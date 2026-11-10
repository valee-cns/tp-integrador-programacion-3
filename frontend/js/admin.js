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

const modalEstado = document.getElementById("confirmar-estado");
const preguntaEstado = document.getElementById("pregunta-estado");

function confirmarCambioEstado(accion) {
    preguntaEstado.textContent = `¿Querés ${accion} este producto?`;
    modalEstado.returnValue = "cancelar";

    return new Promise((resolve) => {
        modalEstado.addEventListener("close", () => {
            resolve(modalEstado.returnValue === "confirmar");
        }, { once: true });

        modalEstado.showModal();
    });
}

document.querySelectorAll(".cambiar-estado").forEach((boton) => {
    boton.addEventListener("click", async () => {
        const activo = boton.dataset.activo === "true";
        const accion = activo ? "reactivar" : "desactivar";

        if (!(await confirmarCambioEstado(accion))) {
            return;
        }

        boton.disabled = true;
        mensajePanel.textContent = "";

        try {
            const respuesta = await fetch(
                `/admin/productos/${boton.dataset.id}/estado`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ activo })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.error);
            }

            window.location.reload();
        } catch (error) {
            mensajePanel.textContent = error.message;
            boton.disabled = false;
        }
    });
});