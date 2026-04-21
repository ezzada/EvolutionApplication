import { Equipement } from "../../common/equipement";
import { ipcMain, app } from "electron";
import { promises as fs } from 'fs';
import path from 'path';

export class EquipementService {

    private cheminFichierEquipements: string;

    constructor() {
        // Calculer le chemin vers le fichier equipements.json
        // En développement: depuis le répertoire racine du projet
        // En production: depuis le répertoire userData d'Electron
        const dataDir = path.join(app.getAppPath(), 'data');
        this.cheminFichierEquipements = path.join(dataDir, 'equipements.json');
    }

        // Méthode privée pour lire le fichier JSON
    private async lireEquipements(): Promise<Equipement[]> {

        try {
            const data = await fs.readFile(this.cheminFichierEquipements, 'utf-8');
            const equipements = JSON.parse(data);
            return equipements.map((f: any) => new Equipement(f));
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.warn(`Fichier ${this.cheminFichierEquipements} introuvable`);
                return [];
            }
            throw error;
        }
    }

    // Méthode privée pour écrire dans le fichier JSON
    private async ecrireEquipements(equipements: Equipement[]): Promise<void> {
        const jsonData = JSON.stringify(equipements, null, 2);
        await fs.writeFile(this.cheminFichierEquipements, jsonData, 'utf-8');
    }

    // Récupérer tous les equipements
    public async chargerEquipements(): Promise<Equipement[]> {
        try {
            const equipements = await this.lireEquipements();
            return equipements;
        } catch (error: any) {
            return [];
        }
    }

    // Ajouter un equipement
    public async ajouterEquipement(equipement: Equipement): Promise<void> {
        const equipements = await this.lireEquipements();

        equipements.push(equipement);

        await this.ecrireEquipements(equipements);
    }

    // Supprimer un equipement
    public async supprimerEquipement(id: number): Promise<void> {
        const equipements = await this.lireEquipements();
        const index = equipements.findIndex(e => e.id === id)

        if (index !== -1) {
            equipements.splice(index, 1); // Suuprimer un élément du tableau à partir de index
            await this.ecrireEquipements(equipements);
        } else {
            throw new Error(`Equipement avec id ${id} introuvable`);
        }
    }

    // Enregistrer les canaux IPC dans le processus principal (main) pour permettre 
    // au renderer (Vue.js + Pinia) de communiquer avec le main (Electron + service + accès fichier + DB) 
    public registerIpcHandlers(): void {
        ipcMain.handle('Canal-ChargerEquipements', async () => {
            return await this.chargerEquipements();
        });
    }
}
