//implémentation du patron singleton
export class Auto{
    // Variable statique de type Auto
    private static instance: Auto | null = null;

    // Constructeur
    private constructor() {

    }

    // Méthode statique pour instancier un SEUL Auto dans l'éxécutoin
    public static getInstance(): Auto {
        // Si on n'a pas encore d'instance de l'objet, alors on le crée
        if(Auto.instance === null) {
            Auto.instance = new Auto();
        }

        // S'il y déja une instance, la retourner
        return Auto.instance;
    }
}
