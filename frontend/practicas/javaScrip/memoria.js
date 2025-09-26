// Variables globales
const board = document.querySelector(".game-board");
const attemptsEl = document.getElementById("attempts");
const timeEl = document.getElementById("time");
const victoryEl = document.getElementById("victory");
const finalAttemptsEl = document.getElementById("finalAttempts");
const finalTimeEl = document.getElementById("finalTime");

let emojis = ["🐱","🐶","🐰","🐸","🐼","🦁"];
let cardsArray = [];
let flippedCards = [];
let attempts = 0;
let matchedPairs = 0;
let timer = null;
let timeLeft = 60;   // ⏳ Tiempo total (60 segundos por ejemplo)
let gameStarted = false;

// Mezclar array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Crear cartas
function generateBoard() {
  board.innerHTML = "";
  const doubled = [...emojis, ...emojis];
  cardsArray = shuffle(doubled);

  cardsArray.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = emoji;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${emoji}</div>
        <div class="card-back">❓</div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

// Voltear carta
function flipCard(card) {
  if (!gameStarted) {
    startTimer(); // Inicia el temporizador en el primer clic
    gameStarted = true;
  }

  if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    flippedCards.push(card);
  }

  if (flippedCards.length === 2) {
    attempts++;
    attemptsEl.textContent = attempts;

    if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
      matchedPairs++;
      flippedCards = [];

      if (matchedPairs === emojis.length) {
        endGame();
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach(c => c.classList.remove("flipped"));
        flippedCards = [];
      }, 1000);
    }
  }
}

// Temporizador cuenta regresiva
function startTimer() {
  timeEl.textContent = timeLeft; // Muestra el tiempo inicial
  timer = setInterval(() => {
    timeLeft--; // Resta 1 segundo
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("⏰ Se acabó el tiempo! El juego se reiniciará.");
      restartGame(); // Reinicia el juego al acabarse el tiempo
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

// Fin del juego
function endGame() {
  stopTimer();
  finalAttemptsEl.textContent = attempts;
  finalTimeEl.textContent = 60 - timeLeft; // ⏳ Tiempo usado = total - lo que quedaba
  victoryEl.classList.remove("hidden");
}

// Reinicio
function restartGame() {
  attempts = 0;
  matchedPairs = 0;
  flippedCards = [];
  timeLeft = 60; // Reinicia el contador de tiempo
  gameStarted = false;
  stopTimer();
  timeEl.textContent = timeLeft;
  attemptsEl.textContent = 0;
  victoryEl.classList.add("hidden");
  generateBoard();
}

// Evento reiniciar
document.getElementById("restart").addEventListener("click", restartGame);

// Iniciar juego
generateBoard();
