import { Participant } from '../../../src/common/participant';
import { ipcMain } from "electron";
import { DatabaseService } from './databaseService';

export class ParticipantService {
    private db: DatabaseService;

    constructor() {
        this.db = new DatabaseService();
    }

    // Méthode pour initialiser la connexion à la BD
    async initialize(): Promise<void> {
        await this.db.connect()
    }

    // Méthode pour charger les participants 
    public async chargerParticipants(): Promise<Participant[]> {
        try {
            const query = 'SELECT * FROM participant'
            const rows = await this.db.query(query)
            console.log(rows)
            return rows.map((row: any) => new Participant({
                matricule: row.Matricule,
                prenom: row.Prenom,
                nom: row.Nom,
                genre: row.Genre,
                niveau: row.Niveau,
                email: row.Email,
                isActif: row.IsActif === 1 ? true : false
            }))
        } catch (error: any) {
            console.log('Erreur lors du chargement des participants', error.message)
            throw error
        }
    }

    public registerIpcHandlers(): void {
        ipcMain.handle('Canal-ChargerParticipants', async () => {
            return await this.chargerParticipants();
        })
    }

    // Ajouter un nouveau participant
    public async ajouterParticipant(participant: Participant): Promise<void> {
        try {
            const query = `INSERT INTO participant (Matricule, Prenom, Nom, Genre, Niveau, Email, isActif'
            VALUES (?, ?, ?, ?, ?, ?)`
            const values = [
                participant.matricule,
                participant.prenom,
                participant.nom,
                participant.genre,
                participant.email,
                participant.isActif ? 1 : 0
            ]

            await this.db.execute(query, values)
        } catch (error: any) {
            console.log('Erreur lors de l\'ajout du participant', error.message)
            throw error
        }
    }

    // Supprimer un participant sélectionné dans le v-data-table
    public async supprimerParticipant(matricule: number): Promise<void> {
        try {
            const query = 'DELETE FROM participant WHERE Matricule = ?'
            const result = await this.db.execute(query, [matricule])

            if (result.affectedRows === 0) {
                throw new Error(`Participant avec le matricule ${matricule} introuvable`)
            }
        } catch(error: any) {
            console.error('Erreur lors de la suppression du participant: ', error.message)
            throw error
        }
    }

    public async modifierParticipant(updated: Partial<Participant>): Promise<void> {

        try {
            if (!updated.matricule) {
                throw new Error('Le matricule est nécessaire pour modifier un participant')
            }

            const query = `
            UPDATE participant 
            SET Prenom = ?, Nom = ?, Genre = ?, Niveau = ?, Email = ?, isActif = ?
            WHERE Matricule = ?`

            const values = [
                updated.prenom,
                updated.nom,
                updated.genre,
                updated.niveau,
                updated.email,
                updated.isActif ? 1 : 0,
                updated.matricule
            ]

            const result = await this.db.execute(query, values)

            if (result.affectedRows === 0) {
                throw new Error(`Participant avec matricule ${updated.matricule} introuvable`)
            }
        } catch (error: any) {
            console.log('Erreur lors de la modification du participant: ', error.message)
            throw error
        }
    }

    // Définition de la méthode pour déconnecter de la base de données
    public async close(): Promise<void> {
        await this.db.disconnect()
    }
}



