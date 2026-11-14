function responderErrorProducto(req, res, estado, mensaje) {
    if (req.baseUrl === "/api") {
        return res.status(estado).json({ error: mensaje });
    }

    return res.status(estado).send(mensaje);
}

module.exports = responderErrorProducto;