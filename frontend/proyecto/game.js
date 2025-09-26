// Juego RunnerJS - endless runner simple
// Comentarios en español (sin acentos)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let WIDTH = canvas.width;
let HEIGHT = canvas.height;

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const bestEl = document.getElementById("best");
const overlay = document.getElementById("overlay");
const restartBtn = document.getElementById("restartBtn");
const saveBtn = document.getElementById("saveBtn");
const playerNameInput = document.getElementById("playerName");
const finalScore = document.getElementById("finalScore");
const finalLevel = document.getElementById("finalLevel");
const saveMsg = document.getElementById("saveMsg");
const leaderboardList = document.getElementById("leaderboardList");

let running = false;
let gameOver = false;
let score = 0;
let level = 1;
let best = parseInt(localStorage.getItem("runner_best") || "0", 10);

// parametros de juego (ajustables)
let gravity = 0.8;
let jumpVel = -12;
let groundY = HEIGHT - 40;

let speed = 4;
let spawnTimer = 0;
let spawnInterval = 90; // frames

// jugador
const player = {
  x: 60,
  y: groundY - 40,
  w: 40,
  h: 40,
  vy: 0,
  onGround: true,
  draw(){
    ctx.fillStyle = "#178b62";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  },
  update(){
    this.vy += gravity;
    this.y += this.vy;
    if(this.y + this.h >= groundY){
      this.y = groundY - this.h;
      this.vy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  },
  jump(){
    if(this.onGround){
      this.vy = jumpVel;
      this.onGround = false;
    }
  }
};

let obstacles = [];

// obstaculo simple: rectangulo
function spawnObstacle(){
  // variacion en tamano y tipo
  const h = 20 + Math.random()*40;
  const w = 12 + Math.random()*28;
  obstacles.push({
    x: WIDTH + 20,
    y: groundY - h,
    w, h
  });
}

// deteccion AABB (rectangulos)
function isColliding(a, b){
  return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
}

// reset
function resetGame(){
  obstacles = [];
  score = 0;
  level = 1;
  speed = 4;
  spawnInterval = 90;
  spawnTimer = 0;
  gameOver = false;
  overlay.classList.add("hidden");
  running = true;
  loop();
}

// game over
function doGameOver(){
  running = false;
  gameOver = true;
  overlay.classList.remove("hidden");
  finalScore.textContent = `Puntaje: ${Math.floor(score)}`;
  finalLevel.textContent = `Nivel: ${level}`;
  // guardar mejor local
  if(score > best){
    best = Math.floor(score);
    localStorage.setItem("runner_best", best);
  }
  bestEl.textContent = `Max: ${best}`;
  // actualizar leaderboard visible
  loadLeaderboard();
}

// game loop
function loop(){
  if(!running) return;
  // update
  // aumentar score con el tiempo y la velocidad
  score += 0.1 * speed;
  spawnTimer++;
  if(spawnTimer >= spawnInterval){
    spawnObstacle();
    spawnTimer = 0;
    // ajustar spawn segun nivel/aleatoriedad
    spawnInterval = Math.max(40, 90 - level*6 - Math.floor(Math.random()*15));
  }

  // aumentar dificultad segun score
  const newLevel = Math.floor(score / 200) + 1;
  if(newLevel > level){
    level = newLevel;
    speed += 0.8; // aumentar velocidad
  }

  // update player y obstacles
  player.update();
  for(let i = obstacles.length -1; i>=0; i--){
    obstacles[i].x -= speed;
    if(obstacles[i].x + obstacles[i].w < 0) obstacles.splice(i,1);
  }

  // check collision
  for(const obs of obstacles){
    if(isColliding(player, obs)){
      doGameOver();
      return;
    }
  }

  // draw
  draw();

  // update HUD
  scoreEl.textContent = `Score: ${Math.floor(score)}`;
  levelEl.textContent = `Nivel: ${level}`;
  bestEl.textContent = `Max: ${best}`;

  requestAnimationFrame(loop);
}

function draw(){
  // limpiar
  ctx.clearRect(0,0, WIDTH, HEIGHT);

  // suelo
  ctx.fillStyle = "#cfcfcf";
  ctx.fillRect(0, groundY, WIDTH, HEIGHT - groundY);

  // player
  player.draw();

  // obstacles
  ctx.fillStyle = "#a63d3d";
  for(const obs of obstacles){
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
  }

  // puntaje (canvas)
  ctx.fillStyle = "#222";
  ctx.font = "12px Arial";
  ctx.fillText(`Score: ${Math.floor(score)}  Nivel: ${level}`, WIDTH - 140, 20);
}

// input
window.addEventListener("keydown", e=>{
  if(e.code === "Space" || e.code === "ArrowUp"){
    e.preventDefault();
    if(!running && !gameOver){
      running = true;
      loop();
    } else if(gameOver){
      // no hacer nada, usar botones
    } else {
      player.jump();
    }
  }
});
canvas.addEventListener("click", ()=> {
  if(!running && !gameOver){ running = true; loop(); }
  player.jump();
});

// boton reiniciar
restartBtn.addEventListener("click", ()=>{
  resetGame();
});

// guardar score
saveBtn.addEventListener("click", async ()=>{
  const name = (playerNameInput.value || "Anonimo").trim().slice(0,20) || "Anonimo";
  const entry = { name, score: Math.floor(score), level, date: new Date().toISOString() };

  saveMsg.textContent = "Guardando...";
  saveBtn.disabled = true;
  try {
    const res = await postScore(entry);
    if(res && res.ok === false && res.fallback){
      saveMsg.textContent = "Guardado correctamente";
    } else {
      saveMsg.textContent = "Score guardado en servidor.";
    }
    // actualizar best local
    if(entry.score > best){
      best = entry.score;
      localStorage.setItem("runner_best", best);
    }
    // recargar leaderboard
    await loadLeaderboard();
  } catch(e){
    saveMsg.textContent = "Error guardando score.";
    console.error(e);
  } finally {
    saveBtn.disabled = false;
  }
});

// cargar leaderboard
async function loadLeaderboard(){
  leaderboardList.innerHTML = "Cargando...";
  try {
    const arr = await fetchScores(10);
    if(!arr || arr.length === 0){
      leaderboardList.innerHTML = "<p>No hay scores aun</p>";
      return;
    }
    // crear tabla
    let html = "<table><thead><tr><th>#</th><th>Nombre</th><th>Score</th><th>Nivel</th></tr></thead><tbody>";
    arr.slice(0,10).forEach((s,i)=>{
      html += `<tr><td>${i+1}</td><td>${escapeHtml(s.name)}</td><td>${s.score}</td><td>${s.level||"-"}</td></tr>`;
    });
    html += "</tbody></table>";
    leaderboardList.innerHTML = html;
  } catch(e){
    leaderboardList.innerHTML = "<p>Error cargando leaderboard</p>";
    console.error(e);
  }
}

function escapeHtml(text){
  return text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

// inicia vista
bestEl.textContent = `Max: ${best}`;
loadLeaderboard();

// si el servidor no esta configurado, mostrar aviso en consola
if(API_URL.includes("REPLACE_WITH")){
  console.warn("API_URL no configurada en api.js. Guarda scores en localStorage o actualiza la URL.");
}
