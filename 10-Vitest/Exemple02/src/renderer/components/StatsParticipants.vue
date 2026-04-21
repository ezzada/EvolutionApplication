<template>
    <v-container>
        <v-row>
            <v-col>
                <h2 class="text-h5 mb-4">
                    Répartition des participants par niveau </h2>

                <Bar :data="barChartData" :options="barChartOptions" />
            </v-col>

            <v-col cols="12" md="6">
                <h2 class="text-h5 mb-4">Participants Actifs vs Inactifs </h2>

                <div style="height: 300px; display: flex; justify-content: center;">
                    <Pie :data="pieChartData" :options="pieChartOptions" />
                </div>
            </v-col>

            <v-col cols="12">
                <h2 class="text-h5 mb-4">Corrélation Niveau et Statu Actif/Inactif </h2>

                <div style="height: 300px; display: flex; justify-content: center;">
                    <Bar :data="stackedBarChartData" :options="stackedBarChartOptions" />
                </div>
            </v-col>

        </v-row>


    </v-container>
</template>

<script setup lang="ts">
import { Bar, Pie } from 'vue-chartjs';

import {
    Chart as ChartJS,
    BarElement, // pour le Bar chart
    ArcElement, // Pour le Pie Chart
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js"

import { computed } from "vue"

import { useParticipantStore } from '../stores/participantStore';

// Enregistrer les composants Chart.js
ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend)

const store = useParticipantStore();

// Calcul dynamique: nombre de participants par niveau
const barChartData = computed(() => {
    const niveaux = ["Débutant", "Intermédiare", "Avancé"]

    const counts = niveaux.map(niv => store.participants.filter(p => p.niveau === niv).length)

    return {
        labels: niveaux,
        datasets: [
            {
                label: "Nombre de participants",
                data: counts,
                backgroundColor: ["green", "orange", "blue"],

            },
        ],
    }
})


const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
        legend: { position: "top" }
    }
}

// Définitions des options pour le Pue chart
// Calculs dynamique: actitf vs Inactifs

const pieChartData = computed(() => {
    const activeCount = store.participants.filter(p => p.isActif).length
    const inactiveCount = store.participants.length - activeCount

    // Calcul des pourcentages
    const total = store.participants.length || 1
    const activePercent = Math.round(activeCount / total * 100)
    const inactivePercent = Math.round(activeCount / total * 100)

    return {
        labels: [`Actifs(${activePercent}%)`, `Inactifs (${inactivePercent}%)`],
        datasets: [
            {
                data: [activeCount, inactiveCount],
                backgroundColor: ["#caf50", "#f44336"],
                hoverOffset: 4,
            }
        ]
    }
})


const pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "chartArea" },

    }
}

// Corrélation Niveau et Status avec Stacked bar Chart
// Calculs dynamiques

const stackedBarChartData = computed(() => {

    const niveaux = ["Débutant", "Intermédiare", "Professionel"]

    const actifsParNiveau = niveaux.map(niv => store.participants.filter(p => p.niveau === niv && p.isActif).length )

    const inactifsParNiveau = niveaux.map(niv => store.participants.filter(p => p.niveau === niv && !p.isActif).length )


    return {
        labels: niveaux,
        datasets: [
            {
               
                label: actifsParNiveau,
                 backgroundColor: "green",

            },
            {
                label: "Inactif",
                data: inactifsParNiveau,
                backgroundColor: "orange"
            }
        ],
    }
})

const stackedBarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
        legend: { position: "top" },

    },

    scales: {
        x: {
            stacked: true
        },
        y: {
            stacked:true
        }
    }
}

</script>

<style scoped></style>