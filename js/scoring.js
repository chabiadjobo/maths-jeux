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

    static getScoreText(current, total) {
        const percentage = (current / total) * 100;
        if (percentage === 100) return 'Parfait !';
        if (percentage >= 80) return 'Excellent !';
        if (percentage >= 60) return 'Bien !';
        if (percentage >= 40) return 'Continue !';
        return 'Essaie encore !';
    }
}

// Make globally available
window.ScoringManager = ScoringManager;
