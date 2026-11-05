function obtenerCarrito(){
    const carritoGuardado = sessionStorage.getItem("carrito");

    if (carritoGuardado === null){
        return [];
    }

    return JSON.parse(carritoGuardado);
}

function guardarCarrito(carrito){
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto){
    const carrito = obtenerCarrito();

    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente){
        productoExistente.cantidad++;
    }else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
}

function obtenerCantidadCarrito(){
    const carrito = obtenerCarrito();
    let cantidad = 0;

    for (const item of carrito){
        cantidad += item.cantidad;
    }

    return cantidad;
}

function cambiarCantidad(idProducto, cambio){
    const carrito = obtenerCarrito();

    const producto = carrito.find((item) => item.id === idProducto);

    if (!producto || producto.cantidad + cambio < 1) {
        return;
    }

    producto.cantidad += cambio;
    guardarCarrito(carrito);
}

function quitarDelCarrito(idProducto){
    const carrito = obtenerCarrito();

    const carritoActualizado = carrito.filter((item) => item.id !== idProducto);

    guardarCarrito(carritoActualizado);
}
