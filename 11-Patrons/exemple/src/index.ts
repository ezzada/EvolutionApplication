import { Auto } from "./auto.js";

class Program {
    public static main(): void {
        const s1 = Auto.getInstance(); // Création d'un objet de type Auto
        const s2 = Auto.getInstance(); // Pas d'instanciation, on aura le premier objet créer dans s2 aussi

        // On vérifie si c'est le même objet dans s1 et s2
        if(s1 === s2){
            console.log("Le singleton fonctionne , les deux variables contiennent la même instance.");
            console.log("s1:",s1);
            console.log("s2:",s2);
        }else{
            console.log("Le singleton a échoué , les deux variables contiennent des instances différentes.");
            console.log("s1:",s1);
            console.log("s2:",s2);
        }

    }
}

// Éxécution
Program.main();