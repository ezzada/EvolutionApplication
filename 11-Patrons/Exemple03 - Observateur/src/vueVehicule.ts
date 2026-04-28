// la classe vehicule implémente l'interface IObservateur

import type { IObservateur } from "./IObservateur.js";

import { Vehicule } from "./vehicule.js";

export class VueVehicule implements IObservateur {
    private vehicule: Vehicule;
    private texte: string = "";

    constructor(vehicule: Vehicule) {
        this.vehicule = vehicule;
        vehicule.ajouter(this); // Ajouter un nouvel obsrvateur pour vehicule
        this.actualiser(); 
    }

    public actualiser(): void {
        this.texte = `Description: ${this.vehicule.Description}, Prix: ${this.vehicule.Prix}`
    }

    public afficher(): void {
        console.log(this.texte)
    }
}

