declare module '*.vue' {
    import { DefineComponent } from 'vue';
    
    // Déclare un module pour les fichiers .vue, indiquant que chaque fichier exporte un composant Vue
    const component: DefineComponent<{}, {}, any>;

    // Exportation du composant pour une utitlisation dans les fichiers ts
    export default component;
}