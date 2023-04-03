import { conectarMongoDB } from 'middlewares/conectarMongoDB';
import { validarTokenJWT } from 'middlewares/validarTokenJWT';
import { publicaoModel } from 'models/publicacaoModel';
import { seguidorModel } from 'models/seguidorModel';
import { usuarioModel } from 'models/usuarioModel';
import { NextApiRequest, NextApiResponse } from 'next';
import { respostaPadraoMsg } from 'types/respostaPadraoMsg';


const endpointFeed = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg| any>)=>{

    try {

        if (req.method === 'GET'){

            if(req?.query?.id){
                // feed pesquisa

                const usuarioEncontrado = await usuarioModel.findById(req?.query?.id);
                if(!usuarioEncontrado){
                    return res.status(404).json({erro: 'Usuário não encontrado'});
                 }
                 const publicacoes = await publicaoModel.find({idUsuario : usuario._id})
                    .sort({data : -1});
                    return res.status(200).json(publicacoes);   

            }else{
                // feed principal
                const {userId} = req.query;
                const usuarioLogado = await usuarioModel.findById(userId);
                if(!usuarioLogado){
                    return res.status(400).json({erro: 'Usuário não encontrado'}); 
                }

                const seguidores = await seguidorModel.findById({usuarioId : usuarioLogado})
                const seguidoresIds = seguidores.map((s: { usuarioSeguidoId: any; }) => s.usuarioSeguidoId);

                const publicacoes = await publicaoModel.find({
                    $or : [
                        {idUsuario : usuarioLogado._id},
                        {idUsuario : seguidoresIds}
                    ]
                })
                .sort({data: -1})
                const result = [];
                for (const publicacao of publicacoes){
                    const usuarioDaPublicacao = await usuarioModel.findById(publicacao.idUsuario);
                    if(usuarioDaPublicacao){ 
                        const final ={...publicacao._doc, usuario:{
                            nome : usuarioDaPublicacao.nome,
                            avatar : usuarioDaPublicacao.avatar
                        }};
                        result.push(final);
                    }
                }
    
                return res.status(200).json(result);  
            }       
    }
        return res.status(405).json({erro: 'Método inválido'});
    }catch(e){
        return res.status(500).json({erro: 'Ocorreu um erro ao buscar o feed'});
    }
}

export default validarTokenJWT(conectarMongoDB(endpointFeed));

