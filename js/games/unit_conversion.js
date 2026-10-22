// Unit conversion game: convert combined length measures to one target unit.

class UnitConversionGame {
    render(question, container) {
        this.question = question;
        this.container = container;
        this.currentAttempt = 0;
        this.locked = false;
        const expression = question.terms.map(term => `${this.formatNumber(term.value)} ${term.unit}`).join(' + ');
        container.innerHTML = `
            <div class="game-unit-conversion">
                <div class="conversion-card">
                    <p class="conversion-expression">${expression}</p>
                    <p class="conversion-arrow">↓</p>
                    <div class="conversion-answer">
                        <label class="sr-only" for="answerInput">Ta réponse en ${question.targetUnit}</label>
                        <input type="text" id="answerInput" inputmode="decimal" autocomplete="off" placeholder="?" class="number-input">
                        <span class="unit-label">${question.targetUnit}</span>
                    </div>
                </div>
                <button class="btn btn-primary check-answer" type="button">Vérifier</button>
                <div id="feedbackContainer"></div>
            </div>`;
        const input = container.querySelector('#answerInput');
        container.querySelector('.check-answer').addEventListener('click', () => this.handleAnswer());
        input.addEventListener('keydown', event => { if (event.key === 'Enter') this.handleAnswer(); });
        input.focus();
    }

    formatNumber(number) { return number.toLocaleString('fr-FR'); }

    parseNumber(value) {
        const normalized = value.trim().replace(/[\s\u202f]/g, '').replace(',', '.');
        return /^-?\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
    }

    handleAnswer() {
        if (this.locked) return;
        const value = this.parseNumber(this.container.querySelector('#answerInput').value);
        if (!Number.isFinite(value)) {
            this.container.querySelector('#feedbackContainer').innerHTML = '<div class="feedback feedback-error" role="status">Entre un nombre.</div>';
            return;
        }
        this.currentAttempt++;
        const status = window.game.processAnswer(
            this.question,
            Math.abs(value - this.question.answer) < 1e-9,
            this.currentAttempt,
            () => this.render(this.question, this.container)
        );
        if (status === 'success') {
            const explanation = this.question.terms.map(term => this.convertExplanation(term, this.question.targetUnit)).join(' + ');
            this.container.querySelector('#feedbackContainer').innerHTML = `
                <div class="feedback feedback-success" role="status" aria-live="polite">
                    ✅ Exact ! ${explanation} = ${this.formatNumber(this.question.answer)} ${this.question.targetUnit}
                </div>`;
        }
        this.locked = status === 'success' || status === 'help';
    }

    convertExplanation(term, targetUnit) {
        const factorMm = { m: 1000, dm: 100, cm: 10, mm: 1 };
        const converted = term.value * factorMm[term.unit] / factorMm[targetUnit];
        return `${this.formatNumber(converted)} ${targetUnit}`;
    }
}

window.unitConversionGame = new UnitConversionGame();
