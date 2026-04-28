import type { ICarteCredit } from "./ICarteCredit.js"

export class RemiseEnArgent implements ICarteCredit {
    public getChargeAnnuelle():number{
        return 20
    }
    public getLimitCredit(): number {
        return 10000
    }
    public getTypeCarte(): string {
        return "Remise en argent"
    }

}