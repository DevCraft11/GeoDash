import { Player } from './player.js';
import { ObstacleManager } from './obstacles.js';
import { CollisionDetector } from './collision.js';
import { ParticleSystem } from './particles.js';

export class Game {
    constructor(width, height, audioManager) {
        this.width = width;
        this.height = height;
        this.audioManager = audioManager;
        
        // Game objects
        this.player = new Player(width * 0.2, height * 0.8);
        this.obstacleManager = new ObstacleManager(width, height);
        this.collisionDetector = new CollisionDetector();
        this.particleSystem = new ParticleSystem();
        
        // Game state
        this.gameSpeed = 5;
        this.distance = 0;
        this.gameOver = false;
        this.groundY = height * 0.9;
        
        // Background elements
        this.backgroundOffset = 0;
        this.cloudOffset = 0;
    }
    
    reset() {
        this.player.reset(this.width * 0.2, this.height * 0.8);
        this.obstacleManager.reset();
        this.particleSystem.clear();
        this.distance = 0;
        this.gameOver = false;
        this.gameSpeed = 5;
        this.backgroundOffset = 0;
        this.cloudOffset = 0;
    }
    
    update() {
        if (this.gameOver) return;
        
        // Update game speed based on distance
        this.gameSpeed = 5 + Math.floor(this.distance / 500) * 0.5;
        
        // Update distance
        this.distance += this.gameSpeed * 0.1;
        
        // Update background
        this.backgroundOffset += this.gameSpeed * 0.5;
        this.cloudOffset += this.gameSpeed * 0.2;
        
        // Update game objects
        this.player.update(this.groundY);
        this.obstacleManager.update(this.gameSpeed);
        this.particleSystem.update();
        
        // Check collisions
        const obstacles = this.obstacleManager.getObstacles();
        for (const obstacle of obstacles) {
            if (this.collisionDetector.checkCollision(this.player, obstacle)) {
                this.gameOver = true;
                
                // Create crash particles
                this.particleSystem.createExplosion(
                    this.player.x + this.player.width / 2,
                    this.player.y + this.player.height / 2,
                    '#ff6b6b'
                );
                
                return;
            }
        }
    }
    
    jump() {
        if (!this.gameOver) {
            this.player.jump();
        }
    }
    
    render(ctx) {
        // Draw background
        this.drawBackground(ctx);
        
        // Draw ground
        this.drawGround(ctx);
        
        // Draw game objects
        this.obstacleManager.render(ctx);
        this.player.render(ctx);
        this.particleSystem.render(ctx);
        
        // Draw speed indicator
        this.drawSpeedIndicator(ctx);
    }
    
    drawBackground(ctx) {
        // Draw sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw moving clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const cloudY = this.height * 0.2;
        const cloudSpacing = 300;
        
        for (let i = 0; i < Math.ceil(this.width / cloudSpacing) + 2; i++) {
            const x = (i * cloudSpacing - this.cloudOffset) % (this.width + cloudSpacing);
            this.drawCloud(ctx, x, cloudY);
            this.drawCloud(ctx, x + 150, cloudY + 50);
        }
        
        // Draw distant mountains
        ctx.fillStyle = 'rgba(108, 122, 137, 0.6)';
        ctx.beginPath();
        const mountainWidth = this.width / 4;
        for (let i = 0; i < 6; i++) {
            const x = (i * mountainWidth - this.backgroundOffset * 0.1) % (this.width + mountainWidth);
            const height = 100 + Math.sin(i * 1.5) * 30;
            ctx.moveTo(x, this.height * 0.7);
            ctx.lineTo(x + mountainWidth / 2, this.height * 0.7 - height);
            ctx.lineTo(x + mountainWidth, this.height * 0.7);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    drawCloud(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 30, y - 20, 22, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawGround(ctx) {
        // Ground
        ctx.fillStyle = '#654321';
        ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);
        
        // Ground pattern
        ctx.fillStyle = '#8B7355';
        const patternSize = 40;
        for (let x = -(this.backgroundOffset % patternSize); x < this.width; x += patternSize) {
            ctx.fillRect(x, this.groundY, patternSize / 2, this.height - this.groundY);
        }
        
        // Grass on top of ground
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, this.groundY - 5, this.width, 5);
    }
    
    drawSpeedIndicator(ctx) {
        const speed = Math.round(this.gameSpeed * 10) / 10;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`Speed: ${speed}x`, this.width - 20, 30);
        ctx.textAlign = 'left';
    }
    
    getDistance() {
        return this.distance;
    }
    
    isGameOver() {
        return this.gameOver;
    }
}
