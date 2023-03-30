import { conectarMongoDB } from 'middlewares/conectarMongoDB';
import { validarTokenJWT } from 'middlewares/validarTokenJWT';
import { publicaoModel } from 'models/publicacaoModel';
import { usuarioModel } from 'models/usuarioModel';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const endpointFeed = nc()
.get (async (req: NextApiRequest, res: NextApiResponse)=>{
    try {
        const {userId} = req.query;
        const usuarioEncontrado = await usuarioModel.findById(userId);

        if(!usuarioEncontrado){
            return res.status(404).json({erro: 'Usuário não encontrado'});
        }

        const publicacoes = await publicaoModel.find({ idUsuario: userId}).sort({id: -1});

        return res.status(200).json({data: publicacoes});
        
    }catch(error){
        return res.status(500).json({erro: 'Ocorreu um erro ao buscar o feed'});
    }
})

export default validarTokenJWT(conectarMongoDB(endpointFeed));

