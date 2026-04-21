import { contextBridge, ipcRenderer } from "electron";

import { Equipement } from "../common/equipement";


contextBridge.exposeInMainWorld('api', {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel:string, callback: (event: any, data: any) => void) => {
        ipcRenderer.on(channel, callback);
    },
    once: (channel: string, callback: (event: any, data: any) => void) => {
        ipcRenderer.once(channel, callback);
    },
    showMessageBox: (options: any) => ipcRenderer.invoke("showMessageBox", options),
    
    chargerEquipements: () => ipcRenderer.invoke('Canal-ChargerEquipement'),

    ouvrirAjouterEquipement: () => ipcRenderer.send('ajouter-equipement'),

    ajouterEquipement: (equipement: Equipement) => ipcRenderer.invoke("Canal-AjouterEquipement", equipement),

    supprimerEquipement: (id: number) => ipcRenderer.invoke("Canal-SupprimerEquipement", id),
    
});