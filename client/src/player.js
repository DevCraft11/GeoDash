export class Player {
    constructor(x, y) {
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        
        // Physics
        this.velocityY = 0;
        this.gravity = 0.8;
        this.jumpPower = -16;
        this.onGround = false;
        
        // Animation
        this.rotation = 0;
        this.rotationSpeed = 0.15;
        
        // Visual effects
        this.trail = [];
        this.maxTrailLength = 8;
    }
    
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityY = 0;
        this.onGround = false;
        this.rotation = 0;
        this.trail = [];
    }
    
    update(groundY) {
        // Store previous position for trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        // Ground collision
        if (this.y + this.height >= groundY) {
            this.y = groundY - this.height;
            this.velocityY = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
        
        // Rotation animation
        if (!this.onGround) {
            this.rotation += this.rotationSpeed;
        } else {
            // Snap rotation to nearest 90-degree angle when on ground
            const targetRotation = Math.round(this.rotation / (Math.PI / 2)) * (Math.PI / 2);
            this.rotation += (targetRotation - this.rotation) * 0.2;
        }
        
        // Keep rotation in bounds
        if (this.rotation > Math.PI * 2) {
            this.rotation -= Math.PI * 2;
        }
    }
    
    jump() {
        if (this.onGround) {
            this.velocityY = this.jumpPower;
            this.onGround = false;
        }
    }
    
    render(ctx) {
        // Draw trail
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < this.trail.length; i++) {
            const trail = this.trail[i];
            const alpha = (i + 1) / this.trail.length * 0.3;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#4ecdc4';
            ctx.fillRect(trail.x, trail.y, this.width, this.height);
        }
        
        ctx.globalAlpha = 1;
        
        // Save context for rotation
        ctx.save();
        
        // Move to center of player for rotation
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Draw main cube
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Draw cube border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Draw inner details
        ctx.fillStyle = '#ff8e8e';
        ctx.fillRect(-this.width / 2 + 5, -this.height / 2 + 5, this.width - 10, this.height - 10);
        
        // Draw center dot
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Draw glow effect when jumping
        if (!this.onGround) {
            ctx.shadowColor = '#4ecdc4';
            ctx.shadowBlur = 20;
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = '#4ecdc4';
            ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
