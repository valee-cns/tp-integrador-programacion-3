const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

async function autenticarAdmin(req, res, next) {
    if (!process.env.JWT_SECRET) {
        return res.status(503).json({error: "La autenticación no está configurada."});
    }

    const token = req.cookies?.tokenAdmin;

    if (!token) {
        return res.status(401).json({error: "Debe iniciar sesión."});
    }

    let datos;

    try {
        datos = jwt.verify(token, process.env.JWT_SECRET, {algorithms: ["HS256"]});
    } catch (error) {
        res.clearCookie("tokenAdmin", { path: "/" });

        return res.status(401).json({error: "La sesión venció o no es válida."});
    }

    if (!Number.isSafeInteger(datos.usuarioId) || datos.usuarioId < 1) {
        res.clearCookie("tokenAdmin", { path: "/" });

        return res.status(401).json({error: "La sesión no es válida."});
    }

    try {
        const usuario = await Usuario.findByPk(datos.usuarioId, {attributes: ["id", "correo"]});

        if (!usuario) {
            res.clearCookie("tokenAdmin", { path: "/" });

            return res.status(401).json({error: "La cuenta de la sesión ya no existe."});
        }

        req.admin = usuario;
        next();
    } catch (error) {
        console.error("Error al comprobar administrador:", error);

        res.status(500).json({error: "No se pudo comprobar la sesión."});
    }
}

module.exports = autenticarAdmin;