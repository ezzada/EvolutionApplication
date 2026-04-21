import { Participant } from "../../common/participant";
import { ipcMain } from "electron";
import { DatabaseService } from "./databaseService";
import { error } from "console";

export class ParticipantService {

  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();

  }

  // Méthode pour initialiser la base de données 
  async initialise(): Promise<void> {
    await this.db.Connect();
  }

  // Récupérer tous les participants
  public async chargerParticipants(): Promise<Participant[]> {
    try {
      const query = 'SELECT * FROM participant';
      const rows = await this.db.query(query);


      return rows.map((rows: any) => new Participant({
        matricule: rows.Matricule,
        prenom: rows.Prenom,
        nom: rows.Nom,
        genre: rows.Genre,
        niveau: rows.Niveau,
        email: rows.Email,
        isActif: rows.IsActif === 1 ? true : false


      }));
    } catch (error: any) {
      console.log('Erreur lors du chargment des paticipants: ', error.message);
      throw error;
    }
  }


  // Enregistrer les canaux IPC dans le processus principal (main) pour permettre 
  // au renderer (Vue.js + Pinia) de communiquer avec le main (Electron + service + accès fichier + DB) 
  public registerIpcHandlers(): void {
    ipcMain.handle('Canal-ChargerParticipants', async () => {
      return await this.chargerParticipants()
    })
  }

  // Ajout un participant
  public async ajouterParticipant(participant: Participant): Promise<void> {
    try {
      const query = `INSERT INTO participant (Matricule, Prenom, Nom, Genre, Niveau, Email, IsActif)
      VALUES (?,?,?,?,?,?,?)`
      const values = [
        participant.matricule,
        participant.prenom,
        participant.nom,
        participant.genre,
        participant.niveau,
        participant.email,
        participant.isActif ? 1 : 0
      ];

      await this.db.execute(query, values);
    } catch (error: any) {
      console.log('Erreur lors de l\'ajout d\'un paticipants: ', error.message);
      throw error;
    }
  }


  // Supprimer un participant
  public async supprimerParticipant(matricule: number): Promise<void> {

    try {
      const query = 'DELETE FROM participant WHERE Matricule = ?';
      const result = await this.db.execute(query, [matricule]);

      if (result.affectedRows == 0) {
        throw new Error(`Participant avec le matricule ${matricule} introuvable`);
      }

    } catch (error: any) {
      console.log('Erreur lors de l\'a supression d\'un paticipants: ', error.message);
      throw error;
    }

  }


  // Modifier un participant existant
  public async modifierParticipant(updated: Partial<Participant>): Promise<void> {

    try {
      if (!updated.matricule) {
        throw new Error('Le matricule est requis pour modifier un participant');
      }
      const query = `UPDATE participant
                        SET Prenom = ?, Nom = ?, Genre = ?, Niveau = ?, Email = ?, IsActif = ?
                        WHERE Matricule = ?`;
      const values = [
        updated.prenom,
        updated.nom,
        updated.genre,
        updated.niveau,
        updated.email,
        updated.isActif ? 1 : 0,
        updated.matricule,
      ];

      const result = await this.db.execute(query, values);

      if (result.affectedRows == 0) {
        throw new Error(`Participant avec matricule ${updated.matricule} introubale`);
      }
    } catch (error: any) {
      console.log('Erreur lors de l\'a modification du paticipants: ', error.message);
      throw error;
    }

  }

  // Définiion de la méthode qui ferme la connexion `la base de données
  public async close(): Promise<void> {
    await this.db.disconnect();
  }

}
