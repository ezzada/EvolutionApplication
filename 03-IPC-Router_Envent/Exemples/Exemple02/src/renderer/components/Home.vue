<template>
    <div id="app">
        <h1>Application Electron avec Vue.js</h1>

        <button @click="openFromWindow"> Formulaire d'inscription</button>
    </div>
</template>

<script lang="ts">
    export default{
        methods: {
            openFromWindow(){
                window.parseInt.send('open-form-window', "Ouvrir le formulaire d'inscription") 

            }
        }
    }
</script>