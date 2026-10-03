// Neighbor game: find the number immediately before or after.

class NeighborGame {
    render(question, container) {
        this.question = question;
        this.container = container;
        this.currentAttempt = 0;
        this.locked = false;
        const input = '<label class="sr-only" for="answerInput">Ta réponse</label><input type="text" id="answerInput" inputmode="numeric" autocomplete="off" placeholder="?" class="number-input">';
        container.innerHTML = `
            <div class="game-neighbor">
                <div class="neighbor-display">
                    ${question.direction === 'before'
                        ? `${input}<span class="arrow">→</span><span class="number">${this.formatNumber(question.value)}</span>`
                        : `<span class="number">${this.formatNumber(question.value)}</span><span class="arrow">→</span>${input}`}
                </div>
                <button class="btn btn-primary check-answer" type="button">Vérifier</button>
                <div id="feedbackContainer"></div>
            </div>`;
        const answerInput = container.querySelector('#answerInput');
        container.querySelector('.check-answer').addEventListener('click', () => this.handleAnswer());
        answerInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') this.handleAnswer();
        });
        answerInput.focus();
    }

    formatNumber(number) {
        return number.toLocaleString('fr-FR');
    }

    handleAnswer() {
        if (this.locked) return;
        const input = this.container.querySelector('#answerInput');
        const normalized = input.value.replace(/[\s\u202f]/g, '');
        if (!/^-?\d+$/.test(normalized)) {
            document.getElementById('feedbackContainer').innerHTML =
                '<div class="feedback feedback-error" role="status">Entre un nombre.</div>';
            return;
        }
        this.currentAttempt++;
        const status = window.game.processAnswer(
            this.question,
            Number(normalized) === this.question.answer,
            this.currentAttempt,
            () => this.render(this.question, this.container)
        );
        this.locked = status === 'success' || status === 'help';
    }
}

window.neighborGame = new NeighborGame();
