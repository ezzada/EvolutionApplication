import type { ICarteCredit } from "./ICarteCredit.js";
import { RemiseEnArgentFactory } from "./remiseEnArgentFactory.js";
import { PlatiniumFactory } from "./platiniumFactory.js";

function main(): void {
    console.log("Création de la première carte de crédit: Remise En Argent");
    const ccRemiseEnArgent: ICarteCredit = new RemiseEnArgentFactory().creerCarte();

    if(ccRemiseEnArgent != null){
        console.log("Type de la carte: " + ccRemiseEnArgent.getTypeCarte());
        console.log("Limite de la carte: " + ccRemiseEnArgent.getLimitCredit());
        console.log("Charge annuelle de la carte: " + ccRemiseEnArgent.getChargeAnnuelle());
    }

    console.log("=========================================");
    console.log("Création de la deuxième carte de crédit: Platinium");

    const ccPlatinium : ICarteCredit = new PlatiniumFactory().creerCarte()

    if(ccPlatinium != null){
        console.log("Type de la carte: " + ccPlatinium.getTypeCarte());
        console.log("Limite de la carte: " + ccPlatinium.getLimitCredit());
        console.log("Charge annuelle de la carte: " + ccPlatinium.getChargeAnnuelle());
    }
    
}

main();