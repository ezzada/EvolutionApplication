import { endianness } from "os";

export class Participant{
    matricule: number;
    prenom: string;
    nom: string;
    genre: string;
    niveau: string;
    email: string;
    isActif: boolean;

    constructor(data?: Partial<Participant>) {

        // ?? retourner la valeur de droite si la valeur de gauche est null ou undifined (nullish coalescing)
        this.matricule = data?.matricule ?? 0;

        // || retourne la valeur de droite si la valeur de gauche est null, undifined, '', 0, false, NaN
        this.prenom = data?.prenom ||  '';
        this.nom = data?.nom || '';
        
        this.genre = Object.values(Genre).includes(data?.genre as Genre) ? data?.genre as Genre : '';
        this.niveau = Object.values(Niveau).includes(data?.niveau as Niveau) ? data?.niveau as Niveau : '';

        this.email = data?.email?.includes('@') ? data?.email : '';
        this.isActif = data?.isActif ?? true;
    }

}

export enum Genre{
    M = 'M',
    F = 'F'
}

export enum Niveau{
    Débutant = 'Débutant',
    Intermédiaire = 'Intermédiaire',
    Professionel = 'Proféssionel'
}