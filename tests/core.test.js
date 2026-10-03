const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

function loadScripts(relativePaths, extra = {}) {
    const listeners = {};
    const context = {
        console,
        Date,
        JSON,
        Math,
        Number,
        Set,
        navigator: {},
        document: {
            addEventListener(name, callback) { listeners[name] = callback; },
            getElementById() { return null; },
            querySelectorAll() { return []; }
        },
        window: {
            setTimeout(callback) { callback(); },
            alert() {},
            prompt() {}
        },
        ...extra
    };
    context.window.window = context.window;
    context.window.document = context.document;
    context.window.navigator = context.navigator;
    vm.createContext(context);
    for (const relativePath of relativePaths) {
        vm.runInContext(read(relativePath), context, { filename: relativePath });
    }
    return { context, listeners };
}

const lesson = JSON.parse(read('data/current.json'));

function fakeStorage() {
    return {
        saved: null,
        saveProgress(lessonId, state) { this.saved = { lessonId, state: JSON.parse(JSON.stringify(state)) }; return true; },
        loadProgress() { return null; },
        saveSoundPreference() { return true; }
    };
}

function fakeAudio(isMuted = false) {
    return {
        isMuted,
        toggle() { this.isMuted = !this.isMuted; },
        playSuccess() {},
        playError() {}
    };
}

const tests = [];
const test = (name, callback) => tests.push({ name, callback });

test('the active lesson contains exactly 24 questions in the required distribution', () => {
    assert.equal(lesson.missions.length, 6);
    assert.deepEqual(lesson.missions.map(mission => mission.questions.length), [10, 1, 1, 4, 4, 4]);
    assert.equal(lesson.missions.flatMap(mission => mission.questions).length, 24);
});

test('all four engines expose the same render(question, container) contract', () => {
    const { context } = loadScripts([
        'js/games/comparison.js',
        'js/games/ordering.js',
        'js/games/neighbor.js',
        'js/games/between.js'
    ]);
    for (const name of ['comparisonGame', 'orderingGame', 'neighborGame', 'betweenGame']) {
        assert.equal(typeof context.window[name].render, 'function');
        assert.equal(context.window[name].render.length, 2);
    }
});

test('ordering supports several consecutive moves without losing state', () => {
    const { context } = loadScripts(['js/games/ordering.js']);
    const engine = context.window.orderingGame;
    engine.currentOrder = [605, 209, 1000, 2610, 984, 402];
    engine.moveItem(1, 0);
    engine.moveItem(5, 1);
    engine.moveItem(3, 2);
    assert.deepEqual(Array.from(engine.currentOrder), [209, 402, 1000, 605, 2610, 984]);
});

test('lesson validation accepts the controlled V0 content and rejects malformed data', () => {
    const { context } = loadScripts(['js/app.js']);
    const game = new context.window.MathsGame(fakeStorage(), fakeAudio());
    assert.equal(game.validateLesson(lesson), true);
    const malformed = JSON.parse(JSON.stringify(lesson));
    malformed.missions[0].questions[0].answer = '=';
    assert.throws(() => game.validateLesson(malformed), /invalid comparison answer/);
});

test('saved mission and question identifiers restore the exact unfinished position', () => {
    const { context } = loadScripts(['js/app.js']);
    const game = new context.window.MathsGame(fakeStorage(), fakeAudio());
    game.currentLesson = lesson;
    const state = game.createInitialState();
    state.currentMissionId = 'm4';
    state.currentQuestionId = 'm4q3';
    state.results.m1q1.completed = true;
    const normalized = game.normalizeState(state);
    assert.equal(normalized.currentMissionId, 'm4');
    assert.equal(normalized.currentQuestionId, 'm4q3');
    assert.equal(game.currentMissionIndex, 3);
    assert.equal(game.currentQuestionIndex, 2);
    assert.equal(normalized.results.m1q1.completed, true);
});

test('a removed saved question falls back to the first unfinished current question', () => {
    const { context } = loadScripts(['js/app.js']);
    const game = new context.window.MathsGame(fakeStorage(), fakeAudio());
    game.currentLesson = lesson;
    const state = game.createInitialState();
    state.currentMissionId = 'old-mission';
    state.currentQuestionId = 'old-question';
    state.results.m1q1.completed = true;
    const normalized = game.normalizeState(state);
    assert.equal(normalized.currentMissionId, 'm1');
    assert.equal(normalized.currentQuestionId, 'm1q2');
});

test('retry mode preserves the historical wrong-attempt count', () => {
    const { context } = loadScripts(['js/app.js']);
    const game = new context.window.MathsGame(fakeStorage(), fakeAudio());
    game.currentLesson = lesson;
    game.lessonState = game.createInitialState();
    game.lessonState.results.m1q1.wrongAttempts = 3;
    game.lessonState.results.m1q1.completed = true;
    game.render = () => {};
    game.retryErrors();
    assert.equal(game.lessonState.results.m1q1.wrongAttempts, 3);
    game.recordWrongAttempt('m1q1');
    assert.equal(game.lessonState.results.m1q1.wrongAttempts, 3);
    assert.equal(game.retryResults.m1q1.wrongAttempts, 1);
});

test('scoring counts 24 questions and applies the star thresholds', () => {
    const { context } = loadScripts(['js/scoring.js']);
    const results = {};
    for (const question of lesson.missions.flatMap(mission => mission.questions)) {
        results[question.id] = { completed: true, wrongAttempts: 0, adultHelpRequired: false };
    }
    results.m1q1.wrongAttempts = 2;
    results.m1q1.adultHelpRequired = true;
    const score = context.window.ScoringManager.calculateResults(lesson, { results });
    assert.equal(score.totalQuestions, 24);
    assert.equal(score.totalCorrect, 24);
    assert.equal(score.correctWithoutHelp, 23);
    assert.equal(score.correctWithHelp, 1);
    assert.equal(score.totalErrors, 2);
    assert.equal(score.stars, 5);
});

test('StorageManager tolerates corrupted progress and persists mute preference', () => {
    const values = new Map();
    const localStorage = {
        setItem(key, value) { values.set(key, String(value)); },
        getItem(key) { return values.has(key) ? values.get(key) : null; },
        removeItem(key) { values.delete(key); },
        key(index) { return Array.from(values.keys())[index] || null; },
        get length() { return values.size; }
    };
    const { context } = loadScripts(['js/storage.js'], { localStorage });
    context.window.localStorage = localStorage;
    const storage = new context.window.StorageManager();
    values.set('mathsGame_progress_lesson', '{broken');
    assert.equal(storage.loadProgress('lesson'), null);
    storage.saveSoundPreference(true);
    assert.equal(storage.loadSoundPreference(), true);
});

test('initialization has one entry point and creates storage, audio, then window.game', () => {
    const app = read('js/app.js');
    assert.equal((app.match(/DOMContentLoaded/g) || []).length, 1);
    const storageIndex = app.indexOf('window.storage =');
    const audioIndex = app.indexOf('window.audio =');
    const gameIndex = app.indexOf('window.game =');
    assert.ok(storageIndex >= 0 && storageIndex < audioIndex && audioIndex < gameIndex);
});

let failed = 0;
for (const { name, callback } of tests) {
    try {
        callback();
        console.log(`PASS ${name}`);
    } catch (error) {
        failed++;
        console.error(`FAIL ${name}`);
        console.error(error.stack || error);
    }
}

console.log(`\n${tests.length - failed}/${tests.length} tests passed`);
if (failed) process.exitCode = 1;
