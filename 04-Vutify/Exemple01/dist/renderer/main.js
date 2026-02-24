import { createApp } from "vue";
import App from './App.vue';
import router from './router'; // Importation du routeur pour la navigation entre les pages
//Configuration de Vuetify¸
import 'vuetify/styles';
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
// Créer une instance Vuetify
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
    }
});
const app = createApp(App); // Création de l'application Vue.js avec le composant principal App
app.use(router); // Utilisation du routeur pour la navigation entre les pages
app.use(vuetify);
app.mount('#app'); // Montage de l'application sur l'élément DOM avec l'ID 'app'
