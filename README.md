# Amusons-nous avec les maths

Application web statique de mathématiques destinée à une enfant de 8 ans. La V0 propose 6 missions et exactement 24 questions, pilotées par `data/current.json`.

## Fonctionnalités

- comparaison de nombres ;
- classement croissant et décroissant, par glisser-déposer ou par clics ;
- nombre immédiatement avant ou après ;
- nombre situé entre deux bornes ;
- feedback progressif sur trois erreurs, sans révélation automatique de la réponse ;
- sauvegarde locale de la progression et du réglage sonore ;
- bilan, étoiles, copie du résultat et révision des questions ayant provoqué une erreur.

## Lancer localement

Prérequis : Python 3 et un navigateur moderne.

```powershell
cd D:\AI-Workspace\Windows\maths-jeux
python -m http.server 8000
```

Ouvrir ensuite <http://localhost:8000>. L’ouverture directe de `index.html` avec `file://` n’est pas prise en charge, car la séance est chargée avec `fetch`.

## Structure

- `index.html` : point d’entrée ;
- `css/style.css` : interface et responsive ;
- `js/app.js` : orchestration, navigation et état ;
- `js/games/` : quatre moteurs de jeu ;
- `js/storage.js` : persistance locale ;
- `js/audio.js` : sons Web Audio ;
- `js/scoring.js` : score et étoiles ;
- `data/current.json` : séance active ;
- `tests/core.test.js` : tests automatisés sans dépendance.

## Vérifier

```powershell
node tests\core.test.js
```

Les tests navigateur et leurs limites sont consignés dans [docs/TESTS_V0.md](docs/TESTS_V0.md).

## Modifier ou étendre

- [Architecture](docs/ARCHITECTURE.md)
- [Ajouter une séance](docs/AJOUTER_UNE_SEANCE.md)
- [Ajouter un type de jeu](docs/AJOUTER_UN_TYPE_DE_JEU.md)
- [Déployer sur GitHub Pages](docs/DEPLOYER_GITHUB_PAGES.md)

Le projet n’est pas encore déployé : une recette manuelle sur Chrome et Edge est attendue avant publication.
