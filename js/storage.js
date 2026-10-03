// Local storage management with robustness

class StorageManager {
    constructor() {
        this.prefix = 'mathsGame_';
        this.isAvailable = this.checkAvailability();
    }

    checkAvailability() {
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.warn('localStorage not available:', error);
            return false;
        }
    }

    saveProgress(lessonId, state) {
        if (!this.isAvailable) return false;

        try {
            const key = this.prefix + 'progress_' + lessonId;
            localStorage.setItem(key, JSON.stringify(state));
            console.log('Progress saved:', lessonId);
            return true;
        } catch (error) {
            console.error('Error saving progress:', error);
            return false;
        }
    }

    loadProgress(lessonId) {
        if (!this.isAvailable) return null;

        try {
            const key = this.prefix + 'progress_' + lessonId;
            const data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                // Validate structure
                if (parsed.lessonId && parsed.results) {
                    console.log('Progress loaded:', lessonId);
                    return parsed;
                }
            }
            return null;
        } catch (error) {
            console.error('Error loading progress (data may be corrupted):', error);
            return null;
        }
    }

    saveSoundPreference(isMuted) {
        if (!this.isAvailable) return false;

        try {
            const key = this.prefix + 'soundMuted';
            localStorage.setItem(key, JSON.stringify(isMuted));
            return true;
        } catch (error) {
            console.error('Error saving sound preference:', error);
            return false;
        }
    }

    loadSoundPreference() {
        if (!this.isAvailable) return false;

        try {
            const key = this.prefix + 'soundMuted';
            const data = localStorage.getItem(key);
            if (data !== null) {
                return JSON.parse(data);
            }
            return false; // Default: sound enabled
        } catch (error) {
            console.error('Error loading sound preference:', error);
            return false; // Default: sound enabled
        }
    }

    clearAll() {
        if (!this.isAvailable) return false;

        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keys.push(key);
                }
            }
            keys.forEach(key => localStorage.removeItem(key));
            console.log('All game data cleared');
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    clearLesson(lessonId) {
        if (!this.isAvailable) return false;

        try {
            const key = this.prefix + 'progress_' + lessonId;
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error clearing lesson data:', error);
            return false;
        }
    }
}

// Make globally available
window.StorageManager = StorageManager;
