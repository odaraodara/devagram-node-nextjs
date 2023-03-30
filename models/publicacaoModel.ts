import mongoose, {Schema} from "mongoose";

const publicacaoSchema = new Schema ({
    idUsuario: {type: String, require: true},
    descricao: {type: String, require: true},
    foto: {type: String, require: false}
       
});

export const publicaoModel = (mongoose.models.publicacoes || mongoose.model('publicacoes'))