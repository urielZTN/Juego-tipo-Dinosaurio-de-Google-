// backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

const scoresFile = path.join(__dirname, "scores.json");

// Middleware para JSON
app.use(bodyParser.json());

// Servir archivos estáticos desde /frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Ruta para el index.html (landing)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ✅ Ruta directa para el game.html
app.get("/proyecto/game.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/proyecto/game.html"));
});

// --- API de scores ---
let scores = [];

// Obtener scores
app.get("/scores", (req, res) => {
  res.json(scores);
});

// Guardar nuevo score
app.post("/scores", (req, res) => {
  const { name, score } = req.body;
  if (name && score !== undefined) {
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score); // ordenar de mayor a menor
    res.json({ message: "Score guardado", scores });
  } else {
    res.status(400).json({ error: "Datos inválidos" });
  }
});

const serveIndex = require("serve-index");

// Ruta para ver todas las prácticas
app.use(
  "/practicas",
  express.static(path.join(__dirname, "../frontend/practicas")),
  serveIndex(path.join(__dirname, "../frontend/practicas"), { icons: true })
);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});
