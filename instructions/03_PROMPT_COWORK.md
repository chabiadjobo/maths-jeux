# Prompt maître pour Claude Cowork — V0 « Amusons-nous avec les maths »

Tu travailles dans le dossier racine du projet `maths-jeux`.

Ta mission est de construire complètement la V0 décrite dans :

- `instructions/01_CAHIER_DES_CHARGES_V0.md`
- `instructions/02_SPECIFICATION_JSON.md`

Ces deux documents sont la source de vérité fonctionnelle et technique.

## 1. Principe de travail

Tu dois réaliser le projet de bout en bout avec le moins de dépendances possible.

Ne me demande pas de coder manuellement.

Ne remplace pas les choix imposés par une stack plus complexe.

Si un choix mineur n’est pas spécifié, prends l’option :

1. la plus simple ;
2. la plus robuste ;
3. la plus facile à maintenir ;
4. compatible GitHub Pages.

Si tu rencontres une contradiction entre les deux documents, arrête-toi et signale-la avant de continuer.

## 2. Règle Git impérative

### Un commit après chaque étape

Chaque étape ci-dessous doit obligatoirement se terminer par un commit Git distinct.

Tu ne dois pas réaliser plusieurs étapes puis faire un seul commit global.

Avant chaque étape :

```bash
git status
```

Après le travail de l’étape :

1. tester ce qui vient d’être ajouté ;
2. corriger les erreurs de cette étape ;
3. vérifier rapidement que les fonctionnalités antérieures fonctionnent encore ;
4. inspecter `git diff` ;
5. faire `git add` uniquement sur les fichiers concernés ;
6. faire le commit prévu ;
7. vérifier `git status`;
8. seulement ensuite commencer l’étape suivante.

Ne réécris pas l’historique pour masquer des corrections.

Si un bug d’une étape antérieure est découvert plus tard, crée un nouveau commit `fix:`.

## 3. Séquence de réalisation obligatoire

### Étape 0 — Initialisation Git

Objectif :

- vérifier si le dossier est déjà un dépôt Git ;
- l’initialiser si nécessaire ;
- créer un `.gitignore` minimal pertinent.

Commit :

```text
chore: initialize maths game project
```

### Étape 1 — Structure du projet

Créer la structure utile prévue par le cahier des charges.

Ne pas créer de fichiers factices inutiles.

Commit :

```text
chore: create project structure
```

### Étape 2 — Schéma et données de séance

Implémenter :

- `data/current.json` avec exactement la première séance ;
- exemple(s) utile(s) dans `data/examples/` ;
- validation de structure suffisamment claire.

Ne pas ajouter d’exercice.

Commit :

```text
feat: define lesson data schema
```

### Étape 3 — Moteur principal et navigation

Implémenter :

- chargement de la séance ;
- écran d’accueil ;
- démarrage ;
- navigation mission par mission ;
- état global de séance ;
- écran final minimal avant enrichissements.

Commit :

```text
feat: implement lesson engine and navigation
```

### Étape 4 — Jeu comparaison

Implémenter le moteur `comparison`.

Inclure :

- affichage ;
- boutons `<` et `>` ;
- validation ;
- intégration au moteur général ;
- clavier si pertinent.

Commit :

```text
feat: add comparison game
```

### Étape 5 — Jeu classement

Implémenter `ordering`.

Inclure :

- mode croissant ;
- mode décroissant ;
- glisser-déposer ;
- alternative sans drag-and-drop ;
- validation de l’ordre.

Commit :

```text
feat: add ordering game
```

### Étape 6 — Nombre précédent / suivant

Implémenter `neighbor` :

- `before` ;
- `after` ;
- saisie clavier ;
- validation.

Commit :

```text
feat: add neighbor game
```

### Étape 7 — Nombre entre deux

Implémenter `between`.

Commit :

```text
feat: add between game
```

### Étape 8 — Feedback pédagogique et tentatives

Implémenter exactement la règle :

- erreur 1 : `Essaie encore, ma princesse.`
- erreur 2 : indice sans révéler la réponse ;
- erreur 3 : `Ma princesse, appelle papa ou maman pour une explication.`
- bouton `Réessayer après l'explication` ;
- ne jamais révéler automatiquement la bonne réponse ;
- mémoriser qu’une aide adulte a été nécessaire.

Commit :

```text
feat: add pedagogical feedback flow
```

### Étape 9 — Score et progression

Implémenter :

- progression question ;
- progression mission ;
- résultat par mission ;
- total ;
- erreurs ;
- réussite sans aide ;
- réussite après aide ;
- étoiles selon le cahier des charges.

Commit :

```text
feat: add scoring and progress tracking
```

### Étape 10 — Sons et bouton mute

Implémenter :

- son de réussite ;
- son d’erreur ;
- contrôle visible ;
- préférence persistante ;
- aucun fond musical ;
- aucune ressource distante obligatoire.

Commit :

```text
feat: add sound feedback and mute control
```

### Étape 11 — Persistance locale

Implémenter `localStorage` de manière robuste.

Inclure :

- progression ;
- résultats ;
- aide adulte ;
- préférence sonore ;
- reprise propre après actualisation ;
- gestion des données absentes ou invalides.

Commit :

```text
feat: add local progress persistence
```

### Étape 12 — Résultat final et partage

Implémenter :

- bilan final complet ;
- `Rejouer mes erreurs` ;
- `Copier mon résultat` ;
- fallback clipboard.

Commit :

```text
feat: add results summary and copy feature
```

### Étape 13 — Validation du contenu réel

Vérifier que la première séance correspond exactement aux exercices définis dans les spécifications.

Ne rien inventer.

Corriger uniquement les éventuels écarts de contenu.

Commit :

```text
content: add first maths lesson
```

Si `current.json` était déjà exact et qu’aucune modification n’est nécessaire, créer dans cette étape un fichier de contrôle/documentation de contenu pertinent plutôt qu’un commit vide.

### Étape 14 — Responsive et accessibilité

Améliorer sans changer le périmètre :

- clavier ;
- focus visible ;
- boutons ;
- labels ;
- contrastes ;
- tailles ;
- petits écrans ;
- feedback non dépendant uniquement de la couleur.

Commit :

```text
fix: improve responsive and accessible interactions
```

### Étape 15 — Tests et corrections

Exécuter la liste de tests du cahier des charges.

Créer un document :

```text
docs/TESTS_V0.md
```

Il doit contenir :

- test ;
- résultat ;
- correction effectuée si nécessaire ;
- limites restantes éventuelles.

Corriger les problèmes trouvés.

Commit :

```text
test: validate v0 user flows
```

### Étape 16 — Documentation utilisateur et développeur

Créer/compléter :

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/AJOUTER_UNE_SEANCE.md`
- `docs/AJOUTER_UN_TYPE_DE_JEU.md`

La documentation `AJOUTER_UNE_SEANCE.md` doit être compréhensible par une personne qui veut seulement remplacer les exercices quotidiens sans coder.

Commit :

```text
docs: add project and lesson documentation
```

### Étape 17 — GitHub Pages

Préparer le projet pour GitHub Pages.

Vérifier :

- chemins relatifs ;
- chargement JSON ;
- absence de chemin local Windows ;
- documentation de publication.

Si l’environnement et les autorisations disponibles permettent effectivement de publier sur GitHub, le faire uniquement si cela ne nécessite pas d’inventer des identifiants ou de contourner une validation utilisateur.

Sinon préparer parfaitement le dépôt et documenter les dernières actions manuelles nécessaires.

Commit :

```text
chore: prepare github pages deployment
```

## 4. Corrections supplémentaires

Après une étape commitée, toute correction indépendante doit utiliser un commit clair, par exemple :

```text
fix: correct ascending ordering validation
```

ou :

```text
fix: restore lesson after page reload
```

Ne pas utiliser des messages vagues du type :

```text
update
changes
fix stuff
```

## 5. Style de code

Priorités :

- simplicité ;
- noms explicites ;
- fonctions courtes ;
- pas de surarchitecture ;
- pas de framework caché ;
- pas de dépendance inutile ;
- éviter les abstractions prématurées ;
- commentaires uniquement lorsqu’ils apportent une information utile.

Le code doit rester compréhensible par un développeur JavaScript généraliste.

## 6. Contraintes de contenu

Les exercices fournis sont des données contrôlées.

Interdictions :

- générer des questions supplémentaires ;
- changer les nombres ;
- mélanger l’ordre des exercices sauf si le fichier le demande explicitement ;
- inventer une correction ;
- modifier une consigne pédagogique sans nécessité d’interface.

Le but est de numériser la séance, pas de créer une nouvelle séance.

## 7. Contrôle avant fin

Avant de déclarer le projet terminé :

1. lire de nouveau les deux documents de spécification ;
2. comparer l’implémentation au cahier des charges ;
3. exécuter les tests ;
4. vérifier `git status` ;
5. vérifier l’historique des commits ;
6. vérifier qu’il existe bien un commit distinct pour chaque étape ;
7. vérifier que `current.json` contient exactement les exercices prévus ;
8. vérifier l’absence d’erreurs console critiques ;
9. vérifier qu’aucune dépendance non prévue n’a été introduite ;
10. vérifier que la documentation permet d’ajouter la prochaine séance sans toucher au moteur.

## 8. Compte rendu final attendu

À la fin, fournir un résumé concis avec :

- statut global : terminé / bloqué partiellement ;
- fonctions réalisées ;
- tests passés ;
- éventuelles limites ;
- URL GitHub Pages si disponible ;
- commande ou procédure pour lancer localement ;
- emplacement de `data/current.json` ;
- procédure minimale pour remplacer la séance ;
- liste des commits créés dans l’ordre.

Ne pas déclarer une fonctionnalité comme terminée si elle n’a pas été testée.
