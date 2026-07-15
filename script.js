const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOver = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

let playerY = 250;
let score = 0;
let running = true;

const keys = {};
let asteroids = [];

let asteroidSpeed = 4;
let spawnRate = 900;
let spawnTimer;

// Keyboard controls
document.addEventListener("keydown", e => {
    keys[e.key] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

// Touch controls
game.addEventListener("touchmove", e => {
    if (!running) return;

    e.preventDefault();

    const rect = game.getBoundingClientRect();
    playerY = e.touches[0].clientY - rect.top;
});

// Mouse drag
game.addEventListener("mousemove", e => {
    if (e.buttons === 1) {
        const rect = game.getBoundingClientRect();
        playerY = e.clientY - rect.top;
    }
});

function spawnAsteroid() {

    if (!running) return;

    const asteroid = document.createElement("div");
    asteroid.className = "asteroid";
    asteroid.innerHTML = "☄️";

    asteroid.x = game.clientWidth;
    asteroid.y = Math.random() * (game.clientHeight - 40);

    // Speed increases over time
    asteroid.speed = asteroidSpeed + Math.random() * 3;

    asteroid.style.left = asteroid.x + "px";
    asteroid.style.top = asteroid.y + "px";

    game.appendChild(asteroid);
    asteroids.push(asteroid);
}

function startSpawner() {

    clearInterval(spawnTimer);

    spawnTimer = setInterval(() => {
        spawnAsteroid();
    }, spawnRate);

}

startSpawner();

function update() {

    if (running) {

        if (keys["ArrowUp"] || keys["w"] || keys["W"])
            playerY -= 7;

        if (keys["ArrowDown"] || keys["s"] || keys["S"])
            playerY += 7;

        playerY = Math.max(20, Math.min(game.clientHeight - 50, playerY));

        player.style.top = playerY + "px";

        // Increase difficulty
        asteroidSpeed = 4 + Math.floor(score / 500);

        let newRate = Math.max(250, 900 - Math.floor(score / 20));

        if (newRate !== spawnRate) {
            spawnRate = newRate;
            startSpawner();
        }

        for (let i = asteroids.length - 1; i >= 0; i--) {

            const a = asteroids[i];

            a.x -= a.speed;

            a.style.left = a.x + "px";

            // Collision
            if (
                a.x < 95 &&
                a.x > 10 &&
                a.y < playerY + 35 &&
                a.y + 35 > playerY
            ) {

                running = false;
                clearInterval(spawnTimer);
                gameOver.style.display = "flex";
            }

            if (a.x < -60) {
                a.remove();
                asteroids.splice(i, 1);
            }
        }

        score++;

        scoreText.innerHTML =
            "Score: " + score +
            "<br>Speed: " + asteroidSpeed;

    }

    requestAnimationFrame(update);
}

update();

restartBtn.onclick = function () {

    asteroids.forEach(a => a.remove());

    asteroids = [];

    playerY = game.clientHeight / 2;

    score = 0;

    asteroidSpeed = 4;

    spawnRate = 900;
    running = true;

    scoreText.innerHTML = "Score: 0";

    gameOver.style.display = "none";

    startSpawner();

};
