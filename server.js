const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

const RANKING_PATH = path.join(__dirname, "data", "ranking.json");

// POST: guardar partida
app.post("/ranking", (req, res) => {
  const partida = req.body;
  partida.fecha = new Date().toISOString();

  let ranking = [];
  if (fs.existsSync(RANKING_PATH)) {
    ranking = JSON.parse(fs.readFileSync(RANKING_PATH));
  }

  ranking.push(partida);

  ranking.sort((a, b) => {
    if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
    if (b.correctas !== a.correctas) return b.correctas - a.correctas;
    return a.tiempoTotal - b.tiempoTotal;
  });

  ranking = ranking.slice(0, 20);
  fs.writeFileSync(RANKING_PATH, JSON.stringify(ranking, null, 2));
  res.status(200).json({ ok: true });
});

// GET: devolver top 20
app.get("/ranking", (req, res) => {
  if (!fs.existsSync(RANKING_PATH)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(RANKING_PATH));
  res.json(data);
});

app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
