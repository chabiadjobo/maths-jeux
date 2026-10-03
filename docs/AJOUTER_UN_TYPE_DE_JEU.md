# Ajouter un type de jeu

Cette opération nécessite du JavaScript. Pour une simple nouvelle séance, suivre plutôt `AJOUTER_UNE_SEANCE.md`.

## Contrat à respecter

Créer `js/games/nouveau-type.js` avec une instance globale et la méthode :

```javascript
class NouveauTypeGame {
    render(question, container) {
        // Afficher l’activité et brancher les interactions.
    }
}

window.nouveauTypeGame = new NouveauTypeGame();
```

Lors d’une validation :

```javascript
const status = window.game.processAnswer(
    this.question,
    isCorrect,
    this.currentAttempt,
    () => this.render(this.question, this.container)
);
```

Le moteur ne doit pas modifier directement `lessonState`, le stockage, le score ou l’audio.

## Points d’intégration

1. Ajouter le script avant `js/app.js` dans `index.html`.
2. Ajouter le type aux types acceptés dans `MathsGame.validateLesson()`.
3. Ajouter ses champs de validation dans `validateQuestion()`.
4. Ajouter l’instance dans la table `engines` de `renderGame()`.
5. Ajouter un indice générique dans `FeedbackManager.getHint()`.
6. Documenter la structure JSON.
7. Ajouter des tests automatisés et un parcours navigateur.

## Contraintes

- La réponse contrôlée vient du JSON.
- Le moteur expose `render(question, container)`, sans variante de contrat.
- La bonne réponse n’est jamais révélée après trois erreurs.
- L’interaction doit fonctionner au clavier et ne pas dépendre uniquement de la couleur.
- Aucun framework ni service distant n’est ajouté pour la V0.
