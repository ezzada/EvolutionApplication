import { CarteCreditFactory } from "./carteCreditFactory.js";
import type { ICarteCredit } from "./ICarteCredit.js";
import { RemiseEnArgent } from "./remiseEnArgent.js";

export class RemiseEnArgentFactory extends CarteCreditFactory {
    protected fabriquerCarte(): ICarteCredit {
        const ccRemiseEnArgent = new RemiseEnArgent()
        return ccRemiseEnArgent
    }
}