MISE À JOUR — Mesures de longueur

Copier le contenu de ce dossier à la racine de ~/Projects/maths-jeux en conservant l'arborescence et en remplaçant les fichiers existants.

Ajouts principaux :
- bouton « Passer pour l'instant » ;
- moteur unit_conversion ;
- moteur estimate_measure ;
- nouvelle séance « Les mesures de longueur » ;
- archivage de l'ancienne séance ;
- bilan avec questions passées.

Après copie :
  node --check js/app.js
  node tests/core.test.js
  python -m http.server 8000

Puis ouvrir http://localhost:8000
