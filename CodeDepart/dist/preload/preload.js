"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => electron.ipcRenderer.send(channel, data),
  on: (channel, callback) => {
    electron.ipcRenderer.on(channel, callback);
  },
  once: (channel, callback) => {
    electron.ipcRenderer.once(channel, callback);
  },
  showMessageBox: (options) => electron.ipcRenderer.invoke("showMessageBox", options),
  chargerEquipements: () => electron.ipcRenderer.invoke("Canal-ChargerEquipement"),
  ouvrirAjouterEquipement: () => electron.ipcRenderer.send("ajouter-equipement")
});
