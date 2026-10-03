# Architecture V0

## Principes

L’application est une SPA légère en HTML, CSS et JavaScript vanilla. Les moteurs ne contiennent aucune question : toutes les données viennent de `data/current.json`.

Une seule initialisation existe, à la fin de `js/app.js`, dans cet ordre :

1. `window.storage = new StorageManager()` ;
2. `window.audio = new AudioManager(window.storage)` ;
3. `window.game = new MathsGame(window.storage, window.audio)` ;
4. `window.game.init()`.

L’instance est volontairement publiée sur `window.game`, car les moteurs l’utilisent pour transmettre les réponses.

## Chargement

`MathsGame.init()` charge `data/current.json`, valide la séance, restaure l’état local puis choisit l’écran :

- aucun état : accueil ;
- séance en cours : mission et question sauvegardées ;
- fin de mission : résumé de mission ;
- séance terminée : bilan.

Les erreurs de chargement/validation et les erreurs d’initialisation sont distinguées dans la console afin qu’une erreur de rendu ne soit pas présentée comme une erreur JSON.

## Contrat des moteurs

Les quatre moteurs exposent le même contrat :

```javascript
engine.render(question, container)
```

Chaque moteur :

1. rend uniquement son interaction ;
2. valide la saisie contre `question.answer` ;
3. appelle `window.game.processAnswer(question, isCorrect, attemptNumber, retryCallback)`.

`MathsGame` centralise le feedback, l’audio, la sauvegarde, l’aide adulte et la navigation. Les instances globales sont `comparisonGame`, `orderingGame`, `neighborGame` et `betweenGame`.

## État persistant

La clé `mathsGame_progress_<lessonId>` contient notamment :

```json
{
  "lessonId": "...",
  "startedAt": "...",
  "completedAt": null,
  "currentMissionId": "m1",
  "currentQuestionId": "m1q2",
  "screen": "mission",
  "soundEnabled": true,
  "results": {
    "m1q1": {
      "wrongAttempts": 3,
      "completed": true,
      "adultHelpRequired": true
    }
  }
}
```

À la restauration, les résultats sont normalisés contre la séance actuelle. Si une mission ou question sauvegardée n’existe plus, l’application reprend à la première question actuelle non terminée. Une sauvegarde corrompue est ignorée.

La préférence mute utilise la clé `mathsGame_soundMuted` et est chargée par `AudioManager` après la création du stockage.

## Feedback

Le nombre de tentatives de l’interaction courante reste local au moteur :

- erreur 1 : encouragement ;
- erreur 2 : indice du JSON ou indice générique ;
- erreur 3 : aide adulte et bouton de reprise ;
- bonne réponse : enregistrement puis navigation.

Aucune branche n’affiche automatiquement `question.answer`.

## Révision

`Rejouer mes erreurs` sélectionne les questions dont `wrongAttempts > 0`. Ses résultats temporaires sont stockés dans `retryResults`, séparément des résultats historiques. Une révision ne remet donc jamais les erreurs initiales à zéro.

## Classement

Le classement emploie une liste unique de cartes. Après chaque déplacement, les cartes et leurs gestionnaires sont reconstruits ensemble. L’alternative clavier/souris consiste à sélectionner une carte puis sa nouvelle position.

## Score

`ScoringManager` calcule :

- réussites finales ;
- réussites sans aide et après aide ;
- total des erreurs ;
- résultats par mission ;
- 1 à 5 étoiles selon le pourcentage réussi sans aide.
