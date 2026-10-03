# Cahier des charges V0 — Amusons-nous avec les maths

## 1. Objet du projet

Créer une petite application web de mathématiques destinée à une enfant de 8 ans, utilisable à distance depuis un simple navigateur.

L’application doit transformer les exercices fournis par l’école ou le livre en activités interactives et ludiques, sans obliger l’adulte à modifier le code à chaque nouvelle séance.

**Nom de l’application :** `Amusons-nous avec les maths`

**Formule d’adresse utilisée dans l’interface :** `Ma princesse`

## 2. Contraintes imposées

### 2.1 Stack

Utiliser exclusivement une stack simple :

- HTML5 ;
- CSS3 ;
- JavaScript vanilla ES6+ ;
- JSON pour le contenu des séances ;
- `localStorage` pour la persistance locale ;
- Git pour le versionnement ;
- GitHub Pages pour le déploiement.

### 2.2 Interdictions pour la V0

Ne pas introduire :

- React, Vue, Angular, Svelte ou autre framework ;
- Node.js comme serveur d’exécution ;
- backend ;
- base de données ;
- authentification ;
- compte utilisateur ;
- API externe ;
- IA intégrée ;
- Docker ;
- CDN indispensable au fonctionnement ;
- bibliothèque lourde de composants ;
- collecte de données personnelles ;
- génération automatique d’exercices.

L’application doit pouvoir fonctionner comme un site statique GitHub Pages.

## 3. Principe fondamental

Le code et les exercices doivent être séparés.

Le code contient les moteurs de jeux.

Le fichier de séance contient les données de l’exercice.

Changer une séance ne doit pas nécessiter de modifier le JavaScript.

La V0 ne doit jamais inventer, compléter, reformuler ou générer des exercices supplémentaires. Elle présente uniquement les exercices explicitement présents dans le fichier de séance.

## 4. Public et principes d’interface

L’utilisatrice principale est une enfant de 8 ans.

L’interface doit donc être :

- simple ;
- claire ;
- lisible ;
- adaptée à un écran d’ordinateur ;
- utilisable à la souris et au clavier ;
- suffisamment ludique sans paraître destinée à un très jeune enfant ;
- sans publicité ;
- sans menu complexe ;
- sans animation permanente ;
- avec de gros boutons et de grands chiffres ;
- avec des contrastes suffisants ;
- responsive pour rester utilisable sur un écran plus petit.

Les animations éventuelles doivent être courtes et servir le feedback.

## 5. Écrans de la V0

### 5.1 Accueil

Afficher au minimum :

- `Amusons-nous avec les maths` ;
- `Ma princesse, prête pour ta mission ?` ;
- le titre de la séance ;
- éventuellement une courte description ;
- le nombre de missions ;
- un bouton `Commencer` ;
- un bouton son visible.

### 5.2 Écran de mission

Afficher :

- `Mission X / N` ;
- le titre de la mission ;
- la consigne ;
- l’activité ;
- la progression dans la mission ;
- le contrôle du son.

### 5.3 Feedback après réponse

Le feedback doit être immédiatement compréhensible.

Une bonne réponse :

- son positif si le son est activé ;
- message bref, par exemple `Bien joué !` ou `Exact.` ;
- validation de la question ;
- mise à jour de la progression ;
- passage à la question suivante.

Une mauvaise réponse :

- son d’erreur discret si le son est activé ;
- application de la règle des tentatives définie à la section 8.

### 5.4 Fin de mission

Afficher :

- mission terminée ;
- nombre de questions ;
- nombre de questions réussies ;
- nombre de questions ayant nécessité l’aide d’un adulte ;
- bouton `Continuer`.

### 5.5 Résultat final

Afficher :

- titre de la séance ;
- résultat global ;
- résultat par mission ;
- nombre de questions terminées ;
- nombre de questions ayant nécessité l’aide d’un adulte ;
- nombre total de tentatives erronées ;
- nombre d’étoiles ;
- bouton `Rejouer mes erreurs` ;
- bouton `Copier mon résultat`.

## 6. Moteurs de jeux V0

La V0 contient exactement quatre moteurs génériques.

### 6.1 `comparison`

But : choisir entre `<` et `>`.

Exemple :

```text
805 ? 580

[ < ] [ > ]
```

Le moteur reçoit les deux nombres et la bonne réponse depuis le JSON.

### 6.2 `ordering`

But : remettre plusieurs nombres dans l’ordre.

Deux modes :

- `ascending` : du plus petit au plus grand ;
- `descending` : du plus grand au plus petit.

Interaction principale :

- cartes réordonnables.

Une solution alternative au glisser-déposer doit être proposée, par exemple une sélection par clic successif, afin que le jeu reste utilisable si le drag-and-drop fonctionne mal.

### 6.3 `neighbor`

But : trouver le nombre immédiatement avant ou après.

Modes :

- `before` ;
- `after`.

Exemples :

```text
[ ? ] → 360
```

```text
49 → [ ? ]
```

La réponse est saisie au clavier.

### 6.4 `between`

But : trouver le nombre entier situé entre deux nombres consécutifs.

Exemple :

```text
199 < [ ? ] < 201
```

La réponse est saisie au clavier.

## 7. Contenu de la première séance

### Mission 1 — Comparaison

Questions :

1. `805 ? 580`
2. `558 ? 531`
3. `85 ? 638`
4. `850 ? 508`
5. `3 000 ? 1 000`
6. `185 ? 580`
7. `1 230 ? 1 213`
8. `980 ? 890`
9. `309 ? 903`
10. `7 350 ? 3 588`

Réponses :

1. `>`
2. `>`
3. `<`
4. `>`
5. `>`
6. `<`
7. `>`
8. `>`
9. `<`
10. `>`

### Mission 2 — Ordre croissant

Valeurs :

`605, 209, 1 000, 2 610, 984, 402`

Ordre attendu :

`209, 402, 605, 984, 1 000, 2 610`

### Mission 3 — Ordre décroissant

Valeurs :

`610, 3 650, 900, 381, 1 980, 875`

Ordre attendu :

`3 650, 1 980, 900, 875, 610, 381`

### Mission 4 — Immédiatement avant

1. avant `360` → `359`
2. avant `1 000` → `999`
3. avant `5 400` → `5 399`
4. avant `2 310` → `2 309`

### Mission 5 — Immédiatement après

1. après `49` → `50`
2. après `1 999` → `2 000`
3. après `2 019` → `2 020`
4. après `8 209` → `8 210`

### Mission 6 — Nombre entre deux nombres

1. `199 < ? < 201` → `200`
2. `1 009 < ? < 1 011` → `1 010`
3. `9 990 < ? < 9 992` → `9 991`
4. `7 018 < ? < 7 020` → `7 019`

## 8. Règles pédagogiques et tentatives

Pour chaque question :

### Bonne réponse

- valider la question ;
- jouer le son positif si activé ;
- afficher un message bref ;
- enregistrer la réussite et le nombre de tentatives ;
- passer à la suite.

### Première mauvaise réponse

Afficher :

`Essaie encore, ma princesse.`

Ne pas afficher la solution.

### Deuxième mauvaise réponse

Afficher un indice bref adapté au type de jeu.

Exemples :

- comparaison : `Compare d'abord le nombre de chiffres, puis les milliers, les centaines, les dizaines et les unités.`
- `neighbor` : `Le nombre juste avant est plus petit de 1. Le nombre juste après est plus grand de 1.`
- `between` : `Cherche le nombre qui vient juste après celui de gauche.`

Ne pas afficher la solution.

### Troisième mauvaise réponse

Ne pas afficher la correction.

Mettre la question dans un état `aide adulte nécessaire`.

Afficher exactement l’idée suivante, avec une formulation naturelle :

`Ma princesse, appelle papa ou maman pour une explication.`

Afficher un bouton :

`Réessayer après l'explication`

La question peut ensuite être retentée. Si elle est encore incorrecte, revenir à l’état d’aide adulte. Ne jamais révéler automatiquement la réponse dans la V0.

Enregistrer qu’une aide adulte a été nécessaire.

## 9. Score et suivi

La V0 doit rester simple.

Pour chaque question, stocker au minimum :

- identifiant de la question ;
- nombre de mauvaises tentatives ;
- réussite finale ;
- aide adulte nécessaire : oui/non.

Le score principal est :

`questions finalement réussies / nombre total de questions`

Le bilan doit également afficher séparément :

- questions réussies sans aide adulte ;
- questions réussies après aide adulte ;
- total des erreurs.

Ainsi, le score ne masque pas le besoin d’accompagnement.

### Étoiles

Calculer les étoiles sur le pourcentage de questions réussies sans aide adulte :

- 90–100 % : 5 étoiles ;
- 75–89 % : 4 étoiles ;
- 60–74 % : 3 étoiles ;
- 40–59 % : 2 étoiles ;
- moins de 40 % : 1 étoile.

## 10. Son

La V0 comporte :

- un son bref de réussite ;
- un son bref d’erreur ;
- aucun fond musical.

Un contrôle visible permet d’activer ou couper le son.

La préférence est enregistrée dans `localStorage`.

Ne pas dépendre d’une ressource distante. Le son peut être produit localement, par exemple avec Web Audio API, ou via des fichiers locaux légers.

Respecter les restrictions des navigateurs concernant l’audio : ne pas tenter de jouer un son avant une interaction utilisateur.

## 11. Persistance locale

Utiliser `localStorage`.

Stocker au minimum :

- préférence sonore ;
- identifiant de la dernière séance ;
- date de réalisation ;
- progression ;
- résultats par question ;
- résultats par mission ;
- erreurs ;
- besoin d’aide adulte.

Le système doit tolérer un `localStorage` vide ou corrompu sans faire planter l’application.

Ne pas stocker d’information sensible.

## 12. Rejouer les erreurs

Le bouton `Rejouer mes erreurs` crée une nouvelle séquence contenant uniquement les questions qui ont généré au moins une mauvaise réponse durant la séance.

Il ne génère aucune nouvelle question.

Les questions doivent conserver leur type de jeu d’origine.

## 13. Copier mon résultat

Le bouton copie dans le presse-papiers un résumé texte.

Exemple :

```text
Amusons-nous avec les maths — 03/10/2026
Les nombres de 0 à 10 000

Comparaison : 10/10
Ordre croissant : réussi
Ordre décroissant : réussi
Nombre précédent : 4/4
Nombre suivant : 4/4
Entre deux nombres : 4/4

Total : 28/28
Réussies sans aide : 25
Réussies après aide : 3
Erreurs : 7
```

Prévoir un fallback si l’API Clipboard n’est pas disponible.

## 14. Architecture attendue

Structure recommandée :

```text
maths-jeux/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── scoring.js
│   ├── audio.js
│   └── games/
│       ├── comparison.js
│       ├── ordering.js
│       ├── neighbor.js
│       └── between.js
├── data/
│   ├── current.json
│   └── examples/
├── assets/
│   ├── images/
│   └── sounds/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── AJOUTER_UNE_SEANCE.md
│   └── AJOUTER_UN_TYPE_DE_JEU.md
└── instructions/
    ├── 01_CAHIER_DES_CHARGES_V0.md
    ├── 02_SPECIFICATION_JSON.md
    └── 03_PROMPT_COWORK.md
```

Une organisation légèrement différente est acceptable uniquement si elle reste plus simple et si elle est documentée. Ne pas augmenter la complexité sans nécessité.

## 15. Navigation

Le flux nominal est :

```text
Accueil
→ Mission 1
→ Mission 2
→ Mission 3
→ Mission 4
→ Mission 5
→ Mission 6
→ Bilan
```

Éviter un routeur ou une navigation multi-page complexe.

Une SPA légère en JavaScript vanilla est acceptable.

## 16. Accessibilité et robustesse

Exigences minimales :

- contrôles utilisables au clavier ;
- focus visible ;
- champs avec labels accessibles ;
- boutons réellement implémentés comme des boutons ;
- taille de clic suffisante ;
- messages de feedback annoncés de manière raisonnable aux technologies d’assistance ;
- pas d’information portée uniquement par la couleur ;
- pas de dépendance au drag-and-drop pour `ordering`.

## 17. Déploiement GitHub Pages

Le projet doit pouvoir être servi comme site statique.

Vérifier notamment :

- chemins relatifs compatibles avec un sous-chemin GitHub Pages ;
- chargement de `data/current.json` depuis le site publié ;
- aucun chemin absolu dépendant du poste local ;
- aucune dépendance à `file://`.

Documenter les étapes de publication.

## 18. Tests obligatoires

Tester au minimum :

1. chargement de `current.json` ;
2. affichage de l’accueil ;
3. démarrage de la séance ;
4. bonne réponse `comparison` ;
5. mauvaise réponse `comparison` ;
6. deuxième erreur avec indice ;
7. troisième erreur avec demande d’aide adulte ;
8. reprise après explication ;
9. `ordering` croissant ;
10. `ordering` décroissant ;
11. alternative au drag-and-drop ;
12. `neighbor before` ;
13. `neighbor after` ;
14. `between` ;
15. score ;
16. étoiles ;
17. résultat par mission ;
18. `Rejouer mes erreurs` ;
19. bouton son ;
20. persistance du réglage son ;
21. persistance de progression ;
22. copie du résultat ;
23. actualisation de page ;
24. reprise après fermeture/réouverture ;
25. absence d’erreur JavaScript critique dans la console ;
26. affichage sur Chrome et Edge ;
27. compatibilité GitHub Pages.

## 19. Documentation obligatoire

Produire :

### `README.md`

Contient :

- but du projet ;
- stack ;
- structure ;
- lancement local ;
- déploiement ;
- liens vers la documentation.

### `docs/ARCHITECTURE.md`

Explique :

- flux de chargement ;
- rôle des modules ;
- moteur de mission ;
- stockage ;
- score.

### `docs/AJOUTER_UNE_SEANCE.md`

Doit permettre à une personne qui ne veut pas coder de :

1. copier un exemple de JSON ;
2. saisir les exercices ;
3. valider le JSON ;
4. remplacer ou modifier `data/current.json` ;
5. tester ;
6. commit ;
7. push ;
8. vérifier GitHub Pages.

### `docs/AJOUTER_UN_TYPE_DE_JEU.md`

Explique comment ajouter plus tard un moteur comme :

- addition ;
- multiplication ;
- monnaie ;
- fractions ;
- horloge ;
- géométrie.

## 20. Critères de fin de V0

La V0 est terminée uniquement si :

- les 6 missions de la première séance sont utilisables ;
- les 4 moteurs sont génériques ;
- les exercices sont entièrement pilotés par JSON ;
- aucun exercice n’est codé en dur dans les moteurs ;
- la règle des 3 erreurs est respectée ;
- aucune solution n’est automatiquement révélée après 3 erreurs ;
- le son fonctionne et peut être coupé ;
- les résultats sont sauvegardés localement ;
- les erreurs peuvent être rejouées ;
- le résultat peut être copié ;
- les tests obligatoires sont passés ;
- la documentation est présente ;
- GitHub Pages fonctionne ;
- l’historique Git contient un commit à chaque étape de réalisation.
