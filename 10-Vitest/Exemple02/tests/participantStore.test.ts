import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { Participant, Genre, Niveau } from '../src/common/participant'
import { useParticipantStore } from '../src/renderer/stores/participantStore'

declare global {
    interface Window {
        api: any
    }
}

describe('participantStore', () => {

    // Données de test partagées 
    let participants: Participant[]

    beforeEach(() => {


        // Initialisation d'un instance de Pinia avant chaque test pour repartir d'un état propre
        setActivePinia(createPinia())


        // Créer un jeu de données de test avant chaque test
        participants = [
            new Participant({
                matricule: 1,
                prenom: 'Alice',
                nom: 'Tremblay',
                genre: 'F' as Genre,
                niveau: 'Débutant' as Niveau,
                email: 'alice@example.com',
                isActif: true
            }),
            new Participant({
                matricule: 2,
                prenom: 'Bob',
                nom: 'Gagnon',
                genre: 'M' as Genre,
                niveau: 'Intermédiaire' as Niveau,
                email: 'bob@example.com',
                isActif: true
            }),
            new Participant({
                matricule: 3,
                prenom: 'Charlie',
                nom: 'Dubois',
                genre: 'M' as Genre,
                niveau: 'Professionnel' as Niveau,
                email: 'charlie@example.com',
                isActif: false
            }),
            new Participant({
                matricule: 4,
                prenom: 'Diana',
                nom: 'Leblanc',
                genre: 'F' as Genre,
                niveau: 'Débutant' as Niveau,
                email: 'diana@example.com',
                isActif: true
            })
        ]

        // Créer un Mock global de window.api avant chaque test
        global.window = global.window || {} as any

        (global.window as any).api = {
            sen: vi.fn(),
            on: vi.fn(),

            once: vi.fn(),
            ajouterParticipant: vi.fn(),
            chargerParticipant: vi.fn(),
            modifierParticipant: vi.fn(),
            showMessageBox: vi.fn()
        }
    })

    // Testet le fonctionnement d'un getter
    describe("participantsActifs", () => {
        it("Devrait retourner seulement les participants actifs", () => {
            const store = useParticipantStore();

            store.participants = participants

            // Appel au getter
            const actifs = store.participantsActifs;

            // Assertitions 
            expect(actifs).toHaveLength(3) // dans le jeu test créé dans beforeEach, nous avons 3 participants
            expect(actifs.every(p => p.isActif)).toBe(true)

            // On test que les participants avec le matricule 3 est inactif ( retourne Undefined)
            expect(actifs.find(p => p.matricule == 3)).toBeUndefined()

            // On vérifier que les matricules des participants actifs sont bien 1,2 et 4
            expect(actifs.map(p => p.matricule)).toEqual([1, 2, 4])
        })
    })

    // Avec Mock: Tester l'ajout d'un participant en utilisant la simulation de l'API avec un Mock de Vitest
    it("Ajouter participant", async () => {
        // Créer un participant de test
        const participant = new Participant({
            matricule: 3,
            prenom: 'jean',
            nom: 'Dupont',
            genre: 'M',
            niveau: 'Professionnel',
            email: 'JD@example.com',
            isActif: false
        });

        // Configurer le mock pour retourner un succès
        (window.api.ajouterParticipant as any).mockResolvedValue({
            success: true
        })

        await useParticipantStore().ajouterParticipant(participant);

        //Vérifier que le mock a été appelé avec le bon particpant 
        expect(window.api.ajouterParticipant).toHaveBeenCalledWith(participant);
        // ... appel de la méthode ajouterPart
        // 
    })

    // Tester le fonctionnement de supprimerParticipant dans le store Pinia 
    // Test avec un Mock (bouchon)

    describe('suppression de participant', () => {
        it.skip('devrait appeler l\'API avec le bon ID et vérifier que le mock a été appelé', async () => {

            // Arranger (Préparer)
            const store = useParticipantStore();
            const matriculeASupprimer = 2; // Participant avec matricule 2 dans le jeu de tests créé

            // Configurer le mock pour retourner un succès
            (window.api.supprimerParticipant as any).mockResolvedValue({
                success: true,
                message: 'Participant supprimé avec succès'
            })

            // Act (Agir)

            const result = await store.supprimerParticipant(matriculeASupprimer);

            expect(result).toEqual({ success: true });


            //Vérifier que le mock a été appelé une seule fois
            expect(window.api.supprimerParticipant).toHaveBeenCalledTimes(1);


            //Vérifier que le mock a été appelé avec le bon matricule
            expect(window.api.supprimerParticipant).toHaveBeenCalledWith(matriculeASupprimer);

        })

        it.skip('devrait gérer les erreurs lors de la suppression avec mock', async () => {
            // Arrange (Préparation)
            const store = useParticipantStore();
            const matriculeASupprimer = 999; // Participant inexistant

            // Configurer le mock pour retourner une erreur
            (window.api.supprimerParticipant as any).mockResolvedValue({
                success: false,
                error: 'Participant non trouvé'
            })

            // Act (Agir)
            const result = await store.supprimerParticipant(matriculeASupprimer)

            // Assert (Vérification)
            // Vérifier que le résultat indique une erreur (le store retourne { success: false, error: '...'})

            expect(result).toEqual({
                success: false,
                error: 'Participant non trouvé'
            })

            // Vérifier que le mock a bien été appelé
            expect(window.api.supprimerParticipant).toHaveBeenCalledExactlyOnceWith(matriculeASupprimer)

        })

    })

})