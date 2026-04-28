import type { ICarteCredit } from "./ICarteCredit.js";

// Classe abstraite CarteCreditFactory
export abstract class CarteCreditFactory {

    protected abstract fabriquerCarte(): ICarteCredit
    
    public creerCarte(): ICarteCredit {
        return this.fabriquerCarte();
    }
}