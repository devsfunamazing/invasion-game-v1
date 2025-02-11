/**
 * 
 * Script game
 * 
 */

const canvas = document.getElementById('canvasGame')
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu")
const playerName = document.getElementById("playerName")
const scoreList = document.getElementById("socreListe")

/**
 * 
 * Sounds loading
 * Shoot Sound
 * Explosion sound
 */
const shootSound  = new Audio("shoot.mp3")
const explosionSound  = new Audio("explosion.mp3")

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
    enemySpeed = level;

    for (let row = 0; row < level; row++) {
        
        for (let col = 0; col < 8; col++) {
            enemies.push({
                x: (col*60) + 50,
                y: (row * 40) + 30,
                width: 40,
                height: 30,
                alive: true,
            });
        }
        
    }

    clearInterval(enemyShootInterval)
    enemyShootInterval = setInterval(enemyShootInterval, 1000 / level)

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
    shootSound.play()
}
