"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
class Equipement {
  id;
  marque;
  modele;
  categorie;
  etat;
  emplacement;
  estSousGarantie;
  constructor(data) {
    this.id = data?.id ?? 0;
    this.marque = data?.marque || "";
    this.modele = data?.modele || "";
    this.categorie = Object.values(Categorie).includes(data?.categorie) ? data?.categorie : "";
    this.etat = Object.values(Etat).includes(data?.etat) ? data?.etat : "";
    this.emplacement = data?.emplacement || "";
    this.estSousGarantie = data?.estSousGarantie ?? true;
  }
}
var Categorie = /* @__PURE__ */ ((Categorie2) => {
  Categorie2["Ordinateur"] = "Ordinateur";
  Categorie2["Peripherique"] = "Périphérique";
  Categorie2["Reseau"] = "Réseau";
  return Categorie2;
})(Categorie || {});
var Etat = /* @__PURE__ */ ((Etat2) => {
  Etat2["Neuf"] = "Neuf";
  Etat2["Bon"] = "Bon";
  Etat2["Usage"] = "Usagé";
  return Etat2;
})(Etat || {});
class EquipementService {
  cheminFichierEquipements;
  constructor() {
    const dataDir = path.join(electron.app.getAppPath(), "data");
    this.cheminFichierEquipements = path.join(dataDir, "equipements.json");
  }
  // Méthode privée pour lire le fichier JSON
  async lireEquipements() {
    try {
      const data = await fs.promises.readFile(this.cheminFichierEquipements, "utf-8");
      const equipements = JSON.parse(data);
      return equipements.map((f) => new Equipement(f));
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(`Fichier ${this.cheminFichierEquipements} introuvable`);
        return [];
      }
      throw error;
    }
  }
  // Méthode privée pour écrire dans le fichier JSON
  async ecrireEquipements(equipements) {
    const jsonData = JSON.stringify(equipements, null, 2);
    await fs.promises.writeFile(this.cheminFichierEquipements, jsonData, "utf-8");
  }
  // Récupérer tous les equipements
  async chargerEquipements() {
    try {
      const equipements = await this.lireEquipements();
      return equipements;
    } catch (error) {
      return [];
    }
  }
  // Ajouter un equipement
  async ajouterEquipement(equipement) {
  }
  // Supprimer un equipement
  async supprimerEquipement(id) {
  }
  // Enregistrer les canaux IPC dans le processus principal (main) pour permettre 
  // au renderer (Vue.js + Pinia) de communiquer avec le main (Electron + service + accès fichier + DB) 
  registerIpcHandlers() {
    electron.ipcMain.handle("Canal-ChargerEquipements", async () => {
      return await this.chargerEquipements();
    });
  }
}
let mainWindow = null;
const equipementService = new EquipementService();
electron.app.on("ready", () => {
  mainWindow = new electron.BrowserWindow({
    width: 850,
    height: 760,
    title: "Gestion d'Inventaire de Matériel Informatique",
    autoHideMenuBar: true,
    // Masquer la barre de menu
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow?.once("ready-to-show", () => {
    mainWindow?.show();
  });
  mainWindow?.webContents.on("did-finish-load", () => {
    mainWindow?.show();
  });
  mainWindow.loadURL("http://localhost:5173");
});
electron.ipcMain.on("ajouter-equipement", () => {
  const ajoutWindow = new electron.BrowserWindow({
    width: 550,
    height: 700,
    title: "Nouvel Équipement",
    // Fenêtre modale
    modal: true,
    parent: mainWindow || void 0,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true
    }
  });
  ajoutWindow?.once("ready-to-show", () => {
    ajoutWindow?.show();
  });
  ajoutWindow?.webContents.on("did-finish-load", () => {
    ajoutWindow?.show();
  });
  ajoutWindow.loadURL("http://localhost:5173/#/ajouterEquipement");
});
electron.ipcMain.on("message-channel", (event, arg) => {
  console.log("Message reçu :", arg);
  event.reply("message-channel", "Réponse du main process");
});
electron.ipcMain.handle("showMessageBox", async (event, options) => {
  return electron.dialog.showMessageBox(options);
});
electron.ipcMain.handle("Canal-ChargerEquipement", async () => {
  try {
    const data = await equipementService.chargerEquipements();
    return { response: { success: true }, data };
  } catch (error) {
    return { respons: { success: false, error: error.message }, data: [] };
  }
});
