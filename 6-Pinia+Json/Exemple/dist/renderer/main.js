import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
    }
});
// Utilisation du routeur dans l'application Vue
const app = createApp(App);
// Créer une instance de Pinia
const pinia = createPinia();
app.use(pinia); // Utiliser Pinia avant router
app.use(router);
app.use(vuetify);
app.mount('#app');
