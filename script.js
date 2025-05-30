// Game variables
let score = 0;
let lives = 3;
let gameRunning = false;
let foodItems = [];
let gameSpeed = 2;
let spawnRate = 0.02;
let baseSpawnRate = 0.02;
let gameStartTime = 0;
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
    
    // Position randomly within the game area (CSS handles the size)
    const maxLeft = gameArea.offsetWidth - 50; // Leave some margin for the food item
    
    food.style.left = Math.random() * maxLeft + 'px';
    food.style.top = '-50px';
    
    // Food falls slightly faster as time progresses (but not too fast)
    const timeElapsed = (Date.now() - gameStartTime) / 1000;
    const speedMultiplier = Math.max(0.7, 1 - (timeElapsed / 120)); // Gets faster over 2 minutes, min 0.7x speed
    const fallDuration = (3 + Math.random() * 2) * speedMultiplier;
    food.style.animationDuration = fallDuration + 's';
    
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
    
    // No more score-based difficulty increase - it's now time-based
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
    if (!gameRunning) return;
    
    // Update difficulty based on time elapsed (gradual increase)
    const timeElapsed = (Date.now() - gameStartTime) / 1000; // seconds
    
    // Gradually increase spawn rate over time (cap at 0.08 to prevent too fast)
    // Increases by 0.01 every 30 seconds
    const difficultyMultiplier = Math.min(1 + (timeElapsed / 30) * 0.5, 4);
    spawnRate = Math.min(baseSpawnRate * difficultyMultiplier, 0.08);
    
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
    gameSpeed = 2;
    spawnRate = baseSpawnRate; // Reset to base spawn rate
    gameStartTime = Date.now(); // Set game start time
    foodItems = [];
    
    // Clear existing food
    document.querySelectorAll('.food-item').forEach(food => {
        food.parentNode.removeChild(food);
    });
    
    updateDisplay();
    showScreen(gameScreen);
    startButton.style.display = 'none';
    gameMessage.textContent = '"Feed me the yummy treats!" - Lilah';
    gameLoop();
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

// Prevent default mobile behaviors only in game area
document.addEventListener('touchmove', function(e) {
    // Only prevent scrolling in the game area
    if (e.target.closest('.game-area')) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    // Only prevent gestures in the game area
    if (e.target.closest('.game-area')) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('gesturestart', function(e) {
    // Only prevent gestures in the game area
    if (e.target.closest('.game-area')) {
        e.preventDefault();
    }
});

document.addEventListener('gesturechange', function(e) {
    // Only prevent gestures in the game area
    if (e.target.closest('.game-area')) {
        e.preventDefault();
    }
});

document.addEventListener('gestureend', function(e) {
    // Only prevent gestures in the game area
    if (e.target.closest('.game-area')) {
        e.preventDefault();
    }
});

// Event listeners
startGameButton.addEventListener('click', startGame);
startButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', () => {
    showScreen(introScreen);
});

// Initialize display
updateDisplay();
showScreen(introScreen);
