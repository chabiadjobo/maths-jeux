# Ajouter ou remplacer une séance

La séance active est toujours `data/current.json`. Aucun fichier JavaScript ne doit être modifié pour changer les exercices.

## Procédure

1. Copier `data/examples/example-simple.json` dans un fichier de travail.
2. Donner un nouvel `id` stable à la séance et renseigner `date`, `title` et éventuellement `description`.
3. Décrire chaque mission avec un `id`, un type pris parmi `comparison`, `ordering`, `neighbor` et `between`, un titre, une consigne et ses questions.
4. Donner un identifiant unique à chaque question et fournir explicitement `answer`.
5. Ajouter éventuellement `hint`, sans y révéler la réponse.
6. Valider le JSON avec un éditeur ou :

```powershell
Get-Content -Raw data\current.json | ConvertFrom-Json | Out-Null
```

7. Remplacer `data/current.json`.
8. Lancer `python -m http.server 8000` puis ouvrir <http://localhost:8000>.
9. Vérifier toutes les missions, les réponses, les indices et le bilan.
10. Exécuter `node tests\core.test.js`.
11. Après validation, committer la séance et pousser uniquement lorsque le déploiement est autorisé.

## Règles importantes

- Ne jamais générer de question supplémentaire.
- Utiliser des nombres JSON, pas des chaînes.
- Pour `ordering`, `values` et `answer` doivent contenir exactement les mêmes valeurs.
- Un changement d’`id` crée naturellement une nouvelle progression.
- Si le contenu change en conservant le même `id`, la restauration ignore les anciennes questions supprimées et ajoute les nouvelles.

Le format complet et des exemples figurent dans `instructions/02_SPECIFICATION_JSON.md`.
