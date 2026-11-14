function validarEstadoProducto(req, res, next) {
    const id = Number(req.params.id);
    const activo = req.body?.activo;

    if (!Number.isSafeInteger(id) || id < 1 || typeof activo !== "boolean") {
        return res.status(400).json({error: "El ID debe ser un entero positivo y el estado debe ser true o false."});
    }

    req.estadoProductoValidado = { id, activo };
    next();
}

module.exports = validarEstadoProducto;