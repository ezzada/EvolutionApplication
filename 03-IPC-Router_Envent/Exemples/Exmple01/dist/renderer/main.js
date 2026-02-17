import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');
const appInfotElement = document.createElement('div');
const taskButton = document.createElement('button');
const resultElement = document.createElement('div');
const calculatorElement = document.createElement('div');
//Configuration de l'intéraface utilisateur
taskButton.textContent = 'Exécuter';
document.body.append(appInfotElement, taskButton, resultElement, calculatorElement);
//Exemple a: demander d'avoir des donnés de l'app
// Le renderer appele la fonction exposée par le preload
const info = window.electronAPI.getAppInfo();
appInfotElement.innerHTML = ` 
<h2>Information sur l'application</h2>
<p>Nom: ${info.name}</p>
<p>Version: ${info.version}</p>
<p>Plateforme: ${info.platform}</p>`;
//Exemple b: Demander de réaliser une tâche
taskButton.addEventListener('click', () => {
    window.electronAPI.performTask({ action: 'Exécuter une tâche', payload: 'test'
    });
});
// Le renderer se  met à l'écoute de la réponse du main process. Quand il répond, on met l'interface utilisateur à jour
window.electronAPI.onTaskResult(result => {
    resultElement.textContent = `Résultat de la tâche: ${JSON.stringify(result)}`;
});
//Exemple c: calculatrice
document.getElementById("add").addEventListener("click", async () => {
    const a = parseInt(document.getElementById('a').value, 10);
    console.log("Valeur de a: " + a);
    const b = parseInt(document.getElementById('b').value, 10);
    console.log("Valeur de b: " + b);
    const somme = await window.electronAPI.calculate(a, b);
    console.log("Résultat: ")(document.getElementById("result")).value = "Résultat: " + somme;
});
