# Déployer sur GitHub Pages

Le déploiement n’a pas encore été effectué. Il doit attendre la recette manuelle sur Chrome et Edge.

## Avant publication

1. Vérifier que `git status` est propre.
2. Lancer `node tests\core.test.js`.
3. Lancer `python -m http.server 8000` et exécuter la recette de `docs/TESTS_V0.md`.
4. Vérifier que `data/current.json` est la séance voulue.
5. Confirmer qu’aucun chemin local Windows ni secret n’a été ajouté.

## Publication

Après autorisation :

1. pousser la branche validée vers le dépôt GitHub ;
2. dans **Settings → Pages**, choisir le déploiement depuis une branche ;
3. sélectionner la branche principale et le dossier racine ;
4. attendre la publication ;
5. ouvrir l’URL Pages et refaire le chargement, une réponse, F5 et la console.

Tous les chemins du projet sont relatifs et compatibles avec un sous-chemin GitHub Pages. Aucun backend ni processus Node n’est requis en production.
