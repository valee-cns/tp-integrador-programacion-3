const clienteCarrito = document.getElementById("cliente-carrito");
const mensajeCarrito = document.getElementById("mensaje-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const botonFinalizar = document.getElementById("finalizar-compra");
const dialogoConfirmacion = document.getElementById("confirmacion-compra");
const botonCancelar = document.getElementById("cancelar-compra");
const botonConfirmar = document.getElementById("confirmar-compra");
const errorCompra = document.getElementById("error-compra");

let enviandoCompra = false;

function mostrarImporte(importe){
    return importe.toLocaleString("es-AR",{
        style: "currency",
        currency: "ARS"
    });
}

function mostrarCarrito(){
    const carrito = obtenerCarrito();
    botonFinalizar.disabled = carrito.length === 0;

    listaCarrito.replaceChildren();
    let total = 0;

    mensajeCarrito.textContent = carrito.length === 0 ? "Tu carrito está vacío." : "";

    for(const producto of carrito){
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const detalle = document.createElement("p");
        detalle.textContent = `${mostrarImporte(producto.precio)} × ${producto.cantidad}`;

        const textoSubtotal = document.createElement("p");
        textoSubtotal.textContent = `Subtotal: ${mostrarImporte(subtotal)}`;

        const botonRestar = document.createElement("button");
        botonRestar.type = "button";
        botonRestar.textContent = "−";
        botonRestar.setAttribute(
            "aria-label",
            `Restar una unidad de ${producto.nombre}`
        );
        botonRestar.disabled = producto.cantidad === 1;

        botonRestar.addEventListener("click", () => {
            cambiarCantidad(producto.id, -1);
            mostrarCarrito();
        });

        const botonSumar = document.createElement("button");
        botonSumar.type = "button";
        botonSumar.textContent = "+";
        botonSumar.setAttribute(
            "aria-label",
            `Sumar una unidad de ${producto.nombre}`
        );

        botonSumar.addEventListener("click", () => {
            cambiarCantidad(producto.id, 1);
            mostrarCarrito();
        });

        const botonQuitar = document.createElement("button");
        botonQuitar.type = "button";
        botonQuitar.textContent = "Quitar";

        botonQuitar.addEventListener("click", () => {
            quitarDelCarrito(producto.id);
            mostrarCarrito();
        });

        tarjeta.append(
            nombre,
            detalle,
            textoSubtotal,
            botonRestar,
            botonSumar,
            botonQuitar
        );

        listaCarrito.appendChild(tarjeta);
    }

    totalCarrito.textContent = mostrarImporte(total);
}

botonFinalizar.addEventListener("click", () => {
    if (obtenerCarrito().length === 0 || enviandoCompra){
        return;
    }

    errorCompra.textContent = "";
    dialogoConfirmacion.showModal();
});

botonCancelar.addEventListener("click", () => {
    dialogoConfirmacion.close();
});

dialogoConfirmacion.addEventListener("cancel", (evento) => {
    if (enviandoCompra){
        evento.preventDefault();
    }
});

botonConfirmar.addEventListener("click", async () => {
    if (enviandoCompra){
        return;
    }

    const carrito = obtenerCarrito();

    if (carrito.length === 0){
        errorCompra.textContent = "El carrito está vacío.";
        return;
    }

    enviandoCompra = true;
    botonConfirmar.disabled = true;
    botonCancelar.disabled = true;
    botonFinalizar.disabled = true;
    errorCompra.textContent = "";

    try {
        const respuesta = await fetch("/api/ventas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombreCliente,
                productos: carrito.map((producto) => ({
                    productoId: producto.id,
                    cantidad: producto.cantidad
                }))
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "No se pudo registrar la compra.");
        }

        sessionStorage.setItem("ultimaVentaId", String(datos.ventaId));
        guardarCarrito([]);

        window.location.replace("/ticket.html");
    } catch (error) {
        errorCompra.textContent = error.message;
    } finally {
        enviandoCompra = false;
        botonConfirmar.disabled = false;
        botonCancelar.disabled = false;
        botonFinalizar.disabled = obtenerCarrito().length === 0;
    }
});

const nombreCliente = sessionStorage.getItem("nombreCliente");

if(nombreCliente === null || nombreCliente.trim() === ""){
    window.location.replace("/");
}else{
    clienteCarrito.textContent = `Compra de ${nombreCliente}`;
    mostrarCarrito();
}

