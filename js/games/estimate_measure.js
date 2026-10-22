// Estimation and real-world measurement game.

class EstimateMeasureGame {
    render(question, container) {
        this.question = question;
        this.container = container;
        this.currentAttempt = 0;
        this.locked = false;
        if (question.mode === 'measure_and_convert') this.renderMeasureAndConvert();
        else this.renderEstimateThenMeasure();
    }

    renderEstimateThenMeasure() {
        const q = this.question;
        this.container.innerHTML = `
            <div class="game-estimate-measure">
                <div class="measure-card">
                    <h3>🔎 ${q.prompt}</h3>
                    ${q.allowLabel ? '<label for="objectLabel">Quel objet as-tu choisi ?</label><input id="objectLabel" type="text" class="text-input" autocomplete="off" placeholder="Ex. ma trousse">' : ''}
                    <label for="estimateInput">Ton estimation, sans mesurer :</label>
                    <div class="measure-input-row"><input id="estimateInput" type="text" inputmode="decimal" class="number-input" autocomplete="off"><span>${q.unit}</span></div>
                    <label for="actualInput">Puis mesure réellement :</label>
                    <div class="measure-input-row"><input id="actualInput" type="text" inputmode="decimal" class="number-input" autocomplete="off"><span>${q.unit}</span></div>
                </div>
                <button class="btn btn-primary check-answer" type="button">Comparer</button>
                <div id="feedbackContainer"></div>
            </div>`;
        this.container.querySelector('.check-answer').addEventListener('click', () => this.handleEstimate());
        this.container.querySelector('#estimateInput').focus();
    }

    renderMeasureAndConvert() {
        const q = this.question;
        this.container.innerHTML = `
            <div class="game-estimate-measure">
                <div class="measure-card">
                    <h3>📏 ${q.prompt}</h3>
                    <p>Écris d'abord la mesure en mètres et centimètres.</p>
                    <div class="multi-measure-row">
                        <input id="metersInput" type="text" inputmode="numeric" class="number-input" autocomplete="off" placeholder="m"><span>m</span>
                        <input id="centimetersInput" type="text" inputmode="decimal" class="number-input" autocomplete="off" placeholder="cm"><span>cm</span>
                    </div>
                    <p>Puis convertis la même longueur :</p>
                    <div class="measure-input-row"><input id="dmInput" type="text" inputmode="decimal" class="number-input" autocomplete="off"><span>dm</span></div>
                    <div class="measure-input-row"><input id="mmInput" type="text" inputmode="decimal" class="number-input" autocomplete="off"><span>mm</span></div>
                </div>
                <button class="btn btn-primary check-answer" type="button">Vérifier et comparer</button>
                <div id="feedbackContainer"></div>
            </div>`;
        this.container.querySelector('.check-answer').addEventListener('click', () => this.handleMeasureAndConvert());
        this.container.querySelector('#metersInput').focus();
    }

    parseNumber(value) {
        const normalized = value.trim().replace(/[\s\u202f]/g, '').replace(',', '.');
        return /^\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
    }

    handleEstimate() {
        if (this.locked) return;
        const q = this.question;
        const estimate = this.parseNumber(this.container.querySelector('#estimateInput').value);
        const actual = this.parseNumber(this.container.querySelector('#actualInput').value);
        const labelInput = this.container.querySelector('#objectLabel');
        const label = labelInput ? labelInput.value.trim() : q.prompt;
        if (!Number.isFinite(estimate) || !Number.isFinite(actual) || estimate < 0 || actual <= 0 || (labelInput && !label)) {
            this.container.querySelector('#feedbackContainer').innerHTML = '<div class="feedback feedback-error" role="status">Complète les champs avec des mesures valides.</div>';
            return;
        }
        const gap = Math.abs(actual - estimate);
        this.locked = true;
        window.game.completeOpenQuestion(q.id, `✅ ${label} : estimation ${this.formatNumber(estimate)} ${q.unit}, mesure ${this.formatNumber(actual)} ${q.unit}. Écart : ${this.formatNumber(gap)} ${q.unit}.`);
    }

    handleMeasureAndConvert() {
        if (this.locked) return;
        const q = this.question;
        const meters = this.parseNumber(this.container.querySelector('#metersInput').value);
        const centimeters = this.parseNumber(this.container.querySelector('#centimetersInput').value);
        const dm = this.parseNumber(this.container.querySelector('#dmInput').value);
        const mm = this.parseNumber(this.container.querySelector('#mmInput').value);
        if (![meters, centimeters, dm, mm].every(Number.isFinite) || centimeters >= 100) {
            this.container.querySelector('#feedbackContainer').innerHTML = '<div class="feedback feedback-error" role="status">Entre une mesure valide. Les centimètres doivent être inférieurs à 100.</div>';
            return;
        }
        const totalCm = meters * 100 + centimeters;
        if (totalCm <= 0) {
            this.container.querySelector('#feedbackContainer').innerHTML = '<div class="feedback feedback-error" role="status">La longueur doit être supérieure à 0.</div>';
            return;
        }
        const expectedDm = totalCm / 10;
        const expectedMm = totalCm * 10;
        this.currentAttempt++;
        const isCorrect = Math.abs(dm - expectedDm) < 1e-9 && Math.abs(mm - expectedMm) < 1e-9;
        const status = window.game.processAnswer(q, isCorrect, this.currentAttempt, () => this.render(q, this.container));
        if (status === 'success') {
            const ref = q.referenceValueCm;
            const comparison = totalCm > ref ? 'Ta table est plus longue que celle de Félix.' : totalCm < ref ? 'La table de Félix est plus longue que la tienne.' : 'Les deux tables ont la même longueur.';
            this.container.querySelector('#feedbackContainer').innerHTML = `<div class="feedback feedback-success" role="status">✅ ${this.formatNumber(totalCm)} cm = ${this.formatNumber(expectedDm)} dm = ${this.formatNumber(expectedMm)} mm. ${comparison}</div>`;
        }
        this.locked = status === 'success' || status === 'help';
    }

    formatNumber(number) { return number.toLocaleString('fr-FR', { maximumFractionDigits: 2 }); }
}

window.estimateMeasureGame = new EstimateMeasureGame();
