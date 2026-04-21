import { Equipement } from "../common/equipement"



interface ElectronAPI {
    send: (channel: string, data: any) => void

    on: (channel: string, callback: (event: any, data: any) => void) => void

    once: (channel: string, callback: (event: any, data: any) => void) => void

    showMessageBox: (options: any) => Promise<any>

    supprimerEquipement: (id: number) => Promise<ApiResponse>

    ouvrirAjouterEquipement: () => void

    ajouterEquipement: (equipement: Equipement) => Promise<{response : ApiResponse, data : Equipement}>

    chargerEquipements: () => Promise<{response: ApiResponse, data : Equipement[]}>

    supprimerEquipement: () => Promise<ApiResponse>

}

declare global {

    interface ApiResponse {
        success: boolean
        error?: string
    }
    interface Window {
        api: ElectronAPI
    }
}

export { }