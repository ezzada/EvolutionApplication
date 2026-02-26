"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
class Participant {
  matricule;
  prenom;
  nom;
  genre;
  niveau;
  email;
  isActif;
  constructor(data) {
    this.matricule = data?.matricule ?? 0;
    this.prenom = data?.prenom || "";
    this.nom = data?.nom || "";
    this.genre = Object.values(Genre).includes(data?.genre) ? data?.genre : "";
    this.niveau = Object.values(Niveau).includes(data?.niveau) ? data?.niveau : "";
    this.email = data?.email?.includes("@") ? data?.email : "";
    this.isActif = data?.isActif ?? true;
  }
}
var Genre = /* @__PURE__ */ ((Genre2) => {
  Genre2["M"] = "M";
  Genre2["F"] = "F";
  return Genre2;
})(Genre || {});
var Niveau = /* @__PURE__ */ ((Niveau2) => {
  Niveau2["Débutant"] = "Débutant";
  Niveau2["Intermédiaire"] = "Intermédiaire";
  Niveau2["Professionel"] = "Proféssionel";
  return Niveau2;
})(Niveau || {});
class ParticipantService {
  participantsFilePath;
  constructor() {
    const dataDir = path.join(electron.app.getPath(), "data");
    this.participantsFilePath = path.join(dataDir, "participant.json");
  }
  //Méthode privée pour lire le fichier JSON
  async lireParticipants() {
    try {
      const data = await fs.promises.readFile(this.participantsFilePath, "utf-8");
      const participant = JSON.parse(data);
      return participant.map((p) => new Participant(p));
    } catch (error) {
      if (error.code == "ENOENT") {
        console.warn(`Fichier ${this.participantsFilePath} introuvable`);
      }
      throw error;
    }
  }
  //Méthode pour charger les donnée
  async chargerParticipants() {
    return await this.lireParticipants();
  }
  registerIpcHandler() {
    electron.ipcMain.handle("Canal-ChargerParticipants", async () => {
      return await this.chargerParticipants();
    });
  }
}
let mainWindow = null;
electron.app.on("ready", () => {
  mainWindow = new electron.BrowserWindow({
    width: 800,
    height: 760,
    autoHideMenuBar: true,
    // Masquer la barre de menu
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      // Utilisation d'un chemin absolu
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
electron.ipcMain.on("open-accueil", () => {
  const accueilWindow = new electron.BrowserWindow({
    width: 550,
    height: 500,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true
    }
  });
  accueilWindow?.once("ready-to-show", () => {
    accueilWindow?.show();
  });
  accueilWindow?.webContents.on("did-finish-load", () => {
    accueilWindow?.show();
  });
  accueilWindow.loadURL("http://localhost:5173/#/accueil");
});
electron.ipcMain.on("message-channel", (event, arg) => {
  console.log("Message reçu :", arg);
  event.reply("message-channel", "Réponse du main process");
});
const participantService = new ParticipantService();
electron.ipcMain.handle("Canal-ChargerParticipants", async () => {
  try {
    const data = await participantService.chargerParticipants();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
