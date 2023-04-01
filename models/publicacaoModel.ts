import mongoose, {Schema} from "mongoose";
import { arrayBuffer } from "stream/consumers";

const publicacaoSchema = new Schema ({
    idUsuario: {type: String, require: true},
    descricao: {type: String, require: true},
    foto: {type: String, require: true},
    data: {type: Date, require: true},
    comentarios: {type: Array, require: true, default:[]},
    likes: {type: Array, require: true, default:[]}
      
});

export const publicaoModel = (mongoose.models.publicacoes 
    || mongoose.model('publicacoes', publicacaoSchema));