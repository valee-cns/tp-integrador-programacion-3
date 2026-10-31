const formulario = document.getElementById("formulario-bienvenida");
const campoNombre = document.getElementById("nombre-cliente");

formulario.addEventListener("submit", (evento) =>{
    evento.preventDefault();

    const nombre = campoNombre.value.trim();

    if(nombre === ""){
        alert("Ingrese su nombre para continuar.");
        campoNombre.focus();
        return;
    }
    alert(`¡Bienvenido a Loot Valley, ${nombre}!`);
    window.location.href = "/productos.html";
});