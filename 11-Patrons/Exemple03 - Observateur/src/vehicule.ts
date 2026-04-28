// Véhicule sera le sujet observable. Elle hérite de la clase abstraite sujet.

import { Sujet } from "./sujet.js";

export class Vehicule extends Sujet{
    private description: string = "";
    private prix: number = 0;

    public get Description(): string {
        return this.description;
    }

    public set Description(value: string) {
        this.description = value;
        this.notifier(); // informer les observateurs de ce changment
    }
    
    public get Prix(): number {
        return this.prix;
    }

    public set Prix(value: number) {
        this.prix = value;
        this.notifier();
    }

}

