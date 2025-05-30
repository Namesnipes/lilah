// Game variables
let score = 0;
let lives = 3;
let gameRunning = false;
let gamePaused = false;
let foodItems = [];
let gameSpeed = 2;
let spawnRate = 0.02;
let lilahPosition = 50; // percentage from left

// DOM elements
const introScreen = document.getElementById('introScreen');
const gameScreen = document.getElementById('gameScreen');
const partyScreen = document.getElementById('partyScreen');
const lilahImage = document.getElementById('lilahImage');
const gameArea = document.getElementById('gameArea');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const startGameButton = document.getElementById('startGameButton');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const backToIntroButton = document.getElementById('backToIntroButton');
const playAgainButton = document.getElementById('playAgainButton');
const gameMessage = document.getElementById('gameMessage');
const finalScoreElement = document.getElementById('finalScore');

// Food types with emojis
const foodTypes = ['🐟', '🥛', '🍗', '🧀', '🐭', '🍤', '🥩', '🍖'];

// Lilah images
const openMouthSrc = 'open.png';
const closedMouthSrc = 'closed.png';

// Game functions
function showScreen(screenToShow) {
    introScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    partyScreen.style.display = 'none';
    screenToShow.style.display = 'block';
}

function updateDisplay() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

function createFoodItem() {
    const food = document.createElement('div');
    food.className = 'food-item';
    food.textContent = foodTypes[Math.floor(Math.random() * foodTypes.length)];
    
    // Get current game area dimensions for responsive positioning
    const gameAreaRect = gameArea.getBoundingClientRect();
    const foodSize = Math.min(40, Math.max(30, gameAreaRect.width * 0.08)); // Responsive food size
    const maxLeft = gameArea.offsetWidth - foodSize;
    
    food.style.left = Math.random() * maxLeft + 'px';
    food.style.top = '-50px';
    food.style.animationDuration = (3 + Math.random() * 2) + 's';
    
    gameArea.appendChild(food);
    foodItems.push(food);
    
    // Remove food when animation ends
    food.addEventListener('animationend', () => {
        if (food.parentNode) {
            food.parentNode.removeChild(food);
            foodItems = foodItems.filter(item => item !== food);
            lives--;
            updateDisplay();
            
            if (lives <= 0) {
                endGame();
            }
        }
    });
    
    // Click/touch to eat food
    food.addEventListener('click', (e) => {
        e.preventDefault();
        eatFood(food);
    });
    
    // Touch support
    food.addEventListener('touchstart', (e) => {
        e.preventDefault();
        eatFood(food);
    });
}

function eatFood(food) {
    if (!food.parentNode) return;
    
    // Show Lilah with open mouth
    lilahImage.src = openMouthSrc;
    setTimeout(() => {
        lilahImage.src = closedMouthSrc;
    }, 200);
    
    // Add score
    score += 10;
    updateDisplay();
    
    options = ["yum", "yummy", "mmmm", "delicious", "so good", "yummy yummy", "tasty", "yummylicious", "yummo", "yummy yum", "joey gets none", "scrumptious", "prrrrrrr", "mreow", "meow meow", "purrfect", "paw-some"];
    // Show score popup
    showScorePopup(food.offsetLeft + 20, food.offsetTop, options[Math.floor(Math.random() * options.length)]);
    
    // Remove food
    food.parentNode.removeChild(food);
    foodItems = foodItems.filter(item => item !== food);
    
    // Increase difficulty slightly
    if (score % 100 === 0) {
        gameSpeed += 0.5;
        spawnRate += 0.005;
    }
}

function showScorePopup(x, y, text) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    gameArea.appendChild(popup);
    
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 1000);
}

function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    // Spawn new food
    if (Math.random() < spawnRate) {
        createFoodItem();
    }
    
    requestAnimationFrame(gameLoop);
}

function startGame() {
    score = 0;
    lives = 3;
    gameRunning = true;
    gamePaused = false;
    gameSpeed = 2;
    spawnRate = 0.02;
    foodItems = [];
    
    // Clear existing food
    document.querySelectorAll('.food-item').forEach(food => {
        food.parentNode.removeChild(food);
    });
    
    updateDisplay();
    showScreen(gameScreen);
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    gameMessage.textContent = '"Feed me the yummy treats!" - Lilah';
    
    gameLoop();
}

function pauseGame() {
    gamePaused = !gamePaused;
    pauseButton.textContent = gamePaused ? 'Resume' : 'Pause';
    
    if (!gamePaused) {
        gameLoop();
    }
}

function endGame() {
    gameRunning = false;
    
    // Clear remaining food
    foodItems.forEach(food => {
        if (food.parentNode) {
            food.parentNode.removeChild(food);
        }
    });
    foodItems = [];
    
    // Show party screen with final score
    finalScoreElement.textContent = score;
    showScreen(partyScreen);
}

function backToIntro() {
    gameRunning = false;
    gamePaused = false;
    
    // Clear any remaining food
    foodItems.forEach(food => {
        if (food.parentNode) {
            food.parentNode.removeChild(food);
        }
    });
    foodItems = [];
    
    showScreen(introScreen);
}

// Event listeners
startGameButton.addEventListener('click', startGame);
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
backToIntroButton.addEventListener('click', backToIntro);
playAgainButton.addEventListener('click', () => {
    showScreen(introScreen);
});

// Initialize display
updateDisplay();
showScreen(introScreen);
