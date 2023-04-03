import type {NextApiHandler, NextApiRequest,NextApiResponse} from 'next';
import type { respostaPadraoMsg} from 'types/respostaPadraoMsg';
import NextCors from 'nextjs-cors';

export const politicaCORS = (handler : NextApiHandler) => 
    async  ( req: NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
     try {
        
        await NextCors (req,res,{
            origin : '*',
            methodes : ['GET', 'POST', 'PUT'],
            optionsSuccessStatus: 200,
            
        });

        return handler (req,res);

     } catch (e) {
        console.log(e);
        return res.status(500).json({erro: 'Erro ao tratar a política de CORS'})
        
     }   
}