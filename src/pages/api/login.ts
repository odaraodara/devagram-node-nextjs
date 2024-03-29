import type {NextApiRequest,NextApiResponse} from 'next';
import {conectarMongoDB} from '../../../middlewares/conectarMongoDB';
import type{respostaPadraoMsg} from '../../../types/respostaPadraoMsg';
import type {respostaLogin} from '../../../types/respostaLogin';
import md5 from 'md5';
import { usuarioModel } from 'models/usuarioModel';
import jwt from 'jsonwebtoken';
import { politicaCORS } from 'middlewares/politicaCORS';



const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse <respostaPadraoMsg | respostaLogin>
) => {

    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({erro: 'ENV jwt não informada'});
    }
// verificando se o método é POST
    if(req.method === 'POST'){
        const {login,senha} =req.body;

        const usuariosEncontrados = await usuarioModel.find({ email : login, senha : md5(senha)});

        if (usuariosEncontrados && usuariosEncontrados.length > 0 ){

            const usuarioEncontrado = usuariosEncontrados [0];

            const token = jwt.sign({_id: usuarioEncontrado._id}, MINHA_CHAVE_JWT);

            return res.status(200).json({
                nome: usuarioEncontrado.nome,
                email:usuarioEncontrado.email,
                token});

        }
        return res.status(400).json({erro: 'Usuário e/ou senha inválido'});
    }
    return res.status(405).json({erro: 'Método informado não é válido'});
}

export default politicaCORS (conectarMongoDB (endpointLogin));
