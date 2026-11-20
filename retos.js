"use strict";

const resultados = document.querySelector("#resultados");
const resumen = document.querySelector("#resumen");
const retos = {
  media: {
    funcion: "getAverage",
    pruebas: [
      { entrada: [[2, 2, 4, 2]], esperado: 2.5 },
      { entrada: [[1, 2, 3, 4, 5]], esperado: 3 },
      { entrada: [[5]], esperado: 5 },
      { entrada: [[12, 17, 4, 12, 2, 2, 16, 12, 2, 11, 16, 5, 20]], esperado: 10.08 },
      { entrada: [[0, 1]], esperado: 0.5 }
    ]
  },
  juego: {
    funcion: "rps",
    pruebas: [
      { entrada: ["rock", "scissors"], esperado: "Player 1 won!" },
      { entrada: ["scissors", "paper"], esperado: "Player 1 won!" },
      { entrada: ["paper", "rock"], esperado: "Player 1 won!" },
      { entrada: ["scissors", "rock"], esperado: "Player 2 won!" },
      { entrada: ["rock", "paper"], esperado: "Player 2 won!" },
      { entrada: ["paper", "scissors"], esperado: "Player 2 won!" },
      { entrada: ["rock", "rock"], esperado: "Draw!" },
      { entrada: ["paper", "paper"], esperado: "Draw!" },
      { entrada: ["scissors", "scissors"], esperado: "Draw!" }
    ]
  },
  retiradas: {
    funcion: "calcularRetiradas",
    pruebas: [
      { entrada: [[-20, 50, -10, 0]], esperado: 30 },
      { entrada: [[15, 20, 0]], esperado: 0 },
      { entrada: [[-5, -12, -3]], esperado: 20 },
      { entrada: [[]], esperado: 0 },
      { entrada: [[100, -80, 30, -20]], esperado: 100 }
    ]
  }
};
const idReto = document.body.dataset.reto;
const reto = retos[idReto];
const funcion = window[reto.funcion];
const descripcionResultado = {
  media: "la media debería ser",
  juego: "el resultado debería ser",
  retiradas: "el total retirado debería ser"
}[idReto] ?? "el resultado debería ser";

if (typeof funcion !== "function") {
  mostrar("No se ha encontrado la función " + reto.funcion + " en el bloque <script> del ejercicio.", false);
} else {
  let aciertos = 0;
  reto.pruebas.forEach((prueba, indice) => {
    const llamada = reto.funcion + "(" + prueba.entrada.map(formatear).join(", ") + ")";
    const esperado = descripcionResultado + " " + formatearResultado(prueba.esperado, true);
    try {
      const recibido = funcion(...JSON.parse(JSON.stringify(prueba.entrada)));
      const correcto = Object.is(recibido, prueba.esperado);
      if (correcto) aciertos++;
      mostrar("Prueba " + (indice + 1) + " · " + llamada + ": " + esperado + ". Tu función devolvió " + formatearResultado(recibido, correcto) + ". " + (correcto ? "Correcta." : "Revisa este caso."), correcto);
    } catch (error) {
      mostrar("Prueba " + (indice + 1) + " · " + llamada + ": " + esperado + ". Error: " + error.message, false);
    }
  });
  resumen.textContent = aciertos + " de " + reto.pruebas.length + " pruebas correctas.";
}

function mostrar(texto, correcto) {
  const item = document.createElement("li");
  item.className = correcto ? "bien" : "mal";
  item.textContent = texto;
  resultados.append(item);
}

function formatear(valor) {
  if (Array.isArray(valor)) return "[" + valor.map(formatear).join(", ") + "]";
  if (typeof valor === "string") return JSON.stringify(valor);
  return String(valor);
}

function formatearResultado(valor, mostrarDosDecimales) {
  if (idReto === "media" && mostrarDosDecimales && typeof valor === "number") {
    return valor.toFixed(2);
  }
  return formatear(valor);
}
