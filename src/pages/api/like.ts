import type {NextApiRequest, NextApiResponse} from 'next';
import type {respostaPadraoMsg} from '../../../types/respostaPadraoMsg';
import { validarTokenJWT } from 'middlewares/validarTokenJWT';
import { conectarMongoDB } from 'middlewares/conectarMongoDB';
import { publicaoModel } from 'models/publicacaoModel';
import { usuarioModel } from 'models/usuarioModel';
import { politicaCORS } from 'middlewares/politicaCORS';

const endpointLike = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {

    try {
        if (req.method === 'PUT'){
            // pegar o ID da publicação
            const {id} = req?.query;
            const publicacao = await publicaoModel.findById(id);
            if(!publicacao){
                return res.status(405).json({erro: 'Publiicação não encontrada'});
            }
            // pegar o ID do usuário que está curtindo
            const {userId} = req?.query;
            const usuario = await usuarioModel.findById(userId);
            if(!usuario){
                return res.status(405).json({erro: 'usuário não encontrado'});
            }
            // computar likes
            const indexDoUsuarioNoLike = publicacao.likes.findIndex( (e:any) => e.toString() === usuario._Id.toString());

            if(indexDoUsuarioNoLike != -1){
                //se o index for maior que -1 significa que ele ja curtiu a foto - então removemos o like
                publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                await publicaoModel.findByIdAndUpdate({_id : publicacao._id},publicacao);
                return res.status(200).json({msg:'Publiicação descurtida com sucesso'});
            } else{
                //se o index for -1 significa que ele ainda não curtiu a foto
                publicacao.likes.push(usuario._id);
                await publicaoModel.findByIdAndUpdate({_id : publicacao._id},publicacao);
                return res.status(200).json({msg:'Publiicação curtida com sucesso'});

            }

        }
        return res.status(405).json({erro: 'O método informado é inválido'});
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: 'Ocorreu um erro ao curtir/descurtr a publicação'});
    }
}

export default politicaCORS (validarTokenJWT(conectarMongoDB(endpointLike)));