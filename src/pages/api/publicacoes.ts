import type { NextApiResponse} from 'next';
import type { respostaPadraoMsg } from 'types/respostaPadraoMsg';
import nc from 'next-connect';
import {upload,uploadImagemCosmic} from '../../../services/uploadImagemCosmic';
import {conectarMongoDB} from '../../../middlewares/conectarMongoDB';
import {validarTokenJWT} from '../../../middlewares/validarTokenJWT';
import {publicaoModel} from '../../../models/publicacaoModel';
import {usuarioModel} from '../../../models/usuarioModel';


const endpointPublicacao = nc()

.use(upload.single('file'))
.post (async (req: any, res:NextApiResponse<respostaPadraoMsg>) =>{

    try {

    const {userId} = req.query;
    const usuario = await usuarioModel.findById(userId);

    if(!usuario){
        return res.status(400).json({erro: 'Usuário não encontrado'});
    }


    if(!req || !req.body){
        return res.status(400).json({erro: 'Parâmetros de entrada não informados'});
    }    

    const {descricao} = req.body;

    if(!descricao || descricao === " "){
        return res.status(400).json({erro: 'Descrição não é válida'});
    }
    if(!req.file || !req.file.originalname){
        return res.status(400).json({erro: 'a imagem é obrigatória'});
    }

    const image =await uploadImagemCosmic(req);
    const publicacao = {
        idUsuario : usuario._Id,
        descricao,
        foto : image.media.url,
        data : new Date()
    }

    await publicaoModel.create(publicacao);

    return res.status(200).json({msg: 'publicação criada com sucesso'});
        
    } catch (e) {
        console.log(e);
        return res.status(400).json({erro: 'Erro ao cadastrar publicação'})
        
    } 

})

export const config ={
    api: {
        bodyParser : false
    }
}

export default validarTokenJWT (conectarMongoDB(endpointPublicacao));  