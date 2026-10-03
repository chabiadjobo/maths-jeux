// Ordering game: ascending or descending

class OrderingGame {
    render(question, container, onAnswer) {
        this.question = question;
        this.onAnswer = onAnswer;

        const shuffled = this.shuffleArray([...question.values]);
        
        container.innerHTML = `
            <div class="game-ordering">
                <div class="cards" id="cardContainer">
                    ${shuffled.map(val => `
                        <div class="card" draggable="true" data-value="${val}">
                            ${this.formatNumber(val)}
                        </div>
                    `).join('')}
                </div>
                <div class="ordering-order">
                    <p>Ordre actuel :</p>
                    <div id="orderDisplay" class="order-display">
                        ${shuffled.map(val => `<span class="order-item">${this.formatNumber(val)}</span>`).join(' ')}
                    </div>
                </div>
                <button class="btn btn-primary" onclick="orderingGame.checkOrder()">Vérifier</button>
            </div>
        `;
    }

    formatNumber(num) {
        return num.toLocaleString('fr-FR');
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    checkOrder() {
        // Placeholder - implemented in step 5
        console.log('Check order not yet implemented');
    }
}

window.orderingGame = new OrderingGame();
