function autorizarAltaAdmin(req, res, next) {
    const claveConfigurada = process.env.ADMIN_SETUP_KEY;
    const claveRecibida = req.get("X-Admin-Setup-Key");

    if (!claveConfigurada) {
        return res.status(503).json({error: "El alta de administradores no está habilitada."});
    }

    if (claveRecibida !== claveConfigurada) {
        return res.status(403).json({error: "No tiene permiso para crear administradores."});
    }

    next();
}

module.exports = autorizarAltaAdmin;