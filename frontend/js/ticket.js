const mensajeTicket = document.getElementById("mensaje-ticket");
const datosTicket = document.getElementById("datos-ticket");
const numeroVenta = document.getElementById("numero-venta");
const nombreClienteTicket = document.getElementById("nombre-cliente");
const fechaVenta = document.getElementById("fecha-venta");
const detalleTicket = document.getElementById("detalle-ticket");
const totalVenta = document.getElementById("total-venta");
const botonSalir = document.getElementById("salir");
const enlacePdf = document.getElementById("descargar-pdf");

function mostrarImporte(importe) {
    return Number(importe).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS"
    });
}

async function cargarTicket(idVenta) {
    try {
        const respuesta = await fetch(`/api/ventas/${idVenta}`);
        const venta = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(venta.error || "No se pudo cargar el ticket.");
        }

        numeroVenta.textContent = `Venta número ${venta.id}`;
        nombreClienteTicket.textContent = `Cliente: ${venta.nombreCliente}`;

        fechaVenta.textContent = `Fecha: ${new Date(venta.fecha).toLocaleString("es-AR")}`;

        detalleTicket.replaceChildren();

        for (const detalle of venta.DetalleVenta) {
            const articulo = document.createElement("article");
            articulo.className = "producto";

            const nombre = document.createElement("h3");
            nombre.textContent = detalle.Producto.nombre;

            const cantidades = document.createElement("p");
            cantidades.textContent = `${detalle.cantidad} × ${mostrarImporte(detalle.precioUnitario)}`;

            const subtotal = document.createElement("p");
            subtotal.textContent = `Subtotal: ${mostrarImporte(Number(detalle.precioUnitario) * detalle.cantidad)}`;

            articulo.append(nombre, cantidades, subtotal);
            detalleTicket.appendChild(articulo);
        }

        totalVenta.textContent = mostrarImporte(venta.total);
        enlacePdf.href = `/api/ventas/${venta.id}/pdf`;
        datosTicket.hidden = false;
        mensajeTicket.textContent = "";
    } catch (error) {
        mensajeTicket.textContent = error.message;
    }
}

botonSalir.addEventListener("click", () => {
    sessionStorage.removeItem("nombreCliente");
    sessionStorage.removeItem("carrito");
    sessionStorage.removeItem("ultimaVentaId");

    window.location.replace("/");
});

const idVenta = sessionStorage.getItem("ultimaVentaId");

if (idVenta === null) {
    window.location.replace("/");
} else {
    cargarTicket(idVenta);
}