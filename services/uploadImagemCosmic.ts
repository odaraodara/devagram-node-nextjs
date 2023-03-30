import multer from "multer";
import cosmicjs from "cosmicjs";

const {
    CHAVE_BUCKET_AVATARES,
    SLUG_BUCKET_AVATARES
    } = process.env;

const cosmic = cosmicjs();
const bucketAvatar = cosmic.bucket({
    slug: SLUG_BUCKET_AVATARES,
    write_key: CHAVE_BUCKET_AVATARES
});

const storage = multer.memoryStorage();
const uploadMulter = multer({ storage : storage});

const uploadImage = async (req : any) => {
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
            return await bucketAvatar.addMedia({media : media_object});
        }else{
            return await bucketAvatar.addMedia({media : media_object});
        }
    }
}

export {uploadMulter, uploadImage};