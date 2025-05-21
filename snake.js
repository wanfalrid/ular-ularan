const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20; // Ukuran grid
const canvasSize = 400;
const gridCount = canvasSize / box;

let snake = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];
let direction = "RIGHT";
let food = randomFood();
let score = 0;
let gameInterval;
let isGameOver = false;
let screamLoop = false;
let musicStarted = false;

const restartBtn = document.getElementById("restartBtn");
const jumpscareContainer = document.getElementById("jumpscareContainer");
const jumpscareImg = document.getElementById("jumpscareImg");
const jumpscareRestartBtn = document.getElementById("jumpscareRestartBtn");
const screamSound = document.getElementById("screamSound");
const btnUp = document.getElementById("btnUp");
const btnDown = document.getElementById("btnDown");
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const bgMusic = document.getElementById("bgMusic");

function randomFood() {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * gridCount),
      y: Math.floor(Math.random() * gridCount),
    };
    if (
      !snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    )
      break;
  }
  return newFood;
}

function drawCell(x, y, color, glowColor) {
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 16;
  ctx.fillStyle = color;
  ctx.fillRect(x * box, y * box, box, box);
  ctx.shadowBlur = 0;
}

function drawSnake() {
  snake.forEach((segment, idx) => {
    drawCell(
      segment.x,
      segment.y,
      idx === 0 ? "#fffa65" : "#00ffe7",
      idx === 0 ? "#fffa65" : "#00ffe7"
    );
  });
}

function drawFood() {
  drawCell(food.x, food.y, "#ff3c6f", "#ff3c6f");
  // Efek makanan
  ctx.beginPath();
  ctx.arc(
    food.x * box + box / 2,
    food.y * box + box / 2,
    box / 2.5,
    0,
    2 * Math.PI
  );
  ctx.strokeStyle = "#fff";
  ctx.shadowColor = "#ff3c6f";
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function update() {
  if (isGameOver) return;
  // Gerakkan ular
  const head = { ...snake[0] };
  if (direction === "LEFT") head.x--;
  if (direction === "RIGHT") head.x++;
  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;

  // Wrap ke sisi lain jika keluar dari batas
  if (head.x < 0) head.x = gridCount - 1;
  if (head.x >= gridCount) head.x = 0;
  if (head.y < 0) head.y = gridCount - 1;
  if (head.y >= gridCount) head.y = 0;

  // Tabrak badan sendiri
  if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Makan makanan
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = "Skor: " + score;
    food = randomFood();
  } else {
    snake.pop();
  }

  draw();
}

function drawGrid() {
  ctx.strokeStyle = "rgba(0,255,231,0.08)";
  for (let i = 0; i <= gridCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * box, 0);
    ctx.lineTo(i * box, canvasSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * box);
    ctx.lineTo(canvasSize, i * box);
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  drawSnake();
}

function gameOver() {
  isGameOver = true;
  clearInterval(gameInterval);
  ctx.fillStyle = "#ff3c6f";
  ctx.font = 'bold 32px "Press Start 2P", monospace';
  ctx.textAlign = "center";
  ctx.shadowColor = "#ff3c6f";
  ctx.shadowBlur = 20;
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  ctx.shadowBlur = 0;
  restartBtn.style.display = "inline-block";
  bgMusic.pause();

  // Jumpscare jika skor >= 5
  if (score >= 10) {
    jumpscareContainer.style.display = "flex";
    screamSound.currentTime = 0;
    screamSound.volume = 1;
    screamSound.play();
    screamLoop = true;
    document.body.classList.add("shaky");
  }
}

function changeDirection(e) {
  if (isGameOver) return;
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

document.addEventListener("keydown", changeDirection);

function startGame() {
  snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ];
  direction = "RIGHT";
  food = randomFood();
  score = 0;
  isGameOver = false;
  document.getElementById("score").innerText = "Skor: 0";
  draw();
  clearInterval(gameInterval);
  gameInterval = setInterval(update, 120);
  restartBtn.style.display = "none";
  jumpscareContainer.style.display = "none";
  document.body.classList.remove("shaky");
  screamSound.pause();
  screamSound.currentTime = 0;
  bgMusic.currentTime = 0;
  bgMusic.volume = 0.7;
  bgMusic.play();

  screamLoop = false;
}

startGame();

restartBtn.addEventListener("click", startGame);
jumpscareRestartBtn.addEventListener("click", startGame);

screamSound.addEventListener("ended", function () {
  if (jumpscareContainer.style.display === "flex" && screamLoop) {
    screamSound.currentTime = 0;
    screamSound.play();
  }
});

btnUp.addEventListener("touchstart", function (e) {
  e.preventDefault();
  if (direction !== "DOWN") direction = "UP";
});
btnDown.addEventListener("touchstart", function (e) {
  e.preventDefault();
  if (direction !== "UP") direction = "DOWN";
});
btnLeft.addEventListener("touchstart", function (e) {
  e.preventDefault();
  if (direction !== "RIGHT") direction = "LEFT";
});
btnRight.addEventListener("touchstart", function (e) {
  e.preventDefault();
  if (direction !== "LEFT") direction = "RIGHT";
});

function startMusicOnUserInteraction() {
  if (!musicStarted) {
    bgMusic.currentTime = 0;
    bgMusic.volume = 0.7;
    bgMusic.play();
    musicStarted = true;
  }
}
document.addEventListener("keydown", startMusicOnUserInteraction, {
  once: true,
});
document.addEventListener("touchstart", startMusicOnUserInteraction, {
  once: true,
});
