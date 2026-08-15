//joueur 1 = toujours un humain (symbole O)
let joueur1 = {
    nom: "Joueur 1",
    symbole: "O",
    score: 0
};
//joueur 2 = humain (mode multi) ou bot (mode bot) (symbole X)
let joueur2 = {
    nom: "Joueur 2",
    symbole: "X",
    score: 0
};

//mode de jeu : "multi" ou "bot"
let mode = null;
//difficulté du bot : "facile", "moyen" ou "difficile"
let difficulte = null;

//est ce que la partie est terminé?
let partieTerminee = false;
//à qui le tour? true = joueur1, false = joueur2
let auJoueur1DeJouer = true;

const cases = document.getElementsByClassName("grid-item");
//combinaisons gagnantes : points clées
const combinaisonsGagnantes = [[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]];

/* ---------------------------------------- */
/* GESTION DES ÉCRANS (menu / difficulté / jeu) */
/* ---------------------------------------- */

function afficherEcran(id) {
    document.querySelectorAll(".ecran").forEach(function (ecran) {
        ecran.classList.add("cache");
    });
    document.getElementById(id).classList.remove("cache");
}

function choisirMode(modeChoisi) {
    mode = modeChoisi;
    if (mode === "multi") {
        joueur1.nom = "Joueur 1";
        joueur2.nom = "Joueur 2";
        difficulte = null;
        demarrerPartie();
    } else {
        afficherEcran("ecran-difficulte");
    }
}

function choisirDifficulte(niveauChoisi) {
    difficulte = niveauChoisi;
    joueur1.nom = "Toi";
    joueur2.nom = "Bot";
    demarrerPartie();
}

function retourMenu() {
    mode = null;
    difficulte = null;
    joueur1.score = 0;
    joueur2.score = 0;
    afficherEcran("ecran-mode");
}

function demarrerPartie() {
    document.getElementById("nom-joueur1").textContent = joueur1.nom;
    document.getElementById("nom-joueur2").textContent = joueur2.nom;

    let texteMode = document.getElementById("mode-actif");
    if (mode === "multi") {
        texteMode.textContent = "Mode : Multijoueur";
    } else {
        let labels = { facile: "Facile", moyen: "Moyen", difficile: "Difficile" };
        texteMode.textContent = "Mode : Contre le Bot (" + labels[difficulte] + ")";
    }

    recommencer();
    afficherEcran("ecran-jeu");
}

/* ---------------------------------------- */
/* LOGIQUE DE JEU */
/* ---------------------------------------- */

function remplirCase(caseIndex, symbole) {
    caseIndex.textContent = symbole;
    //marquage
    caseIndex.classList.add("coche");
}

//match nul
function nombreCasesRemplies() {
    let compteur = 0;
    for (let i = 0; i < cases.length; i++) {
        if (cases[i].classList.contains("coche")){
            compteur++;
        }
    }
    return compteur;
}

//affichage du score
function afficherScore(){
    let scoreJoueur1 = document.querySelector(".you-score");
    let scoreJoueur2 = document.querySelector(".cpu-score");
    scoreJoueur1.textContent = joueur1.score;
    scoreJoueur2.textContent = joueur2.score;
}

//affiche à qui le tour de jouer
function afficherTour() {
    let texteTour = document.getElementById("tour");
    if (partieTerminee) {
        return;
    }
    if (auJoueur1DeJouer) {
        texteTour.textContent = "C'est au tour de " + joueur1.nom + " (" + joueur1.symbole + ")";
    } else {
        texteTour.textContent = "C'est au tour de " + joueur2.nom + " (" + joueur2.symbole + ")";
    }
}

//vérification du joueur gagnant, sur un tableau de symboles donné
function combinaisonGagnante(tableau, symbole) {
    for (let i = 0; i < combinaisonsGagnantes.length; i++) {
        let [a, b, c] = combinaisonsGagnantes[i];
        if (tableau[a] === symbole && tableau[b] === symbole && tableau[c] === symbole) {
            return combinaisonsGagnantes[i];
        }
    }
    return null;
}

//vérification du joueur gagnant sur la grille affichée (et surlignage)
function quigagne(joueurATester) {
    let tableau = [];
    for (let i = 0; i < cases.length; i++) {
        tableau.push(cases[i].textContent);
    }
    let combinaison = combinaisonGagnante(tableau, joueurATester.symbole);
    if (combinaison) {
        combinaison.forEach(function (index) {
            cases[index].style.color = "green";
        });
        return true;
    }
    return false;
}

//fin de partie
function finDePartie(gagnant) {
    partieTerminee = true;
    gagnant.score++;
    afficherScore();
    let message = document.getElementById("message");
    message.textContent = gagnant.nom + " a gagné !";
}

function matchNul() {
    partieTerminee = true;
    let message = document.getElementById("message");
    message.textContent = "Match nul !";
}

function jouerCase(id){
    let caseCliquee = document.getElementById("case" + id);

    //on bloque si la partie est finie ou si la case est déjà prise
    if(partieTerminee || caseCliquee.classList.contains("coche")) {
        return;
    }
    //en mode bot, on bloque les clics quand ce n'est pas le tour du joueur humain
    if (mode === "bot" && !auJoueur1DeJouer) {
        return;
    }

    //on détermine quel joueur joue ce coup-ci
    let joueurActuel = auJoueur1DeJouer ? joueur1 : joueur2;

    jouerCoup(id, joueurActuel);
}

//exécute un coup pour un joueur donné et gère la suite (victoire, nul, tour suivant, bot)
function jouerCoup(id, joueurActuel) {
    let caseCliquee = document.getElementById("case" + id);
    remplirCase(caseCliquee, joueurActuel.symbole);

    if (quigagne(joueurActuel)) {
        finDePartie(joueurActuel);
        return;
    }

    if (nombreCasesRemplies() === cases.length) {
        matchNul();
        return;
    }

    //on change de tour
    auJoueur1DeJouer = !auJoueur1DeJouer;
    afficherTour();

    //si c'est au bot de jouer, on déclenche son coup après un petit délai
    if (mode === "bot" && !auJoueur1DeJouer && !partieTerminee) {
        setTimeout(jouerCoupBot, 500);
    }
}

/* ---------------------------------------- */
/* INTELLIGENCE DU BOT */
/* ---------------------------------------- */

function casesVides() {
    let indices = [];
    for (let i = 0; i < cases.length; i++) {
        if (!cases[i].classList.contains("coche")) {
            indices.push(i);
        }
    }
    return indices;
}

function coupAleatoire() {
    let libres = casesVides();
    return libres[Math.floor(Math.random() * libres.length)];
}

//cherche une case qui ferait gagner "symbole" immédiatement, sinon null
function coupGagnantPour(symbole) {
    let tableau = [];
    for (let i = 0; i < cases.length; i++) {
        tableau.push(cases[i].textContent);
    }
    let libres = casesVides();
    for (let i = 0; i < libres.length; i++) {
        let index = libres[i];
        tableau[index] = symbole;
        if (combinaisonGagnante(tableau, symbole)) {
            tableau[index] = "";
            return index;
        }
        tableau[index] = "";
    }
    return null;
}

//algorithme minimax pour le mode difficile (bot imbattable)
function minimax(tableau, profondeur, estMaximisant) {
    let gagnantBot = combinaisonGagnante(tableau, joueur2.symbole);
    if (gagnantBot) return 10 - profondeur;
    let gagnantHumain = combinaisonGagnante(tableau, joueur1.symbole);
    if (gagnantHumain) return profondeur - 10;
    if (!tableau.includes("")) return 0;

    if (estMaximisant) {
        let meilleurScore = -Infinity;
        for (let i = 0; i < tableau.length; i++) {
            if (tableau[i] === "") {
                tableau[i] = joueur2.symbole;
                let score = minimax(tableau, profondeur + 1, false);
                tableau[i] = "";
                meilleurScore = Math.max(meilleurScore, score);
            }
        }
        return meilleurScore;
    } else {
        let meilleurScore = Infinity;
        for (let i = 0; i < tableau.length; i++) {
            if (tableau[i] === "") {
                tableau[i] = joueur1.symbole;
                let score = minimax(tableau, profondeur + 1, true);
                tableau[i] = "";
                meilleurScore = Math.min(meilleurScore, score);
            }
        }
        return meilleurScore;
    }
}

function meilleurCoupMinimax() {
    let tableau = [];
    for (let i = 0; i < cases.length; i++) {
        tableau.push(cases[i].textContent);
    }
    let meilleurScore = -Infinity;
    let meilleurIndex = null;
    for (let i = 0; i < tableau.length; i++) {
        if (tableau[i] === "") {
            tableau[i] = joueur2.symbole;
            let score = minimax(tableau, 0, false);
            tableau[i] = "";
            if (score > meilleurScore) {
                meilleurScore = score;
                meilleurIndex = i;
            }
        }
    }
    return meilleurIndex;
}

//choisit la case que le bot va jouer, selon la difficulté
function choisirCoupBot() {
    if (difficulte === "facile") {
        //toujours aléatoire
        return coupAleatoire();
    }

    if (difficulte === "moyen") {
        //gagne si possible
        let coupGagnant = coupGagnantPour(joueur2.symbole);
        if (coupGagnant !== null) return coupGagnant;
        //bloque l'adversaire une fois sur deux
        let coupBlocage = coupGagnantPour(joueur1.symbole);
        if (coupBlocage !== null && Math.random() < 0.5) return coupBlocage;
        //sinon aléatoire
        return coupAleatoire();
    }

    //difficile : bot imbattable (minimax)
    return meilleurCoupMinimax();
}

function jouerCoupBot() {
    if (partieTerminee) return;
    let index = choisirCoupBot();
    if (index === undefined || index === null) return;
    jouerCoup(index, joueur2);
}

/* ---------------------------------------- */
/* RÉINITIALISATION */
/* ---------------------------------------- */

//réinitialise la grille pour une nouvelle partie
function recommencer() {
    for (let i = 0; i < cases.length; i++) {
        cases[i].textContent = "";
        cases[i].classList.remove("coche");
        cases[i].style.color = "";
    }
    let message = document.getElementById("message");
    message.textContent = "";
    partieTerminee = false;
    auJoueur1DeJouer = true;
    afficherScore();
    afficherTour();
}

