import {describe, it, expect, beforeEach} from 'vitest'
import {Participant, Genre, Niveau} from '../src/common/participant'

// Test de la classe Participant
describe('Participant', () => {

    // test du constructeur de Participant
    describe('Constructeur', () => {
        it('devrait créer un participant avec toutes les propriétés valides', () => {
            // Arrange (Préparer)
            const data = {
                matricule: 12345,
                prenom: 'Marie',
                nom: 'Tremblay',
                genre: 'F' as Genre,
                niveau: 'Intermédiaire' as Niveau,
                email: 'marie.tremblay@example.com',
                isActif: true
            }

            // Act (Agir)
            const participant = new Participant(data)

            // Assert (Vérifier)
            expect(participant.matricule).toBe(12345)
            expect(participant.prenom).toBe('Marie')
            expect(participant.nom).toBe('Tremblay')
            expect(participant.genre).toBe('F')
            expect(participant.niveau).toBe('Intermédiaire')
            expect(participant.email).toBe('marie.tremblay@example.com')
            expect(participant.isActif).toBe(true)
        })
    })

    describe('Validation du genre', ()=>{
        it('devrait accepter un genre masculin valide', ()=>{
            const participant = new Participant({genre: 'M' as Genre})

            expect(participant.genre).toBe('M')
        })
    })

    describe('Validation du niveau', ()=>{
        it('devrait accepter un le niveau débutant', ()=>{
            const participant = new Participant({niveau: 'Débutant' as Niveau})

            expect(participant.niveau).toBe('Débutant')
        })
    })


    describe('Validation de la propriété isActif avec la valeur par défaut', ()=>{
        it('devrait être true par défaut', ()=>{
            const participant = new Participant()

            expect(participant.isActif).toBe(true)
        })
    })



})