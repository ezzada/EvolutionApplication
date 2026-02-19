import { createRouter, createWebHashHistory } from 'vue-router';
import Form from './components/Form.vue';
import Home from './components/Home.vue';
const routes = [
    { path: '/', component: Home },
    { path: '/form', component: Form },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
// Exporter le routeur pour l'utiliser dans l'application Vue
export default router;
