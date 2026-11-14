const botonCerrarSesion = document.getElementById("cerrar-sesion");
const mensajePanel = document.getElementById("mensaje-panel");
const categoriaPanel = document.querySelector("#categoria-panel");
const buscarProducto = document.querySelector("#buscar-producto");
const resultadoFiltrosPanel = document.querySelector("#resultado-filtros-panel");
const seccionesPanel = document.querySelectorAll("main section[data-categoria-id]");
const modalEstado = document.getElementById("confirmar-estado");
const preguntaEstado = document.getElementById("pregunta-estado");

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

function normalizarNombre(texto) {
    return texto.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

function filtrarProductosPanel() {
    const categoriaElegida = categoriaPanel.value;
    const nombreBuscado = normalizarNombre(buscarProducto.value);
    let totalVisible = 0;

    for (const seccion of seccionesPanel) {
        const coincideCategoria =
            categoriaElegida === "" || seccion.dataset.categoriaId === categoriaElegida;
        let visiblesEnCategoria = 0;

        for (const tarjeta of seccion.querySelectorAll(".producto")) {
            const nombre = tarjeta.querySelector(".nombre-producto").textContent;
            const visible = coincideCategoria && normalizarNombre(nombre).includes(nombreBuscado);

            tarjeta.hidden = !visible;
            if (visible) visiblesEnCategoria++;
        }

        seccion.hidden = visiblesEnCategoria === 0;
        totalVisible += visiblesEnCategoria;
    }

    resultadoFiltrosPanel.textContent = totalVisible === 0
        ? "No se encontraron productos."
        : `Productos encontrados: ${totalVisible}`;
}

categoriaPanel.addEventListener("change", filtrarProductosPanel);
buscarProducto.addEventListener("input", filtrarProductosPanel);
filtrarProductosPanel();