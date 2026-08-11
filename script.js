//joueur
let joueur = {
    nom : "kepler",
    symbole: "O",
    score: 0
};
let cpu = {
    nom : "cpu",
    symbole: "X",
    score: 0
};
//est ce que la partie est terminé?
let partieTerminee = false;
//à qui le tour?
let auJoueurDeJouer = true;
const cases = document.getElementsByClassName("grid-item");
//combinaisons gagnantes : points clées
const combinaisonsGagnantes = [[0,1,2],[3,4,5],[6,7,8], 
[0,3,6],[1,4,7],[2,5,8], 
[0,4,8],[2,4,6]];

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
    let scoreJoueur = document.querySelector(".you-score");
    let scoreCPU = document.querySelector(".cpu-score");
    scoreJoueur.textContent = joueur.score;
    scoreCPU.textContent = cpu.score;
}

//affiche à qui le tour de jouer
function afficherTour() {
    let texteTour = document.getElementById("tour");
    if (partieTerminee) {
        return;
    }
    if (auJoueurDeJouer) {
        texteTour.textContent = "C'est au tour de " + joueur.nom + " (" + joueur.symbole + ")";
    } else {
        texteTour.textContent = "C'est au tour de " + cpu.nom + " (" + cpu.symbole + ")";
    }
}

//vérification du joueur gagnant
function quigagne(joueurATester) { 
    //parcours de chaque combinaison gagnante possible
    for(let i = 0; i < combinaisonsGagnantes.length; i++) {
        let a = combinaisonsGagnantes[i][0];
        let b = combinaisonsGagnantes[i][1];
        let c = combinaisonsGagnantes[i][2];
        if(
            cases[a].textContent === joueurATester.symbole &&
            cases[b].textContent === joueurATester.symbole &&
            cases[c].textContent === joueurATester.symbole
        ){
            cases[a].style.color = "green";
            cases[b].style.color = "green";
            cases[c].style.color = "green";
            return true;
        }
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

    //on détermine quel joueur joue ce coup-ci
    let joueurActuel = auJoueurDeJouer ? joueur : cpu;

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
    auJoueurDeJouer = !auJoueurDeJouer;
    afficherTour();
}

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
    auJoueurDeJouer = true;
    afficherTour();
}

//initialisation au chargement de la page
afficherScore();
afficherTour();
