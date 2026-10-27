/**
 * Moteur métier du planning des ateliers du Repair Café des Lilas.
 *
 * Kit du défi : écrivez le corps de chaque fonction, sans changer son nom ni ses
 * paramètres (les tests de spécification les appellent ainsi).
 *
 * Toutes les fonctions sont pures : elles ne modifient jamais les données reçues
 * et renvoient de nouvelles valeurs. Les dates sont au format ISO « AAAA-MM-JJ »,
 * les heures au format « HH:MM » (heure locale).
 *
 * @module ateliers
 */

/**
 * Un atelier du planning.
 *
 * @typedef {object} Atelier
 * @property {string} id identifiant unique (ex. « AT-01 »)
 * @property {string} titre titre affiché au public
 * @property {string} categorie catégorie (velo, couture, electronique, informatique, petit-electromenager, jouets)
 * @property {string} date date de l'atelier, « AAAA-MM-JJ »
 * @property {string} debut heure de début, « HH:MM »
 * @property {number} dureeMinutes durée en minutes
 * @property {string} lieu lieu de l'atelier
 * @property {number} places nombre de places
 * @property {string[]} [inscrits] adresses e-mail des personnes inscrites
 */

/**
 * Un bénévole et ses créneaux de disponibilité.
 *
 * @typedef {object} Benevole
 * @property {string} id identifiant unique (ex. « BEN-01 »)
 * @property {string} prenom prénom
 * @property {string[]} competences catégories d'ateliers qu'il sait animer
 * @property {{ date: string, debut: string, fin: string }[]} disponibilites créneaux de disponibilité
 */

/**
 * Nombre de places restantes d'un atelier : places moins inscrits, jamais négatif.
 * Un atelier sans liste « inscrits » est considéré comme sans inscrit.
 *
 * @param {Atelier} atelier atelier à examiner
 * @returns {number} places restantes (0 ou plus)
 * @throws {TypeError} si « atelier » n'est pas un objet
 */
export function placesRestantes(atelier) {
    if (atelier === null || typeof atelier !== 'object' || Array.isArray(atelier)) {
        throw new TypeError("L'atelier doit être un objet");
    }
    const inscrits = atelier.inscrits ?? [];
    const nombreInscrits = inscrits.length;

    return Math.max(0, atelier.places - nombreInscrits);
}

/**
 * Normalise un texte pour la recherche : minuscules, sans accents, espaces
 * superflus retirés (« Électronique  » → « electronique »).
 *
 * @param {string} texte texte à normaliser
 * @returns {string} texte normalisé
 * @throws {TypeError} si « texte » n'est pas une chaîne
 */
export function normaliserTexte(texte) {
    if (typeof texte !== 'string') {
        throw new TypeError('Le texte doit être une chaîne.');
    }
    return texte
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, ' ');
}

/**
 * Filtre les ateliers selon des critères facultatifs, cumulés (ET logique).
 * Sans critère, renvoie une copie de la liste.
 *
 * @param {Atelier[]} ateliers liste des ateliers
 * @param {object} [criteres] critères de filtre
 * @param {string} [criteres.categorie] catégorie exacte
 * @param {string} [criteres.du] première date incluse, « AAAA-MM-JJ »
 * @param {string} [criteres.au] dernière date incluse, « AAAA-MM-JJ »
 * @param {number} [criteres.placesMin] nombre minimal de places restantes
 * @returns {Atelier[]} nouveau tableau des ateliers retenus, dans l'ordre d'origine
 * @throws {TypeError} si « ateliers » n'est pas un tableau ou « criteres » pas un objet
 * @throws {RangeError} si une date n'est pas au format ISO, si « du » est après « au »,
 *   ou si « placesMin » est négatif
 */
export function filtrerAteliers(ateliers, criteres = {}) {
    if (!Array.isArray(ateliers)) {
        throw new TypeError('Les ateliers doivent être un tableau');
    }
    if (criteres === null || typeof criteres !== 'object' || Array.isArray(criteres)) {
        throw new TypeError('Les critères doivent être un objet');
    }

    const dateValide = (date) =>
        typeof date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(date) &&
        !Number.isNaN(Date.parse(date)) &&
        new Date(date).toISOString().slice(0, 10) === date;

    if (criteres.du !== undefined && !dateValide(criteres.du)) {
        throw new RangeError('Date du début invalide.');
    }
    if (criteres.au !== undefined && !dateValide(criteres.au)) {
        throw new RangeError('Date de fin invalide.');
    }
    if (criteres.du && criteres.au && criteres.du > criteres.au) {
        throw new RangeError('La date de début dépasse la date de fin.');
    }
    if (criteres.placesMin !== undefined && criteres.placesMin < 0) {
        throw new RangeError('Le nombre minimal de places est négatif.');
    }
    return ateliers.filter((atelier) => {
        if (criteres.categorie !== undefined && atelier.categorie !== criteres.categorie) {
            return false;
        }
        if (criteres.du !== undefined && atelier.date < criteres.du) {
            return false;
        }
        if (criteres.au !== undefined && atelier.date > criteres.au) {
            return false;
        }
        if (criteres.placesMin !== undefined && placesRestantes(atelier) < criteres.placesMin) {
            return false;
        }
        return true;
    });
}

/**
 * Trie les ateliers par date et heure de début croissantes, puis, à égalité,
 * par places restantes décroissantes. Le tri est stable (à égalité complète,
 * l'ordre d'origine est gardé) et se fait sur une copie.
 *
 * @param {Atelier[]} ateliers liste des ateliers
 * @returns {Atelier[]} nouveau tableau trié
 * @throws {TypeError} si « ateliers » n'est pas un tableau
 */
export function trierAteliers(ateliers) {
    if (!Array.isArray(ateliers)) {
        throw new TypeError('Les ateliers doivent être un tableau');
    }
    return [...ateliers].sort((a, b) => {
        const comparaisonDate = a.date.localeCompare(b.date);
        if (comparaisonDate !== 0) {
            return comparaisonDate;
        }
        const comparaisonHeure = a.debut.localeCompare(b.debut);
        if (comparaisonHeure !== 0) {
            return comparaisonHeure;
        }
        return placesRestantes(b) - placesRestantes(a);
    });
}

/**
 * Recherche les ateliers dont le titre contient le texte cherché, sans tenir
 * compte des majuscules, des accents ni des espaces superflus. Un texte vide
 * (ou fait d'espaces) renvoie une copie de toute la liste.
 *
 * @param {Atelier[]} ateliers liste des ateliers
 * @param {string} texte texte cherché
 * @returns {Atelier[]} nouveau tableau des ateliers trouvés, dans l'ordre d'origine
 * @throws {TypeError} si « ateliers » n'est pas un tableau ou « texte » pas une chaîne
 */
export function rechercherAteliers(ateliers, texte) {
    if (!Array.isArray(ateliers)) {
        throw new TypeError('Les ateliers doivent être un tableau.');
    }
    if (typeof texte !== 'string') {
        throw new TypeError('Le texte doit être une chaîne.');
    }
    const recherche = normaliserTexte(texte);
    return ateliers.filter((atelier) => normaliserTexte(atelier.titre).includes(recherche));
}

/**
 * Statistiques de remplissage du planning.
 *
 * - « tauxRemplissage » : inscrits / places, en pourcentage entier arrondi (0 sans place) ;
 * - « moyenneInscrits » : inscrits par atelier, arrondi au dixième (0 sans atelier) ;
 * - « categorieLaPlusDemandee » : catégorie au plus fort taux de remplissage ; à égalité,
 *   la première dans l'ordre alphabétique ; null sans atelier.
 *
 * @param {Atelier[]} ateliers liste des ateliers
 * @returns {{ nombreAteliers: number, places: number, inscrits: number, tauxRemplissage: number,
 *   moyenneInscrits: number, parCategorie: Object<string, { ateliers: number, places: number,
 *   inscrits: number, tauxRemplissage: number }>, categorieLaPlusDemandee: (string|null) }}
 *   statistiques globales et par catégorie
 * @throws {TypeError} si « ateliers » n'est pas un tableau
 */
export function calculerStatistiques(ateliers) {
    if (!Array.isArray(ateliers)) {
        throw new TypeError('Les ateliers doivent être un tableau.');
    }
    const parCategorie = {};
    let places = 0;
    let inscrits = 0;
    for (const atelier of ateliers) {
        const nombreInscrits = atelier.inscrits?.length ?? 0;

        places += atelier.places;
        inscrits += nombreInscrits;

        if (!Object.hasOwn(parCategorie, atelier.categorie)) {
            parCategorie[atelier.categorie] = {
                ateliers: 0,
                places: 0,
                inscrits: 0,
                tauxRemplissage: 0,
            };
        }
        const categorie = parCategorie[atelier.categorie];

        categorie.ateliers++;
        categorie.places += atelier.places;
        categorie.inscrits += nombreInscrits;
    }
    for (const categorie of Object.values(parCategorie)) {
        categorie.tauxRemplissage =
            categorie.places === 0 ? 0 : Math.round((categorie.inscrits / categorie.places) * 100);
    }

    const categories = Object.keys(parCategorie).sort();

    let categorieLaPlusDemandee = null;
    let meilleurTaux = -1;

    for (const nom of categories) {
        const taux = parCategorie[nom].tauxRemplissage;

        if (taux > meilleurTaux) {
            meilleurTaux = taux;
            categorieLaPlusDemandee = nom;
        }
    }

    return {
        nombreAteliers: ateliers.length,
        places,
        inscrits,
        tauxRemplissage: places === 0 ? 0 : Math.round((inscrits / places) * 100),
        moyenneInscrits:
            ateliers.length === 0 ? 0 : Math.round((inscrits / ateliers.length) * 10) / 10,
        parCategorie,
        categorieLaPlusDemandee,
    };
}

/**
 * Regroupe les ateliers par mois (« AAAA-MM »), avec reduce. Les clés sont dans
 * l'ordre chronologique ; dans chaque mois, les ateliers gardent l'ordre d'origine.
 *
 * @param {Atelier[]} ateliers liste des ateliers
 * @returns {Object<string, Atelier[]>} ateliers rangés par mois
 * @throws {TypeError} si « ateliers » n'est pas un tableau
 */
export function regrouperParMois(ateliers) {
    if (!Array.isArray(ateliers)) {
        throw new TypeError('Les ateliers doivent être un tableau.');
    }

    const groupes = ateliers.reduce((acc, atelier) => {
        const mois = atelier.date.slice(0, 7);
        if (!Object.hasOwn(acc, mois)) {
            acc[mois] = [];
        }
        acc[mois].push(atelier);
        return acc;
    }, {});

    return Object.fromEntries(
        Object.entries(groupes).sort(([moisA], [moisB]) => moisA.localeCompare(moisB)),
    );
}

/**
 * Vérifie une demande d'inscription à un atelier et renvoie la liste des erreurs,
 * en français, prêtes à afficher. Une demande valide renvoie une liste vide.
 * Un champ manquant est signalé comme une erreur, sans exception.
 *
 * Règles : nom obligatoire ; adresse e-mail obligatoire et valide ; adresse pas
 * déjà inscrite (sans tenir compte des majuscules) ; atelier non complet ; âge
 * obligatoire (entier positif ou nul) ; une personne mineure (moins de 18 ans)
 * doit avoir l'autorisation de ses parents (« autorisationParentale » à true).
 *
 * @param {Atelier} atelier atelier visé
 * @param {{ nom?: string, email?: string, age?: number, autorisationParentale?: boolean }} demande
 *   demande d'inscription
 * @returns {string[]} messages d'erreur (vide si la demande est valide)
 * @throws {TypeError} si « atelier » ou « demande » n'est pas un objet
 */
export function validerInscription(atelier, demande) {
    if (atelier === null || typeof atelier !== 'object' || Array.isArray(atelier)) {
        throw new TypeError("L'atelier doit être un objet.");
    }
    if (demande === null || typeof demande !== 'object' || Array.isArray(demande)) {
        throw new TypeError('La demande doit être un objet.');
    }
    const erreurs = [];
    if (typeof demande.nom !== 'string' || demande.nom.trim() === '') {
        erreurs.push('Le nom est obligatoire.');
    }
    if (typeof demande.email !== 'string' || demande.email.trim() === '') {
        erreurs.push("L'adresse e-mail est obligatoire.");
    } else {
        const email = demande.email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            erreurs.push("L'adresse e-mail est invalide.");
        }
        const inscrits = atelier.inscrits ?? [];
        if (inscrits.some((inscrit) => inscrit.toLowerCase() === email)) {
            erreurs.push('Cette adresse e-mail est déjà inscrite.');
        }
    }
    if (placesRestantes(atelier) === 0) {
        erreurs.push("L'atelier est complet.");
    }
    if (!Number.isInteger(demande.age) || demande.age < 0) {
        erreurs.push("L'âge doit être un entier positif ou nul.");
    } else if (demande.age < 18 && demande.autorisationParentale !== true) {
        erreurs.push('Une autorisation parentale est obligatoire pour les mineurs.');
    }
    return erreurs;
}

/**
 * Affecte un bénévole à chaque atelier : compétent dans sa catégorie, disponible
 * pendant tout l'atelier, et jamais sur deux ateliers qui se chevauchent.
 *
 * Stratégie gloutonne : on traite d'abord les ateliers les plus contraints (ceux
 * qui ont le moins de bénévoles possibles ; à égalité, par date et heure) et l'on
 * choisit le bénévole libre le moins chargé (à égalité, le premier identifiant).
 *
 * @param {Atelier[]} ateliers ateliers à pourvoir
 * @param {Benevole[]} benevoles bénévoles disponibles
 * @returns {{ affectations: Object<string, string>, nonPourvus: string[] }} identifiant du
 *   bénévole par identifiant d'atelier, et identifiants des ateliers non pourvus (triés)
 * @throws {TypeError} si « ateliers » ou « benevoles » n'est pas un tableau
 */
export function affecterBenevoles(ateliers, benevoles) {
    if (!Array.isArray(ateliers) || !Array.isArray(benevoles)) {
        throw new TypeError('Les ateliers et les bénévoles doivent être des tableaux.');
    }

    const enMinutes = (heure) => {
        const [heures, minutes] = heure.split(':').map(Number);
        return heures * 60 + minutes;
    };

    const affectations = {};
    const nonPourvus = [];
    const occupations = {};
    const charges = {};

    for (const benevole of benevoles) {
        occupations[benevole.id] = [];
        charges[benevole.id] = 0;
    }

    const ateliersPrepares = ateliers.map((atelier) => {
        const debut = enMinutes(atelier.debut);
        const fin = debut + atelier.dureeMinutes;

        const candidats = benevoles.filter((benevole) => {
            const competent = benevole.competences.includes(atelier.categorie);

            const disponible = benevole.disponibilites.some((creneau) => {
                return (
                    creneau.date === atelier.date &&
                    enMinutes(creneau.debut) <= debut &&
                    enMinutes(creneau.fin) >= fin
                );
            });

            return competent && disponible;
        });

        return { atelier, debut, fin, candidats };
    });

    ateliersPrepares.sort((a, b) => {
        const comparaisonNombre = a.candidats.length - b.candidats.length;
        if (comparaisonNombre !== 0) {
            return comparaisonNombre;
        }

        const comparaisonDate = a.atelier.date.localeCompare(b.atelier.date);

        if (comparaisonDate !== 0) {
            return comparaisonDate;
        }

        return a.atelier.debut.localeCompare(b.atelier.debut);
    });

    for (const element of ateliersPrepares) {
        const { atelier, debut, fin, candidats } = element;

        const libres = candidats.filter((benevole) => {
            return !occupations[benevole.id].some((occupation) => {
                return (
                    occupation.date === atelier.date &&
                    debut < occupation.fin &&
                    fin > occupation.debut
                );
            });
        });

        libres.sort((a, b) => {
            const comparaisonCharge = charges[a.id] - charges[b.id];

            if (comparaisonCharge !== 0) {
                return comparaisonCharge;
            }

            return a.id.localeCompare(b.id);
        });

        if (libres.length === 0) {
            nonPourvus.push(atelier.id);
            continue;
        }

        const choisi = libres[0];

        affectations[atelier.id] = choisi.id;
        charges[choisi.id]++;

        occupations[choisi.id].push({
            date: atelier.date,
            debut,
            fin,
        });
    }

    nonPourvus.sort();

    return {
        affectations,
        nonPourvus,
    };
}
