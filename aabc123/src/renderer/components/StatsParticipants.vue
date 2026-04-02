<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <h2 class="text-h5 mb-4">Répartition des participants par niveau</h2>
                <Bar :data="barChartData" :options="barChartOptions" />
            </v-col>

            <v-col cols="12" md="6">
                <h2 class="text-h5 mb-4">Participants Actifs vs Inactifs</h2>
                <div style="height: 300px; display: flex; justify-content: center;">
                    <Pie :data="pieChartData" :options="pieChartOptions" />
                </div>
            </v-col>

            <v-col cols="12">
                <h2 class="text-h5 mb-4">Corrélation enre activité et niveau</h2>
                <div style="height: 300px; display: flex; justify-content: center;">
                    <Bar :data="stackedBarChartData" :options="stackedBarOptions" />
                </div>
            </v-col>
        </v-row>

    </v-container>
</template>

<script setup lang="ts">
import { Bar, Pie } from 'vue-chartjs';

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement,
    ChartOptions
} from "chart.js"

import { computed } from 'vue';

import { useParticipantStore } from '../stores/participantStore';

// Enregister les composants Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend)

const store = useParticipantStore()

// Calcul dynamique: nombre de participants par niveau
const barChartData = computed(() => {
    const niveaux = ["Debutant", "Intermediaire", "Professionnel"]
    const counts = niveaux.map(niv => store.participants.filter(p => p.niveau === niv).length)

    return {
        labels: niveaux,
        datasets: [
            {
                label: "Nombre de participants",
                data: counts,
                backgroundColor: ["green", "orange", "blue"]
            }
        ]
    }
})

const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
        legend: { position: "top" }
    }
}

const pieChartData = computed(() => {
    const activeCount = store.participantsActifs.length
    const inactiveCount = store.totalParticipants - activeCount

    // Calcul des pourcentages
    const total = store.participants.length || 1
    const activePercent = Math.round((activeCount / total) * 100)
    const inactivePercent = 100 - activePercent

    return {
        labels: ["Active", "Inactive"],
        datasets: [
            {
                label: "Nombre de participants",
                data: [activePercent, inactivePercent],
                backgroundColor: ["#00b818", "#eb0027"],
                hoverOffset: 4
            }
        ]
    }
})

const pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "chartArea" }
    }
}

// Corrélation niveau et Status avec Stacked Bar Chart
const stackedBarChartData = computed(() => {

    const niveaux = ["Debutant", "Intermediaire", "Professionnel"]

    const actives = niveaux.map(niv => store.participants.filter(p => p.niveau === niv && p.isActif).length)
    const inactives = niveaux.map(niv => store.participants.filter(p => p.niveau === niv && !p.isActif).length)
    console.log(actives)

    return {
        labels: niveaux,
        datasets: [
            {
                label: "Actifs",
                data: actives,
                backgroundColor: ["green"]
            },

            {
                label: "Inactifs",
                data: inactives,
                backgroundColor: ["red"]
            }
        ]
    }
})

const stackedBarOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
        legend: { position: "top" }
    },

    scales: {
        x: {
            stacked: true
        },

        y: {
            stacked: true
        }
    }
}

</script>

<style scoped></style>