declare module '*.vue' {
    import { DefineComponent } from "vue"

    // Déclaration d'un composant vue générique 
    const component: DefineComponent<{},{},any>

    //Exportation du composant pour une utilisation dans les fichier ts

    export default component;
}