import { CarteCreditFactory } from "./carteCreditFactory.js";
import type { ICarteCredit } from "./ICarteCredit.js";
import { Platinium } from "./platinium.js";

export class PlatiniumFactory extends CarteCreditFactory{
    protected fabriquerCarte(): ICarteCredit {
        const ccPlatinium = new Platinium
        return ccPlatinium
    }
}