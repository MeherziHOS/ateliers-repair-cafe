// Vos tests : au moins 10, sur des cas limites (liste vide, égalités de tri, accents,
// atelier complet, bénévole indisponible, ateliers qui se suivent…).
// Lancez-les avec « npm test » (ils s'ajoutent aux tests de spécification).
//
// Exemple à adapter (retirez les « // » pour l'activer) :
//
// import { test } from 'node:test';
// import assert from 'node:assert/strict';
// import { trierAteliers } from '../src/ateliers.js';
//
// test('trier : une liste vide donne une liste vide', () => {
//     assert.deepEqual(trierAteliers([]), []);
// });

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    placesRestantes,
    normaliserTexte,
    filtrerAteliers,
    trierAteliers,
    rechercherAteliers,
    calculerStatistiques,
    validerInscription,
    affecterBenevoles,
} from '../src/ateliers.js';

const atelier = {
    id: 'AT-01',
    titre: 'Réparation vélo',
    categorie: 'velo',
    date: '2026-11-10',
    debut: '14:00',
    dureeMinutes: 60,
    lieu: 'Salle A',
    places: 3,
    inscrits: ['khaoula@test.fr'],
};

// Test 1 : liste d'ateliers vide.
test('1 - trierAteliers : tableau vide', () => {
    assert.deepEqual(trierAteliers([]), []);
});

// Test 2 : atelier complet.
test('2 - placesRestantes : atelier complet', () => {
    const complet = {
        ...atelier,
        inscrits: ['a@test.fr', 'b@test.fr', 'c@test.fr'],
    };

    assert.equal(placesRestantes(complet), 0);
});

// Test 3 : trop d'inscrits.
test('3 - placesRestantes : résultat jamais négatif', () => {
    const complet = {
        ...atelier,
        places: 1,
        inscrits: ['a@test.fr', 'b@test.fr'],
    };

    assert.equal(placesRestantes(complet), 0);
});

// Test 4 : accents et espaces.
test('4 - normaliserTexte : accents et espaces', () => {
    assert.equal(normaliserTexte('  RÉPARATION   VéLO  '), 'reparation velo');
});

// Test 5 : filtre sans critères.
test('5 - filtrerAteliers : aucun critère', () => {
    const liste = [atelier];
    const resultat = filtrerAteliers(liste);

    assert.deepEqual(resultat, liste);
    assert.notStrictEqual(resultat, liste);
});

// Test 6 : égalité complète dans le tri.
test("6 - trierAteliers : conserver l'ordre en cas d'égalité", () => {
    const premier = { ...atelier, id: 'AT-01' };
    const second = { ...atelier, id: 'AT-02' };

    const resultat = trierAteliers([premier, second]);

    assert.deepEqual(
        resultat.map((a) => a.id),
        ['AT-01', 'AT-02'],
    );
});

// Test 7 : recherche sans accents.
test('7 - rechercherAteliers : recherche sans accents', () => {
    const resultat = rechercherAteliers([atelier], 'VELO');

    assert.equal(resultat.length, 1);
});

// Test 8 : statistiques sans ateliers.
test('8 - calculerStatistiques : liste vide', () => {
    const resultat = calculerStatistiques([]);

    assert.equal(resultat.nombreAteliers, 0);
    assert.equal(resultat.tauxRemplissage, 0);
    assert.equal(resultat.categorieLaPlusDemandee, null);
});

// Test 9 : inscription sans autorisation parentale.
test('9 - validerInscription : mineur sans autorisation', () => {
    const erreurs = validerInscription(atelier, {
        nom: 'Lucas',
        email: 'lucas@test.fr',
        age: 15,
        autorisationParentale: false,
    });

    assert.ok(erreurs.length > 0);
});

// Test 10 : bénévole indisponible.
test('10 - affecterBenevoles : bénévole indisponible', () => {
    const benevole = {
        id: 'BEN-01',
        prenom: 'Marie',
        competences: ['velo'],
        disponibilites: [
            {
                date: '2026-11-10',
                debut: '16:00',
                fin: '18:00',
            },
        ],
    };

    const resultat = affecterBenevoles([atelier], [benevole]);

    assert.deepEqual(resultat.affectations, {});
    assert.deepEqual(resultat.nonPourvus, ['AT-01']);
});
