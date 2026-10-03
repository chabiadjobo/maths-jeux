# Tests V0

Date d’exécution : 3 octobre 2026.

## Tests automatisés

Commande exécutée :

```powershell
node tests\core.test.js
```

Résultat : **10/10 réussis**.

Couverture :

- 6 missions, 24 questions et distribution `10 + 1 + 1 + 4 + 4 + 4` ;
- contrat commun `render(question, container)` des quatre moteurs ;
- plusieurs déplacements successifs dans le moteur de classement ;
- validation du JSON et rejet d’une réponse invalide ;
- restauration exacte de `currentMissionId` et `currentQuestionId` ;
- fallback vers la première question non terminée après changement de séance ;
- conservation des erreurs historiques en mode révision ;
- score, aide adulte, erreurs et étoiles ;
- tolérance à un stockage corrompu et préférence mute ;
- point d’initialisation unique dans l’ordre stockage, audio, jeu.

La syntaxe de tous les fichiers JavaScript a également été vérifiée avec `node --check`.

## Tests navigateur réellement exécutés

Serveur : `python -m http.server 8000`.

Navigateur disponible : navigateur intégré Codex. Chrome et Edge n’étaient pas exposés dans l’environnement.

| Test | Résultat constaté |
|---|---|
| Accueil initial | Titre, adresse, séance, 6 missions, 24 questions et bouton Commencer affichés |
| Commencer | Mission 1, question 1 affichée |
| Comparaison correcte | Validation et passage à la question suivante |
| Erreur 1 | `Essaie encore, ma princesse.` |
| Erreur 2 | Indice générique affiché sans réponse |
| Erreur 3 | Appel à l’adulte et bouton de reprise |
| Reprise après aide | Interaction réinitialisée, puis réussite possible |
| 10 comparaisons | 10/10 et fin de mission |
| F5 au milieu de la séance | Reprise à `m1q2`, résultats `m1q1` conservés |
| Mute et F5 | Icône et préférence mute restaurées |
| Classement croissant | Ordre exact validé |
| Glisser-déposer successif | Deux déplacements effectués avec reconstruction du DOM entre les deux |
| Alternative par clic | Plusieurs sélections/déplacements successifs, ordre exact validé |
| Classement décroissant | Ordre exact validé |
| Nombre avant | 4/4, dont une validation par Entrée |
| Nombre après | 4/4 |
| Nombre entre deux | 4/4 |
| Passage entre missions | Écran de fin puis Continuer validés sur les 6 missions |
| Progression | Mission et numéro de question affichés et mis à jour |
| Son | Chemins succès/erreur exécutés sans erreur console |
| Bilan final | 24/24, détail des 6 missions |
| Score et étoiles | 23 sans aide, 1 après aide, 3 erreurs, 5 étoiles |
| Rejouer les erreurs | Séquence d’une question créée puis terminée |
| Historique après révision | Total resté à 3 erreurs |
| Copier le résultat | Texte complet copié, total 24/24 |
| Fermeture/réouverture | Nouvel onglet sur la même origine : bilan restauré |
| Console | Aucune entrée de niveau erreur après le parcours complet |

## Vérifications statiques

- `data/current.json` est un JSON valide ;
- les chemins sont relatifs et compatibles avec un hébergement statique ;
- aucune dépendance externe ni question générée ;
- aucune branche de feedback n’affiche automatiquement la réponse.

## Recette manuelle restant à faire

- refaire le parcours sur **Chrome** ;
- refaire le parcours sur **Edge** ;
- confirmer à l’oreille les deux sons sur la machine cible ;
- vérifier le rendu sur un petit écran réel et avec navigation clavier complète ;
- après autorisation de déploiement, vérifier l’URL GitHub Pages.

Ces points ne sont pas déclarés validés.
