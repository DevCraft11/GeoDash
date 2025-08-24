export class ObstacleManager {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 80; // frames between spawns
        this.groundY = height * 0.9;
        
        // Obstacle types
        this.obstacleTypes = [
            { type: 'spike', width: 25, height: 40, color: '#ff4444' },
            { type: 'block', width: 30, height: 60, color: '#444444' },
            { type: 'tall_spike', width: 20, height: 80, color: '#ff6666' },
        ];
    }
    
    reset() {
        this.obstacles = [];
        this.spawnTimer = 0;
    }
    
    update(gameSpeed) {
        this.spawnTimer++;
        
        // Spawn new obstacles
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnObstacle();
            this.spawnTimer = 0;
            
            // Gradually decrease spawn interval to increase difficulty
            this.spawnInterval = Math.max(50, this.spawnInterval - 0.5);
        }
        
        // Move obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.x -= gameSpeed;
            
            // Remove obstacles that are off-screen
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    spawnObstacle() {
        // Random obstacle type
        const obstacleType = this.obstacleTypes[Math.floor(Math.random() * this.obstacleTypes.length)];
        
        const obstacle = {
            x: this.width,
            y: this.groundY - obstacleType.height,
            width: obstacleType.width,
            height: obstacleType.height,
            type: obstacleType.type,
            color: obstacleType.color
        };
        
        this.obstacles.push(obstacle);
    }
    
    render(ctx) {
        for (const obstacle of this.obstacles) {
            this.renderObstacle(ctx, obstacle);
        }
    }
    
    renderObstacle(ctx, obstacle) {
        ctx.save();
        
        switch (obstacle.type) {
            case 'spike':
                this.drawSpike(ctx, obstacle);
                break;
            case 'tall_spike':
                this.drawSpike(ctx, obstacle);
                break;
            case 'block':
                this.drawBlock(ctx, obstacle);
                break;
        }
        
        ctx.restore();
    }
    
    drawSpike(ctx, obstacle) {
        // Main spike body
        ctx.fillStyle = obstacle.color;
        ctx.beginPath();
        ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y); // Top point
        ctx.lineTo(obstacle.x, obstacle.y + obstacle.height); // Bottom left
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height); // Bottom right
        ctx.closePath();
        ctx.fill();
        
        // Spike border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Inner highlight
        ctx.fillStyle = '#ff8888';
        ctx.beginPath();
        ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y + 5);
        ctx.lineTo(obstacle.x + 5, obstacle.y + obstacle.height - 5);
        ctx.lineTo(obstacle.x + obstacle.width - 5, obstacle.y + obstacle.height - 5);
        ctx.closePath();
        ctx.fill();
    }
    
    drawBlock(ctx, obstacle) {
        // Main block
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Block border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Inner details
        ctx.fillStyle = '#666';
        ctx.fillRect(obstacle.x + 3, obstacle.y + 3, obstacle.width - 6, obstacle.height - 6);
        
        // Rivets
        ctx.fillStyle = '#888';
        const rivetSize = 3;
        ctx.fillRect(obstacle.x + 5, obstacle.y + 5, rivetSize, rivetSize);
        ctx.fillRect(obstacle.x + obstacle.width - 8, obstacle.y + 5, rivetSize, rivetSize);
        ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.height - 8, rivetSize, rivetSize);
        ctx.fillRect(obstacle.x + obstacle.width - 8, obstacle.y + obstacle.height - 8, rivetSize, rivetSize);
    }
    
    getObstacles() {
        return this.obstacles;
    }
}
