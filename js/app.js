// Main application logic for maths games.

class MathsGame {
    constructor(storage, audio) {
        this.storage = storage;
        this.audio = audio;
        this.currentLesson = null;
        this.lessonState = null;
        this.currentMissionIndex = 0;
        this.currentQuestionIndex = 0;
        this.retryMode = false;
        this.retryQuestions = [];
        this.retryIndex = 0;
        this.retryResults = {};
    }

    async init() {
        try {
            const response = await fetch('data/current.json', { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status} while loading data/current.json`);
            const lesson = await response.json();
            this.validateLesson(lesson);
            this.currentLesson = lesson;
        } catch (error) {
            console.error('Unable to load or validate the lesson:', error);
            this.showError('La séance ne peut pas être chargée. Demande à papa ou maman de vérifier le fichier.');
            return;
        }

        try {
            const savedState = this.storage.loadProgress(this.currentLesson.id);
            this.lessonState = savedState ? this.normalizeState(savedState) : null;
            if (this.lessonState) this.saveProgress();
            this.render();
        } catch (error) {
            console.error('Unable to initialize the application:', error);
            this.showError('L’application ne peut pas démarrer. Demande à papa ou maman de réessayer.');
        }
    }

    validateLesson(lesson) {
        const fail = message => { throw new Error(`Invalid lesson: ${message}`); };
        if (!lesson || lesson.schemaVersion !== 1) fail('schemaVersion must be 1');
        if (typeof lesson.id !== 'string' || !lesson.id) fail('missing id');
        if (typeof lesson.date !== 'string' || !lesson.date) fail('missing date');
        if (typeof lesson.title !== 'string' || !lesson.title) fail('missing title');
        if (!Array.isArray(lesson.missions) || lesson.missions.length === 0) fail('missions must be a non-empty array');

        const missionIds = new Set();
        const questionIds = new Set();
        const supportedTypes = new Set(['comparison', 'ordering', 'neighbor', 'between']);
        for (const mission of lesson.missions) {
            if (!mission || typeof mission.id !== 'string' || !mission.id) fail('mission without id');
            if (missionIds.has(mission.id)) fail(`duplicate mission id ${mission.id}`);
            missionIds.add(mission.id);
            if (!supportedTypes.has(mission.type)) fail(`unsupported mission type ${mission.type}`);
            if (typeof mission.title !== 'string' || !mission.title) fail(`mission ${mission.id} has no title`);
            if (typeof mission.instruction !== 'string' || !mission.instruction) fail(`mission ${mission.id} has no instruction`);
            if (!Array.isArray(mission.questions) || mission.questions.length === 0) fail(`mission ${mission.id} has no questions`);
            for (const question of mission.questions) {
                if (!question || typeof question.id !== 'string' || !question.id) fail(`question without id in ${mission.id}`);
                if (questionIds.has(question.id)) fail(`duplicate question id ${question.id}`);
                questionIds.add(question.id);
                this.validateQuestion(mission.type, question, fail);
            }
        }
        return true;
    }

    validateQuestion(type, question, fail) {
        if (type === 'comparison') {
            if (typeof question.left !== 'number' || typeof question.right !== 'number') fail(`${question.id}: invalid comparison values`);
            if (!['<', '>'].includes(question.answer)) fail(`${question.id}: invalid comparison answer`);
        } else if (type === 'ordering') {
            if (!['ascending', 'descending'].includes(question.direction)) fail(`${question.id}: invalid ordering direction`);
            if (!Array.isArray(question.values) || !Array.isArray(question.answer) || question.values.length !== question.answer.length) fail(`${question.id}: invalid ordering arrays`);
            if (!question.values.every(Number.isFinite) || !question.answer.every(Number.isFinite)) fail(`${question.id}: ordering values must be numbers`);
            const values = [...question.values].sort((a, b) => a - b);
            const answer = [...question.answer].sort((a, b) => a - b);
            if (JSON.stringify(values) !== JSON.stringify(answer)) fail(`${question.id}: answer does not contain the same values`);
        } else if (type === 'neighbor') {
            if (!['before', 'after'].includes(question.direction)) fail(`${question.id}: invalid neighbor direction`);
            if (![question.value, question.answer].every(Number.isFinite)) fail(`${question.id}: neighbor values must be numbers`);
        } else if (type === 'between') {
            if (![question.left, question.right, question.answer].every(Number.isFinite)) fail(`${question.id}: between values must be numbers`);
        }
    }

    emptyQuestionResult() {
        return { wrongAttempts: 0, completed: false, adultHelpRequired: false };
    }

    createInitialState() {
        const results = {};
        for (const { question } of this.getAllQuestions()) results[question.id] = this.emptyQuestionResult();
        const firstMission = this.currentLesson.missions[0];
        return {
            lessonId: this.currentLesson.id,
            startedAt: new Date().toISOString(),
            completedAt: null,
            currentMissionId: firstMission.id,
            currentQuestionId: firstMission.questions[0].id,
            screen: 'mission',
            soundEnabled: !this.audio.isMuted,
            results
        };
    }

    normalizeState(savedState) {
        if (!savedState || savedState.lessonId !== this.currentLesson.id || typeof savedState.results !== 'object') return null;
        const state = {
            lessonId: this.currentLesson.id,
            startedAt: typeof savedState.startedAt === 'string' ? savedState.startedAt : new Date().toISOString(),
            completedAt: typeof savedState.completedAt === 'string' ? savedState.completedAt : null,
            currentMissionId: savedState.currentMissionId,
            currentQuestionId: savedState.currentQuestionId,
            screen: savedState.screen,
            soundEnabled: !this.audio.isMuted,
            results: {}
        };
        for (const { question } of this.getAllQuestions()) {
            const existing = savedState.results[question.id] || {};
            state.results[question.id] = {
                wrongAttempts: Number.isInteger(existing.wrongAttempts) && existing.wrongAttempts >= 0 ? existing.wrongAttempts : 0,
                completed: existing.completed === true,
                adultHelpRequired: existing.adultHelpRequired === true
            };
        }

        const allCompleted = this.getAllQuestions().every(({ question }) => state.results[question.id].completed);
        if (allCompleted && state.completedAt) {
            const lastMission = this.currentLesson.missions.at(-1);
            state.screen = savedState.screen === 'home' ? 'home' : 'results';
            state.currentMissionId = lastMission.id;
            state.currentQuestionId = lastMission.questions.at(-1).id;
            this.currentMissionIndex = this.currentLesson.missions.length - 1;
            this.currentQuestionIndex = lastMission.questions.length - 1;
            return state;
        }
        if (!allCompleted) state.completedAt = null;

        let position = this.findPosition(state.currentMissionId, state.currentQuestionId);
        const savedQuestionCompleted = position && state.results[state.currentQuestionId].completed;
        if (!position || (savedQuestionCompleted && state.screen !== 'missionComplete')) {
            position = this.getAllQuestions().find(({ question }) => !state.results[question.id].completed) || this.getAllQuestions()[0];
            state.screen = 'mission';
        }
        this.currentMissionIndex = position.missionIndex;
        this.currentQuestionIndex = position.questionIndex;
        state.currentMissionId = position.mission.id;
        state.currentQuestionId = position.question.id;
        if (state.screen === 'missionComplete' && this.currentQuestionIndex !== position.mission.questions.length - 1) state.screen = 'mission';
        if (!['mission', 'missionComplete'].includes(state.screen)) state.screen = 'mission';
        return state;
    }

    getAllQuestions() {
        const items = [];
        this.currentLesson.missions.forEach((mission, missionIndex) => {
            mission.questions.forEach((question, questionIndex) => items.push({ mission, question, missionIndex, questionIndex }));
        });
        return items;
    }

    findPosition(missionId, questionId) {
        const missionIndex = this.currentLesson.missions.findIndex(mission => mission.id === missionId);
        if (missionIndex < 0) return null;
        const mission = this.currentLesson.missions[missionIndex];
        const questionIndex = mission.questions.findIndex(question => question.id === questionId);
        if (questionIndex < 0) return null;
        return { mission, question: mission.questions[questionIndex], missionIndex, questionIndex };
    }

    showError(message) {
        document.getElementById('app').innerHTML = `<main class="error-screen"><h1>Oups !</h1><p>${message}</p></main>`;
    }

    render() {
        if (!this.lessonState) this.renderHome();
        else if (this.lessonState.screen === 'home') this.renderHome();
        else if (this.retryMode) this.renderRetryMission();
        else if (this.lessonState.completedAt || this.lessonState.screen === 'results') this.renderResults();
        else if (this.lessonState.screen === 'missionComplete') this.renderMissionComplete();
        else this.renderMission();
    }

    renderHome() {
        let actions;
        let status = '';
        if (!this.lessonState) {
            actions = '<button class="btn btn-primary" type="button" onclick="window.game.start()">Commencer</button>';
        } else if (this.lessonState.completedAt) {
            status = '<p class="session-status">Séance terminée</p>';
            actions = `
                <button class="btn btn-primary" type="button" onclick="window.game.viewResults()">Voir mon résultat</button>
                <button class="btn btn-secondary" type="button" onclick="window.game.restartLesson()">Recommencer la séance</button>`;
        } else {
            actions = '<button class="btn btn-primary" type="button" onclick="window.game.continueLesson()">Continuer ma séance</button>';
        }
        document.getElementById('app').innerHTML = `
            <main class="home-screen">
                <h1 class="app-title">Amusons-nous avec les maths</h1>
                <p class="greeting">Ma princesse, prête pour ta mission ?</p>
                <section class="lesson-info" aria-labelledby="lesson-title">
                    <h2 id="lesson-title">${this.currentLesson.title}</h2>
                    ${this.currentLesson.description ? `<p>${this.currentLesson.description}</p>` : ''}
                    <p class="mission-count">📋 ${this.currentLesson.missions.length} missions • ${this.getAllQuestions().length} questions</p>
                    ${status}
                </section>
                <div class="buttons">${actions}</div>
                ${this.soundButton('audio-control')}
            </main>`;
    }

    renderMission() {
        const mission = this.currentLesson.missions[this.currentMissionIndex];
        const question = mission.questions[this.currentQuestionIndex];
        document.getElementById('app').innerHTML = `
            <main class="mission-screen">
                <header class="mission-header"><span class="mission-number">Mission ${this.currentMissionIndex + 1} / ${this.currentLesson.missions.length}</span>${this.soundButton()}</header>
                <h1>${mission.title}</h1><p class="instruction">${mission.instruction}</p>
                <div id="gameContainer"></div>
                <div class="progress" aria-label="Progression dans la mission">
                    <div class="progress-bar"><div class="progress-fill" style="width: ${(this.currentQuestionIndex / mission.questions.length) * 100}%"></div></div>
                    <p class="progress-text">Question ${this.currentQuestionIndex + 1} / ${mission.questions.length}</p>
                </div>
            </main>`;
        this.renderGame(mission.type, question, document.getElementById('gameContainer'));
    }

    renderGame(type, question, container) {
        const engines = { comparison: window.comparisonGame, ordering: window.orderingGame, neighbor: window.neighborGame, between: window.betweenGame };
        const engine = engines[type];
        if (!engine || typeof engine.render !== 'function') throw new Error(`Missing game engine for type ${type}`);
        engine.render(question, container);
    }

    renderMissionComplete() {
        const mission = this.currentLesson.missions[this.currentMissionIndex];
        const completed = mission.questions.filter(question => this.lessonState.results[question.id].completed).length;
        const withHelp = mission.questions.filter(question => this.lessonState.results[question.id].adultHelpRequired).length;
        document.getElementById('app').innerHTML = `
            <main class="mission-screen mission-complete-screen">
                <header class="mission-header"><span class="mission-number">Mission ${this.currentMissionIndex + 1} / ${this.currentLesson.missions.length}</span>${this.soundButton()}</header>
                <h1>Mission terminée ! 🎉</h1><h2>${mission.title}</h2>
                <div class="results-summary"><p>Questions réussies : ${completed} / ${mission.questions.length}</p><p>Aide d’un adulte : ${withHelp}</p></div>
                <button class="btn btn-primary" type="button" onclick="window.game.continueAfterMission()">Continuer</button>
            </main>`;
    }

    renderResults() {
        const results = window.ScoringManager.calculateResults(this.currentLesson, this.lessonState);
        document.getElementById('app').innerHTML = `
            <main class="results-screen">
                <h1>Séance terminée ! 🎉</h1><h2>${this.currentLesson.title}</h2>
                <div class="final-score"><p class="score-text">${results.totalCorrect} / ${results.totalQuestions} questions réussies</p><div class="stars" aria-label="${results.stars} étoiles sur 5">${'⭐'.repeat(results.stars)}</div><p class="star-message">${results.starMessage}</p></div>
                <section class="results-by-mission" aria-labelledby="mission-results-title"><h3 id="mission-results-title">Résultats par mission :</h3>
                    ${results.missions.map(mission => `<div class="mission-result mission-${mission.status}"><span>${mission.title}</span><span class="result-score">${mission.correct}/${mission.total}</span></div>`).join('')}
                </section>
                <div class="results-summary"><p>✅ Réussies sans aide : ${results.correctWithoutHelp}</p><p>🆘 Réussies après aide : ${results.correctWithHelp}</p><p>❌ Erreurs totales : ${results.totalErrors}</p></div>
                <div class="buttons">
                    ${this.hasErrors() ? '<button class="btn btn-primary" type="button" onclick="window.game.retryErrors()">Rejouer mes erreurs</button>' : ''}
                    <button class="btn btn-secondary" type="button" onclick="window.game.copyResults()">Copier mon résultat</button>
                    <button class="btn btn-secondary" type="button" onclick="window.game.returnHome()">Retour à l'accueil</button>
                    <button class="btn btn-secondary" type="button" onclick="window.game.restartLesson()">Recommencer la séance</button>
                </div>
                ${this.soundButton('audio-control')}
            </main>`;
    }

    renderRetryMission() {
        const item = this.retryQuestions[this.retryIndex];
        document.getElementById('app').innerHTML = `
            <main class="mission-screen">
                <header class="mission-header"><span class="mission-number">Révision ${this.retryIndex + 1} / ${this.retryQuestions.length}</span>${this.soundButton()}</header>
                <h1>${item.mission.title}</h1><p class="instruction">Corrigeons ensemble !</p><div id="gameContainer"></div>
                <div class="progress"><div class="progress-bar"><div class="progress-fill" style="width: ${(this.retryIndex / this.retryQuestions.length) * 100}%"></div></div><p class="progress-text">Question ${this.retryIndex + 1} / ${this.retryQuestions.length}</p></div>
            </main>`;
        this.renderGame(item.mission.type, item.question, document.getElementById('gameContainer'));
    }

    soundButton(wrapperClass = '') {
        return `<div class="${wrapperClass}"><button class="sound-toggle" type="button" onclick="window.game.toggleSound()" aria-label="${this.audio.isMuted ? 'Activer' : 'Couper'} le son" title="${this.audio.isMuted ? 'Activer' : 'Couper'} le son"><span class="sound-icon" aria-hidden="true">${this.audio.isMuted ? '🔕' : '🔊'}</span></button></div>`;
    }

    start() {
        this.lessonState = this.createInitialState();
        this.currentMissionIndex = 0;
        this.currentQuestionIndex = 0;
        this.retryMode = false;
        this.saveProgress();
        this.render();
    }

    returnHome() {
        if (this.lessonState) {
            this.lessonState.screen = 'home';
            this.saveProgress();
        }
        this.renderHome();
    }

    continueLesson() {
        if (!this.lessonState || this.lessonState.completedAt) return;
        this.lessonState.screen = 'mission';
        this.saveProgress();
        this.render();
    }

    viewResults() {
        if (!this.lessonState || !this.lessonState.completedAt) return;
        this.lessonState.screen = 'results';
        this.saveProgress();
        this.renderResults();
    }

    restartLesson() {
        const confirmed = window.confirm('Recommencer la séance ? La progression et les résultats de cette séance seront remis à zéro.');
        if (!confirmed) return;

        this.storage.clearLesson(this.currentLesson.id);
        this.lessonState = this.createInitialState();
        this.currentMissionIndex = 0;
        this.currentQuestionIndex = 0;
        this.retryMode = false;
        this.retryQuestions = [];
        this.retryIndex = 0;
        this.retryResults = {};
        this.saveProgress();
        this.render();
    }

    processAnswer(question, isCorrect, attemptNumber, retryAfterHelp) {
        const feedback = document.getElementById('feedbackContainer');
        if (!feedback) throw new Error('Feedback container is missing');
        if (isCorrect) {
            this.recordCompletion(question.id);
            this.audio.playSuccess();
            feedback.innerHTML = '<div class="feedback feedback-success" role="status" aria-live="polite">✅ Bien joué ! 🎉</div>';
            this.saveProgress();
            window.setTimeout(() => this.nextQuestion(), 700);
            return 'success';
        }

        this.recordWrongAttempt(question.id);
        this.audio.playError();
        if (attemptNumber === 1) {
            feedback.innerHTML = '<div class="feedback feedback-error" role="status" aria-live="polite">❌ Essaie encore, ma princesse.</div>';
            this.saveProgress();
            return 'error';
        }
        if (attemptNumber === 2) {
            const hint = window.FeedbackManager.getHint(this.getCurrentMissionType(question.id), question);
            feedback.innerHTML = `<div class="feedback feedback-hint" role="status" aria-live="polite">💡 ${hint}</div>`;
            this.saveProgress();
            return 'hint';
        }

        this.recordAdultHelp(question.id);
        feedback.innerHTML = '<div class="feedback feedback-help" role="status" aria-live="assertive">🆘 Ma princesse, appelle papa ou maman pour une explication.</div>';
        const retryButton = document.createElement('button');
        retryButton.type = 'button';
        retryButton.className = 'btn btn-primary';
        retryButton.textContent = 'Réessayer après l\'explication';
        retryButton.addEventListener('click', retryAfterHelp, { once: true });
        feedback.appendChild(retryButton);
        retryButton.focus();
        this.saveProgress();
        return 'help';
    }

    recordWrongAttempt(questionId) {
        if (this.retryMode) this.retryResults[questionId].wrongAttempts++;
        else this.lessonState.results[questionId].wrongAttempts++;
    }

    recordAdultHelp(questionId) {
        if (this.retryMode) this.retryResults[questionId].adultHelpRequired = true;
        else this.lessonState.results[questionId].adultHelpRequired = true;
    }

    recordCompletion(questionId) {
        if (this.retryMode) this.retryResults[questionId].completed = true;
        else this.lessonState.results[questionId].completed = true;
    }

    getCurrentMissionType(questionId) {
        const item = this.getAllQuestions().find(candidate => candidate.question.id === questionId);
        return item ? item.mission.type : '';
    }

    nextQuestion() {
        if (this.retryMode) {
            this.retryIndex++;
            if (this.retryIndex >= this.retryQuestions.length) {
                this.retryMode = false;
                this.retryQuestions = [];
                this.retryIndex = 0;
            }
            this.render();
            return;
        }
        const mission = this.currentLesson.missions[this.currentMissionIndex];
        if (this.currentQuestionIndex < mission.questions.length - 1) {
            this.currentQuestionIndex++;
            this.updateCurrentPosition('mission');
        } else if (this.currentMissionIndex < this.currentLesson.missions.length - 1) {
            this.lessonState.screen = 'missionComplete';
        } else {
            this.lessonState.completedAt = new Date().toISOString();
            this.lessonState.screen = 'results';
        }
        this.saveProgress();
        this.render();
    }

    continueAfterMission() {
        if (this.currentMissionIndex >= this.currentLesson.missions.length - 1) return;
        this.currentMissionIndex++;
        this.currentQuestionIndex = 0;
        this.updateCurrentPosition('mission');
        this.saveProgress();
        this.render();
    }

    updateCurrentPosition(screen) {
        const mission = this.currentLesson.missions[this.currentMissionIndex];
        const question = mission.questions[this.currentQuestionIndex];
        this.lessonState.currentMissionId = mission.id;
        this.lessonState.currentQuestionId = question.id;
        this.lessonState.screen = screen;
    }

    saveProgress() {
        if (!this.lessonState) return;
        this.lessonState.soundEnabled = !this.audio.isMuted;
        this.storage.saveProgress(this.currentLesson.id, this.lessonState);
    }

    toggleSound() {
        this.audio.toggle();
        this.storage.saveSoundPreference(this.audio.isMuted);
        if (this.lessonState) this.saveProgress();
        document.querySelectorAll('.sound-icon').forEach(icon => {
            icon.textContent = this.audio.isMuted ? '🔕' : '🔊';
        });
        document.querySelectorAll('.sound-toggle').forEach(button => {
            const action = this.audio.isMuted ? 'Activer' : 'Couper';
            button.setAttribute('aria-label', `${action} le son`);
            button.title = `${action} le son`;
        });
    }

    hasErrors() {
        return this.getAllQuestions().some(({ question }) => this.lessonState.results[question.id].wrongAttempts > 0);
    }

    retryErrors() {
        this.retryQuestions = this.getAllQuestions().filter(({ question }) => this.lessonState.results[question.id].wrongAttempts > 0).map(({ mission, question }) => ({ mission, question }));
        if (this.retryQuestions.length === 0) return;
        this.retryResults = {};
        for (const { question } of this.retryQuestions) this.retryResults[question.id] = this.emptyQuestionResult();
        this.retryIndex = 0;
        this.retryMode = true;
        this.render();
    }

    copyResults() {
        const results = window.ScoringManager.calculateResults(this.currentLesson, this.lessonState);
        const date = new Date(this.lessonState.startedAt).toLocaleDateString('fr-FR');
        const missionLines = results.missions.map(mission => `${mission.title} : ${mission.correct}/${mission.total}`).join('\n');
        const text = `Amusons-nous avec les maths — ${date}\n${this.currentLesson.title}\n\n${missionLines}\n\nTotal : ${results.totalCorrect}/${results.totalQuestions}\nRéussies sans aide : ${results.correctWithoutHelp}\nRéussies après aide : ${results.correctWithHelp}\nErreurs : ${results.totalErrors}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => window.alert('Résultat copié !')).catch(error => {
                console.warn('Clipboard API unavailable, using fallback:', error);
                this.fallbackCopyResults(text);
            });
        } else this.fallbackCopyResults(text);
    }

    fallbackCopyResults(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            if (!document.execCommand('copy')) throw new Error('copy command returned false');
            window.alert('Résultat copié !');
        } catch (error) {
            console.error('Unable to copy the results:', error);
            window.prompt('Copie ce résultat :', text);
        } finally {
            textarea.remove();
        }
    }
}

window.MathsGame = MathsGame;

document.addEventListener('DOMContentLoaded', () => {
    // Single initialization point. The order is required by AudioManager.
    window.storage = new window.StorageManager();
    window.audio = new window.AudioManager(window.storage);
    window.game = new window.MathsGame(window.storage, window.audio);
    window.game.init();
});
