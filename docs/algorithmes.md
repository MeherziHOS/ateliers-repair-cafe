# Documentation des algorithmes — Repair Café des Lilas

## 1. Présentation

Le projet utilise plusieurs algorithmes JavaScript pour gérer les ateliers, les inscriptions et les bénévoles.

Les fonctions sont développées dans `src/ateliers.js`.

Elles respectent le principe des fonctions pures : elles ne modifient pas les données reçues et produisent un résultat à partir de leurs paramètres.

## 2. Filtrage des ateliers

**Fonction :** `filtrerAteliers`

Cette fonction sélectionne les ateliers selon plusieurs critères facultatifs :

- La catégorie.
- La date de début et la date de fin.
- Le nombre minimal de places restantes.

Les critères sont cumulés avec une logique ET : un atelier doit respecter toutes les conditions renseignées.

La méthode `.filter` permet de créer un nouveau tableau sans modifier le tableau d'origine.

## 3. Tri des ateliers

**Fonction :** `trierAteliers`

Les ateliers sont classés selon trois priorités :

1. Date croissante.
2. Heure de début croissante.
3. Places restantes décroissantes, si la date et l'heure sont identiques.

La méthode `.sort` est appliquée à une copie du tableau.

En cas d'égalité complète, l'ordre initial est conservé grâce au tri stable de JavaScript.

## 4. Regroupement par mois

**Fonction :** `regrouperParMois`

Cette fonction utilise `.reduce` pour regrouper les ateliers selon leur année et leur mois.

La méthode `.slice(0, 7)` extrait la partie `AAAA-MM` de chaque date.

L'accumulateur contient progressivement les groupes d'ateliers.

Les clés des mois sont ensuite triées chronologiquement avec `Object.entries`, `.sort` et `Object.fromEntries`.

## 5. Calcul des statistiques

**Fonction :** `calculerStatistiques`

Le programme calcule :

- Le nombre total d'ateliers.
- Le nombre total de places.
- Le nombre d'inscrits.
- Le taux de remplissage global.
- La moyenne d'inscrits par atelier.
- Les statistiques par catégorie.
- La catégorie la plus demandée.

Le taux de remplissage est calculé ainsi :

`(nombre d'inscrits / nombre de places) × 100`

Les divisions par zéro sont évitées lorsque le nombre de places est nul.

## 6. Affectation des bénévoles — Algorithme glouton

**Fonction :** `affecterBenevoles`

### Objectif

Affecter les bénévoles aux ateliers en tenant compte de leurs compétences, de leurs disponibilités et des conflits d'horaires.

### Contraintes

Un bénévole doit :

- Posséder la compétence correspondant à la catégorie de l'atelier.
- Être disponible pendant toute la durée de l'atelier.
- Ne pas être affecté à deux ateliers qui se chevauchent.

### Étapes de l'algorithme

1. Convertir les horaires en minutes pour faciliter les comparaisons.
2. Rechercher les bénévoles compétents et disponibles pour chaque atelier.
3. Trier les ateliers en commençant par ceux qui possèdent le moins de candidats possibles.
4. En cas d'égalité, traiter les ateliers par date et heure croissantes.
5. Écarter les bénévoles déjà occupés sur un créneau incompatible.
6. Choisir le bénévole ayant le moins d'ateliers attribués.
7. En cas d'égalité de charge, choisir le premier identifiant.
8. Enregistrer l'affectation et mettre à jour la charge et les occupations.
9. Ajouter les ateliers sans bénévole disponible dans `nonPourvus`.

### Pourquoi un algorithme glouton ?

L'algorithme prend une décision à chaque étape en choisissant le meilleur candidat disponible selon les règles définies.

Il ne revient pas sur les affectations précédentes.

Cette stratégie est relativement simple à mettre en œuvre et respecte les contraintes métier du défi.

### Limite

L'algorithme glouton ne garantit pas toujours le nombre maximal d'ateliers pourvus.

Une stratégie avec retour arrière pourrait parfois trouver une meilleure répartition, mais elle serait plus complexe.

## 7. Tests automatisés

Le projet utilise le module de test intégré à Node.js.

Les tests vérifient notamment :

- Les tableaux vides.
- Les ateliers complets.
- La normalisation des textes.
- Les égalités de tri.
- Les inscriptions invalides.
- Les bénévoles indisponibles.
- Les contraintes d'affectation.

Lors de la dernière vérification, 33 tests ont réussi sans échec.

## 8. Qualité du code

Les commandes utilisées sont :

- `npm test` : exécution des tests.
- `npm run lint` : analyse statique avec ESLint.
- `npm run format` : formatage avec Prettier.
- `npm run format:check` : vérification du formatage.

Ces contrôles contribuent à maintenir un code lisible et cohérent.
