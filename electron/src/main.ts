// app: représente l'app Electron. Gère le cycle de vie de l'app: démarrage, ouverture de la fenêtre, fermeture, état (app.whenReady())
//BrowserWindow: classe qui créée la fenêtre native dans laquelle sera chargée la page Web
//naticeImage et Tray pour afficher une icône 
import {app, BrowserWindow, nativeImage, Tray} from 'electron'

//Importer le module path de Node.js. Pour manipuler les fichiers et charger les pages Web dans la fenêtre
import path from 'path'

const createWindow = () => {

    //Instanciation de la fenêtre
    const win = new BrowserWindow(
        {
            width: 800,
            height: 600,

            minHeight:500,
            minWidth:500,

            maxWidth:1200,
            maxHeight: 650,

            resizable: true, // false si on veut empêcher le redimentionnement de la fenêtre par l'utilisateur 

            transparent: false,

            frame: true, //false supprime 

            backgroundColor: "rgba(82, 82, 82, 0.69)", 

            icon: path.join(__dirname,'assets/pomme.ico'),

            webPreferences:{
                //true pour le moment, mais un peu risqué car on autorise l'accès aux API Node.js dans les page Web
                nodeIntegration: true
            }

        }
    )

    //Afficher un icône dans la zone de notification
    const iconPath = path.join(__dirname, 'assets/pommes.ico')
    const trayIcon = nativeImage.createFromPath(iconPath)
    const tray = new Tray(trayIcon)
    tray.setToolTip('Affichage avec tray')
    //Charger le fichier HTML dans la fenêtre créée
    win.loadFile(path.join(__dirname, '../index.html'))
}

//Lorsque l'environnement est prêt
app.whenReady().then(()=>{
    createWindow()
})