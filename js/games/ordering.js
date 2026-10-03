// Ordering game: one reorderable list, usable by drag-and-drop or two successive clicks.

class OrderingGame {
    render(question, container) {
        this.question = question;
        this.container = container;
        this.currentOrder = this.shuffleArray([...question.values]);
        this.currentAttempt = 0;
        this.locked = false;
        this.selectedIndex = null;
        this.draggedIndex = null;
        container.innerHTML = `
            <div class="game-ordering">
                <p class="ordering-instructions">Glisse les cartes, ou sélectionne une carte puis sa nouvelle place.</p>
                <div id="orderDisplay" class="cards order-display" aria-label="Ordre actuel"></div>
                <button class="btn btn-primary check-order" type="button">Vérifier</button>
                <div id="feedbackContainer"></div>
            </div>`;
        container.querySelector('.check-order').addEventListener('click', () => this.checkOrder());
        this.renderCards();
    }

    renderCards() {
        const display = this.container.querySelector('#orderDisplay');
        display.innerHTML = this.currentOrder.map((value, index) => `
            <button class="card${index === this.selectedIndex ? ' selected' : ''}" type="button"
                    draggable="true" data-index="${index}" aria-pressed="${index === this.selectedIndex}">
                ${value.toLocaleString('fr-FR')}
            </button>`).join('');

        display.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => this.selectCard(Number(card.dataset.index)));
            card.addEventListener('dragstart', event => this.onDragStart(event, Number(card.dataset.index)));
            card.addEventListener('dragend', event => event.currentTarget.classList.remove('dragging'));
            card.addEventListener('dragover', event => event.preventDefault());
            card.addEventListener('drop', event => this.onDrop(event, Number(card.dataset.index)));
        });
    }

    selectCard(index) {
        if (this.locked) return;
        if (this.selectedIndex === null) {
            this.selectedIndex = index;
        } else if (this.selectedIndex === index) {
            this.selectedIndex = null;
        } else {
            this.moveItem(this.selectedIndex, index);
            this.selectedIndex = null;
        }
        this.renderCards();
    }

    onDragStart(event, index) {
        if (this.locked) {
            event.preventDefault();
            return;
        }
        this.draggedIndex = index;
        event.currentTarget.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(index));
    }

    onDrop(event, targetIndex) {
        event.preventDefault();
        const sourceIndex = this.draggedIndex === null
            ? Number(event.dataTransfer.getData('text/plain'))
            : this.draggedIndex;
        this.draggedIndex = null;
        if (Number.isInteger(sourceIndex) && sourceIndex !== targetIndex) {
            this.moveItem(sourceIndex, targetIndex);
            this.renderCards();
        }
    }

    moveItem(sourceIndex, targetIndex) {
        const [value] = this.currentOrder.splice(sourceIndex, 1);
        this.currentOrder.splice(targetIndex, 0, value);
    }

    shuffleArray(values) {
        for (let index = values.length - 1; index > 0; index--) {
            const other = Math.floor(Math.random() * (index + 1));
            [values[index], values[other]] = [values[other], values[index]];
        }
        if (JSON.stringify(values) === JSON.stringify(this.question && this.question.answer)) {
            [values[0], values[1]] = [values[1], values[0]];
        }
        return values;
    }

    checkOrder() {
        if (this.locked) return;
        this.currentAttempt++;
        const isCorrect = this.currentOrder.every((value, index) => value === this.question.answer[index]);
        const status = window.game.processAnswer(
            this.question,
            isCorrect,
            this.currentAttempt,
            () => this.render(this.question, this.container)
        );
        this.locked = status === 'success' || status === 'help';
    }
}

window.orderingGame = new OrderingGame();
