// Ordering game: ascending or descending

class OrderingGame {
    constructor() {
        this.question = null;
        this.currentOrder = [];
        this.shuffled = [];
        this.currentAttempt = 0;
        this.maxAttempts = 3;
        this.answered = false;
        this.draggedElement = null;
    }

    render(question, container, onAnswer) {
        this.question = question;
        this.shuffled = this.shuffleArray([...question.values]);
        this.currentOrder = [...this.shuffled];
        this.currentAttempt = 0;
        this.answered = false;
        this.container = container;

        container.innerHTML = `
            <div class="game-ordering">
                <div class="cards" id="cardContainer">
                    ${this.shuffled.map(val => `
                        <div class="card" draggable="true" data-value="${val}" onclick="orderingGame.selectCard(event)">
                            ${this.formatNumber(val)}
                        </div>
                    `).join('')}
                </div>

                <div class="ordering-instructions">
                    <p>Glisse et dépose les cartes ou clique pour réordonner.</p>
                </div>

                <div class="ordering-order">
                    <p>Ordre actuel :</p>
                    <div id="orderDisplay" class="order-display">
                        ${this.shuffled.map(val => `<span class="order-item" data-value="${val}">${this.formatNumber(val)}</span>`).join('')}
                    </div>
                </div>

                <button class="btn btn-primary" onclick="orderingGame.checkOrder()">Vérifier</button>
                <div id="feedbackContainer"></div>
            </div>
        `;

        this.setupDragAndDrop();
        this.selectedCard = null;
    }

    setupDragAndDrop() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => this.onDragStart(e));
            card.addEventListener('dragend', (e) => this.onDragEnd(e));
        });

        const orderItems = document.querySelectorAll('.order-item');
        orderItems.forEach(item => {
            item.addEventListener('dragover', (e) => this.onDragOver(e));
            item.addEventListener('drop', (e) => this.onDrop(e));
        });
    }

    onDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    onDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedElement = null;
    }

    onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    onDrop(e) {
        e.preventDefault();
        if (!this.draggedElement) return;

        const draggedValue = parseInt(this.draggedElement.dataset.value);
        const targetValue = parseInt(e.target.dataset.value);

        if (draggedValue !== targetValue) {
            this.swapInOrder(draggedValue, targetValue);
        }
    }

    swapInOrder(value1, value2) {
        const idx1 = this.currentOrder.indexOf(value1);
        const idx2 = this.currentOrder.indexOf(value2);

        if (idx1 >= 0 && idx2 >= 0) {
            [this.currentOrder[idx1], this.currentOrder[idx2]] = [this.currentOrder[idx2], this.currentOrder[idx1]];
            this.updateOrderDisplay();
        }
    }

    selectCard(e) {
        if (this.answered) return;

        const card = e.target.closest('.card');
        if (!card) return;

        if (this.selectedCard) {
            if (this.selectedCard === card) {
                this.selectedCard.classList.remove('selected');
                this.selectedCard = null;
            } else {
                const val1 = parseInt(this.selectedCard.dataset.value);
                const val2 = parseInt(card.dataset.value);
                this.swapInOrder(val1, val2);
                this.selectedCard.classList.remove('selected');
                this.selectedCard = null;
            }
        } else {
            card.classList.add('selected');
            this.selectedCard = card;
        }
    }

    updateOrderDisplay() {
        const display = document.getElementById('orderDisplay');
        display.innerHTML = this.currentOrder.map(val => 
            `<span class="order-item" data-value="${val}">${this.formatNumber(val)}</span>`
        ).join('');
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
        if (this.answered) return;

        this.currentAttempt++;
        const isCorrect = JSON.stringify(this.currentOrder) === JSON.stringify(this.question.answer);

        // Record attempt
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
            message = this.question.hint || 'Cherche à partir du plus ' + (this.question.direction === 'ascending' ? 'petit' : 'grand') + '.';
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
            <button class="btn btn-primary" onclick="orderingGame.retryAfterHelp()">
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

window.orderingGame = new OrderingGame();
