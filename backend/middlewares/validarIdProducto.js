const responderErrorProducto = require("../utils/responderErrorProducto");

function validarIdProducto(req, res, next) {
    const id = Number(req.params.id);

    if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1) {
        return responderErrorProducto(req, res, 400, "El ID de producto no es válido");
    }

    req.idProductoValidado = id;
    next();
}

module.exports = validarIdProducto;