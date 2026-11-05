const selectorCategoria = document.getElementById("categoria");
const contenedorProductos = document.getElementById("productos");
const mensaje = document.getElementById("mensaje");
const botonAnterior = document.getElementById("anterior");
const botonSiguiente = document.getElementById("siguiente");
const infoPagina = document.getElementById("info-pagina");
const nombreCliente = sessionStorage.getItem("nombreCliente");
const saludoCliente = document.getElementById("saludo-cliente");
const cantidadCarrito = document.getElementById("cantidad-carrito");

let paginaActual = 1;
let totalPaginas = 0;
const LIMITE = 3;

function actualizarCantidadCarrito(){
    cantidadCarrito.textContent = obtenerCantidadCarrito();
}

async function cargarCategorias() {
    const respuesta = await fetch("/api/categorias");

    if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las categorías.");
    }

    const categorias = await respuesta.json();

    for (const categoria of categorias) {
        const opcion = document.createElement("option");

        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;

        selectorCategoria.appendChild(opcion);
    }
}

function crearTarjeta(producto) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "producto";

    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = producto.descripcion;

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = Number(producto.precio).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS"
    });

    const botonAgregar = document.createElement("button");
    botonAgregar.type = "button";
    botonAgregar.textContent = "Agregar al carrito";

    const botonQuitar = document.createElement("button");
    botonQuitar.type = "button";
    botonQuitar.textContent = "Quitar del carrito";

    function actualizarBotonQuitar(){
        const estaEnCarrito = obtenerCarrito().some((item) => item.id === producto.id);
        botonQuitar.hidden = !estaEnCarrito;
    }

    botonAgregar.addEventListener("click", () => {
        agregarAlCarrito(producto);
        actualizarCantidadCarrito();
        actualizarBotonQuitar();
    });

    botonQuitar.addEventListener("click", () => {
        quitarDelCarrito(producto.id);
        actualizarCantidadCarrito();
        actualizarBotonQuitar();
    })

    actualizarBotonQuitar();

    tarjeta.appendChild(nombre);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(botonAgregar);
    tarjeta.appendChild(botonQuitar);

    return tarjeta;
}

async function cargarProductos() {
    selectorCategoria.disabled = true;
    botonAnterior.disabled = true;
    botonSiguiente.disabled = true;

    mensaje.textContent = "Cargando productos...";
    contenedorProductos.replaceChildren();
    infoPagina.textContent = "";

    try {
        let url = `/api/productos?pagina=${paginaActual}&limite=${LIMITE}`;

        if (selectorCategoria.value !== "") {
            url += `&categoriaId=${selectorCategoria.value}`;
        }

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos.");
        }

        const datos = await respuesta.json();

        totalPaginas = datos.totalPaginas;

        for (const producto of datos.productos) {
            const tarjeta = crearTarjeta(producto);
            contenedorProductos.appendChild(tarjeta);
        }

        if (datos.totalProductos === 0) {
            mensaje.textContent = "No hay productos disponibles.";
            infoPagina.textContent = "Sin páginas";
        } else {
            mensaje.textContent = `${datos.totalProductos} productos disponibles.`;
            infoPagina.textContent =
                `Página ${paginaActual} de ${totalPaginas}`;
        }

        botonAnterior.disabled = paginaActual <= 1;
        botonSiguiente.disabled = paginaActual >= totalPaginas;
    } catch (error) {
        mensaje.textContent = error.message;
    } finally {
        selectorCategoria.disabled = false;
    }
}

selectorCategoria.addEventListener("change", () => {
    paginaActual = 1;
    cargarProductos();
});

botonAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        cargarProductos();
    }
});

botonSiguiente.addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
        paginaActual++;
        cargarProductos();
    }
});

async function iniciarCatalogo() {
    try {
        await cargarCategorias();
        await cargarProductos();
    } catch (error) {
        mensaje.textContent = error.message;
    }
}

if (nombreCliente === null || nombreCliente.trim() === "") {
    window.location.replace("/");
} else {
    saludoCliente.textContent = `¡Hola, ${nombreCliente}! Elegí tus productos.`;
    actualizarCantidadCarrito();
    iniciarCatalogo();
}