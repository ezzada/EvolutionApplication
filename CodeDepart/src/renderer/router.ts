import { createRouter, createWebHashHistory } from "vue-router";

import Home from './components/Home.vue';
import AjouterEquipement from "./components/AjouterEquipement.vue";
import StatsEquipements from "./components/StatsEquipements.vue";

const routes = [
    {path: '/', name: 'Home', component: Home}, 
    {path: '/ajouterEquipement', name: 'AjouterEquipement', component: AjouterEquipement}, 
    {path: '/statsEquipements', name: 'StatsEquipements', component: StatsEquipements}, 
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;