// Between game: number between two numbers

class BetweenGame {
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
            <div class="game-between">
                <div class="between-display">
                    <span class="number">${this.formatNumber(question.left)}</span>
                    <span class="symbol">&lt;</span>
                    <input type="text" id="answerInput" inputmode="numeric" placeholder="?" class="number-input">
                    <span class="symbol">&lt;</span>
                    <span class="number">${this.formatNumber(question.right)}</span>
                </div>
                <button class="btn btn-primary" onclick="betweenGame.handleAnswer()">Vérifier</button>
                <div id="feedbackContainer"></div>
            </div>
        `;

        setTimeout(() => {
            const input = document.getElementById('answerInput');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.handleAnswer();
                });
            }
        }, 100);
    }

    formatNumber(num) {
        return num.toLocaleString('fr-FR');
    }

    handleAnswer() {
        if (this.answered) return;

        const input = document.getElementById('answerInput');
        if (!input || !input.value.trim()) {
            window.game.audio.playError();
            const feedback = document.getElementById('feedbackContainer');
            feedback.innerHTML = `<div class="feedback feedback-error">Veuillez entrer un nombre.</div>`;
            return;
        }

        const userAnswer = parseInt(input.value.replace(/\s/g, ''));
        const expectedAnswer = this.question.answer;

        this.currentAttempt++;

        // Record attempt
        const questionState = window.game.lessonState.results[this.question.id];
        if (userAnswer !== expectedAnswer) {
            questionState.wrongAttempts++;
        }

        if (userAnswer === expectedAnswer) {
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
        feedback.innerHTML = `<div class="feedback feedback-success">Bien joué ! 🎉</div>`;

        window.game.lessonState.results[this.question.id].completed = true;
        window.game.storage.saveProgress(window.game.currentLesson.id, window.game.lessonState);

        setTimeout(() => window.game.nextQuestion(), 1500);
    }

    showError() {
        window.game.audio.playError();

        const feedback = document.getElementById('feedbackContainer');
        let message = 'Essaie encore, ma princesse.';

        if (this.currentAttempt === 2) {
            message = this.question.hint || 'Cherche le nombre qui vient juste après celui de gauche.';
        }

        feedback.innerHTML = `<div class="feedback feedback-${this.currentAttempt === 2 ? 'hint' : 'error'}">${message}</div>`;
    }

    showNeedHelp() {
        window.game.audio.playError();

        const feedback = document.getElementById('feedbackContainer');
        feedback.innerHTML = `
            <div class="feedback feedback-help">
                Ma princesse, appelle papa ou maman pour une explication.
            </div>
            <button class="btn btn-primary" onclick="betweenGame.retryAfterHelp()">
                Réessayer après l'explication
            </button>
        `;
    }

    retryAfterHelp() {
        this.currentAttempt = 0;
        this.answered = false;
        this.render(this.question, this.container);
    }
}

window.betweenGame = new BetweenGame();
