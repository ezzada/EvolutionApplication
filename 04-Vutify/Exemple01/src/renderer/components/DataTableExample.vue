<template>
    <v-data-table :headers="headers" 
    :items="desserts"
    :items-per-page="5"
    show-select
    v-model="selected"
    return-object
    >
    
    <template v-slot:top>
        <v-toolbar flat>
            <v-toolbar-title>Liste des desserts</v-toolbar-title>
        </v-toolbar>
    </template>
    
    </v-data-table>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const selected = ref([])

const headers = [
    {title: 'Dessert', key: 'name'},
    {title: 'Calories', key: 'calories'},
    {title: 'Gras (g)', key: 'fat'},
]

const desserts = [
    {name: 'Frozen Yogurt',calories:159,fat:6.0},
    {name: 'Ice Cream',calories:237,fat:6.0},
    {name: 'Eclair',calories:262,fat:6.0},
    
]
</script>