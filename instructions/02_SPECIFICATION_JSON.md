# Spécification JSON V0 — Amusons-nous avec les maths

## 1. But

Ce document définit le format de données utilisé par la V0.

Le but principal est de pouvoir changer les exercices sans modifier le code JavaScript.

Le fichier actif est :

```text
data/current.json
```

Tous les moteurs doivent lire leurs données depuis ce fichier.

## 2. Règles générales

- JSON valide, encodé en UTF-8.
- Pas de commentaires dans le JSON.
- Les nombres sont stockés comme nombres JSON, pas comme chaînes, sauf raison explicite.
- L’affichage avec séparateurs de milliers est géré par l’application.
- Chaque séance, mission et question possède un identifiant stable et unique dans son niveau.
- Le code ne doit pas déduire la réponse si le fichier contient déjà un champ `answer`; il doit valider contre les données fournies.
- Aucun moteur ne doit ajouter de question.
- Les champs inconnus doivent être ignorés proprement si cela ne compromet pas le fonctionnement.
- Un fichier invalide doit produire un message utilisateur propre et une erreur console explicite, pas un écran blanc.

## 3. Structure racine

Structure V0 :

```json
{
  "schemaVersion": 1,
  "id": "2026-10-03-nombres-0-10000",
  "date": "2026-10-03",
  "title": "Les nombres de 0 à 10 000",
  "description": "Comparer, ranger et repérer les nombres.",
  "missions": []
}
```

### Champs

| Champ | Type | Obligatoire | Rôle |
|---|---|---:|---|
| `schemaVersion` | integer | oui | Version du schéma |
| `id` | string | oui | Identifiant unique de la séance |
| `date` | string `YYYY-MM-DD` | oui | Date de la séance |
| `title` | string | oui | Titre affiché |
| `description` | string | non | Sous-titre |
| `missions` | array | oui | Missions dans l’ordre voulu |

## 4. Champs communs d’une mission

```json
{
  "id": "m1",
  "type": "comparison",
  "title": "Compare les nombres",
  "instruction": "Choisis le bon symbole.",
  "questions": []
}
```

| Champ | Type | Obligatoire | Rôle |
|---|---|---:|---|
| `id` | string | oui | Identifiant mission |
| `type` | string | oui | Moteur à utiliser |
| `title` | string | oui | Titre |
| `instruction` | string | oui | Consigne |
| `questions` | array | selon type | Questions |

Types autorisés en V0 :

- `comparison`
- `ordering`
- `neighbor`
- `between`

## 5. Type `comparison`

### Structure

```json
{
  "id": "m1",
  "type": "comparison",
  "title": "Compare les nombres",
  "instruction": "Choisis le bon symbole.",
  "questions": [
    {
      "id": "m1q1",
      "left": 805,
      "right": 580,
      "answer": ">"
    }
  ]
}
```

### Validation

- `left` : nombre obligatoire ;
- `right` : nombre obligatoire ;
- `answer` : uniquement `<` ou `>` en V0.

L’égalité `=` n’est pas nécessaire pour la première séance et ne doit pas être ajoutée automatiquement.

## 6. Type `ordering`

Chaque exercice de classement est représenté comme une question afin que le moteur puisse plus tard en accepter plusieurs.

### Structure

```json
{
  "id": "m2",
  "type": "ordering",
  "title": "Du plus petit au plus grand",
  "instruction": "Range les nombres dans l'ordre croissant.",
  "questions": [
    {
      "id": "m2q1",
      "direction": "ascending",
      "values": [605, 209, 1000, 2610, 984, 402],
      "answer": [209, 402, 605, 984, 1000, 2610]
    }
  ]
}
```

Valeurs de `direction` :

- `ascending`
- `descending`

Même si la réponse peut être calculée par tri, le champ `answer` reste explicitement présent dans le fichier pour conserver une donnée pédagogique contrôlée.

Le moteur peut vérifier la cohérence `values` / `answer` et signaler en console une incohérence.

## 7. Type `neighbor`

### Avant

```json
{
  "id": "m4",
  "type": "neighbor",
  "title": "Le nombre juste avant",
  "instruction": "Trouve le nombre qui vient immédiatement avant.",
  "questions": [
    {
      "id": "m4q1",
      "direction": "before",
      "value": 360,
      "answer": 359
    }
  ]
}
```

### Après

```json
{
  "id": "m5",
  "type": "neighbor",
  "title": "Le nombre juste après",
  "instruction": "Trouve le nombre qui vient immédiatement après.",
  "questions": [
    {
      "id": "m5q1",
      "direction": "after",
      "value": 49,
      "answer": 50
    }
  ]
}
```

Valeurs autorisées :

- `before`
- `after`

## 8. Type `between`

```json
{
  "id": "m6",
  "type": "between",
  "title": "Le nombre caché",
  "instruction": "Trouve le nombre qui se trouve entre les deux nombres.",
  "questions": [
    {
      "id": "m6q1",
      "left": 199,
      "right": 201,
      "answer": 200
    }
  ]
}
```

## 9. Indices

Pour la V0, l’application peut fournir un indice par défaut selon le type de moteur.

Le JSON peut également définir un indice spécifique :

```json
{
  "id": "m1q3",
  "left": 85,
  "right": 638,
  "answer": "<",
  "hint": "Regarde d'abord le nombre de chiffres."
}
```

Règle :

- si `hint` existe, l’utiliser à la deuxième erreur ;
- sinon utiliser l’indice générique du moteur.

L’indice ne doit jamais contenir directement la bonne réponse.

## 10. Première séance complète

Le fichier `data/current.json` initial doit être équivalent à :

```json
{
  "schemaVersion": 1,
  "id": "2026-10-03-nombres-0-10000",
  "date": "2026-10-03",
  "title": "Les nombres de 0 à 10 000",
  "description": "Comparer, ranger et repérer les nombres.",
  "missions": [
    {
      "id": "m1",
      "type": "comparison",
      "title": "Compare les nombres",
      "instruction": "Choisis le bon symbole : plus petit ou plus grand.",
      "questions": [
        {"id": "m1q1", "left": 805, "right": 580, "answer": ">"},
        {"id": "m1q2", "left": 558, "right": 531, "answer": ">"},
        {"id": "m1q3", "left": 85, "right": 638, "answer": "<", "hint": "Regarde d'abord le nombre de chiffres."},
        {"id": "m1q4", "left": 850, "right": 508, "answer": ">"},
        {"id": "m1q5", "left": 3000, "right": 1000, "answer": ">"},
        {"id": "m1q6", "left": 185, "right": 580, "answer": "<"},
        {"id": "m1q7", "left": 1230, "right": 1213, "answer": ">"},
        {"id": "m1q8", "left": 980, "right": 890, "answer": ">"},
        {"id": "m1q9", "left": 309, "right": 903, "answer": "<"},
        {"id": "m1q10", "left": 7350, "right": 3588, "answer": ">"}
      ]
    },
    {
      "id": "m2",
      "type": "ordering",
      "title": "Du plus petit au plus grand",
      "instruction": "Range les nombres dans l'ordre croissant.",
      "questions": [
        {
          "id": "m2q1",
          "direction": "ascending",
          "values": [605, 209, 1000, 2610, 984, 402],
          "answer": [209, 402, 605, 984, 1000, 2610]
        }
      ]
    },
    {
      "id": "m3",
      "type": "ordering",
      "title": "Du plus grand au plus petit",
      "instruction": "Range les nombres dans l'ordre décroissant.",
      "questions": [
        {
          "id": "m3q1",
          "direction": "descending",
          "values": [610, 3650, 900, 381, 1980, 875],
          "answer": [3650, 1980, 900, 875, 610, 381]
        }
      ]
    },
    {
      "id": "m4",
      "type": "neighbor",
      "title": "Le nombre juste avant",
      "instruction": "Trouve le nombre qui vient immédiatement avant.",
      "questions": [
        {"id": "m4q1", "direction": "before", "value": 360, "answer": 359},
        {"id": "m4q2", "direction": "before", "value": 1000, "answer": 999},
        {"id": "m4q3", "direction": "before", "value": 5400, "answer": 5399},
        {"id": "m4q4", "direction": "before", "value": 2310, "answer": 2309}
      ]
    },
    {
      "id": "m5",
      "type": "neighbor",
      "title": "Le nombre juste après",
      "instruction": "Trouve le nombre qui vient immédiatement après.",
      "questions": [
        {"id": "m5q1", "direction": "after", "value": 49, "answer": 50},
        {"id": "m5q2", "direction": "after", "value": 1999, "answer": 2000},
        {"id": "m5q3", "direction": "after", "value": 2019, "answer": 2020},
        {"id": "m5q4", "direction": "after", "value": 8209, "answer": 8210}
      ]
    },
    {
      "id": "m6",
      "type": "between",
      "title": "Le nombre caché",
      "instruction": "Trouve le nombre qui se trouve entre les deux nombres.",
      "questions": [
        {"id": "m6q1", "left": 199, "right": 201, "answer": 200},
        {"id": "m6q2", "left": 1009, "right": 1011, "answer": 1010},
        {"id": "m6q3", "left": 9990, "right": 9992, "answer": 9991},
        {"id": "m6q4", "left": 7018, "right": 7020, "answer": 7019}
      ]
    }
  ]
}
```

## 11. Données de progression dans `localStorage`

Le format interne n’est pas un contrat public aussi strict que le JSON de séance, mais il doit être documenté.

Exemple recommandé :

```json
{
  "lessonId": "2026-10-03-nombres-0-10000",
  "startedAt": "2026-10-03T10:00:00.000Z",
  "completedAt": null,
  "currentMissionId": "m1",
  "currentQuestionId": "m1q3",
  "soundEnabled": true,
  "results": {
    "m1q1": {
      "wrongAttempts": 0,
      "completed": true,
      "adultHelpRequired": false
    },
    "m1q2": {
      "wrongAttempts": 3,
      "completed": true,
      "adultHelpRequired": true
    }
  }
}
```

Le stockage peut évoluer si nécessaire, à condition de rester documenté et robuste.

## 12. Validation du fichier

Au chargement :

1. vérifier la présence de `schemaVersion` ;
2. vérifier l’existence des champs racine obligatoires ;
3. vérifier que `missions` est un tableau non vide ;
4. vérifier le `type` de chaque mission ;
5. vérifier les champs indispensables au type ;
6. produire une erreur descriptive en console en cas d’incohérence ;
7. afficher un écran utilisateur simple du type :
   `La séance ne peut pas être chargée. Demande à papa ou maman de vérifier le fichier.`

Ne pas afficher de stack trace à l’enfant.

## 13. Compatibilité future

Le schéma doit pouvoir évoluer par ajout d’un `schemaVersion` supérieur.

Ne pas essayer d’anticiper tous les futurs types de jeux dans la V0.

Le code doit néanmoins dispatcher les moteurs par `type` de façon claire pour qu’un nouveau moteur puisse être ajouté sans réécrire l’application.
