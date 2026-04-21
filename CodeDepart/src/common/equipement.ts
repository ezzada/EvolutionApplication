export class Equipement {
    id: number;
    marque: string;
    modele: string;
    categorie: string;
    etat: string;
    emplacement: string;
    estSousGarantie: boolean;

    constructor(data?: Partial<Equipement>) {
        this.id = data?.id ?? 0;
        this.marque = data?.marque || '';
        this.modele = data?.modele || '';
        this.categorie = Object.values(Categorie).includes(data?.categorie as Categorie) ? data?.categorie as Categorie : '';
        this.etat = Object.values(Etat).includes(data?.etat as Etat) ? data?.etat as Etat : '';
        this.emplacement = data?.emplacement || '';
        this.estSousGarantie = data?.estSousGarantie ?? true;
    }
}

export enum Categorie {
    Ordinateur = 'Ordinateur',
    Peripherique = 'Périphérique',
    Reseau = 'Réseau',
}

export enum Etat {
    Neuf = 'Neuf',
    Bon = 'Bon',
    Usage = 'Usagé',
}
