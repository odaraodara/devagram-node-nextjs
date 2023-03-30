import multer from "multer";
import cosmicjs from "cosmicjs";

const {
    CHAVE_BUCKET_AVATARES,
    SLUG_BUCKET_AVATARES,
    CHAVE_BUCKET_PUBLICACOES,
    SLUG_BUCKET_PUBLICACOES
    } = process.env;

const Cosmic = cosmicjs();
const bucketAvatar = Cosmic.bucket({
    slug: SLUG_BUCKET_AVATARES,
    write_key: CHAVE_BUCKET_AVATARES
});

const bucketPublicacoes = Cosmic.bucket({
    slug: SLUG_BUCKET_PUBLICACOES,
    write_key: CHAVE_BUCKET_PUBLICACOES
});


const storage = multer.memoryStorage();
const updload = multer({storage : storage});

const uploadImagemCosmic = async(req : any) => {
    if(req?.file?.originalname){

        if(!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') && 
            !req.file.originalname.includes('.jpeg')){
                throw new Error('Extensao da imagem invalida');
        } 

        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };

        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.addMedia({media : media_object});
        }else{
            return await bucketAvatar.addMedia({media : media_object});
        }
    }
}

export {updload, uploadImagemCosmic};