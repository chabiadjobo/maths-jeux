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
            between: 'Cherche le nombre qui vient juste après celui de gauche.',
            unit_conversion: 'Mets d’abord toutes les mesures dans la même unité. Rappel : 1 m = 10 dm = 100 cm = 1 000 mm.',
            estimate_measure: 'Rappel : 1 m = 100 cm, 1 dm = 10 cm et 1 cm = 10 mm.'
        };

        return hints[questionType] || 'Réfléchis bien.';
    }

}

window.FeedbackManager = FeedbackManager;
