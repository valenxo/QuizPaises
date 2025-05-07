
let paises = [];
let preguntaActual = 0;
let correctas = 0;
let inicio = Date.now();
let preguntaAnterior = null;
let ultimaCorrecta = null;

fetch("https://restcountries.com/v3.1/all?lang=es")
  .then(res => res.json())
  .then(data => {
    paises = data.filter(p => p.capital && p.capital.length > 0 && p.name?.common && p.flags?.svg);
    siguientePregunta();
  });

function generarPregunta(pais, tipo) {
  const nombre = pais.translations?.spa?.common || pais.name.common;

  if (tipo === "bandera") {
    return {
      tipo: "bandera",
      pregunta: "¿Qué país está representado por esta bandera?",
      imagen: pais.flags.svg,
      respuesta: nombre,
      opciones: generarOpciones(nombre),
    };
  }

  if (tipo === "frontera") {
    const cantidad = (pais.borders || []).length;
    const nums = new Set([cantidad]);
    while (nums.size < 4) nums.add(Math.floor(Math.random() * 11));
    return {
      tipo: "frontera",
      pregunta: `¿Cuántos países limítrofes tiene ${nombre}?`,
      respuesta: cantidad.toString(),
      opciones: Array.from(nums).map(n => n.toString()).sort(() => Math.random() - 0.5),
    };
  }

  return {
    tipo: "capital",
    pregunta: `¿Cuál es el país de la capital "${pais.capital[0]}"?`,
    respuesta: nombre,
    opciones: generarOpciones(nombre),
  };
}

function generarOpciones(correcta) {
  const nombres = paises.map(p => p.translations?.spa?.common || p.name.common)
    .filter(n => n && n !== correcta);
  const opciones = new Set([correcta]);
  while (opciones.size < 4) {
    const rand = nombres[Math.floor(Math.random() * nombres.length)];
    opciones.add(rand);
  }
  return Array.from(opciones).sort(() => Math.random() - 0.5);
}

function siguientePregunta() {
  if (preguntaActual === 10) return mostrarResultado();

  const pais = paises[Math.floor(Math.random() * paises.length)];
  const tipos = ["capital", "bandera", "frontera"];
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  const q = generarPregunta(pais, tipo);
  mostrarPregunta(q);
}

function mostrarPregunta(q) {
  const pregunta = document.getElementById("pregunta");
  const opcionesDiv = document.getElementById("opciones");
  const mensaje = document.getElementById("mensaje");
  const contador = document.getElementById("contador");

  pregunta.innerHTML = q.pregunta;
  if (q.tipo === "bandera" && q.imagen) {
    pregunta.innerHTML += `<br><img src="${q.imagen}" alt="Bandera" style="width: 120px; height: auto;" class="my-2">`;
  }

  opcionesDiv.innerHTML = "";
  if (preguntaAnterior !== null) {
    if (ultimaCorrecta) {
      mensaje.textContent = "✅ Respuesta correcta";
      mensaje.className = "mensaje text-green";
    } else {
      mensaje.textContent = `❌ Incorrecto. La respuesta correcta era: ${preguntaAnterior.respuesta}`;
      mensaje.className = "mensaje text-red";
    }
  } else {
    mensaje.textContent = "";
    mensaje.className = "mensaje";
  }

  q.opciones.forEach(op => {
    const btn = document.createElement("button");
    btn.textContent = op;
    btn.onclick = () => verificarRespuesta(op, q.respuesta);
    btn.className = "bg-blue-100 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-4 rounded-xl shadow transition-all duration-200";
    opcionesDiv.appendChild(btn);
  });

  preguntaAnterior = q;
  contador.textContent = `Pregunta ${preguntaActual + 1} de 10`;
}

function verificarRespuesta(seleccionado, correcta) {
  ultimaCorrecta = seleccionado === correcta;
  if (ultimaCorrecta) correctas++;
  preguntaActual++;
  setTimeout(siguientePregunta, 800);
}

function mostrarResultado() {
  const fin = Date.now();
  const duracion = Math.round((fin - inicio) / 1000);
  const resultado = document.getElementById("resultado");
  resultado.classList.remove("hidden");
  resultado.innerHTML = `
    <div class="resultado-content">
      <h2 class="title">Resultado Final</h2>
      <p>Correctas: <strong>${correctas}</strong></p>
      <p>Incorrectas: <strong>${10 - correctas}</strong></p>
      <p>Duración total: <strong>${duracion}s</strong></p>
      <p>Tiempo promedio: <strong>${(duracion / 10).toFixed(1)}s</strong></p>
      <button onclick="reiniciarJuego()" style="margin-top: 1rem; background-color: #1e3a8a; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none;">🔁 Volver a jugar</button>
    </div>
  `;
  fetch("/ranking", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nombre: prompt("Ingresa tu nombre para el ranking:") || "Anónimo",
    puntaje: correctas * 3 + preguntasDeBandera * 2,  // ajustá esto si querés puntaje real
    correctas: correctas,
    tiempoTotal: duracion
  })
});

}

function reiniciarJuego() {
  preguntaActual = 0;
  correctas = 0;
  inicio = Date.now();
  preguntaAnterior = null;
  ultimaCorrecta = null;
  document.getElementById("resultado").classList.add("hidden");
  siguientePregunta();
}

