import { createRouter, createWebHistory } from "vue-router"

import Home from "./components/Home.vue" //Imporatation de la page d'acceuil
import Form from "./components/Form.vue"

const routes = [
    {path: '/', component: Home},
    {path: '/', component: Form},
]

const router = createRouter(
    {
        history: createWebHistory(),
        routes,
    }
)

//Exporter router pour utilisation dans l'application
export default router 