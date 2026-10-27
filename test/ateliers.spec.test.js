// Tests de spécification du défi (fournis avec le kit : ne les modifiez pas).
// Ils décrivent ce que chaque fonction doit faire. Au départ, ils échouent tous :
// votre travail consiste à les faire passer, puis à écrire vos propres tests
// dans « test/mes-tests.test.js ».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    affecterBenevoles,
    calculerStatistiques,
    filtrerAteliers,
    normaliserTexte,
    placesRestantes,
    rechercherAteliers,
    regrouperParMois,
    trierAteliers,
    validerInscription,
} from '../src/ateliers.js';
import { chargerAteliers, chargerBenevoles } from '../src/donnees.js';

/** Gèle un objet et tout ce qu'il contient : toute modification lève une erreur. */
function geler(valeur) {
    if (valeur && typeof valeur === 'object') {
        Object.values(valeur).forEach(geler);
        Object.freeze(valeur);
    }
    return valeur;
}

const ateliers = geler(chargerAteliers());
const benevoles = geler(chargerBenevoles());
const ids = (liste) => liste.map((a) => a.id);
const parId = (id) => ateliers.find((a) => a.id === id);
const enMinutes = (h) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));

test('placesRestantes : places moins inscrits, jamais négatif, 0 inscrit si le champ manque', () => {
    assert.equal(placesRestantes(parId('AT-02')), 2);
    assert.equal(placesRestantes(parId('AT-01')), 0);
    assert.equal(
        placesRestantes({ places: 3, inscrits: ['a@x.fr', 'b@x.fr', 'c@x.fr', 'd@x.fr'] }),
        0,
    );
    assert.equal(placesRestantes({ places: 5 }), 5);
});

test('normaliserTexte : minuscules, sans accents, espaces superflus retirés', () => {
    assert.equal(normaliserTexte('  Électronique   et  RÉPARATION '), 'electronique et reparation');
});

test('filtrerAteliers : par catégorie', () => {
    assert.deepEqual(ids(filtrerAteliers(ateliers, { categorie: 'velo' })), [
        'AT-01',
        'AT-08',
        'AT-13',
        'AT-20',
        'AT-25',
    ]);
});

test('filtrerAteliers : par période, dates incluses', () => {
    assert.deepEqual(ids(filtrerAteliers(ateliers, { du: '2026-12-05', au: '2026-12-12' })), [
        'AT-13',
        'AT-14',
        'AT-15',
        'AT-16',
        'AT-17',
        'AT-18',
    ]);
});

test('filtrerAteliers : places restantes minimales et critères cumulés', () => {
    assert.deepEqual(ids(filtrerAteliers(ateliers, { categorie: 'velo', placesMin: 1 })), [
        'AT-08',
        'AT-13',
        'AT-20',
    ]);
    assert.deepEqual(
        ids(filtrerAteliers(ateliers, { categorie: 'couture', du: '2027-01-01', placesMin: 3 })),
        ['AT-30'],
    );
});

test('filtrerAteliers : sans critère, une copie de toute la liste', () => {
    const resultat = filtrerAteliers(ateliers);
    assert.equal(resultat.length, 30);
    assert.notEqual(resultat, ateliers);
});

test('filtrerAteliers : erreurs explicites (TypeError, RangeError)', () => {
    assert.throws(() => filtrerAteliers('ateliers'), TypeError);
    assert.throws(
        () => filtrerAteliers(ateliers, { du: '2026-12-31', au: '2026-12-01' }),
        RangeError,
    );
    assert.throws(() => filtrerAteliers(ateliers, { placesMin: -1 }), RangeError);
});

test('trierAteliers : par date et heure de début croissantes', () => {
    const tries = trierAteliers([parId('AT-12'), parId('AT-03'), parId('AT-10'), parId('AT-01')]);
    assert.deepEqual(ids(tries), ['AT-01', 'AT-03', 'AT-10', 'AT-12']);
});

test('trierAteliers : à la même heure, places restantes décroissantes', () => {
    // AT-01 et AT-02 commencent le 07/11 à 10 h : AT-02 a 2 places restantes, AT-01 aucune.
    assert.deepEqual(ids(trierAteliers([parId('AT-01'), parId('AT-02')])), ['AT-02', 'AT-01']);
});

test('trierAteliers : renvoie une copie triée, la liste reçue reste intacte', () => {
    const avant = ids(ateliers);
    const tries = trierAteliers([...ateliers].reverse());
    assert.equal(tries.length, 30);
    assert.deepEqual(ids(ateliers), avant);
});

test('rechercherAteliers : insensible aux majuscules et aux accents', () => {
    assert.deepEqual(ids(rechercherAteliers(ateliers, 'ELECTRONIQUE')), [
        'AT-04',
        'AT-09',
        'AT-15',
        'AT-17',
        'AT-21',
        'AT-27',
    ]);
    assert.deepEqual(ids(rechercherAteliers(ateliers, 'fermeture éclair')), ['AT-07']);
});

test('rechercherAteliers : texte vide → toute la liste ; texte non chaîne → TypeError', () => {
    assert.equal(rechercherAteliers(ateliers, '   ').length, 30);
    assert.throws(() => rechercherAteliers(ateliers, 42), TypeError);
});

test('calculerStatistiques : totaux, taux de remplissage et moyenne', () => {
    const s = calculerStatistiques(ateliers);
    assert.equal(s.nombreAteliers, 30);
    assert.equal(s.places, 222);
    assert.equal(s.inscrits, 155);
    assert.equal(s.tauxRemplissage, 70);
    assert.equal(s.moyenneInscrits, 5.2);
});

test('calculerStatistiques : par catégorie et catégorie la plus demandée', () => {
    const s = calculerStatistiques(ateliers);
    assert.deepEqual(s.parCategorie.jouets, {
        ateliers: 4,
        places: 26,
        inscrits: 8,
        tauxRemplissage: 31,
    });
    assert.equal(Object.keys(s.parCategorie).length, 6);
    assert.equal(s.categorieLaPlusDemandee, 'couture');
});

test('calculerStatistiques : liste vide, sans division par zéro', () => {
    assert.deepEqual(calculerStatistiques([]), {
        nombreAteliers: 0,
        places: 0,
        inscrits: 0,
        tauxRemplissage: 0,
        moyenneInscrits: 0,
        parCategorie: {},
        categorieLaPlusDemandee: null,
    });
});

test("regrouperParMois : mois dans l'ordre chronologique, ateliers dans l'ordre d'origine", () => {
    const groupes = regrouperParMois([...ateliers].reverse());
    assert.deepEqual(Object.keys(groupes), ['2026-11', '2026-12', '2027-01']);
    assert.equal(groupes['2026-11'].length, 12);
    assert.deepEqual(ids(groupes['2027-01']).slice(0, 2), ['AT-30', 'AT-29']);
});

test('validerInscription : une demande valide ne renvoie aucune erreur', () => {
    const demande = { nom: 'Camille Durand', email: 'camille.durand@example.org', age: 32 };
    assert.deepEqual(validerInscription(parId('AT-02'), demande), []);
});

test('validerInscription : atelier complet', () => {
    const erreurs = validerInscription(parId('AT-01'), {
        nom: 'Camille',
        email: 'camille@example.org',
        age: 32,
    });
    assert.equal(erreurs.length, 1);
    assert.match(erreurs[0], /complet/i);
});

test('validerInscription : adresse déjà inscrite, sans tenir compte des majuscules', () => {
    const deja = parId('AT-02').inscrits[0].toUpperCase();
    const erreurs = validerInscription(parId('AT-02'), { nom: 'Camille', email: deja, age: 32 });
    assert.equal(erreurs.length, 1);
    assert.match(erreurs[0], /déjà inscrit/i);
});

test('validerInscription : champs manquants ou invalides signalés, sans exception', () => {
    assert.equal(validerInscription(parId('AT-02'), {}).length, 3);
    const erreurs = validerInscription(parId('AT-02'), {
        nom: ' ',
        email: 'camille.example.org',
        age: 32,
    });
    assert.equal(erreurs.length, 2);
    assert.ok(erreurs.some((e) => /nom/i.test(e)));
    assert.ok(erreurs.some((e) => /adresse/i.test(e)));
    assert.throws(() => validerInscription(parId('AT-02'), null), TypeError);
});

test("validerInscription : une personne mineure a besoin de l'autorisation de ses parents", () => {
    const demande = { nom: 'Lou Martin', email: 'lou.martin@example.org', age: 15 };
    const erreurs = validerInscription(parId('AT-02'), demande);
    assert.equal(erreurs.length, 1);
    assert.match(erreurs[0], /autorisation/i);
    assert.deepEqual(
        validerInscription(parId('AT-02'), { ...demande, autorisationParentale: true }),
        [],
    );
});

test('affecterBenevoles : compétence, disponibilité, aucun chevauchement', () => {
    const { affectations } = affecterBenevoles(ateliers, benevoles);
    const occupations = {};
    for (const [idAtelier, idBenevole] of Object.entries(affectations)) {
        const a = parId(idAtelier);
        const b = benevoles.find((x) => x.id === idBenevole);
        const debut = enMinutes(a.debut);
        const fin = debut + a.dureeMinutes;
        assert.ok(
            b.competences.includes(a.categorie),
            `${idBenevole} ne sait pas animer ${idAtelier}`,
        );
        assert.ok(
            b.disponibilites.some(
                (d) => d.date === a.date && enMinutes(d.debut) <= debut && fin <= enMinutes(d.fin),
            ),
            `${idBenevole} n'est pas disponible pour ${idAtelier}`,
        );
        for (const o of occupations[idBenevole] ?? []) {
            assert.ok(
                o.date !== a.date || fin <= o.debut || o.fin <= debut,
                `${idBenevole} est sur deux ateliers à la fois`,
            );
        }
        occupations[idBenevole] = [
            ...(occupations[idBenevole] ?? []),
            { date: a.date, debut, fin },
        ];
    }
});

test('affecterBenevoles : un atelier sans bénévole possible est listé dans nonPourvus', () => {
    const { affectations, nonPourvus } = affecterBenevoles(ateliers, benevoles);
    assert.ok(nonPourvus.includes('AT-28'));
    assert.equal(affectations['AT-28'], undefined);
    assert.equal(Object.keys(affectations).length + nonPourvus.length, 30);
});
