<template>
  <v-container>
    <v-form @submit.prevent="submitForm" ref="formRef">
      <v-text-field v-model="newEquipement.id" label="ID" type="number" required />
      <v-text-field v-model="newEquipement.marque" label="Marque" required />
      <v-text-field v-model="newEquipement.modele" label="Modèle" required />

      <v-select
        v-model="newEquipement.categorie"
        :items="['Ordinateur', 'Périphérique', 'Réseau']"
        label="Catégorie"
        required
      />

      <v-select
        v-model="newEquipement.etat"
        :items="['Neuf', 'Bon', 'Usagé']"
        label="État"
        required
      />

      <v-text-field v-model="newEquipement.emplacement" label="Emplacement" required />

      <v-switch v-model="newEquipement.estSousGarantie" label="Sous garantie" />

      <v-btn type="submit" color="primary">Ajouter</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEquipementStore } from '../stores/equipementStore'
import type { Equipement } from '../../common/equipement'

const store = useEquipementStore()
const formRef = ref()

const newEquipement = ref<Equipement>({
  id: 0,
  marque: '',
  modele: '',
  categorie: '',
  etat: '',
  emplacement: '',
  estSousGarantie: true,
})

async function submitForm() {
  try {
        
      newEquipement.value = {
        id: 0,
        marque: '',
        modele: '',
        categorie: '',
        etat: '',
        emplacement: '',
        estSousGarantie: true,
      }
      const result = await store.ajouterEquipement(newEquipement.value)
      if(result.success){
        await window.api.showMessageBox(`Equipement: (${newEquipement.value.marque}, ${newEquipement.value.modele}) ajouté avec succes !`);
        formRef.value?.reset()
      }else{
        console.error(result.error);
      }
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'équipement:', error)
  }
}
</script>

<style scoped>
</style>
