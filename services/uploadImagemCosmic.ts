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
const upload = multer ({ storage : storage});

const uploadImage = async (req : any) => {
    if (req && req.file.originalname) {
        if (!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') &&
            !req.file.orginalname.includes('.jpeg')) {
                throw new Error('extensão inválida');
            }

    const media = {
        originalname: req.file.originalname,
        buffer: req.file.buffer
    }

    if (req.url && req.url.includes('usuarios')){
        return await bucketAvatar.addMedia({media: media});
    }
    return await bucketAvatar.addMedia({media: media});
  }
}

export {upload, uploadImage};