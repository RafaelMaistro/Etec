import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MODELS
import Usuario from "./models/Usuario.js";
import Material from "./models/Material.js";
import Problema from "./models/Problema.js";
import Agendamento from "./models/Agendamento.js";
import Kit from "./models/Kit.js";

// APP
const app = express();
app.use(express.json());
app.use(cors());

// STATIC FILES
const staticRoot = path.join(__dirname, "..");
app.use(express.static(staticRoot));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // fotos

// MULTER → Upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// MONGO
const MONGO =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/agendamentosETEC";

mongoose
  .connect(MONGO)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((e) => console.error("❌ Erro conexão MongoDB:", e));

/* =============================
        ROTAS DO SISTEMA
============================= */

// ROOT → login
app.get("/", (req, res) => {
  res.sendFile(path.join(staticRoot, "login.html"));
});

/* ========== USUÁRIOS ========== */

// TODOS
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POR ID
app.get("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (e) {
    console.error("Erro ao buscar usuário:", e);
    res.status(500).json({ error: e.message });
  }
});

// CRIAR
app.post("/usuarios", async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.json(usuario);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ATUALIZAR (COM FOTO)
app.put("/usuarios/:id", upload.single("foto"), async (req, res) => {
  try {
    const dados = { ...req.body };

    if (req.file) {
      dados.foto = `/uploads/${req.file.filename}`;
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      dados,
      { new: true }
    );

    res.json(usuario);
  } catch (e) {
    console.error("Erro ao atualizar perfil:", e);
    res.status(500).json({ error: e.message });
  }
});

// DELETAR
app.delete("/usuarios/:id", async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ========== MATERIAIS ========== */

app.get("/materiais", async (req, res) => {
  res.json(await Material.find());
});

app.post("/materiais", async (req, res) => {
  res.json(await Material.create(req.body));
});

app.put("/materiais/:id", async (req, res) => {
  res.json(
    await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
  );
});

app.delete("/materiais/:id", async (req, res) => {
  await Material.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ========== PROBLEMAS ========== */

// TODOS
app.get("/problemas", async (req, res) => {
  try {
    res.json(await Problema.find());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ POR ID (ESSA ESTAVA FALTANDO E CAUSAVA O ERRO)
app.get("/problemas/:id", async (req, res) => {
  try {
    const problema = await Problema.findById(req.params.id);

    if (!problema) {
      return res
        .status(404)
        .json({ error: "Problema não encontrado" });
    }

    res.json(problema);
  } catch (e) {
    console.error("Erro ao buscar problema:", e);
    res.status(500).json({ error: e.message });
  }
});

// CRIAR
app.post("/problemas", async (req, res) => {
  try {
    res.json(await Problema.create(req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ATUALIZAR
app.put("/problemas/:id", async (req, res) => {
  try {
    res.json(
      await Problema.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETAR
app.delete("/problemas/:id", async (req, res) => {
  try {
    await Problema.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ========== AGENDAMENTOS ========== */

app.get("/agendamentos", async (req, res) => {
  try {
    if (req.query.professor) {
      return res.json(
        await Agendamento.find({ professor: req.query.professor })
      );
    }

    res.json(await Agendamento.find());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/agendamentos/:id", async (req, res) => {
  try {
    const ag = await Agendamento.findById(req.params.id);
    if (!ag)
      return res
        .status(404)
        .json({ error: "Agendamento não encontrado" });

    res.json(ag);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/agendamentos", async (req, res) => {
  try {
    res.json(await Agendamento.create(req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/agendamentos/:id", async (req, res) => {
  try {
    const atual = await Agendamento.findById(req.params.id);
    if (!atual) {
      return res
        .status(404)
        .json({ error: "Agendamento não encontrado" });
    }

    const dados = {
      laboratorio: req.body.laboratorio,
      data: req.body.data,
      hora: req.body.hora,
      professor: req.body.professor,
      materiais: req.body.materiais,
      status: req.body.status,
      observacaoTecnico:
        req.body.observacaoTecnico ??
        atual.observacaoTecnico,
      kitId: req.body.kitId ?? atual.kitId
    };

    const ag = await Agendamento.findByIdAndUpdate(
      req.params.id,
      dados,
      { new: true }
    );

    res.json(ag);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/agendamentos/:id", async (req, res) => {
  try {
    await Agendamento.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ========== KITS ========== */

app.post("/kits", async (req, res) => {
  try {
    res.json(await Kit.create(req.body));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/kits/prof/:professor", async (req, res) => {
  try {
    res.json(
      await Kit.find({ professor: req.params.professor })
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/kits/kit/:id", async (req, res) => {
  try {
    res.json(await Kit.findById(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/kits/:id", async (req, res) => {
  try {
    res.json(
      await Kit.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      })
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/kits/:id", async (req, res) => {
  try {
    await Kit.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ========== SERVER ========== */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server rodando em http://localhost:" + PORT);
});
