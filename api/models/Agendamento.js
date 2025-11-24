import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  laboratorio: { type: String, required: true },
  data: { type: String, required: true },      
  hora: { type: String, required: true },      
  professor: { type: String, required: true },
  materiais: { type: [String], default: [] },
  status: { type: String, default: "Pendente" },
  kitId: { type: String, default: null },
  
});

export default mongoose.model("Agendamento", Schema);
