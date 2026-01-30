// Sound utility for click feedback
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Soft click sound
  playClick() {
    if (!this.enabled) return;
    
    try {
      this.init();
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
      
      oscillator.type = 'sine';
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.08);
    } catch (e) {
      // Audio not supported
    }
  }

  // Typing sound - mechanical keyboard style
  playType() {
    if (!this.enabled) return;
    
    try {
      this.init();
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Random frequency for variety
      const baseFreq = 200 + Math.random() * 100;
      oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.03);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.06, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.04);
      
      oscillator.type = 'square';
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.04);
    } catch (e) {
      // Audio not supported
    }
  }

  // Soft hover sound
  playHover() {
    if (!this.enabled) return;
    
    try {
      this.init();
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.04);
      
      oscillator.type = 'sine';
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.04);
    } catch (e) {
      // Audio not supported
    }
  }

  // Success sound
  playSuccess() {
    if (!this.enabled) return;
    
    try {
      this.init();
      const frequencies = [523, 659, 784]; // C5, E5, G5 chord
      
      frequencies.forEach((freq, i) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime + i * 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3 + i * 0.05);
        
        oscillator.type = 'sine';
        oscillator.start(this.audioContext.currentTime + i * 0.05);
        oscillator.stop(this.audioContext.currentTime + 0.3 + i * 0.05);
      });
    } catch (e) {
      // Audio not supported
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const soundManager = new SoundManager();

// Hook for using sounds
export const useSound = () => {
  return {
    playClick: () => soundManager.playClick(),
    playHover: () => soundManager.playHover(),
    playSuccess: () => soundManager.playSuccess(),
    playType: () => soundManager.playType(),
    toggle: () => soundManager.toggle(),
    enabled: soundManager.enabled,
  };
};
