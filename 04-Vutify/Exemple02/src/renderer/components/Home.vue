<template>

    <v-app>
        <v-app-bar color="primary" dark density="compact">
      <!-- Menu Fichier -->
      <menu>
        <template v-slot:activator="{ props }">
         <v-btn v-bind="props">Fichier</v-btn>  
        </template>
        <v-list>
          <v-list-item @click="nouvelleTache">Tâche</v-list-item>
          <v-list-item>Ouvrir</v-list-item>
          <v-list-item>Enregistrer</v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="quitter">Quitter</v-list-item>
        </v-list>
      </menu>

      <!-- Menu Édition -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text">Édition</v-btn>
        </template>
        <v-list>
          <v-list-item>Copier</v-list-item>
          <v-list-item>Coller</v-list-item>
          <v-list-item>Couper</v-list-item>
        </v-list>
      </v-menu>

      <!-- Menu Aide -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text">Aide</v-btn>
        </template>
        <v-list>
          <v-list-item>Documentation</v-list-item>
          <v-list-item>À propos</v-list-item>
        </v-list>
      </v-menu>

      <v-spacer></v-spacer>
    </v-app-bar>
        <!-- Menu latéral
         <v-navigation-drawer app v-model="drawer" temporary width="200" color="greenlighten-4" elevation="10" >
            <v-list>
                <v-list-item title="Acceuil" prepend-icon="mdi-home" @click="openAccueil"></v-list-item>
                <v-list-item title="Profile" prepend-icon="mdi-account"></v-list-item>
                <v-list-item title="Paramètre" prepend-icon="mdi-cog"></v-list-item>
            </v-list>
         </v-navigation-drawer> -->

         <v-main>
            <v-container>
                <v-tabs v-model="tab" background-color="primary" dark grow>
                    <v-tab value="dashboard">Tableau de bord</v-tab>
                    <v-tab value="form">Formulaire</v-tab>
                    <v-tab value="vdatatable">Tableau de données</v-tab>
                    <v-tab value="todo">Tâches</v-tab>
                    <v-tab value="profile">Profile</v-tab>
                    <v-tab value="loadfile">Charger fichier</v-tab>
                </v-tabs>

                <!-- Contenu dynamique selon l'onglet sélectionné -->
                 <v-window v-model="tab" class="mt-4">
                    <v-window-item value="dashboard"`>
                        <DashBoardExample v-if="tab === 'dashboard'"/>
                    </v-window-item>

                    <v-window-item value="form"`>
                        <FormExample v-if="tab === 'form'"/>
                    </v-window-item>

                    <v-window-item value="vdatatable"`>
                        <DataTableExample v-if="tab === 'vdatatable'"/>
                    </v-window-item>
                    
                    <v-window-item value="todo"`>
                        <TodoExample v-if="tab === 'todo'"/>
                    </v-window-item>
                    
                    <v-window-item value="profile"`>
                        <ProfileExample v-if="tab === 'profile'"/>
                    </v-window-item>
                    
                    <v-window-item value="loadfile"`>
                        <ChargerFichier v-if="tab === 'loadfile'"/>
                    </v-window-item>
                 </v-window>
            </v-container>
         </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DashBoardExample from './DashBoardExample.vue';
import FormExample from './FormExample.vue';
import DataTableExample from './DataTableExample.vue';
import TodoExample from './TodoExample.vue';
import ProfileExample from './ProfileExample.vue';
import ChargerFichier from './ChargerFichier.vue';

const drawer = ref(false)

function openAccueil(){
    window.api.send('open-accueil', "Accueil")
}

const tab = ref('dashboard')

// export default {
//     methods: {
//         openFormWindow() {
//             // Ouverture d'une nouvelle fenêtre pour le formulaire d'inscription
//             window.api.send('open-form-window', "Ouvrir le formulaire d'inscription");
//         },
//     }
// }

function nouvelleTache(){
    window.api.send('open-todo', "TodoExemple")
}
function quitter(){
    window.close()    
}
</script> 