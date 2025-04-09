
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const RANKING_PATH = path.join(__dirname, "data", "ranking.json");

app.post("/ranking", (req, res) => {
  const partida = req.body;
  let ranking = [];
  if (fs.existsSync(RANKING_PATH)) {
    ranking = JSON.parse(fs.readFileSync(RANKING_PATH));
  }
  ranking.push(partida);
  ranking.sort((a, b) => b.puntaje - a.puntaje);
  if (ranking.length > 20) ranking = ranking.slice(0, 20);
  fs.writeFileSync(RANKING_PATH, JSON.stringify(ranking, null, 2));
  res.sendStatus(200);
});

app.get("/ranking", (req, res) => {
  if (fs.existsSync(RANKING_PATH)) {
    const ranking = JSON.parse(fs.readFileSync(RANKING_PATH));
    res.json(ranking);
  } else {
    res.json([]);
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
