import mysql, {Connection} from 'mysql2/promise'

export class DatabaseService {
    private connection: Connection | null = null;
    private readonly config = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gestionparticipants',
        waitForFonnections: true,
        connectionLimit:10,
        queueLimit:0
    }

    // Définition de la méthode permettant d'établir la connection à la BD
    async Connect(): Promise<void> {
        try{
            this.connection = await mysql.createConnection(this.config);

            console.log('Connecté à la BD MySQL');


        }catch(error: any) {
            console.log('Erreur de conneciton à la base de données', error.message);
            throw error;
        }
    }

    // Définition de la méthode de déconnexion de la BD
    async disconnect(): Promise<void> {
        if(this.connection){
            await this.connection.end();
            this.connection = null;
            console.log('Déconnecté de la BD');

        }
    }

    // Définition de la méthode  permettant d'éxécuter des rquêtes de sélection
    async query(sql: string, values?: any[]): Promise<any[]> {
        if(!this.connection){
            throw new Error('Connexion `la base de données non établie');
        }

        try{
            const[rows] = await this.connection.execute(sql, values);
            return rows as any[];
        }catch(error:any)
        {
            console.error('erreur lors de la éxécution de la requête:', error.message);
            throw error;
        }
    }


    // Défoiniotn d'une requêtes CRUD (requêtes: INSERT, UPDATE,DELETE)
    async execute(sql: string, values?: any[]): Promise<{affectedRows: number; insertId?: number}> {
        if(!this.connection){
            throw new Error('');
        }

        try {
            const [result] = await this.connection.execute(sql, values);
            return {
                affectedRows: (result as any).affectedRows,
                insertId: (result as any).insertId
            }
        }catch(error:any)
        {
            console.log('erreur lors de léxécution de la requête:', error.message)
            throw error;
        }
    }


    // Méthode pour vérifier si a connexion est établie
    isConnected(): boolean{
        return this.connection !== null;
    }

    // Méthode pour obtenir la configguration actuelle de l'accès à la BD
    getConfig(){
        return {...this.config};
    }
}