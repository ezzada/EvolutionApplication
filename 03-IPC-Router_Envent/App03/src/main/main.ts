import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadURL('http://localhost:5173'); // URL de l'application Vue.js
}


app.whenReady().then(createWindow);

// Communication entre le processus principal et le processus de rendu
ipcMain.on('message-channel', (event, arg) => {
    console.log('Message reçu du processus de rendu: ', arg);
    event.reply('message-channel-reply', 'Réponse du processus principal');
});

ipcMain.on('open-form-window', () => {
    const formWindow = new BrowserWindow({
        width: 400,
        height: 300,
        backgroundColor: '#d5d5d5',
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true, // isoler le contexte pour des raisons de sécurité
        },
    });

    // Charger "Form.vue" dans la nouvelle fenêtre
    formWindow.loadURL('http://localhost:5173/#/form'); // URL de la route vers Form.vue
});


// Afficher la boite de message contennat les données saisies dans le formulaire
ipcMain.on('show-dialog', (event, formDataString) => {
    const formData = JSON.parse(formDataString); // Convertir la chaîne JSON en objet

    const message = `
    Données du formulaire:\n\n
    Nom: ${formData.nom}\n
    Prénom: ${formData.prenom}\n
    Date de naissance: ${formData.dateNaissance}\n
    Email: ${formData.email}\n
    Région: ${formData.region}\n
    Statut professionnel: ${formData.statutProfessionnel.join(', ')}\n
    État matrimonial: ${formData.etatMatrimonial}\n
    Langages choisis: ${formData.langagesChoisis.join(', ')}
    `;
    
    dialog.showMessageBox({
        type: 'info',
        title: 'Formulaire validé',
        message: 'Données du formulaire',
        detail: message,
        buttons: ['OK']
    });
});

// b-
ipcMain.on('focus-nom', (event)=>{
    event.sender.send('focus-nom')
})