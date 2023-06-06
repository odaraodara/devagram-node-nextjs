import type {NextApiResponse} from 'next';
import type {respostaPadraoMsg} from '../../../types/respostaPadraoMsg';
import type {cadastroRequisicao} from '../../../types/cadastroRequisicao';
import {usuarioModel} from '../../../models/usuarioModel';
import md5 from 'md5';
import {conectarMongoDB} from '../../../middlewares/conectarMongoDB';
import {upload,uploadImagemCosmic} from '../../../services/uploadImagemCosmic';
import nc from 'next-connect';
import { politicaCORS } from 'middlewares/politicaCORS';



const handler = nc()
    .use(upload.single('file'))

    .post (async (req : any, res : NextApiResponse <respostaPadraoMsg>) =>{
        try{

        const usuario = req.body as cadastroRequisicao;
    
        if (!usuario.nome || usuario.nome.length < 2){
            return res.status(400).json({erro: 'Nome inválido'}); 
        }
    
        if (!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.') ){
            return res.status(400).json({erro: 'Email inválido'});  // validação muito simples
        }
    
        if (!usuario.senha || usuario.senha.length < 4){
            return res.status(400).json({erro: 'Senha inválida'});
        }
    
        // validação para não repetir usuário com o mesmo email
    
        const usuariosRepetidos = await usuarioModel.find({email : usuario.email});
        if (usuariosRepetidos && usuariosRepetidos.length > 0){
            return res.status(400).json({erro: 'Já existe uma conta com o emal informado'})
        }

        // enviar a imagem do multer para o cosmic
        const image = await uploadImagemCosmic(req);
    
        // salvar no banco de dados
    
        const usuarioASerSalvo ={
             nome : usuario.nome,
             email : usuario.email,
             senha : md5(usuario.senha),
             avatar: image.media.url
        }
            await usuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({msg: 'Usuário criado com sucesso'});
            
        } catch (e: any){
            console.log(e);
            return res.status(400).json({erro : e.toString()});
        }
     });


export const config = {
    api: {
        bodyParser: false
    }
};

export default politicaCORS (conectarMongoDB (handler)); 