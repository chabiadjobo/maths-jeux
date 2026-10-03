// Neighbor game: before or after

class NeighborGame {
    render(question, container, onAnswer) {
        this.question = question;
        this.onAnswer = onAnswer;

        const placeholder = question.direction === 'before' ? 'avant' : 'après';
        
        container.innerHTML = `
            <div class="game-neighbor">
                <div class="neighbor-display">
                    ${question.direction === 'before' ? `
                        <input type="text" id="answerInput" inputmode="numeric" placeholder="?" class="number-input">
                        <span class="arrow">→</span>
                        <span class="number">${this.formatNumber(question.value)}</span>
                    ` : `
                        <span class="number">${this.formatNumber(question.value)}</span>
                        <span class="arrow">→</span>
                        <input type="text" id="answerInput" inputmode="numeric" placeholder="?" class="number-input">
                    `}
                </div>
                <button class="btn btn-primary" onclick="neighborGame.handleAnswer()">Vérifier</button>
            </div>
        `;

        setTimeout(() => document.getElementById('answerInput')?.focus(), 100);
    }

    formatNumber(num) {
        return num.toLocaleString('fr-FR');
    }

    handleAnswer() {
        // Placeholder - implemented in step 6
        console.log('Handle answer not yet implemented');
    }
}

window.neighborGame = new NeighborGame();
