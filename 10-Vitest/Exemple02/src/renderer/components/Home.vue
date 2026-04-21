<template>
  <v-app>

    <!-- Barre de navigation supérieure -->
    <v-app-bar app color="primary" dark elevation="10">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Gestion des participants</v-toolbar-title>
    </v-app-bar>

    <!-- Menu latéral -->
    <v-navigation-drawer app v-model="drawer" temporary width="200" color="green lighten-4" elevation="10">
      <!-- Contenu du menu vertical -->
      <v-list>
        <v-list-item title="Ajouter" prepend-icon="mdi-plus" @click="ouvrirAjouterParticipant"
          :disabled="tab !== 'table'"></v-list-item>
        <v-list-item title="Supprimer" prepend-icon="mdi-delete" @click="supprimerParticipant"
          :disabled="tab !== 'table'"></v-list-item>
        <v-list-item title="Modifier" prepend-icon="mdi-pencil" @click="ouvrirModifierParticipant"
          :disabled="tab !== 'table'"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>

        <v-tabs v-model="tab" background-color="primary" dark grow>
          <v-tab value="table">Gestion participants</v-tab>
          <v-tab value="stats">Stats participants</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="table">
            <v-data-table :items="participants" :headers="headers" class="ligne-alternance" show-expand
              item-value="matricule" @click:row="(event: MouseEventInit, row: { item: Participant }) =>
                handleRowClick(row.item)">

              <!-- Slot pour la colonne niveau -->
              <template v-slot:item.niveau="{ item }">
                <v-select v-model="item.niveau" :items="['Débutant', 'Intermédiaire', 'Professionnel']"
                  density="compact" variant="outlined" hide-details disabled class="disabled-black"></v-select>
              </template>

              <!-- Slot pour le contenu caché -->
              <template v-slot:expanded-row="{ item }">
                <td :colspan="headers.length">
                  <div>
                    <strong>Email :</strong> {{ item.email }} <br>
                    <strong>Actif :</strong>

                    <img :src="item.isActif ? '../components/images/active.png' : '../components/images/inactive.png'"
                      :alt="item.isActif ? 'Actif' : 'Inactif'" width="30" height="30" />
                  </div>
                </td>
              </template>


            </v-data-table>
          </v-window-item>

          <v-window-item value="stats">
            <Stats-participants v-if="tab === 'stats'"></Stats-participants>
          </v-window-item>

        </v-window>





      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">

// importer la fonction ref pour créer une référence réactive
import { ref, onMounted, computed } from 'vue'
import { useParticipantStore } from '../stores/participantStore'
import StatsParticipants from './StatsParticipants.vue';

const store = useParticipantStore()

// initiliser une variable réactive pour contrôler l'ouverture ou la fermeture du menu latéral
const drawer = ref(true);

const tab = ref('table');

// Définir les en-têtes de la table des participants
const headers = ref([
  { title: 'Matricule', value: 'matricule' },
  { title: 'Nom', value: 'nom' },
  { title: 'Prénom', value: 'prenom' },
  { title: 'Genre', value: 'genre' },
  { title: 'Niveau', value: 'niveau' },
  // { title: 'Email', value: 'email' },
  // { title: 'Actif', value: 'isActif' }
]);

// on met "type" ici pour pour qu'il y ait pas de code JavaScript généré pour l'importation de Participant, car c'est juste une interface pour le typage
import type { Participant } from '../../common/participant'

// Utiliser les participants du store (reactif)
const participants = computed(() => store.participants);

// async ... await pour attendre que chargerParticipants soit terminé avant de continuer
onMounted(async () => {
  // Charger les participants depuis le service au montage du composant
  await store.chargerParticipants();

  // Configurer les écouteurs IPC pour les changements
  store.setupIpcListeners();

});

const selectedParticipant = ref<Participant | null>(null);

function handleRowClick(item: Participant) {
  console.log('Ligne sélectionnée: Nom:', item.nom, ", Prénom:", item.prenom, ", Matricule:", item.matricule, ", Genre:", item.genre, ", Niveau:", item.niveau, ", Email:", item.email, ", Actif:", item.isActif);
  selectedParticipant.value = item;
  // Stocker aussi dans le store pour que ModifierParticipant puisse y accéder
  store.selectParticipant(item);

}

function ouvrirAjouterParticipant() {
  window.api.send('ajouter-participant', "Ajouter un participant");
}

async function supprimerParticipant() {

  const participant = selectedParticipant.value;

  if (participant && participant.matricule) {
    const result = await store.supprimerParticipant(participant.matricule);
    if (result.success) {
      //console.log(`Participant ${participant.nom} supprimé avec succès.`);
      await window.api.showMessageBox({
        type: "info",
        title: "Suppression",
        message: `Participant ${participant.nom} supprimé avec succès.`,
      });
    } else {
      //console.error('Erreur lors de la suppression du participant:', result.error);
      await window.api.showMessageBox({
        type: "error",
        title: "Erreur de suppression",
        message: `Erreur lors de la suppression du participant: ${result.error}`,
      });
    }
  } else {
    //console.error('Aucun participant sélectionné dans le tableau de participants.');
    await window.api.showMessageBox({
      type: "warning",
      title: "Aucun participant sélectionné",
      message: "Veuillez sélectionner un participant à supprimer dans le tableau.",
    });
  }
}

function ouvrirModifierParticipant() {
  if (selectedParticipant.value) {
    // Convertir en objet plain (non-réactif) avant d'envoyer via IPC
    // JSON.parse(JSON.stringify()) crée une copie sérialisable
    const participantPlain = JSON.parse(JSON.stringify(selectedParticipant.value))
    window.api.send('modifier-participant', participantPlain);
  } else {
    window.api.showMessageBox({
      type: "warning",
      title: "Aucun participant sélectionné",
      message: "Veuillez sélectionner un participant à modifier dans le tableau.",
    });
  }
}

</script>

<style scoped>
.ligne-alternance :deep(tbody tr:nth-child(odd)) {
  background-color: #d7e7d3;
}

.ligne-alternance :deep(tbody tr:nth-child(even)) {
  background-color: #d8db9e;
}

/* :deep permet de cibler les éléments enfants dans les composants Vuetify */
/* .v-field--disabled est la classe appliquée aux champs désactivés dans Vuetify */
.disabled-black :deep(.v-field--disabled) {
  color: black;
  opacity: 1;
}
</style>