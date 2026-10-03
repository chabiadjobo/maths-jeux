// Audio feedback management using Web Audio API

class AudioManager {
    constructor() {
        this.isMuted = false;
        this.audioContext = null;
        
        // Restore mute preference from storage
        if (window.storage) {
            this.isMuted = window.storage.loadSoundPreference();
        }
    }

    getAudioContext() {
        if (!this.audioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        }
        return this.audioContext;
    }

    toggle() {
        this.isMuted = !this.isMuted;
    }

    playSuccess() {
        if (this.isMuted) return;
        
        try {
            const ctx = this.getAudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Success: ascending beep (262 Hz, 330 Hz, 392 Hz)
            osc.frequency.setValueAtTime(262, ctx.currentTime);
            osc.frequency.setValueAtTime(330, ctx.currentTime + 0.1);
            osc.frequency.setValueAtTime(392, ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        } catch (error) {
            console.error('Error playing success sound:', error);
        }
    }

    playError() {
        if (this.isMuted) return;

        try {
            const ctx = this.getAudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Error: descending buzz (200 Hz for 0.2s)
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
        } catch (error) {
            console.error('Error playing error sound:', error);
        }
    }
}

// Make globally available
window.AudioManager = AudioManager;
