/**
 * 
 * Script game
 * 
 */

const canvas = document.getElementById('canvasGame')
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu")
const playerName = document.getElementById("playerName")
let scoreList = document.getElementById("scoreList")

/**
 * 
 * Sounds loading
 * Shoot Sound
 * Explosion sound
 */
// const shootSound  = new Audio("shoot.mp3")
// const explosionSound  = new Audio("explosion.mp3")

/**
 * 
 * Player init data
 */
let player = {
    name:"",
    x: 375,
    y: 550,
    width: 50,
    height: 20,
    speed: 5,
    dx: 0,
    lives: 3
}

/**
 * Game Variable
 * bullets Array[] - init empty
 * enemyBullets Array[] - init empty
 * enemies Array[] - init empty
 * score Int - init 0
 * level Int - init 0
 * enemySpeed Int - init 2
 * gameOver Boolean - init false
 * enemyShootInterval
 * 
 */
let bullets = [];
let enemyBullets = [];
let enemies = [];
let score = 0;
let level = 1;
let enemySpeed = 2;
let gameOver = false;
let enemyShootInterval;
let difficultyLevel = 1; // Niveau de difficulté initial

let isPaused = false; // État de la pause

/**
 * 
 * Function Start Game
 * No args 
 */
function startGame() {
    player.name = playerName.value || "Player Lambda"
    menu.style.display = "none";
    canvas.style.display = "block";
    resetGame();
    updateGame();
}

// Génération des ennemis aléatoires avec vitesse progressive
function spawnEnemy() {
    let x = Math.random() * (canvas.width - 40); // Position aléatoire sur l'axe X
    let y = Math.random() * (canvas.height * 0.4); // 🆕 Ennemis apparaissent en haut

    let baseSpeed = 1 + level * 0.2; // 🆕 Augmente avec le niveau
    let speedX = Math.random() * baseSpeed + 1;
    let speedY = Math.random() * baseSpeed + 1;
    let directionX = Math.random() < 0.5 ? 1 : -1;
    let directionY = 1; // Descend vers le joueur

    enemies.push({ 
        x, 
        y, 
        speedX, 
        speedY, 
        directionX, 
        directionY, 
        width: 40, 
        height: 40, 
        lives: 2,  // 🆕 Ennemis ont 2 vies
        alive: true 
    });
}



// Déplacement des ennemis
function moveEnemies() {
    enemies.forEach((enemy) => {
        enemy.x += enemy.speedX * enemy.directionX;
        enemy.y += enemy.speedY * enemy.directionY;

        // Collision avec les bords
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.directionX *= -1;
        }

        if (enemy.y >= canvas.height - enemy.height) {
            enemy.directionY = -1; // Remonter
        } else if (enemy.y <= 0) {
            enemy.directionY = 1; // Redescendre
        }
    });
}

// Augmenter la difficulté toutes les 10 secondes
setInterval(() => {
    difficultyLevel++;
}, 10000);

// Générer un ennemi toutes les 1.5 secondes
setInterval(spawnEnemy, 1500);


/**
 * Reset the Game for new Game
 */
function resetGame() {
    bullets = [];
    enemies = [];
    enemyBullets = [];
    gameOver = false;
    score = 0;
    player.lives = 3;
    
    let minEnemies = 5 + (level * 2);  // 🆕 Minimum d'ennemis en fonction du niveau
    let maxEnemies = 10 + (level * 3); // 🆕 Maximum d'ennemis en fonction du niveau
    let enemyCount = Math.floor(Math.random() * (maxEnemies - minEnemies + 1)) + minEnemies;

    for (let i = 0; i < enemyCount; i++) {
        spawnEnemy();
    }

    clearInterval(enemyShootInterval);
    enemyShootInterval = setInterval(enemyShoot, 1000 / level);
}


/**
 * 
 * Player moves
 * 
 */
function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if ( (player.x + player.width) > canvas.width ) player.x = canvas.width - player.width;
}

/**
 * Function Shoot
 * 
 */
function shoot() {
    bullets.push({
        x: player.x + (player.width / 2) - 2,
        y: player.y,
        width: 5,
        height: 10,
        speed: 5
    })

    // Jouer le son lors du tire
    //shootSound.play()
}

/**
 * 
 * Enemies Shoot
 */
const enemyShoot = ()=>{
    
    let livingEnemies = enemies.filter(e => e.alive);

    if (livingEnemies.length > 0) {
        let shooter = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
        enemyBullets.push({
            x: shooter.x + shooter.width / 2 - 2,
            y: shooter.y + shooter.height,
            width: 5,
            height: 10,
            speed: 3
        });
    }
}

// Lancer les tirs ennemis toutes les 2 secondes
setInterval(enemyShoot, 2000);

/**
 * Collision detection
 * 
 */
const checkCollisions = () => {

    bullets.forEach((b, i) => {
        enemies.forEach((e, j) => {
            if (e.alive && b.x < e.x + e.width && b.x + b.width > e.x &&
                b.y < e.y + e.height && b.y + b.height > e.y) {
                
                e.lives--;  // 🆕 L’ennemi perd 1 vie
                
                if (e.lives === 0) {
                    e.alive = false; // 🆕 L’ennemi meurt quand ses vies tombent à 0
                    score += 10;
                }

                bullets.splice(i, 1); // Supprimer la balle après collision
            }
        });
    });

    enemyBullets.forEach((b, i) => {
        if (b.x < player.x + player.width && b.x + b.width > player.x &&
            b.y < player.y + player.height && b.y + b.height > player.y) {
            player.lives--;
            enemyBullets.splice(i, 1);
            if (player.lives <= 0) {
                gameOver = true;
                saveScore();
            }
        }
    });

    // Détection de collision entre le joueur et les ennemis
    enemies.forEach((e, j) => {
        if (e.alive && player.x < e.x + e.width && player.x + player.width > e.x &&
            player.y < e.y + e.height && player.y + player.height > e.y) {
            player.lives--;
            // e.alive = false; // L'ennemi est supprimé si le joueur le touche
            if (player.lives <= 0) {
                gameOver = true;
                saveScore();
            }
        }
    });
};


function saveScore() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ name: player.name, level, score });
    localStorage.setItem("scores", JSON.stringify(scores));
    updateScoreList();
}

// Mettre à jour l'affichage des scores
function updateScoreList() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scoreList.innerHTML = "";
    scores.forEach(s => {
        let li = document.createElement("li");
        li.textContent = `${s.name} - Niveau ${s.level}: ${s.score}`;
        scoreList.appendChild(li);
    });
}

// Dessiner le joueur
const drawPlayer = ()=> {
    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dessiner les balles
const drawBullets = ()=> {
    ctx.fillStyle = "red";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
    ctx.fillStyle = "yellow";
    enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
}

// Dessiner les ennemis
const drawEnemies = ()=> {
    ctx.fillStyle = "orange";
    enemies.forEach((enemy) => {
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
    });
    // enemies.forEach(e => {
    //     if (e.alive) ctx.fillRect(e.x, e.y, e.width, e.height);
    // });
}

// Boucle du jeu
const updateGame = ()=> {
    
    if (gameOver) {
        drawGameScreen()
        return;
    }
    
    if (isPaused) {
        drawPauseScreen();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    moveEnemies();
    bullets.forEach(b => b.y -= 5);
    enemyBullets.forEach(b => b.y += 3);
    checkCollisions();
    drawPlayer();
    drawBullets();
    drawEnemies();
    
    requestAnimationFrame(updateGame);
}

// Mettre en pause ou reprendre le jeu
function togglePause() {
    isPaused = !isPaused;
    if (!isPaused) {
        updateGame(); // Redémarrer la boucle du jeu
    }
}

// Afficher "PAUSE" à l'écran
function drawPauseScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("PAUSE", canvas.width / 2 - 60, canvas.height / 2);
}

// Afficher "Game Over" à l'écran
function drawGameScreen() {
    ctx.fillStyle = "rgba(105, 10, 10, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 60, canvas.height / 2);
}

// Gestion des touches
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.dx = -player.speed;
    if (e.key === "ArrowRight") player.dx = player.speed;
    if (e.key === " ") shoot();
    if (e.key.toLowerCase() === "p") togglePause(); // Pause avec "P"
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
});

// Charger les scores au démarrage
updateScoreList();
