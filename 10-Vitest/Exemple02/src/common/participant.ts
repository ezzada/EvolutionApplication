export class Participant {
    matricule: number;
    prenom: string;
    nom: string;
    genre: string;
    niveau: string;
    email: string;
    isActif: boolean;

    //Définition du constructeur avec des valeurs par défaut
    // data? veut dire que le paramètre est optionnel
    // Partial<Participant> permet de créer un objet avec les mêmes propriétés que Participant
    // mais toutes les propriétés sont optionnelles
    constructor(data?: Partial<Participant>) {

        // "??" si la valeur est null ou undefined
        this.matricule = data?.matricule ?? 0;

        // "||" retourne la valeur de droite si la valeur de gauche est falsy (null, undefined, '', 0, false, NaN)
        this.prenom = data?.prenom || '';
        this.nom = data?.nom || '';
        // Si la valeur data.genre fait partie des valeurs possibles de l'énumération Genre, alors on l'assigne à this.genre. Sinon, on assigne une chaîne vide ('') 
        this.genre = Object.values(Genre).includes(data?.genre as Genre) ? data?.genre as Genre : ''; 
        // Si la valeur data.niveau fait partie des valeurs possibles de l'énumération Niveau, alors on l'assigne à this.niveau. Sinon, on assigne une chaîne vide ('')
        this.niveau = Object.values(Niveau).includes(data?.niveau as Niveau) ? data?.niveau as Niveau : ''; 
        this.email = data?.email?.includes('@') ? data?.email : ''; 
        this.isActif = data?.isActif ?? true;
    }    
}

// En TypeScript, les enumérations sont numériques par défaut (0, 1, 2, ...) dans l'ordre de déclaration
// Pour que les enumérations soient de type string, il faut les déclarer avec une valeur explicite
export enum Genre {
    M = 'M',
    F = 'F',
}

export enum Niveau {
    Débutant = 'Débutant', 
    Intermédiaire = 'Intermédiaire', 
    Professionnel = 'Professionnel',
}
