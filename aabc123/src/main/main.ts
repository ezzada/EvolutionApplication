import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { ParticipantService } from './service/participantService';
import { Participant } from '@/common/participant';
import { updateFormatted } from 'vuetify/lib/labs/VCalendar/util/timestamp';

// Déclaration de la fenêtre principale
// nul indique que la fenêtre n'est pas encore créée
let mainWindow: BrowserWindow | null = null;
let participantService: ParticipantService;

app.on('ready', async () => {
  //Initialisation du service des participants et établir la connexion à la BD
  participantService = new ParticipantService();
  try {
    await participantService.initialize();
    console.log('Service des participants initialisé avec la BD');
  } catch (error: any) {
    console.error('Erreur lors de l\'initialisation:', error.message);
    dialog.showErrorBox('Erreur de connexion', 'Impossible de se connecté à la BD. Vérifiez que Mysql est en cours d\'exécution');
    app.quit();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 800,
    height: 760,
    autoHideMenuBar: true, // Masquer la barre de menu
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'), // Utilisation d'un chemin absolu
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Ceci est une fonction qui attend que la fenêtre soit prête à être affichée avant de l'afficher
  mainWindow?.once('ready-to-show', () => {
    mainWindow?.show()
  });

  //Fermer la connexion à la BD à l'arrêt de l'application 
  app.on('before-quit', async() =>{
    if(participantService){
      await participantService.close();
    }
  })

  // Ceci est une fonction qui attend que le contenu soit complètement chargé avant d'afficher la fenêtre
  mainWindow?.webContents.on('did-finish-load', () => {
    mainWindow?.show()
  });

  mainWindow.loadURL('http://localhost:5173'); // URL de l'application Vue.js
});

ipcMain.on('ajouter-participant', () => {
  const ajoutWindow = new BrowserWindow({
    width: 550,
    height: 700,
    title: "Nouveau participant",
    // Fenêtre modale
    modal: true,
    parent: mainWindow || undefined,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
    },
  });

  // Ceci est une fonction qui attend que la fenêtre soit prête à être affichée avant de l'afficher
  // Pour qu'il n'y ait pas d'écran blanc avant le chargement complet de la vue
  ajoutWindow?.once('ready-to-show', () => {
    ajoutWindow?.show()
  });

  // Ceci est une fonction qui attend que le contenu soit complètement chargé avant d'afficher la fenêtre
  // Pour qu'il n'y ait pas d'écran blanc avant le chargement complet de la vue
  ajoutWindow?.webContents.on('did-finish-load', () => {
    ajoutWindow?.show()
  });

  // Charge la route Vue dans la nouvelle fenêtre
  ajoutWindow.loadURL('http://localhost:5173/#/ajouterParticipant')
});

let selectedParticipantForModif: Participant | null = null;
let modifWindow: BrowserWindow | null = null;



ipcMain.on('modifier-participant', (event, participant: Participant) => {

  // Stocker le participant sélectionné pour le passer à la fenêtre de modification
  selectedParticipantForModif = participant;

  modifWindow = new BrowserWindow({
    width: 550,
    height: 700,
    title: "Modifier un participant",
    // Fenêtre modale
    modal: true,
    parent: mainWindow || undefined,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
    },
  });

  // Ceci est une fonction qui attend que la fenêtre soit prête à être affichée avant de l'afficher
  // Pour qu'il n'y ait pas d'écran blanc avant le chargement complet de la vue
  modifWindow?.once('ready-to-show', () => {
    modifWindow?.show()

    // Envoyer le participant à la fenêtre lorsqu'elle sera prête
    if (modifWindow && selectedParticipantForModif) {
      modifWindow.webContents.send('selected-participant', selectedParticipantForModif)
    }
  });

  // Ceci est une fonction qui attend que le contenu soit complètement chargé avant d'afficher la fenêtre
  // Pour qu'il n'y ait pas d'écran blanc avant le chargement complet de la vue
  modifWindow?.webContents.on('did-finish-load', () => {
    modifWindow?.show()
  });

  // Charge la route Vue dans la nouvelle fenêtre
  modifWindow.loadURL('http://localhost:5173/#/modifierParticipant')
});


// Communication entre le processus principal et le processus de rendu
ipcMain.on('message-channel', (event, arg) => {
  console.log('Message reçu :', arg);
  event.reply('message-channel', 'Réponse du main process');
});



ipcMain.handle('Canal-ChargerParticipants', async () => {
  try {
    const data = await participantService.chargerParticipants()

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
});

ipcMain.handle('Canal-AjouterParticipant', async (_event, participant: Participant) => {
  try {
    await participantService.ajouterParticipant(participant)

    if (mainWindow) {
      mainWindow.webContents.send('participant-added', participant)
    }
    return { success: true, data: participant }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
});

ipcMain.handle("showMessageBox", async (event, options) => {
  return dialog.showMessageBox(options);
})


ipcMain.handle('Canal-Supprimer-Participant', async (_event, matricule) => {
  try {
    await participantService.supprimerParticipant(matricule)

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
});

ipcMain.handle('Canal-ModifierParticipant', async(_event, updatedParticipant: Participant) => {


  try {
    await participantService.modifierParticipant(updatedParticipant)
    // Notifier la fenêtre principale qu'un participant a été modifié
    if (mainWindow) {
      // Convertir en plain object pour éviter les erreurs de sérialisation
      const plainParticipant = JSON.parse(JSON.stringify(updatedParticipant))
      mainWindow.webContents.send('participant-modifier', plainParticipant)
    }
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})
