const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOver = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

let playerY = 0;
let asteroids = [];
let score = 0;
let running = false;

function resetGame() {

    asteroids.forEach(a => a.remove());
    asteroids = [];

    score = 0;
    scoreText.textContent = "Score: 0";

    playerY = game.clientHeight / 2;
    player.style.top = playerY + "px";

    gameOver.style.display = "none";

    running = true;

}

window.onload = function () {

    resetGame();

};

// ---------- PLAYER ----------

function movePlayer(y) {

    playerY = y;

    if (playerY < 30) playerY = 30;
    if (playerY > game.clientHeight - 30)
        playerY = game.clientHeight - 30;

    player.style.top = playerY + "px";

}

// Mouse
game.addEventListener("mousemove", e => {

    if (!running) return;

    const rect = game.getBoundingClientRect();

    movePlayer(e.clientY - rect.top);

});

// Touch
game.addEventListener("touchstart", e => {

    if (!running) return;

    const rect = game.getBoundingClientRect();

    movePlayer(e.touches[0].clientY - rect.top);

});

game.addEventListener("touchmove", e => {

    if (!running) return;

    e.preventDefault();

    const rect = game.getBoundingClientRect();

    movePlayer(e.touches[0].clientY - rect.top);

}, { passive: false });

// ---------- SPAWN ASTEROIDS ----------

setInterval(() => {

    if (!running) return;

    const asteroid = document.createElement("div");

    asteroid.className = "asteroid";
    asteroid.textContent = "☄️";

    asteroid.x = game.clientWidth;
    asteroid.y = Math.random() * (game.clientHeight - 50);
    asteroid.speed = 6 + Math.random() * 3;

    asteroid.style.left = asteroid.x + "px";
    asteroid.style.top = asteroid.y + "px";

    game.appendChild(asteroid);

    asteroids.push(asteroid);

}, 700);

// ---------- GAME LOOP ----------

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
                a.x < 90 &&
                Math.abs(a.y - playerY) < 40
            ) {

                running = false;

                gameOver.style.display = "flex";

            }

            // Remove
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
restartBtn.onclick = resetGame;
