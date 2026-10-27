# Kit du défi « JavaScript et algorithmique »

Projet de départ du moteur de planning des ateliers du Repair Café des Lilas. La consigne complète est dans la fiche « Défi – JavaScript et algorithmique ».

## Démarrer

1. Décompressez le kit dans `C:\dev` : vous obtenez `C:\dev\ateliers-repair-cafe`.
2. Ouvrez ce dossier dans VS Code, puis, dans le terminal :

    ```bash
    npm install
    npm test
    ```

    Les tests de spécification s'affichent en échec (« fonction à écrire ») : c'est normal, c'est votre point de départ.

3. Versionnez le projet tout de suite : `git init`, un premier commit, puis un dépôt GitHub **public** nommé `ateliers-repair-cafe`.

## Ce que contient le kit

| Fichier                                                            | Rôle                                                       | À modifier ? |
| ------------------------------------------------------------------ | ---------------------------------------------------------- | ------------ |
| `data/ateliers.json`, `data/benevoles.json`                        | le jeu de données (30 ateliers, 8 bénévoles)               | non          |
| `src/donnees.js`                                                   | charge les données                                         | non          |
| `src/ateliers.js`                                                  | les 9 fonctions à écrire : nom, paramètres et JSDoc donnés | **oui**      |
| `test/ateliers.spec.test.js`                                       | les tests de spécification                                 | non          |
| `test/mes-tests.test.js`                                           | vos tests (au moins 10)                                    | **oui**      |
| `package.json`, `eslint.config.js`, `.prettierrc`, `.editorconfig` | scripts et règles de qualité                               | non          |

À créer : `README.md` et `docs/algorithmes.md` (voir la consigne). Ce fichier `LISEZMOI.md` peut être supprimé.

## Scripts

| Commande               | Effet                                |
| ---------------------- | ------------------------------------ |
| `npm test`             | lance tous les tests (`node --test`) |
| `npm run lint`         | analyse le code avec ESLint          |
| `npm run format`       | met le code en forme avec Prettier   |
| `npm run format:check` | vérifie la mise en forme             |
