import {createApp} from 'vue'

import App from './App.vue';

import router from './router';
declare global{
    interface window{
        api:{
            send:(channel:string, ...args: any[]) => void;
            on:(channel:string, listener: (event: any, ...args: any[]) => void) => void 
        }
    }
}

//createApp(App).mount('#app');

const app = createApp(App)

app.use(router)
app.mount('#app')