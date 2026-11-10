const { timingSafeEqual } = require("node:crypto");
const { Usuario } = require("../models");
const autenticarAdmin = require("./autenticarAdmin");

async function autorizarAltaUsuario(req, res, next) {
    const claveRecibida = req.get("X-Admin-Setup-Key");

    if (claveRecibida === undefined) {
        return autenticarAdmin(req, res, next);
    }

    const claveConfigurada = process.env.ADMIN_SETUP_KEY || "";
    const formatoClave = /^[a-f0-9]{64}$/i;

    if (process.env.ADMIN_SETUP_ENABLED !== "true" || !formatoClave.test(claveConfigurada) || !formatoClave.test(claveRecibida) || !timingSafeEqual(Buffer.from(claveRecibida, "hex"), Buffer.from(claveConfigurada, "hex"))) {
        return res.status(403).json({error: "La configuración inicial no está autorizada."});
    }

    const correoInicial = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
    const correoRecibido = req.body?.correo;

    if (!correoInicial || typeof correoRecibido !== "string" || correoRecibido.trim().toLowerCase() !== correoInicial) {
        return res.status(403).json({error: "El correo no coincide con el administrador inicial configurado."});
    }

    try {
        if (await Usuario.count() > 0) {
            return res.status(409).json({error: "La configuración inicial ya se completó."});
        }

        return next();
    } catch (error) {
        return res.status(500).json({error: "No se pudo comprobar la configuración inicial."});
    }
}

module.exports = autorizarAltaUsuario;