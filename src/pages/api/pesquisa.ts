import type {NextApiRequest, NextApiResponse} from 'next';
import type {respostaPadraoMsg} from '../../../types/respostaPadraoMsg';
import { validarTokenJWT } from 'middlewares/validarTokenJWT';
import { conectarMongoDB } from 'middlewares/conectarMongoDB';
import { usuarioModel } from 'models/usuarioModel';
import { politicaCORS } from 'middlewares/politicaCORS';

const endpointPesquisa = async (req: NextApiRequest, res:NextApiResponse<respostaPadraoMsg | any>) =>{

try {
    if (req.method === 'GET'){

        if(req?.query?.id){

            const usuarioEncontrado = await usuarioModel.findById(req?.query?.id);
            if (!usuarioEncontrado){
                return res.status(400).json({erro: 'Usuário não encontrado'});
            }
            usuarioEncontrado.senha = null; 
            return res.status(200).json(usuarioEncontrado);

        } else{
            const {filtro} = req.query;

            if (!filtro || filtro.length < 2){
                return res.status(400).json({erro: 'informar mais de 2 caracteres para busca'});   
            }
    
            const usuariosEncontrados = await usuarioModel.find({
                $or: [ 
                    {nome : {$regex : filtro, $options :'i'}},
                    {email : {$regex : filtro, $options :'i'}}
                ]
                
            });
    
            return res.status(200).json(usuariosEncontrados);

        }

    }
    return res.status(405).json({erro: 'Método invormado não é válido'});

    
} catch (e) {
    console.log(e);
    return res.status(500).json({erro: 'não foi possivel fazer essa busca'+ e});
}
}

export default politicaCORS (validarTokenJWT(conectarMongoDB(endpointPesquisa)));