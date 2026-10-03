// Between game: number between two numbers

class BetweenGame {
    render(question, container, onAnswer) {
        this.question = question;
        this.onAnswer = onAnswer;

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
            </div>
        `;

        setTimeout(() => document.getElementById('answerInput')?.focus(), 100);
    }

    formatNumber(num) {
        return num.toLocaleString('fr-FR');
    }

    handleAnswer() {
        // Placeholder - implemented in step 7
        console.log('Handle answer not yet implemented');
    }
}

window.betweenGame = new BetweenGame();
