import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  funcao: String,
  materia: String,

  foto: {
    type: String,
    default: ""
  }
});

export default mongoose.model("Usuario", Schema);
