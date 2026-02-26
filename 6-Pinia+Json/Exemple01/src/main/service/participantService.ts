import { promises } from 'dns';
import { Participant } from '../../common/paticipant'
import { ipcMain, app } from 'electron';
import {promises as fs} from 'fs'
import path from 'path';
import { Console } from 'console';
import { ThemeSymbol } from 'vuetify/lib/composables/theme';


export class ParticipantService {
    private participantsFilePath: string;

    constructor(){
        const dataDir = path.join(app.getPath(), 'data')

        this.participantsFilePath = path.join(dataDir, 'participant.json')
    }

    //Méthode privée pour lire le fichier JSON
    private async lireParticipants(): Promise<Participant[]>{
        try{
            const data = await fs.readFile(this.participantsFilePath, 'utf-8')
            const participant = JSON.parse(data);

            return participant.map((p : any) => new Participant(p))
        } catch (error: any) {
            if(error.code == 'ENOENT'){
                console.warn(`Fichier ${this.participantsFilePath} introuvable`)
                
            }
            throw error
        }
    }

    //Méthode pour charger les donnée
    public async chargerParticipants(): Promise<Participant[]> {
        return await this.lireParticipants()
    }

    public registerIpcHandler(): void {
        ipcMain.handle('Canal-ChargerParticipants', async () =>{
            return await this.chargerParticipants()
        })
    }
}