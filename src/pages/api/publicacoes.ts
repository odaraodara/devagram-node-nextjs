import { upload, uploadImage } from "services/uploadImagemCosmic";
import nc from 'next-connect';
import { NextApiResponse } from "next";
import { validarTokenJWT } from "middlewares/validarTokenJWT";
import { conectarMongoDB } from "middlewares/conectarMongoDB";
import { usuarioModel } from "models/usuarioModel";
import { publicaoModel } from "models/publicacaoModel";

const endpointPublicacoes = nc()
.use (upload.single('file'))
.post (async (req: any, res:NextApiResponse)=>{
    try {

        const {userId} = req.query;
        const usuarioEncontrado = await usuarioModel.findById(userId);

        if(!usuarioEncontrado){
            return res.status(404).json({erro: "usuário não encontrado"});
        }

        if(!req || !req.body){
            return res.status(400).json({erro: "requisição inválida"});
        }

        const {descricao} = req.body;

        if(!descricao || descricao === ""){
            return res.status(400).json({erro: "descrição inválida"});
        }

        if(!req.file){
            return res.status(400).json({erro: "Imagem inválida"});
        }

        const image = await uploadImage(req);

        const publicacao = {
            idUsuario: userId,
            descricao: descricao,
            foto: image.media.url
        }
        
        usuarioEncontrado.publicacao++;

        await usuarioModel.findByIdAndUpdate({_id: userId}, usuarioEncontrado);

        await publicaoModel.create(publicacao);
        return res.status(201).json({msg: "Publicação criada com sucesso!"});


    } catch (error) {
        return res.status(500).json({ erro: "Ocorreu um erro ao salvar a publicação"})        
    }

});

export const config = {
    api: {
        bodyParser: false,
    },
}

export default validarTokenJWT(conectarMongoDB(endpointPublicacoes));