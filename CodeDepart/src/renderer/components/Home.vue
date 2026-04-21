<template>
  <v-app>

    <!-- Barre de navigation supérieure -->
    <v-app-bar app color="primary" dark elevation="10">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Gestion d'Inventaire de Matériel Informatique</v-toolbar-title>
    </v-app-bar>
    <!-- Menu latéral -->
    <v-navigation-drawer app v-model="drawer" temporary width="200" color="green lighten-4" elevation="10">
      <!-- Contenu du menu vertical -->
       <v-list>
         <v-list-item title="Ajouter" prepend-icon="mdi-plus" @click="ouvrirAjouterEquipement"></v-list-item>
         <v-list-item title="Supprimer" prepend-icon="mdi-delete" @click="supprimerEquipement"></v-list-item>

       </v-list>
    </v-navigation-drawer> 

    <v-main>
      <v-container>
        <v-tabs
          v-model="tab"
          color="indigo-darken-1"
          bg-color="indigo-darken-4"
          align-tabs="center"
          grow
        >
          <v-tab value="table">
            Gestion équipements
          </v-tab>
          <v-tab value="stats">
            Stats équipements
          </v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="table">
            <v-data-table :headers="headers" :items="equipements" item-value="id" class="striped-table"  @click:row="(event: MouseEvent, row: {item: Equipement}) => handleRowClick(row.item)">            
            </v-data-table>
          </v-window-item>

          <v-window-item value="stats" style="background-color: #F2EBB6; color: black;">
            <StatsEquipements v-if="tab === 'stats'" />
          </v-window-item>
        </v-window>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">

// importer la fonction ref pour créer une référence réactive
import { ref, onMounted, computed } from 'vue'
import { useEquipementStore } from '../stores/equipementStore'
import { storeToRefs } from 'pinia';
import StatsEquipements from './StatsEquipements.vue';
import { Equipement } from '@/common/equipement';



const tab = ref('table');
// Pour contenir les informations du participant à supprimer
const selectedEquipement = ref<Equipement | null>(null);
const store = useEquipementStore()

// Définir les en-têtes de la table des equipements
const headers = ref([
  { title: 'ID', value: 'id' },
  { title: 'Marque', value: 'marque' },
  { title: 'Modèle', value: 'modele' },
  { title: 'Catégorie', value: 'categorie' },
  { title: 'État', value: 'etat' }
])
const drawer = ref(false);
const { equipements } = storeToRefs(store);

onMounted(async () => {

  // Charger les équipements
  // à implémenter

  const store = useEquipementStore()
  store.chargerEquipements()
});

function handleRowClick(item: Equipement){

  selectedEquipement.value = item;
  store.selectEquipement(item)
}

async function supprimerEquipement() {
    const equipement = selectedEquipement.value

  if(equipement && equipement.id) {

    const result = await store.supprimerEquipement(equipement.id);

    if(result?.success) {
      await window.api.showMessageBox({
        type:"info",
        title: "Suppression",
        message: `Equipement ${equipement.marque} supprimé avec succès.`,
      });      
    } else {
      await window.api.showMessageBox({
        type: "error",
        title: "Erreur de suppression",
        message: `Erreur lors de la suppression du equipement: ${result?.error}`,
      });
    }
  } else {
    await window.api.showMessageBox({
        type: "warning",
        title: "Aucun equipement sélectionné",
        message: `Veuillez cliquer sur la ligne du equipement à supprimer`,
      });
  }
}
async function ouvrirAjouterEquipement() {
     await window.api.ouvrirAjouterEquipement();
}

</script>

<style scoped>
/* :deep permet de cibler les éléments enfants dans les composants Vuetify */
/* .v-field--disabled est la classe appliquée aux champs désactivés dans Vuetify */
.disabled-black :deep(.v-field--disabled) {
  color: white; 
  opacity: 1;
}

.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: #2989A6;
  color: white;
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #69A818;
  color: white;
} 

</style>