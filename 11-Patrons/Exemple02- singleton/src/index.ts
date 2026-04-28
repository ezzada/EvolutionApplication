import { Calcul } from "./calcul.js";

class Program {
    public static main(): void {
        const c1 = Calcul.getInstance().valeur1 = 12; 
        const c2 = Calcul.getInstance().valeur2 = 7.5; 

        // On vérifie si c'est le même objet dans s1 et s2
        console.log(
            `${Calcul.getInstance().valeur1}+${Calcul.getInstance().Addtion}`
        );
        console.log(
            `${Calcul.getInstance().valeur1}-${Calcul.getInstance().Soustraction}`
        );

        console.log("\============================================\n")

        console.log(
            `${Calcul.getInstance().valeur1}+${Calcul.getInstance().Addtion}`
        );
        console.log(
            `${Calcul.getInstance().valeur1}-${Calcul.getInstance().Soustraction}`
        );

    }
}

// Éxécution
Program.main();