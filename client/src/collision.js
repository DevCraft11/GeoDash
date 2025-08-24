export class CollisionDetector {
    constructor() {
        // Collision detection settings
        this.tolerance = 2; // Pixels of tolerance for more forgiving gameplay
    }
    
    checkCollision(player, obstacle) {
        const playerBounds = player.getBounds();
        
        // Add tolerance to make collision slightly more forgiving
        const p = {
            x: playerBounds.x + this.tolerance,
            y: playerBounds.y + this.tolerance,
            width: playerBounds.width - this.tolerance * 2,
            height: playerBounds.height - this.tolerance * 2
        };
        
        const o = {
            x: obstacle.x,
            y: obstacle.y,
            width: obstacle.width,
            height: obstacle.height
        };
        
        // AABB (Axis-Aligned Bounding Box) collision detection
        return this.aabbCollision(p, o);
    }
    
    aabbCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // More precise collision detection for specific shapes
    checkSpikeCollision(player, spike) {
        const playerBounds = player.getBounds();
        
        // Check if player is within spike's x bounds
        if (playerBounds.x + playerBounds.width < spike.x || 
            playerBounds.x > spike.x + spike.width) {
            return false;
        }
        
        // Check if player is within spike's y bounds
        if (playerBounds.y + playerBounds.height < spike.y || 
            playerBounds.y > spike.y + spike.height) {
            return false;
        }
        
        // More precise spike collision using triangle math
        const spikeTopX = spike.x + spike.width / 2;
        const spikeTopY = spike.y;
        const spikeBottomY = spike.y + spike.height;
        
        // Check if any corner of the player is inside the spike triangle
        const playerCorners = [
            { x: playerBounds.x, y: playerBounds.y },
            { x: playerBounds.x + playerBounds.width, y: playerBounds.y },
            { x: playerBounds.x, y: playerBounds.y + playerBounds.height },
            { x: playerBounds.x + playerBounds.width, y: playerBounds.y + playerBounds.height }
        ];
        
        for (const corner of playerCorners) {
            if (this.pointInTriangle(
                corner,
                { x: spikeTopX, y: spikeTopY },
                { x: spike.x, y: spikeBottomY },
                { x: spike.x + spike.width, y: spikeBottomY }
            )) {
                return true;
            }
        }
        
        return false;
    }
    
    pointInTriangle(point, v1, v2, v3) {
        const dX = point.x - v3.x;
        const dY = point.y - v3.y;
        const dX21 = v3.x - v2.x;
        const dY12 = v2.y - v3.y;
        const D = dY12 * (v1.x - v3.x) + dX21 * (v1.y - v3.y);
        const s = dY12 * dX + dX21 * dY;
        const t = (v3.y - v1.y) * dX + (v1.x - v3.x) * dY;
        
        if (D < 0) return s <= 0 && t <= 0 && s + t >= D;
        return s >= 0 && t >= 0 && s + t <= D;
    }
}
