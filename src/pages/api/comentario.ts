import { conectarMongoDB } from 'middlewares/conectarMongoDB';
import { validarTokenJWT } from 'middlewares/validarTokenJWT';
import { publicaoModel } from 'models/publicacaoModel';
import { usuarioModel } from 'models/usuarioModel';
import { NextApiRequest, NextApiResponse } from 'next';
import { respostaPadraoMsg } from 'types/respostaPadraoMsg';

const endpointComentario = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
    
    try {
    if(req.method === 'PUUT'){
        const {userId, id} = req.query;
        const usuarioLogado = await usuarioModel.findById(userId);
        if(!usuarioLogado){
            return res.status(400).json({erro: 'Usuario não encontrado'});
        }
        const publicacao = await publicaoModel.findById(id);
        if(!publicacao){
            return res.status(400).json({erro: 'Publicação não encontrada'}); 
        }
        if (!req.body || !req.body.comentario){
            return res.status(400).json({erro: 'Comentáio não é válido'}); 
        }

        const comentario = {
            usuarioId : usuarioLogado._id,
            nome : usuarioLogado.nome,
            comentario : req.body.comentario
        }
        publicacao.comentarios.push(comentario);
        await publicaoModel.findByIdAndUpdate({_id : publicacao});
        return res.status(200).json({msg: 'Comentáio add com sucesso'}); 

    }
    return res.status(405).json({erro: 'O método informado é inválido'});

        
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: 'Ocorreu um erro ao add comentário'});
        
    }
}

export default validarTokenJWT(conectarMongoDB(endpointComentario));

