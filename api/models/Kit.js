import mongoose from "mongoose";

const KitSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  professor: { type: String, required: true },
  items: [
    {
      id: String,
      name: String,
      unit: String,
      qtySelected: Number
    }
  ]
});

export default mongoose.model("Kit", KitSchema);
