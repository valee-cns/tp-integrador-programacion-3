const botonCerrarSesion = document.getElementById("cerrar-sesion");
const mensajePanel = document.getElementById("mensaje-panel");

botonCerrarSesion.addEventListener("click", async () => {
    botonCerrarSesion.disabled = true;
    mensajePanel.textContent = "";

    try {
        const respuesta = await fetch("/admin/logout", {
            method: "POST"
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "No se pudo cerrar la sesión.");
        }

        window.location.replace("/admin/login");
    } catch (error) {
        mensajePanel.textContent = error.message;
        botonCerrarSesion.disabled = false;
    }
});