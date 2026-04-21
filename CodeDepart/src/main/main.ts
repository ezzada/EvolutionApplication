import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';

import { EquipementService } from './service/equipementService'
import { Equipement } from '@/common/equipement';

// Déclaration de la fenêtre principale
let mainWindow: BrowserWindow | null = null;

const equipementService = new EquipementService()

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 850,
    height: 760,
    title: "Gestion d'Inventaire de Matériel Informatique",
    autoHideMenuBar: true, // Masquer la barre de menu
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow?.once('ready-to-show', () => {
    mainWindow?.show()
  });

  mainWindow?.webContents.on('did-finish-load', () => {
    mainWindow?.show()
  });

  mainWindow.loadURL('http://localhost:5173');
});

// Gestionnaire de l'événement pour ouvrir la fenêtre d'ajout d'equipement
ipcMain.on('ajouter-equipement', () => {
  
  const ajoutWindow = new BrowserWindow({
    width: 550,
    height: 700,
    title: "Nouvel Équipement",
    // Fenêtre modale
    modal: true,
    parent: mainWindow || undefined,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
    },
  });

  ajoutWindow?.once('ready-to-show', () => {
    ajoutWindow?.show()
  });

  ajoutWindow?.webContents.on('did-finish-load', () => {
    ajoutWindow?.show()
  });

  ajoutWindow.loadURL('http://localhost:5173/#/ajouterEquipement');

});

// Communication entre le processus principal et le processus de rendu
ipcMain.on('message-channel', (event, arg) => {
  console.log('Message reçu :', arg);
  event.reply('message-channel', 'Réponse du main process');
});

// Pour afficher une boîte de dialogue depuis le main process
ipcMain.handle("showMessageBox", async (event, options) => {
  return dialog.showMessageBox(options);
});

ipcMain.handle('Canal-ChargerEquipement', async () => {
  try {
    const data = await equipementService.chargerEquipements()

    return { response: { success: true }, data: data }
  } catch (error: any) {
    return { respons: { success: false, error: error.message }, data: [] }
  }
});

ipcMain.handle('Canal-AjouterEquipement', async (_event, equipement: Equipement) => {
  try {
    await equipementService.ajouterEquipement(equipement)

    if (mainWindow) {
      mainWindow.webContents.send('equipement-added', equipement)
    }

    return { success: true, data: equipement }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
});

ipcMain.handle('Canal-SupprimerEquipement', async (_event, id) => {
  try {
    await equipementService.supprimerEquipement(id)

    return { success: true }
  }catch(error: any)
  {
    return { success: false, error:error.message}
  }
});
