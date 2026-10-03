// Comparison game: < or >

class ComparisonGame {
    render(question, container, onAnswer) {
        this.question = question;
        this.onAnswer = onAnswer;

        container.innerHTML = `
            <div class="game-comparison">
                <div class="numbers">
                    <div class="number">${this.formatNumber(question.left)}</div>
                    <div class="question-mark">?</div>
                    <div class="number">${this.formatNumber(question.right)}</div>
                </div>
                <div class="buttons-game">
                    <button class="btn btn-answer" data-answer="<" onclick="comparisonGame.handleAnswer('<')">
                        &lt;
                    </button>
                    <button class="btn btn-answer" data-answer=">" onclick="comparisonGame.handleAnswer('>')">
                        &gt;
                    </button>
                </div>
            </div>
        `;
    }

    formatNumber(num) {
        return num.toLocaleString('fr-FR');
    }

    handleAnswer(answer) {
        if (answer === this.question.answer) {
            window.game.audio.playSuccess();
            this.showFeedback('Bien joué !', 'success');
        } else {
            window.game.audio.playError();
            this.showFeedback('Essaie encore, ma princesse.', 'error');
        }
    }

    showFeedback(message, type) {
        // Placeholder - implemented in step 8
        console.log(message, type);
    }
}

window.comparisonGame = new ComparisonGame();
