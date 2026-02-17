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
}
app.whenReady().then(createWindow);
//Comunicaion entre le processus principal et le processus
ipcMain.on('message-channel', (event, arg) => {
    console.log('Message reçu: ', arg);
    event.reply('message-channel', 'Réponse du main process');
});
