// Main application logic for maths games

class MathsGame {
    constructor() {
        this.currentLesson = null;
        this.lessonState = null;
        this.currentMissionIndex = 0;
        this.currentQuestionIndex = 0;
    }

    async init() {
        console.log('Initializing MathsGame...');
        
        // Load lesson data
        try {
            const response = await fetch('data/current.json');
            if (!response.ok) throw new Error(`Failed to load lesson: ${response.status}`);
            this.currentLesson = await response.json();
            console.log('Lesson loaded:', this.currentLesson);
        } catch (error) {
            console.error('Error loading lesson:', error);
            this.showError('La séance ne peut pas être chargée. Demande à papa ou maman de vérifier le fichier.');
            return;
        }

        // Validate lesson structure
        if (!this.validateLesson(this.currentLesson)) {
            this.showError('La séance ne peut pas être chargée. Demande à papa ou maman de vérifier le fichier.');
            return;
        }

        // Load or initialize state
        this.lessonState = this.storage.loadProgress(this.currentLesson.id);

        // Render initial screen
        this.render();
    }

    validateLesson(lesson) {
        if (!lesson.schemaVersion) return false;
        if (!lesson.id || !lesson.date || !lesson.title) return false;
        if (!Array.isArray(lesson.missions) || lesson.missions.length === 0) return false;
        
        for (const mission of lesson.missions) {
            if (!mission.id || !mission.type || !mission.title) return false;
            if (!Array.isArray(mission.questions)) return false;
        }
        return true;
    }

    showError(message) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="error-screen">
                <h1>Oups !</h1>
                <p>${message}</p>
            </div>
        `;
    }

    render() {
        if (!this.lessonState) {
            this.renderHome();
        } else if (this.lessonState.completedAt) {
            this.renderResults();
        } else {
            this.renderMission();
        }
    }

    renderHome() {
        const app = document.getElementById('app');
        const totalQuestions = this.currentLesson.missions.reduce((sum, m) => sum + m.questions.length, 0);
        
        app.innerHTML = `
            <div class="home-screen">
                <h1 class="app-title">Amusons-nous avec les maths</h1>
                <p class="greeting">Ma princesse, prête pour ta mission ?</p>
                
                <div class="lesson-info">
                    <h2>${this.currentLesson.title}</h2>
                    ${this.currentLesson.description ? `<p>${this.currentLesson.description}</p>` : ''}
                    <p class="mission-count">📋 ${this.currentLesson.missions.length} missions • ${totalQuestions} questions</p>
                </div>

                <div class="buttons">
                    <button class="btn btn-primary" onclick="game.start()">Commencer</button>
                </div>

                <div class="audio-control">
                    <button class="sound-toggle" onclick="game.toggleSound()" title="Activer/Désactiver le son">
                        <span class="sound-icon" id="soundIcon">${this.audio.isMuted ? '🔕' : '🔊'}</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderMission() {
        const mission = this.currentLesson.missions[this.currentMissionIndex];
        const question = mission.questions[this.currentQuestionIndex];
        const progress = `${this.currentQuestionIndex + 1} / ${mission.questions.length}`;

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="mission-screen">
                <div class="mission-header">
                    <span class="mission-number">Mission ${this.currentMissionIndex + 1} / ${this.currentLesson.missions.length}</span>
                    <button class="sound-toggle" onclick="game.toggleSound()" title="Activer/Désactiver le son">
                        <span class="sound-icon" id="soundIcon">${this.audio.isMuted ? '🔕' : '🔊'}</span>
                    </button>
                </div>

                <h2>${mission.title}</h2>
                <p class="instruction">${mission.instruction}</p>

                <div id="gameContainer"></div>

                <div class="progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(this.currentQuestionIndex / mission.questions.length) * 100}%"></div>
                    </div>
                    <p class="progress-text">${progress}</p>
                </div>
            </div>
        `;

        // Render game based on type
        this.renderGameByType(mission.type, question, mission);
    }

    renderGameByType(type, question, mission) {
        const container = document.getElementById('gameContainer');
        
        switch (type) {
            case 'comparison':
                window.comparisonGame.render(question, container, () => this.checkAnswer());
                break;
            case 'ordering':
                window.orderingGame.render(question, container, () => this.checkAnswer());
                break;
            case 'neighbor':
                window.neighborGame.render(question, container, () => this.checkAnswer());
                break;
            case 'between':
                window.betweenGame.render(question, container, () => this.checkAnswer());
                break;
            default:
                container.innerHTML = '<p>Type de jeu inconnu</p>';
        }
    }

    checkAnswer() {
        // Answer checking is handled by individual games
        console.log('Answer check completed');
    }

    renderResults() {
        const app = document.getElementById('app');
        const results = window.ScoringManager.calculateResults(this.currentLesson, this.lessonState);

        app.innerHTML = `
            <div class="results-screen">
                <h1>Séance terminée ! 🎉</h1>
                
                <div class="final-score">
                    <p class="score-text">${results.totalCorrect} / ${results.totalQuestions} questions réussies</p>
                    <div class="stars">${'⭐'.repeat(results.stars)}</div>
                    <p class="star-message">${results.starMessage}</p>
                </div>

                <div class="results-by-mission">
                    <h3>Résultats par mission :</h3>
                    ${results.missions.map(m => `
                        <div class="mission-result mission-${m.status}">
                            <span>${m.title}</span>
                            <span class="result-score">${m.correct}/${m.total}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="results-summary">
                    <p>✅ Réussies sans aide : ${results.correctWithoutHelp}</p>
                    <p>🆘 Réussies après aide : ${results.correctWithHelp}</p>
                    <p>❌ Erreurs totales : ${results.totalErrors}</p>
                </div>

                <div class="buttons">
                    ${this.hasErrors() ? '<button class="btn btn-primary" onclick="game.retryErrors()">Rejouer mes erreurs</button>' : ''}
                    <button class="btn btn-primary" onclick="game.copyResults()">Copier mon résultat</button>
                </div>
            </div>
        `;
    }

    hasErrors() {
        for (const mission of this.currentLesson.missions) {
            for (const question of mission.questions) {
                const qState = this.lessonState.results[question.id] || {};
                if ((qState.wrongAttempts || 0) > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    start() {
        this.lessonState = {
            lessonId: this.currentLesson.id,
            startedAt: new Date().toISOString(),
            completedAt: null,
            currentMissionId: this.currentLesson.missions[0].id,
            currentQuestionId: this.currentLesson.missions[0].questions[0].id,
            soundEnabled: !this.audio.isMuted,
            results: {}
        };

        // Initialize results for all questions
        for (const mission of this.currentLesson.missions) {
            for (const question of mission.questions) {
                this.lessonState.results[question.id] = {
                    wrongAttempts: 0,
                    completed: false,
                    adultHelpRequired: false
                };
            }
        }

        this.storage.saveProgress(this.currentLesson.id, this.lessonState);
        this.currentMissionIndex = 0;
        this.currentQuestionIndex = 0;
        this.render();
    }

    nextQuestion() {
        const mission = this.currentLesson.missions[this.currentMissionIndex];
        
        if (this.currentQuestionIndex < mission.questions.length - 1) {
            this.currentQuestionIndex++;
        } else if (this.currentMissionIndex < this.currentLesson.missions.length - 1) {
            this.currentMissionIndex++;
            this.currentQuestionIndex = 0;
        } else {
            // Lesson completed
            this.lessonState.completedAt = new Date().toISOString();
            this.storage.saveProgress(this.currentLesson.id, this.lessonState);
        }

        this.storage.saveProgress(this.currentLesson.id, this.lessonState);
        this.render();
    }

    toggleSound() {
        this.audio.toggle();
        this.storage.saveSoundPreference(this.audio.isMuted);
        const icon = document.getElementById('soundIcon');
        if (icon) {
            icon.textContent = this.audio.isMuted ? '🔕' : '🔊';
        }
    }

    retryErrors() {
        // Placeholder for retry errors feature (implemented in step 12)
        console.log('Retry errors not yet implemented');
    }

    copyResults() {
        // Placeholder for copy results feature (implemented in step 12)
        console.log('Copy results not yet implemented');
    }
}

// Initialize game on page load
let game;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio
    window.audio = new AudioManager();
    
    // Initialize storage
    window.storage = new StorageManager();
    
    // Initialize game
    game = new MathsGame();
    game.audio = window.audio;
    game.storage = window.storage;
    game.init();
});
