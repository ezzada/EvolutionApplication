<template>
  <v-container>
    <v-expansion-panel multiple variant="popout" elevation="5">
      <!-- Informations personnelles -->
      <v-expansion-panel title="Informations personnelles">
        <v-expansion-panel-text>
          <v-row>
            <!-- Colonne texte -->
            <v-col cols="12" md="9">
              <v-text-field label="Nom" v-model="nom" />
              <v-text-field label="Email" v-model="email" />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Préférences -->
      <v-expansion-panel title="Préférences">
        <v-expansion-panel-text>

          <!-- <p> Centres d’intérêt</p> -->
          <v-combobox v-model="intrests" :items="optionInterets" label="Centre d'intérêt" multiple chips clearable>
          </v-combobox>
          <v-slider v-model="satisfaction" :max="10" label="Satisfaction" thumb-label step="1"></v-slider>
          <v-btn color="primary" @click="enregistrerPreferences">
            Enregistrer les préférences
          </v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Coordonnées -->
      <v-expansion-panel title="Coordonnées">
        <v-expansion-panel-text>
          <p>Téléphone : 450-123-4567</p>
          <p>Adresse: 123, rue Fleury, St-Jérôme</p>
          <p>Email : john.doe@example.com</p>
        </v-expansion-panel-text>
      </v-expansion-panel>

    </v-expansion-panel>
  </v-container>

  <v-snackbar v-model="snakebar" color="success" location="bottom" timeout="5000">
    Préférences enregistrées avec succès !
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const nom = ref('')
const email = ref('')

const satisfaction = ref(5)
const intrests = ref([])
const optionInterets = ['Musique', 'sport', "Technologie", 'Gaming']

const snakebar = ref(false)
function enregistrerPreferences(){

}

</script>
