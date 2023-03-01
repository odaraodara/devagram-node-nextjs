import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg'


export const conectarMongoDB = (handler : NextApiHandler) =>
   async (req : NextApiRequest, res : NextApiResponse <respostaPadraoMsg> ) =>
{
    //verificar se o banco já está conectado. Se estiver -> seguir para o endpoint ou próximo middleware

    if(mongoose.connections[0].readyState){
        return handler(req ,res);
    }

    // Já que não está conectado, vamos conectar.
    //obter a variável de ambiente preenchida do env

    const {DB_CONEXAO_STRING} = process.env

    // se a env estiver vazia aborta o uso do sistema e avisa ao programador

    if(!DB_CONEXAO_STRING){
        return res.status(500).json({ erro : 'env de configuraçao do banco não informada'});
    }

    mongoose.connection.on('connected',() => console.log('Banco de Dados conectado'));
    mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar ao Banco de Dados ${error}`));   
    await mongoose.connect(DB_CONEXAO_STRING);

    // agora posso seguir para o endpoint pois estou conectado no Banco
    return handler (req, res);
}

