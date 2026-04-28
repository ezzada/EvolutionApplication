// Exmple d'implémentation du patron observateur (Observer) producteur/consomateur

import { VueVehicule } from "./vueVehicule.js";
import { Vehicule } from "./vehicule.js";

function main(): void {
    const v = new Vehicule();
    const vue = new VueVehicule(v);

    v.Description = "Voiture de sport";
    v.Prix = 100000;

    vue.afficher();

    v.Prix = 90000;

    vue.afficher();

}

// Exécution
main();