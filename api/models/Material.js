import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  nome: String, quantidade: Number, unidade: String, tipo: String
});
export default mongoose.model("Material", Schema);
