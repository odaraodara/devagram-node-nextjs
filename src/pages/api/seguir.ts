import { conectarMongoDB } from 'middlewares/conectarMongoDB';
import { politicaCORS } from 'middlewares/politicaCORS';
import { validarTokenJWT } from 'middlewares/validarTokenJWT';
import { seguidorModel } from 'models/seguidorModel';
import { usuarioModel } from 'models/usuarioModel';
import type { NextApiRequest, NextApiResponse} from 'next';
import type { respostaPadraoMsg } from 'types/respostaPadraoMsg';

const endpointSeguir = async (req: NextApiRequest, res:NextApiResponse<respostaPadraoMsg>) =>{
    try {

        const {userId, id} =req?.query;

        if(req.method === 'PUT'){
            // usuario logado
            const usuarioLogado = await usuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro: 'Usuário logado não encontrado'});   
            }
            // usuario a ser seguido
            const usuarioASerSeguido = await usuarioModel.findById(id);
            if(!usuarioASerSeguido ){
                return res.status(400).json({erro: 'Usuário a ser seguido não encontrado'});   
            }
            // verificar se já segue para executar uma ação

            const euJaSigoEsseUsuario = await seguidorModel
                .find({ usuarioId: usuarioLogado._id , usuarioSeguidoId: usuarioASerSeguido._id});

                if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){
                    // sinal que eu já sigo esse usuário
                    euJaSigoEsseUsuario.forEach(async (e: any)=> 
                        await seguidorModel.findByIdAndDelete({_id : e._id}));

                    usuarioLogado.seguindo --;
                    await usuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

                    usuarioASerSeguido.seguidores--;
                    await usuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                    return res.status(200).json({msg: 'Deixou de seguir o usuário com sucesso'});  

                }else{
                    //sinal que eu não sigo esse usuário
                    const seguidor = {
                        usuarioId : usuarioLogado._id,
                        usuarioSeguidoId: usuarioASerSeguido._id
                    };
                    await seguidorModel.create(seguidor);
                return res.status(200).json({msg: 'Usuário seguido com sucesso'});  
                
                    // atualizar o contador de seguindo
                    usuarioLogado.seguindo ++;
                    await usuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
                    
                    //atualizar o contador de seguidores no usuário seguido
                    usuarioASerSeguido.seguidores++;
                    await usuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                }


        }
        return res.status(405).json({erro: 'Método inválido'});
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: 'Não foi possível seguir o usuário informado'});
    }
}

export default politicaCORS (validarTokenJWT(conectarMongoDB(endpointSeguir)));