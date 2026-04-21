import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { Participant } from '../../common/participant';

export const useParticipantStore = defineStore('participant', () => {
    // state
    const participants = ref<Participant[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const selectedParticipant = ref<Participant | null>(null);

    // getters
    
    const participantsActifs = computed(() => {
        return participants.value.filter(p => p.isActif)
    })

    const participantsParNiveau = computed(() => {
        return (niveau: string) => participants.value.filter(p => p.niveau === niveau)
    })

    const participantParMatricule = computed(() => {
        return (matricule: number) => participants.value.find(p => p.matricule === matricule)
    })

    const totalParticipants = computed(() => participants.value.length)

    // Actions
    
    // Charger tous les participants depuis le service Electron
    async function chargerParticipants() {
        isLoading.value = true
        error.value = null

        try {
        const result = await window.api.chargerParticipants()
        
        if (result.success) {
            participants.value = result.data
        } else {
            error.value = result.error || 'Erreur lors du chargement'
        }
        } catch (e: any) {
        error.value = e.message
        console.error('Erreur:', e)
        } finally {
        isLoading.value = false
        }
    }

    /*Réinitialiser l'état du store utile quand:
    - on change les données par ajout, modification et suppression et qu'on veut repartir d'un état propre
    - on veut vider les données (ex: déconnexion utilisateur), au moment du logout on vide le store et au login on chare les données
    - on veut remettre à zéro avant de recharger des données
    - Pour les tests unitaires: chaque test parte d'un store vierge
    */
    function resetState() {
        participants.value = []
        isLoading.value = false
        error.value = null
    }

        // Ajouter un nouveau participant
    async function ajouterParticipant(participant: Participant) {
        isLoading.value = true
        error.value = null

        try {
        const result = await window.api.ajouterParticipant(participant)
        
        if (result.success) {
            // NE PAS ajouter localement ici - le listener IPC s'en chargera
            // Cela évite les doublons quand on ajoute depuis la fenêtre "ajout"
            return { success: true }
        } else {
            error.value = result.error || 'Erreur lors de l\'ajout'
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
        // Écouter quand un participant est ajouté depuis une autre fenêtre
        window.api.on('participant-added', (event: any, participant: Participant) => {
            // Ajouter le participant à la liste locale sans recharger toute la liste
            // Vérifier qu'il n'existe pas déjà pour éviter les doublons
            const exists = participants.value.some(p => p.matricule === participant.matricule)
            if (!exists) {
                participants.value.push(participant)
                console.log('Participant ajouté via IPC:', participant)
            }
        })

        // Écouter quand un participant est modifié depuis la fenêtre de modification
        window.api.on('participant-modified', (event: any, updatedParticipant: Participant) => {
            // Trouver et mettre à jour le participant dans la liste locale
            const index = participants.value.findIndex(p => p.matricule === updatedParticipant.matricule)
            if (index !== -1) {
                participants.value[index] = updatedParticipant
                console.log('Participant modifié via IPC:', updatedParticipant)
            }
        })

        // Écouteeur quand un participant est supprimé
        window.api.on('participant-deleted', (event:any,matricule:number) =>{
            const index =participants.value.findIndex(p =>p.matricule === matricule)

            if(index !== -1) {
                participants.value.splice(index,1);
                console.log('Participants supprimé via IPC, matricule:', matricule)
            }
        })

    }

        // Supprimer un participant
    async function supprimerParticipant(matricule: number) {
        isLoading.value = true
        error.value = null

        try {
        const result = await window.api.supprimerParticipant(matricule)
        
        if (result.success) {
            // Supprimer localement
            const index = participants.value.findIndex(p => p.matricule === matricule)
            if (index !== -1) {
            participants.value.splice(index, 1)
            }
            return { success: true }
        } else {
            error.value = result.error || 'Erreur lors de la suppression'
            return { success: false, error: error.value }
        }
        } catch (e: any) {
        error.value = e.message
        return { success: false, error: e.message }
        } finally {
        isLoading.value = false
        }
    }

        // Définir le participant sélectionné
    function selectParticipant(participant: Participant) {
        selectedParticipant.value = { ...participant }
    }

    // Réinitialiser le participant sélectionné
    function clearSelectedParticipant() {
        selectedParticipant.value = null
    }



    // Return (exposition publique)
    // Exposer les éléments du store aux composants Vue qui l'utilisent pour accéder aux états, getters et actions
    return {
        // State
        participants,
        isLoading,
        error,
        selectedParticipant,

        // Getters
        participantsActifs,
        participantsParNiveau,
        participantParMatricule,
        totalParticipants,
        // Actions
        chargerParticipants,
        
        ajouterParticipant,
        setupIpcListeners,

        supprimerParticipant,

        resetState,

        selectParticipant,
        clearSelectedParticipant,

    }

});
