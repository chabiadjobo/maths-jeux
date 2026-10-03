// Scoring and progress tracking

class ScoringManager {
    static calculateStars(correctWithoutHelpCount, totalQuestions) {
        const percentage = (correctWithoutHelpCount / totalQuestions) * 100;
        if (percentage >= 90) return 5;
        if (percentage >= 75) return 4;
        if (percentage >= 60) return 3;
        if (percentage >= 40) return 2;
        return 1;
    }

    static getStarMessage(stars) {
        const messages = {
            5: 'Parfait ! 🌟',
            4: 'Excellent ! ✨',
            3: 'Bien ! ⭐',
            2: 'Bravo ! 👏',
            1: 'Continue ! 💪'
        };
        return messages[stars] || 'Bravo !';
    }

    static calculateResults(lesson, state) {
        let totalCorrect = 0, totalErrors = 0, correctWithoutHelp = 0, correctWithHelp = 0;
        const missionResults = [];

        for (const mission of lesson.missions) {
            let missionCorrect = 0;
            let missionErrors = 0;

            for (const question of mission.questions) {
                const qState = state.results[question.id] || {};
                if (qState.completed) {
                    totalCorrect++;
                    if (!qState.adultHelpRequired) {
                        correctWithoutHelp++;
                    } else {
                        correctWithHelp++;
                    }
                    missionCorrect++;
                }
                missionErrors += qState.wrongAttempts || 0;
                totalErrors += qState.wrongAttempts || 0;
            }

            missionResults.push({
                id: mission.id,
                title: mission.title,
                correct: missionCorrect,
                total: mission.questions.length,
                status: missionCorrect === mission.questions.length ? 'success' : missionCorrect > 0 ? 'partial' : 'incomplete'
            });
        }

        const totalQuestions = lesson.missions.reduce((sum, m) => sum + m.questions.length, 0);
        const percentage = (correctWithoutHelp / totalQuestions) * 100;
        const stars = this.calculateStars(correctWithoutHelp, totalQuestions);

        return {
            totalCorrect,
            totalQuestions,
            totalErrors,
            correctWithoutHelp,
            correctWithHelp,
            percentage: Math.round(percentage),
            stars,
            starMessage: this.getStarMessage(stars),
            missions: missionResults
        };
    }

    static getProgressPercentage(lesson, state) {
        let completed = 0;
        let total = 0;

        for (const mission of lesson.missions) {
            for (const question of mission.questions) {
                const qState = state.results[question.id] || {};
                if (qState.completed) completed++;
                total++;
            }
        }

        return Math.round((completed / total) * 100);
    }
}

// Make globally available
window.ScoringManager = ScoringManager;
