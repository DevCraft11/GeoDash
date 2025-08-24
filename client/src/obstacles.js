export class ObstacleManager {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 80; // frames between spawns
        this.groundY = height * 0.9;
        
        // Fun fruit obstacle types
        this.obstacleTypes = [
            { type: 'banana', width: 25, height: 45, color: '#fff332' },
            { type: 'orange', width: 35, height: 35, color: '#ff8c00' },
            { type: 'apple', width: 30, height: 35, color: '#ff4444' },
            { type: 'pineapple', width: 28, height: 50, color: '#ffb347' },
            { type: 'watermelon', width: 40, height: 25, color: '#00ff7f' },
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
            case 'banana':
                this.drawBanana(ctx, obstacle);
                break;
            case 'orange':
                this.drawOrange(ctx, obstacle);
                break;
            case 'apple':
                this.drawApple(ctx, obstacle);
                break;
            case 'pineapple':
                this.drawPineapple(ctx, obstacle);
                break;
            case 'watermelon':
                this.drawWatermelon(ctx, obstacle);
                break;
        }
        
        ctx.restore();
    }
    
    drawBanana(ctx, obstacle) {
        // Banana body
        ctx.fillStyle = obstacle.color;
        ctx.beginPath();
        ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 
                   obstacle.width/2, obstacle.height/2, Math.PI/6, 0, Math.PI * 2);
        ctx.fill();
        
        // Banana tip
        ctx.fillStyle = '#e6c200';
        ctx.beginPath();
        ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + 5, 
                   obstacle.width/3, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Banana lines
        ctx.strokeStyle = '#e6c200';
        ctx.lineWidth = 1;
        for(let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(obstacle.x + 5, obstacle.y + 10 + i * 10);
            ctx.lineTo(obstacle.x + obstacle.width - 5, obstacle.y + 15 + i * 10);
            ctx.stroke();
        }
    }
    
    drawOrange(ctx, obstacle) {
        // Orange body
        ctx.fillStyle = obstacle.color;
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 
               obstacle.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Orange texture dots
        ctx.fillStyle = '#ff6600';
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = obstacle.x + obstacle.width/2 + Math.cos(angle) * 8;
            const y = obstacle.y + obstacle.height/2 + Math.sin(angle) * 8;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Orange stem
        ctx.fillStyle = '#228b22';
        ctx.fillRect(obstacle.x + obstacle.width/2 - 2, obstacle.y - 3, 4, 6);
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 
               obstacle.width/2, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawApple(ctx, obstacle) {
        // Apple body
        ctx.fillStyle = obstacle.color;
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2 + 5, 
               obstacle.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Apple indent at top
        ctx.fillStyle = '#cc3333';
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + 8, 
               obstacle.width/3, 0, Math.PI * 2);
        ctx.fill();
        
        // Apple stem
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(obstacle.x + obstacle.width/2 - 1, obstacle.y, 2, 8);
        
        // Apple leaf
        ctx.fillStyle = '#228b22';
        ctx.beginPath();
        ctx.ellipse(obstacle.x + obstacle.width/2 + 5, obstacle.y + 3, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2 + 5, 
               obstacle.width/2, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawPineapple(ctx, obstacle) {
        // Pineapple body
        ctx.fillStyle = obstacle.color;
        ctx.beginPath();
        ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2 + 8, 
                   obstacle.width/2, obstacle.height/2 - 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pineapple pattern
        ctx.strokeStyle = '#ff8c00';
        ctx.lineWidth = 1;
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 3; j++) {
                ctx.beginPath();
                ctx.moveTo(obstacle.x + 5 + j * 8, obstacle.y + 15 + i * 8);
                ctx.lineTo(obstacle.x + 10 + j * 8, obstacle.y + 20 + i * 8);
                ctx.stroke();
            }
        }
        
        // Pineapple leaves
        ctx.fillStyle = '#228b22';
        for(let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(obstacle.x + 5 + i * 4, obstacle.y);
            ctx.lineTo(obstacle.x + 7 + i * 4, obstacle.y - 8);
            ctx.lineTo(obstacle.x + 9 + i * 4, obstacle.y);
            ctx.closePath();
            ctx.fill();
        }
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2 + 8, 
                   obstacle.width/2, obstacle.height/2 - 8, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawWatermelon(ctx, obstacle) {
        // Watermelon body
        ctx.fillStyle = obstacle.color;
        ctx.beginPath();
        ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 
                   obstacle.width/2, obstacle.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Dark green stripes
        ctx.fillStyle = '#006400';
        for(let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 
                       obstacle.width/2 - 2 - i * 6, obstacle.height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = obstacle.color;
            ctx.beginPath();
            ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 
                       obstacle.width/2 - 5 - i * 6, obstacle.height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#006400';
        }
        
        // Watermelon stem
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(obstacle.x + obstacle.width/2 - 1, obstacle.y - 2, 2, 4);
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 
                   obstacle.width/2, obstacle.height/2, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    getObstacles() {
        return this.obstacles;
    }
}
