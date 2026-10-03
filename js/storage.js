// Local storage management

class StorageManager {
    constructor() {
        this.prefix = 'mathsGame_';
    }

    saveProgress(lessonId, state) {
        try {
            localStorage.setItem(this.prefix + 'progress_' + lessonId, JSON.stringify(state));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    loadProgress(lessonId) {
        try {
            const data = localStorage.getItem(this.prefix + 'progress_' + lessonId);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            console.error('Error loading progress:', error);
            return null;
        }
    }

    saveSoundPreference(isMuted) {
        try {
            localStorage.setItem(this.prefix + 'soundMuted', JSON.stringify(isMuted));
        } catch (error) {
            console.error('Error saving sound preference:', error);
        }
    }

    loadSoundPreference() {
        try {
            const data = localStorage.getItem(this.prefix + 'soundMuted');
            if (data !== null) {
                return JSON.parse(data);
            }
            return false; // Default: sound enabled
        } catch (error) {
            console.error('Error loading sound preference:', error);
            return false;
        }
    }

    clearAll() {
        try {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            }
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
}

// Make globally available
window.StorageManager = StorageManager;
