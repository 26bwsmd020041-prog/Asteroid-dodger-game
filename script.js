const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOver = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

let playerY = 0;
let asteroids = [];
let score = 0;
let running = true;

// Start player in the middle
function startGame() {
    playerY = game.clientHeight / 2;
    player.style.top = playerY + "px";

    score = 0;
    scoreText.textContent = "Score: 0";

    asteroids.forEach(a => a.remove());
    asteroids = [];

    gameOver.style.display = "none";

    running = true;
}

startGame();

// Mouse control
game.addEventListener("mousemove", e => {
    if (!running) return;

    const rect = game.getBoundingClientRect();
    playerY = e.clientY - rect.top;

    if (playerY < 25) playerY = 25;
    if (playerY > game.clientHeight - 25)
        playerY = game.clientHeight - 25;

    player.style.top = playerY + "px";
});

// Touch control
game.addEventListener("touchmove", e => {
    if (!running) return;

    e.preventDefault();

    const rect = game.getBoundingClientRect();
    playerY = e.touches[0].clientY - rect.top;

    if (playerY < 25) playerY = 25;
    if (playerY > game.clientHeight - 25)
        playerY = game.clientHeight - 25;

    player.style.top = playerY + "px";

}, { passive: false });

// Spawn asteroids
setInterval(() => {

    if (!running) return;

    const asteroid = document.createElement("div");

    asteroid.className = "asteroid";
    asteroid.textContent = "☄️";

    asteroid.x = game.clientWidth;
    asteroid.y = Math.random() * (game.clientHeight - 50);
    asteroid.speed = 5 + Math.random() * 4;

    asteroid.style.left = asteroid.x + "px";
    asteroid.style.top = asteroid.y + "px";

    game.appendChild(asteroid);

    asteroids.push(asteroid);

}, 800);

// Main game loop
function loop() {

    if (running) {

        score++;
        scoreText.textContent = "Score: " + score;

        for (let i = asteroids.length - 1; i >= 0; i--) {

            let a = asteroids[i];

            a.x -= a.speed;
            a.style.left = a.x + "px";

            // Collision
            if (
                a.x < 80 &&
                Math.abs(a.y - playerY) < 40
            ) {
                running = false;
                gameOver.style.display = "flex";
            }

            // Remove off-screen
            if (a.x < -60) {
                a.remove();
                asteroids.splice(i, 1);
            }
        }
    }

    requestAnimationFrame(loop);
}

loop();

// Restart
restartBtn.onclick = startGame;
