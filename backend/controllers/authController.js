const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

function mostrarLogin(req, res) {
    res.render("login", {error: null});
}

async function iniciarSesion(req, res) {
    const { correo, password } = req.credenciales;

    if (!process.env.JWT_SECRET) {
        return res.status(503).json({error: "La autenticación no está configurada."});
    }

    try {
        const usuario = await Usuario.findOne({
            where: { correo }
        });

        const passwordCorrecta = usuario ? await bcrypt.compare(password, usuario.passwordHash) : false;

        if (!passwordCorrecta) {
            return res.status(401).json({error: "Correo o contraseña incorrectos."});
        }

        const token = jwt.sign(
            { usuarioId: usuario.id },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                expiresIn: "1h"
            }
        );

        res.cookie("tokenAdmin", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });

        res.json({mensaje: "Sesión iniciada correctamente."});
    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        res.status(500).json({error: "No se pudo iniciar sesión."});
    }
}

function consultarSesion(req, res) {
    res.json({
        administrador: {
            id: req.admin.id,
            correo: req.admin.correo
        }
    });
}

function cerrarSesion(req, res) {
    res.clearCookie("tokenAdmin", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });

    res.json({
        mensaje: "Sesión cerrada correctamente."
    });
}

module.exports = { mostrarLogin, iniciarSesion, consultarSesion, cerrarSesion };