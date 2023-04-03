import mongoose, {Schema} from "mongoose";

const seguidorSchema = new Schema ({
    //quem segue
    usuarioId : {type : String, require : true},
    // quem está sendo seguido
    usuarioSeguidoId : {type : String, require : true}
});

export const seguidorModel = (mongoose.models.seguidores 
    || mongoose.model('seguidores', seguidorSchema));