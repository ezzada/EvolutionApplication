import {app, BrowserWindow, ipcMain} from 'electron'
import { platform, version } from 'os';
import * as path from 'path'
import { resourceUsage } from 'process';

let mainWindow: BrowserWindow

function createWindow(){
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    })

    mainWindow.loadURL('http://localhost:5173');


}


app.whenReady().then(createWindow)

//Comunicaion entre le processus principal et le processus
ipcMain.on('message-channel', (event, arg) => {
    console.log('Message reçu: ', arg)
    event.reply('message-channel', 'Réponse du main process')
})

// Écoute de l'évenement pour l'ouverture de la nouvelle fenêtre
ipcMain.on('openFromWindow', () => {
    const formWindow = new BrowserWindow({
        width: 450, 
        height: 650,
        backgroundColor: '#d5cdcb', 
        webPreferences:{
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true, // isoler le contexte de rendu pour plus de sécurité
        }
    })

    //Charger la page "Form.vue" dans la fenêtre 
    formWindow.loadURL('http://localhost:5173/#/form')
}) 