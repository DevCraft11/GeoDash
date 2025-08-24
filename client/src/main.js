import { Game } from './game.js';
import { AudioManager } from './audio.js';

// Game instance
let game = null;
let audioManager = null;

// DOM elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOver');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const bestScoreElement = document.getElementById('bestScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const mobileControls = document.getElementById('mobileControls');
const jumpBtn = document.getElementById('jumpBtn');

// Game state
let gameState = 'menu'; // 'menu', 'playing', 'gameOver'
let bestScore = parseInt(localStorage.getItem('geometryRushBest')) || 0;

// Initialize canvas size
function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate canvas size with better viewport handling
    const aspectRatio = 16 / 9;
    
    // Account for UI elements (score, mobile controls) by using less screen space
    const maxWidth = containerWidth * 0.9;
    const maxHeight = containerHeight * 0.8; // Reduced from 0.9 to 0.8 to leave more space
    
    let canvasWidth = Math.min(maxWidth, 1000); // Reduced max width from 1200 to 1000
    let canvasHeight = canvasWidth / aspectRatio;
    
    // If calculated height is too big, adjust based on height constraint
    if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = canvasHeight * aspectRatio;
    }
    
    // Ensure minimum size for playability
    canvasWidth = Math.max(canvasWidth, 400);
    canvasHeight = Math.max(canvasHeight, 225);
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
}

// Detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

// Initialize game
function initGame() {
    resizeCanvas();
    audioManager = new AudioManager();
    game = new Game(canvas.width, canvas.height, audioManager);
    
    // Show mobile controls if on mobile
    if (isMobileDevice()) {
        mobileControls.classList.remove('hidden');
    }
    
    // Update best score display
    bestScoreElement.textContent = bestScore;
    
    // Start game loop
    gameLoop();
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    if (gameState === 'playing' && game) {
        game.update();
        
        // Update score
        const distance = Math.floor(game.getDistance());
        scoreElement.textContent = `Distance: ${distance}m`;
        
        // Check game over
        if (game.isGameOver()) {
            gameState = 'gameOver';
            const finalDistance = Math.floor(game.getDistance());
            
            // Update best score
            if (finalDistance > bestScore) {
                bestScore = finalDistance;
                localStorage.setItem('geometryRushBest', bestScore.toString());
            }
            
            // Show game over screen
            finalScoreElement.textContent = finalDistance;
            bestScoreElement.textContent = bestScore;
            gameOverScreen.classList.remove('hidden');
            mobileControls.classList.add('hidden');
            
            // Play crash sound
            audioManager.playSound('crash');
            audioManager.stopMusic();
        }
    }
}

// Render game
function render() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'playing' && game) {
        game.render(ctx);
    }
}

// Start game
function startGame() {
    gameState = 'playing';
    game.reset();
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    if (isMobileDevice()) {
        mobileControls.classList.remove('hidden');
    }
    
    // Start background music
    audioManager.playMusic();
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (gameState === 'playing' && game) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            game.jump();
            audioManager.playSound('jump');
        }
    } else if (gameState === 'menu' && (e.code === 'Space' || e.code === 'ArrowUp')) {
        e.preventDefault();
        startGame();
    }
});

// Mobile controls
jumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'playing' && game) {
        game.jump();
        audioManager.playSound('jump');
    }
});

// Touch controls for canvas
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'playing' && game) {
        game.jump();
        audioManager.playSound('jump');
    } else if (gameState === 'menu') {
        startGame();
    }
});

// Click controls for canvas
canvas.addEventListener('click', (e) => {
    if (gameState === 'playing' && game) {
        game.jump();
        audioManager.playSound('jump');
    } else if (gameState === 'menu') {
        startGame();
    }
});

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Prevent default touch behaviors
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchstart', (e) => {
    if (e.target === canvas || e.target === jumpBtn) {
        e.preventDefault();
    }
}, { passive: false });

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);
