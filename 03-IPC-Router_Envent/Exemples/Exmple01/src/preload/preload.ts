import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI",{
    // Exemple a: Communication synchrone
    // Le script preload expose une API sécurisée appelée electronAPI
    // Il créé une fonction "getAppInfo"
    getAppInfo: () => ipcRenderer.sendSync('get-app-info'),

    //Exemple d: Communication asynchrone
    //onTaskResult permet au renderer de s'abonner à l'événement task-result
    // Lorsque le main process renvoie une réponse, la fonction callback est exécutée
    onTaskResult: (callback: (result: any) => void) => {
        ipcRenderer.on('task-result', (result) => callback(result))
    },

    // Ajouter performTask
    performTask: (data: any) => ipcRenderer.send("perform_task", data),

    //Exemple c. Communication bibirectionnel
    calculate: (a: number, b: number) => ipcRenderer.invoke('calculate', {a,b}),

    
})