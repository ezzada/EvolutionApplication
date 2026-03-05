export class Participant {
    matricule;
    prenom;
    nom;
    genre;
    niveau;
    email;
    isActif;
    constructor(data) {
        // ?? retourner la valeur de droite si la valeur de gauche est null ou undefined (nullish coalescing)
        this.matricule = data?.matricule ?? 0;
        // || retourner la valeur de droite si la valeur de gauche est null, undefined, '', 0, false, NaN
        this.prenom = data?.prenom || '';
        this.nom = data?.nom || '';
        this.genre = Object.values(Genre).includes(data?.genre) ? data?.genre : '';
        this.niveau = Object.values(Niveau).includes(data?.niveau) ? data?.niveau : '';
        this.email = data?.email?.includes('@') ? data?.email : '';
        this.isActif = data?.isActif ?? true;
    }
}
export var Genre;
(function (Genre) {
    Genre["M"] = "M";
    Genre["F"] = "F";
})(Genre || (Genre = {}));
export var Niveau;
(function (Niveau) {
    Niveau["D\u00E9butant"] = "D\u00E9butant";
    Niveau["Interm\u00E9diaire"] = "Interm\u00E9diaire";
    Niveau["Professionnel"] = "Professionnel";
})(Niveau || (Niveau = {}));
