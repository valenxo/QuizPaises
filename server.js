const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

const RANKING_PATH = path.join(__dirname, "data", "ranking.json");

app.post("/ranking", (req, res) => {
  const partida = req.body;
  partida.fecha = new Date().toISOString();
  console.log("📩 Recibido:", partida); // LOG

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
  console.log("✅ Ranking actualizado:", ranking); // LOG

  res.status(200).json({ ok: true });
});


app.get("/ranking", (req, res) => {
  if (!fs.existsSync(RANKING_PATH)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(RANKING_PATH));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
