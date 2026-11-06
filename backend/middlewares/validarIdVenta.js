function validarIdVenta(req, res, next) {
    const id = req.params.id;

    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
        return res.status(400).json({
            error: "El ID de venta debe ser un entero positivo."
        });
    }

    req.idVenta = Number(id);
    next();
}

module.exports = validarIdVenta;