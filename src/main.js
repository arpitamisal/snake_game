import { createInitialState, queueDirection, stepGame } from "./snakeLogic.js";

const GRID_SIZE = 16;
const TICK_MS = 140;
const BEST_SCORE_KEY = "snake-best-score";

const board = document.querySelector("#board");
const scoreValue = document.querySelector("#score");
const bestScoreValue = document.querySelector("#best-score");
const restartButton = document.querySelector("#restart-button");
const pauseButton = document.querySelector("#pause-button");
const statusText = document.querySelector("#status-text");
const gameOverBanner = document.querySelector("#game-over-banner");
const controlButtons = [...document.querySelectorAll("[data-direction]")];

let state = createInitialState({ width: GRID_SIZE, height: GRID_SIZE });
let isPaused = false;
let bestScore = readBestScore();

function readBestScore() {
  const stored = window.localStorage.getItem(BEST_SCORE_KEY);
  return stored ? Number(stored) : 0;
}

function writeBestScore(value) {
  window.localStorage.setItem(BEST_SCORE_KEY, String(value));
}

function restartGame() {
  state = createInitialState({ width: GRID_SIZE, height: GRID_SIZE });
  isPaused = false;
  render();
}

function togglePause() {
  if (state.isGameOver) {
    return;
  }

  isPaused = !isPaused;
  render();
}

function setDirection(direction) {
  state = queueDirection(state, direction);
}

function tick() {
  if (isPaused || state.isGameOver) {
    return;
  }

  state = stepGame(state);

  if (state.score > bestScore) {
    bestScore = state.score;
    writeBestScore(bestScore);
  }

  render();
}

function render() {
  scoreValue.textContent = String(state.score);
  bestScoreValue.textContent = String(bestScore);
  pauseButton.textContent = isPaused ? "Resume" : "Pause";

  if (state.isGameOver) {
    statusText.textContent = "Game over. Restart to try again.";
    gameOverBanner.classList.remove("hidden");
  } else if (isPaused) {
    statusText.textContent = "Paused. Resume when you're ready.";
    gameOverBanner.classList.add("hidden");
  } else {
    statusText.textContent =
      "Use arrow keys or WASD to move. Eat food, avoid walls and yourself.";
    gameOverBanner.classList.add("hidden");
  }

  board.style.gridTemplateColumns = `repeat(${state.width}, 1fr)`;
  board.innerHTML = "";
  const snakeCells = new Set(state.snake.map((segment) => `${segment.x},${segment.y}`));
  const headKey = `${state.snake[0].x},${state.snake[0].y}`;
  const foodKey = state.food ? `${state.food.x},${state.food.y}` : "";

  for (let y = 0; y < state.height; y += 1) {
    for (let x = 0; x < state.width; x += 1) {
      const cell = document.createElement("div");
      const key = `${x},${y}`;
      cell.className = "cell";

      if (key === foodKey) {
        cell.classList.add("food");
      }

      if (snakeCells.has(key)) {
        cell.classList.add(key === headKey ? "snake-head" : "snake");
      }

      board.append(cell);
    }
  }
}

document.addEventListener("keydown", (event) => {
  const directionMap = {
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
    ArrowLeft: "left",
    w: "up",
    d: "right",
    s: "down",
    a: "left",
    W: "up",
    D: "right",
    S: "down",
    A: "left"
  };

  if (event.key === " ") {
    event.preventDefault();
    togglePause();
    return;
  }

  if (event.key === "Enter" && state.isGameOver) {
    restartGame();
    return;
  }

  const direction = directionMap[event.key];
  if (!direction) {
    return;
  }

  event.preventDefault();
  setDirection(direction);
});

restartButton.addEventListener("click", restartGame);
pauseButton.addEventListener("click", togglePause);

for (const button of controlButtons) {
  button.addEventListener("click", () => {
    setDirection(button.dataset.direction);
  });
}

render();
window.setInterval(tick, TICK_MS);
