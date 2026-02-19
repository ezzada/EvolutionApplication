<template>
<div>
    <h1>Bienvenue sur la page d'accueil</h1>
    <button @click="openFormWindow">Ouvrir le formulaire d'inscription</button>
</div>
</template>

<script lang="ts">
export default{
    methods: {
        openFormWindow() {   
            window.api.send('open-form-window', "Ouvrir la fenêtre de formulaire");
        }
    }
};
</script>