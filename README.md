# Repair Café des Lilas — Planning des ateliers

## Présentation

Ce projet a été réalisé dans le cadre de ma formation Conceptrice Développeuse d'Applications (CDA) de l'AFPA.

Il s'agit d'un moteur métier développé en JavaScript pour gérer le planning des ateliers du Repair Café des Lilas.

Le programme permet de consulter les ateliers, de gérer les inscriptions et d'affecter les bénévoles selon leurs compétences et leurs disponibilités.

## Fonctionnalités

Le moteur métier comprend neuf fonctions :

1. `placesRestantes` : calcule les places disponibles.
2. `normaliserTexte` : normalise un texte pour faciliter les recherches.
3. `filtrerAteliers` : filtre les ateliers selon différents critères.
4. `trierAteliers` : trie les ateliers par date, heure et places restantes.
5. `rechercherAteliers` : recherche des ateliers par titre.
6. `calculerStatistiques` : calcule les statistiques du planning.
7. `regrouperParMois` : regroupe les ateliers par mois.
8. `validerInscription` : vérifie les demandes d'inscription.
9. `affecterBenevoles` : affecte les bénévoles aux ateliers.

Les fonctions sont conçues pour ne pas modifier les données reçues.

## Technologies utilisées

- JavaScript (modules ES)
- Node.js
- npm
- Git et GitHub
- ESLint
- Prettier
- Node.js Test Runner

## Installation

Cloner le dépôt GitHub :

```bash
git clone URL_DU_DEPOT
cd ateliers-repair-cafe
```

Installer les dépendances :

```bash
npm install
```

## Commandes disponibles

| Commande               | Description                   |
| ---------------------- | ----------------------------- |
| `npm test`             | Exécute les tests automatisés |
| `npm run lint`         | Vérifie la qualité du code    |
| `npm run format`       | Formate le code avec Prettier |
| `npm run format:check` | Vérifie le formatage          |

## Tests automatisés

Le projet contient :

- 23 tests de spécification fournis par l'AFPA.
- 10 tests personnels couvrant notamment les cas limites.

Résultat obtenu : **33 tests réussis, 0 fail**.

Les tests personnels vérifient notamment les listes vides, les ateliers complets, les accents, les égalités de tri, les inscriptions des mineurs et les bénévoles indisponibles.

## Organisation du projet

```text
ateliers-repair-cafe/
    data/
        ateliers.json
         benevoles.json
    src/
         ateliers.js
         donnees.js
    test/
         ateliers.spec.test.js
         mes-tests.test.js
    docs/
        algorithmes.md
         README.md
        package.json
```

## Documentation des algorithmes

Les explications des principaux algorithmes, notamment l'affectation des bénévoles, sont disponibles dans `docs/algorithmes.md`.

## Contexte pédagogique

Projet réalisé dans le cadre du jalon 4 — Révision ciblée : JavaScript et algorithmique, formation CDA AFPA, octobre 2026.
