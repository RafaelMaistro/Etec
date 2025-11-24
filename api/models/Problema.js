import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  descricao: String, tecnico: String, status: {type:String, default:"Pendente"}, resolucao: String
});
export default mongoose.model("Problema", Schema);
