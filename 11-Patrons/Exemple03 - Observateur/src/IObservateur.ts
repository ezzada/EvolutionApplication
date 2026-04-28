// interface de l'observateur du sujet (l'Observable)
// À chaque modification de l'état de l'observable, on informe l'obeservateur 

export interface IObservateur {
    actualiser(): void;


}