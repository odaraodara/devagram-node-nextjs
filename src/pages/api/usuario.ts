import type {NextApiRequest, NextApiResponse} from 'next';
import {validarTokenJWT} from '../../../middlewares/validarTokenJWT';
import{conectarMongoDB}from '../../../middlewares/conectarMongoDB';
import { respostaPadraoMsg } from 'types/respostaPadraoMsg';
import { usuarioModel } from 'models/usuarioModel';
import nc from 'next-connect';
import {upload,uploadImagemCosmic} from '../../../services/uploadImagemCosmic';
import { politicaCORS } from 'middlewares/politicaCORS';

const usuarioEndpoint = nc()

.use(upload.single('file'))
.put (async (req:any, res:NextApiResponse<respostaPadraoMsg>) =>{
    try {
    
        const {userId} = req?.query;
        const usuario = await usuarioModel.findById(userId);

        if (!usuario){
            return res.status(400).json({erro: 'Usuário não encontrado'});
        }

        const {nome} = req.body
        if(nome && nome.length >2 ){
            usuario.nome = nome;
        }

        const {file} = req
        if(file && file.originalname ){
            const image = await uploadImagemCosmic(req);
            if(image && image.media && image.media.url){
                usuario.avatar = file;
            }
        // alterar os dados no DB
        
        await usuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario);

        return res.status(400).json({msg: 'Usuário alterado com sucesso'});
            
        }  


        
    } catch (e) {return res.status(400).json({erro: 'Não foi possível atualizar o usuário'});
        
    } 
})

.get (async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any> ) => {

    try {
    const {userId} = req?.query;
    const usuario = await usuarioModel.findById(userId);
    usuario.senha = null;

    return res.status(200).json(usuario);
    
    } catch (e) {
        console.log(e);
        return res.status(400).json({erro: 'Não foi possível obter os dados do usuário'}); 
    }  
})

export const config = {
    api: {
        bodyParser: false
    }
};

export default politicaCORS (validarTokenJWT(conectarMongoDB(usuarioEndpoint))); 