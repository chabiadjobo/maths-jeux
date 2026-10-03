// Comparison game: < or >

class ComparisonGame {
    constructor() {
        this.question = null;
        this.currentAttempt = 0;
        this.maxAttempts = 3;
        this.answered = false;
    }

    render(question, container, onAnswer) {
        this.question = question;
        this.currentAttempt = 0;
        this.answered = false;
        this.container = container;

        container.innerHTML = `
            <div class="game-comparison">
                <div class="numbers">
                    <div class="number" aria-label="Nombre de gauche: ${this.formatNumber(question.left)}">${this.formatNumber(question.left)}</div>
                    <div class="question-mark">?</div>
                    <div class="number" aria-label="Nombre de droite: ${this.formatNumber(question.right)}">${this.formatNumber(question.right)}</div>
                </div>
                <div class="buttons-game">
                    <button class="btn btn-answer" data-answer="<" onclick="comparisonGame.handleAnswer('<')" aria-label="Répondre: plus petit que">
                        &lt;
                    </button>
                    <button class="btn btn-answer" data-answer=">" onclick="comparisonGame.handleAnswer('>')" aria-label="Répondre: plus grand que">
                        &gt;
                    </button>
                </div>
                <div id="feedbackContainer"></div>
            </div>
        `;

        // Set focus to first button for keyboard navigation
        setTimeout(() => {
            const firstBtn = container.querySelector('.btn-answer');
            if (firstBtn) firstBtn.focus();
        }, 100);

        // Add keyboard support
        container.addEventListener('keydown', (e) => {
            if (e.key === '<' || e.key === 'ArrowLeft') {
                this.handleAnswer('<');
            } else if (e.key === '>' || e.key === 'ArrowRight') {
                this.handleAnswer('>');
            }
        });
    }

    formatNumber(num) {
        return num.toLocaleString('fr-FR');
    }

    handleAnswer(answer) {
        if (this.answered) return;

        this.currentAttempt++;
        const isCorrect = answer === this.question.answer;

        // Record attempt in game state
        const questionState = window.game.lessonState.results[this.question.id];
        if (!isCorrect) {
            questionState.wrongAttempts++;
        }

        if (isCorrect) {
            this.showSuccess();
        } else if (this.currentAttempt < this.maxAttempts) {
            this.showError();
        } else {
            this.showNeedHelp();
            questionState.adultHelpRequired = true;
        }

        window.game.storage.saveProgress(window.game.currentLesson.id, window.game.lessonState);
    }

    showSuccess() {
        this.answered = true;
        window.game.audio.playSuccess();

        const feedback = document.getElementById('feedbackContainer');
        feedback.innerHTML = `
            <div class="feedback feedback-success" role="status" aria-live="polite">
                ✅ Bien joué ! 🎉
            </div>
        `;

        // Mark as completed
        window.game.lessonState.results[this.question.id].completed = true;
        window.game.storage.saveProgress(window.game.currentLesson.id, window.game.lessonState);

        setTimeout(() => window.game.nextQuestion(), 1500);
    }

    showError() {
        window.game.audio.playError();

        const feedback = document.getElementById('feedbackContainer');
        let message = 'Essaie encore, ma princesse.';

        if (this.currentAttempt === 2) {
            message = this.getHint();
        }

        feedback.innerHTML = `
            <div class="feedback feedback-${this.currentAttempt === 2 ? 'hint' : 'error'}" role="status" aria-live="polite">
                ${this.currentAttempt === 1 ? '❌' : '💡'} ${message}
            </div>
        `;
    }

    showNeedHelp() {
        window.game.audio.playError();

        const feedback = document.getElementById('feedbackContainer');
        feedback.innerHTML = `
            <div class="feedback feedback-help" role="status" aria-live="polite">
                🆘 Ma princesse, appelle papa ou maman pour une explication.
            </div>
            <button class="btn btn-primary" onclick="comparisonGame.retryAfterHelp()">
                Réessayer après l'explication
            </button>
        `;

        setTimeout(() => {
            const btn = feedback.querySelector('.btn');
            if (btn) btn.focus();
        }, 100);
    }

    getHint() {
        if (this.question.hint) {
            return this.question.hint;
        }

        return 'Compare d\'abord le nombre de chiffres, puis les milliers, les centaines, les dizaines et les unités.';
    }

    retryAfterHelp() {
        this.currentAttempt = 0;
        this.answered = false;
        this.render(this.question, this.container);
    }
}

window.comparisonGame = new ComparisonGame();
