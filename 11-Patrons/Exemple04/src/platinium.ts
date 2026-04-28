import type { ICarteCredit } from "./ICarteCredit.js";

export class Platinium implements ICarteCredit {
    public getChargeAnnuelle():number{
        return 20
    }
    public getLimitCredit(): number {
        return 30000
    }
    public getTypeCarte(): string {
        return "Platinium"
    }

}