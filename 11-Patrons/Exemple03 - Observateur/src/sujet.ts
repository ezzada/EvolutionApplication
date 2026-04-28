// Classe abstrate du sujet (observable)

import type { IObservateur } from "./IObservateur.js";

export abstract class Sujet {

    // Une liste d'observateur
    private Observateurs: IObservateur[] = [];

    public ajouter(obeservateur: IObservateur): void {
        this.Observateurs.push(obeservateur);
    }

    // Retirer un observateur du sujet
    public retirer(obeservateur: IObservateur): void {
        this.Observateurs = this.Observateurs.filter(obs => obs !== obeservateur)
    }

    // Notifier le changement d'état du sujet à tous les observateurs
    public notifier(): void {
        for(const ob of this.Observateurs) {
            ob.actualiser();
        }
    }


}