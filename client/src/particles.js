export class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    clear() {
        this.particles = [];
    }
    
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update velocity (gravity and air resistance)
            particle.vy += particle.gravity;
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            
            // Update life
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        ctx.save();
        
        for (const particle of this.particles) {
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            
            if (particle.type === 'circle') {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (particle.type === 'square') {
                ctx.fillRect(
                    particle.x - particle.size / 2,
                    particle.y - particle.size / 2,
                    particle.size,
                    particle.size
                );
            }
        }
        
        ctx.restore();
    }
    
    createExplosion(x, y, color = '#ff6b6b', particleCount = 15) {
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 3 + Math.random() * 7;
            const size = 2 + Math.random() * 6;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: this.getRandomColor(color),
                type: Math.random() > 0.5 ? 'circle' : 'square',
                life: 30 + Math.random() * 20,
                maxLife: 50,
                alpha: 1,
                gravity: 0.3,
                friction: 0.98
            };
            
            this.particles.push(particle);
        }
    }
    
    createJumpParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            const particle = {
                x: x + Math.random() * 30,
                y: y + 25,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3,
                size: 1 + Math.random() * 3,
                color: '#4ecdc4',
                type: 'circle',
                life: 20 + Math.random() * 10,
                maxLife: 30,
                alpha: 1,
                gravity: 0.1,
                friction: 0.95
            };
            
            this.particles.push(particle);
        }
    }
    
    createTrailParticles(x, y) {
        if (Math.random() > 0.7) { // Don't create trail particles every frame
            const particle = {
                x: x + Math.random() * 20,
                y: y + Math.random() * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 1 + Math.random() * 2,
                color: 'rgba(78, 205, 196, 0.6)',
                type: 'circle',
                life: 15 + Math.random() * 10,
                maxLife: 25,
                alpha: 0.6,
                gravity: 0,
                friction: 0.99
            };
            
            this.particles.push(particle);
        }
    }
    
    getRandomColor(baseColor) {
        const colors = [
            baseColor,
            '#ff8e8e',
            '#ffaa6b',
            '#4ecdc4',
            '#45b7d1',
            '#f39c12'
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
