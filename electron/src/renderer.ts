console.log('Renderer est prêt');

document.addEventListener('DOMContentLoaded',()=>{
    console.log('Electron est prêt')
})

//Un clic sur le bouton 'bonjourBtn' affiche une fenêtre d'alerte
document.getElementById('bonjourBtn')?.addEventListener('click',()=>{
    alert('Bonjour depuis le renderer process')
    console.log('Bonjour depuis le renderer process')
})