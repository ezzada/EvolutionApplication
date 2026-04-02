import mysql, { Connection } from 'mysql2/promise'

export class DatabaseService {
    private connection: Connection | null = null

    private readonly config = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gestionparticipants',
        waitForConnection: true,
        connectionLimit: 10,
        queueLimit: 0
    }

    // Définition de la méthode de connexion à la base de donnée
    async connect(): Promise<void> {
        try {
            this.connection = await mysql.createConnection(this.config)
            console.log('Connecté à la BD')
        } catch (error: any) {
            console.log('Erreur de connexion à la BD', error.message)
            throw error
        }
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.end()
            this.connection = null
            console.log('Déconnecté de la BD')
        }
    }

    // Définition de la méthode permettant d'exécuter des requêtes de sélection
    async query(sql: string, values?: any[]): Promise<any[]> {
        if (!this.connection) {
            throw new Error('Connexion à la BD non établie')
        }

        try {
            const [rows] = await this.connection.execute(sql, values)
            return rows as any[]
        } catch (error: any) {
            console.log('Erreur lors de l\'exécution de la requête:', error.message)
            throw error
        }
    }

    // Définition d'une méthode pour les requêtes CRUD (INSERT, UPDATE, DELETE)
    async execute(sql: string, values?: any[]): Promise<{affectedRows: number; insertId?: number}> {
        if (!this.connection) {
            throw new Error('Connexion à la BD non établie')
        }

        try {
            const [result] = await this.connection.execute(sql, values)
            return {
                affectedRows: (result as any).affectedRows,
                insertId: (result as any).insertId
            }
        } catch(error: any) {
            console.log('Erreur lors de l\'exécution de la requête:', error.message)
            throw error
        }
    }

    // Méthode pour vérifier si la connexion est établie
    isConnected(): boolean {
        return this.connection !== null
    }

    // Méthode pour obtenir la configuration actuelle de l'accès à la BD
    getConfig() {
        return { ...this.config }
    }
}