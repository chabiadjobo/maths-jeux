// Comparison game: choose < or >.

class ComparisonGame {
    render(question, container) {
        this.question = question;
        this.container = container;
        this.currentAttempt = 0;
        this.locked = false;
        container.innerHTML = `
            <div class="game-comparison">
                <div class="numbers">
                    <div class="number" aria-label="Nombre de gauche : ${this.formatNumber(question.left)}">${this.formatNumber(question.left)}</div>
                    <div class="question-mark">?</div>
                    <div class="number" aria-label="Nombre de droite : ${this.formatNumber(question.right)}">${this.formatNumber(question.right)}</div>
                </div>
                <div class="buttons-game">
                    <button class="btn btn-answer" type="button" data-answer="&lt;" aria-label="Répondre : plus petit que">&lt;</button>
                    <button class="btn btn-answer" type="button" data-answer="&gt;" aria-label="Répondre : plus grand que">&gt;</button>
                </div>
                <div id="feedbackContainer"></div>
            </div>`;

        container.querySelectorAll('.btn-answer').forEach(button => {
            button.addEventListener('click', () => this.handleAnswer(button.dataset.answer));
        });
        container.addEventListener('keydown', event => {
            if (event.key === '<' || event.key === 'ArrowLeft') this.handleAnswer('<');
            if (event.key === '>' || event.key === 'ArrowRight') this.handleAnswer('>');
        });
        container.querySelector('.btn-answer').focus();
    }

    formatNumber(number) {
        return number.toLocaleString('fr-FR');
    }

    handleAnswer(answer) {
        if (this.locked) return;
        this.currentAttempt++;
        const status = window.game.processAnswer(
            this.question,
            answer === this.question.answer,
            this.currentAttempt,
            () => this.render(this.question, this.container)
        );
        this.locked = status === 'success' || status === 'help';
    }
}

window.comparisonGame = new ComparisonGame();
