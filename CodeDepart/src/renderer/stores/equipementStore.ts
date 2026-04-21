import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { Equipement } from '../../common/equipement';

export const useEquipementStore = defineStore('equipement', () => {
    // state
    const equipements = ref<Equipement[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const selectedEquipement = ref<Equipement | null>(null);

    // getters
    const equipementsSousGarantie = computed(() => {
        return equipements.value.filter(p => p.estSousGarantie)
    })

    const equipementsParEtat = computed(() => {
        return (etat: string) => equipements.value.filter(p => p.etat === etat)
    })

    const equipementParId = computed(() => {
        return (id: number) => equipements.value.find(p => p.id === id)
    })

    const totalEquipements = computed(() => equipements.value.length)

    // Actions

    //Charger les equipements depuis le service Electron
    async function chargerEquipements() {
        isLoading.value = true
        error.value = null

        try {
            const result = await window.api.chargerEquipements()
            if (result.response.success) {
                equipements.value = result.data
            } else {
                error.value = result.response.error || 'Erreur lors du chargement'
            }
        } catch (e: any) {
            error.value = e.message
            console.error('Erreur:', e)
        } finally {
            isLoading.value = false
        }
    }

    // Ajouter un nouvel equipement
    async function ajouterEquipement(equipement: Equipement) {

        isLoading.value = true
        error.value = null

        try {
            const plainEquipement = JSON.parse(JSON.stringify(equipement))
            const result = await window.api.ajouterEquipement(plainEquipement)

            if (result.response.success) {
                return { success: true }
            } else {
                error.value = result.response.error || 'Erreur lors de l\'ajout'
                return { success: false, error: error.value }
            }
        } catch (e: any) {
            error.value = e.message
            return { success: false, error: e.message }
        } finally {
            isLoading.value = false
        }
    }

    // Écouter les notifications IPC pour les changements (depuis d'autres fenêtres)
    function setupIpcListeners() {
        window.api.on('equipement-added', (event: any, equipement: Equipement) => {
            const exists = equipements.value.some(e => e.id === equipement.id)

            if (!exists) {
                equipements.value.push(equipement)
                console.log('Equipement ajouté via IPC: ', equipement)
            }
        })

    }

    // Supprimer un equipement
    async function supprimerEquipement(id: number) {
       isLoading.value = true
        error.value = null

        try {
            const result = await window.api.supprimerEquipement(id)

            if(result.success) {
                // Supprimer localement
                const index = equipements.value.findIndex(e => e.id === id)

                if(index!== -1)
                {
                    equipements.value.splice(index, 1)
                    return { success: true }
                }                
            } else {
                error.value = result.error || 'Erreur lors de la suppression'
                return { success: false, error: error.value }
            }
        }catch(e:any)
        {
            error.value = e.message
            return { success: false, error: e.message }
        } finally {
            isLoading.value = false
        } 
    }

    function resetState() {
        equipements.value = []
        isLoading.value = false
        error.value = null
    }

    // Définir l'equipement sélectionné
    function selectEquipement(equipement: Equipement) {
        selectedEquipement.value = { ...equipement }
    }

    // Réinitialiser l'equipement sélectionné
    function clearSelectedEquipement() {
        selectedEquipement.value = null
    }

    // Return (exposition publique)
    return {
        // State
        equipements,
        isLoading,
        error,
        selectedEquipement,
        // Getters
        equipementsSousGarantie,
        equipementsParEtat,
        equipementParId,
        totalEquipements,
        // Actions
        chargerEquipements,
        ajouterEquipement,
        setupIpcListeners,
        supprimerEquipement,
        selectEquipement,
        clearSelectedEquipement,
        resetState
    }
});
