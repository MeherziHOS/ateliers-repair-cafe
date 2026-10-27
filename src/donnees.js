/**
 * Chargement des données du planning (fourni avec le kit : à ne pas modifier).
 *
 * @module donnees
 */
import { readFileSync } from 'node:fs';

const lire = (fichier) =>
    JSON.parse(readFileSync(new URL(`../data/${fichier}`, import.meta.url), 'utf8'));

/**
 * Charge les ateliers du fichier « data/ateliers.json ».
 *
 * @returns {import('./ateliers.js').Atelier[]} liste des ateliers
 */
export function chargerAteliers() {
    return lire('ateliers.json');
}

/**
 * Charge les bénévoles du fichier « data/benevoles.json ».
 *
 * @returns {import('./ateliers.js').Benevole[]} liste des bénévoles
 */
export function chargerBenevoles() {
    return lire('benevoles.json');
}
