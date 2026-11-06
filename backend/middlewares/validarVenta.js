function validarVenta(req, res, next) {
    const { nombreCliente, productos } = req.body ?? {};

    if (typeof nombreCliente !== "string" || nombreCliente.trim() === "" || nombreCliente.trim().length > 100){
        return res.status(400).json({error: "El nombre debe tener entre 1 y 100 caracteres."});
    }

    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({error: "La compra debe incluir al menos un producto."});
    }

    const idsRecibidos = new Set();

    for(const producto of productos) {
        if (producto === null || typeof producto !== "object" || Array.isArray(producto)){
            return res.status(400).json({error: "Cada producto debe ser un objeto."});
        }

        if (!Number.isSafeInteger(producto.productoId) || producto.productoId < 1) {
            return res.status(400).json({error: "El ID del producto debe ser un entero positivo."});
        }

        if (!Number.isSafeInteger(producto.cantidad) || producto.cantidad < 1 || producto.cantidad > 100000){
            return res.status(400).json({error: "La cantidad debe ser un entero entre 1 y 100000."});
        }

        if (idsRecibidos.has(producto.productoId)) {
            return res.status(400).json({error: "No se puede repetir un producto en la compra."});
        }

        idsRecibidos.add(producto.productoId);
    }

    req.ventaValidada = {
        nombreCliente: nombreCliente.trim(),
        productos: productos.map((producto) => ({
            productoId: producto.productoId,
            cantidad: producto.cantidad
        }))
    };

    next();
}

module.exports = validarVenta;