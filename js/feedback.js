// Feedback and pedagogical flow management

class FeedbackManager {
    static ATTEMPT_1_MESSAGE = 'Essaie encore, ma princesse.';
    static ATTEMPT_3_MESSAGE = 'Ma princesse, appelle papa ou maman pour une explication.';
    static BUTTON_TEXT = 'Réessayer après l\'explication';

    static getHint(questionType, question) {
        if (question.hint) return question.hint;

        const hints = {
            comparison: 'Compare d\'abord le nombre de chiffres, puis les milliers, les centaines, les dizaines et les unités.',
            ordering: 'Cherche à partir du plus ' + (question.direction === 'ascending' ? 'petit' : 'grand') + '.',
            neighbor: 'Le nombre juste ' + (question.direction === 'before' ? 'avant est plus petit' : 'après est plus grand') + ' de 1.',
            between: 'Cherche le nombre qui vient juste après celui de gauche.'
        };

        return hints[questionType] || 'Réfléchis bien.';
    }

    static recordWrongAttempt(questionId) {
        const state = window.game.lessonState.results[questionId];
        if (state) {
            state.wrongAttempts++;
        }
    }

    static recordCompletion(questionId, withAdultHelp = false) {
        const state = window.game.lessonState.results[questionId];
        if (state) {
            state.completed = true;
            state.adultHelpRequired = withAdultHelp;
        }
    }

    static isAnswerNeverRevealed() {
        // This ensures that even after 3 errors, we never automatically show the answer
        return true;
    }
}

window.FeedbackManager = FeedbackManager;
