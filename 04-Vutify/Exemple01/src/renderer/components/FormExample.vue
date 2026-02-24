<template>
    <v-container>
        <v-card class="pa-6" max-width="600">
            <v-card-title>Inscription à la conférence</v-card-title>

            <v-form :key="formKey" @submit="soumettreFormulaire" ref="form">

                <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" v-model="formStore.nom" label="Nom complet" :rules="[r.obligatoire]" />
                    </template>
                    <span>Saisir votre prénom et nom de famille</span>
                </v-tooltip>
                <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" v-model="formStore.email" label="Adresse email" :rules="[r.obligatoire, r.email]" />
                    </template>
                    <span>Saisir une adresse email valid ex.: exemple@gmail.com</span>
                </v-tooltip>

                

                <v-select v-model="formStore.niveau" label="Niveau d'expérience" 
                :items="['Débutant', 'Intermédiaire', 'Avancé']"
                :rules="[r.obligatoire]"
                />

                <v-radio-group v-model="formStore.genre" label="Genre">
                    <v-radio label="Femme" value="F"/>
                    <v-radio label="Homme" value="M"/>
                </v-radio-group>

                <v-switch v-model="formStore.newsletter" label="Recevoir les nouveautés par courriel"/>

                <v-btn color="primary" class="mt-4" @click="soumettreFormulaire">Soumettre</v-btn>
            </v-form>

            <v-snackbar v-model="snackbar" timeout="3000">
                Inscription réussie !
            </v-snackbar>

        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useFormStore } from "../stores/formStore";
import { FormKey } from "vuetify/lib/composables/form";

//Pour résoudre le problème de vérification des champ après le submit du formulaire
const formKey = ref(0)
const formStore = useFormStore()

// const nom = ref("");
// const email = ref('');
// const niveau = ref('');
// const genre = ref('');
//const newsletter = ref(false);
const snackbar = ref(false);
const r = {
    
     obligatoire: (v:string) => !!v || 'Ce champ est obligatoire',

     email: (v:string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Adresse courriel invalide',
};

function soumettreFormulaire() {
    if(!formStore.isFormValid){
        return; //Si le formulaire n'est pas valide
    }
    console.log('Données envoyées: ', {...formStore.formData})

    snackbar.value = true
    formKey.value++

    formStore.restForm()
}
</script>
