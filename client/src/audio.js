export class AudioManager {
    constructor() {
        this.sounds = {
            jump: document.getElementById('jumpSound'),
            crash: document.getElementById('crashSound'),
            background: document.getElementById('backgroundMusic')
        };
        
        this.enabled = true;
        this.musicEnabled = true;
        
        // Set volumes
        this.sounds.jump.volume = 0.4;
        this.sounds.crash.volume = 0.6;
        this.sounds.background.volume = 0.3;
        
        // Handle audio loading errors gracefully
        Object.keys(this.sounds).forEach(key => {
            this.sounds[key].addEventListener('error', (e) => {
                console.warn(`Failed to load audio: ${key}`, e);
            });
        });
    }
    
    playSound(soundName) {
        if (!this.enabled || !this.sounds[soundName]) {
            return;
        }
        
        try {
            const sound = this.sounds[soundName];
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.warn(`Failed to play sound: ${soundName}`, error);
            });
        } catch (error) {
            console.warn(`Error playing sound: ${soundName}`, error);
        }
    }
    
    playMusic() {
        if (!this.musicEnabled || !this.sounds.background) {
            return;
        }
        
        try {
            this.sounds.background.currentTime = 0;
            this.sounds.background.play().catch(error => {
                console.warn('Failed to play background music:', error);
            });
        } catch (error) {
            console.warn('Error playing background music:', error);
        }
    }
    
    stopMusic() {
        if (this.sounds.background) {
            try {
                this.sounds.background.pause();
                this.sounds.background.currentTime = 0;
            } catch (error) {
                console.warn('Error stopping background music:', error);
            }
        }
    }
    
    toggleSound() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopMusic();
        }
        return this.musicEnabled;
    }
    
    setVolume(soundName, volume) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    setSoundEnabled(enabled) {
        this.enabled = enabled;
    }
    
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (!enabled) {
            this.stopMusic();
        }
    }
}
