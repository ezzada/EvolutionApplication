import { Console } from "console";
import { Participant } from "../../common/participant";
import { ipcMain, app } from "electron"
import { promises as fs } from 'fs';
import path from 'path';
import { json } from "stream/consumers";

export class ParticipantService {
    private participantsFilePath: string;

    constructor() {
        const dataDir = path.join(app.getAppPath(), 'data');
        this.participantsFilePath = path.join(dataDir, 'participants.json');
    }

    // Méthode privée pour lire le fichier JSON
    private async lireParticipants(): Promise<Participant[]> {
        try {
            const data = await fs.readFile(this.participantsFilePath, 'utf-8');
            const participants = JSON.parse(data);

            return participants.map((p: any) => new Participant(p));
        }catch(error: any){
            if(error.code === 'ENOENT') {
                console.warn(`Fichier ${this.participantsFilePath} introuvable, retour d'un tableau vide`);
                return [];
            }
            throw error;
        }
    }

    // Méthode pour charger les participants
    public async chargerParticipants(): Promise<Participant[]> {
        return await this.lireParticipants();
    }

    public registerIpcHandlers(): void {
        ipcMain.handle('Canal-ChargerParticipants', async () => {
            return await this.chargerParticipants()
        })
    }

    // Ajouter un nouveau participant
    public async ajouterParticipant(participant: Participant): Promise<void> {
        const participants = await this.lireParticipants();

        participants.push(participant);

        await this.ecrireParticipants(participants);
    }

    private async ecrireParticipants(participants: Participant[]) : Promise<void>{
        const jsonData = JSON.stringify(participants, null, 2);
        await fs.writeFile(this.participantsFilePath, jsonData, 'utf-8');
    }

    // Supprimer un participant sélectionné dans le v-data-table
    public async supprimerParticipant(matricule:number): Promise<void> {

        const participants = await this.lireParticipants();
        const index = participants.findIndex(p=> p.matricule === matricule)

        if(index!==-1)
        {
            participants.splice(index, 1); // Suuprimer un élément du tableau à partir de index
            await this.ecrireParticipants(participants);
        } else {
            throw new Error(`Participant avec matricule ${matricule} introuvable`);
        }
    }
}