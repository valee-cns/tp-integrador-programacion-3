const raizTema = document.documentElement;
const temaGuardado = localStorage.getItem("temaLootValley");

raizTema.dataset.tema = temaGuardado === "oscuro" ? "oscuro" : "claro";

document.addEventListener("DOMContentLoaded", () => {
    const botonTema = document.getElementById("cambiar-tema");

    if (!botonTema) return;

    function actualizarTextoTema() {
        botonTema.textContent = raizTema.dataset.tema === "oscuro"
            ? "Activar tema claro"
            : "Activar tema oscuro";
    }

    actualizarTextoTema();

    botonTema.addEventListener("click", () => {
        const nuevoTema = raizTema.dataset.tema === "oscuro" ? "claro" : "oscuro";

        raizTema.dataset.tema = nuevoTema;
        localStorage.setItem("temaLootValley", nuevoTema);
        actualizarTextoTema();
    });
});