//implémentation du patron singleton
export class Calcul{
    // Variable statique de type Auto
    private static instance: Calcul | null = null;

    // Constructeur
    private constructor() {

    }

    // Méthode statique pour instancier un SEUL Auto dans l'éxécutoin
    public static getInstance(): Calcul {
        // Si on n'a pas encore d'instance de l'objet, alors on le crée
        if(Calcul.instance === null) {
            Calcul.instance = new Calcul();
        }

        // S'il y déja une instance, la retourner
        return Calcul.instance;
    }


    public valeur1(): Number {

        const valeur1 = 0;

        return valeur1
    }

    public valeur2(): Number {

        const valeur2 = 0;

        return valeur2
    }


    public Addtion(valeur1,valeur2) {

        return valeur1 + valeur2;
    }

    public Soustraction(valeur1,valeur2){
        return valeur1 - valeur2;
    }

}
