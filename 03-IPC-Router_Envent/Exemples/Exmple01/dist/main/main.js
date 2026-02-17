import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });
    mainWindow.loadURL('http://localhost:5173');
    // fonction pour configuer les communications IPC
    setupIPC();
}
function setupIPC() {
    // Exemple a. Communication IPC Synchrone
    // Définition d'un gestionnaire IPC nommé get-app-info
    ipcMain.on('get-app-info', (event) => {
        event.returnValue = {
            name: app.getName(),
            version: app.getVersion(),
            platform: process.platform,
        };
    });
    // Exemple b. Communication IPC asynchrone
    // Le main process se met à l'écoute (on) de l'événement  "perform-task"
    ipcMain.on('perform-task', (event, data) => {
        console.log('Tâche reçue: ', data);
        // Une fois le traitement terminé, le main process envoi une réponse via un nouvel événement "task-result"
        mainWindow.webContents.send('task-result', { success: true, result: 'Tâche accomplie par la main process' });
    });
    // Exemple c. Communication IPC bidirectionel
    // Déclaration d'un gestionnaire IPC qui écoute les requêtes nommées "calculate"
    // Event: pas besoin d'event, donc _ 
    // args: la déstructuration {}
    ipcMain.handle('calculate', (_, { a, b }) => a + b);
}
app.whenReady().then(createWindow);
