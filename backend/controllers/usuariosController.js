const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

async function crearUsuario(req, res) {
    const { correo, password } = req.usuarioValidado;

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            correo,
            passwordHash
        });

        res.status(201).json({
            mensaje: "Administrador creado correctamente.",
            usuario: {
                id: usuario.id,
                correo: usuario.correo
            }
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({error: "Ya existe un usuario con ese correo."});
        }

        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({error: "Los datos del usuario no son válidos."});
        }

        console.error("Error al crear administrador:", error);

        res.status(500).json({error: "No se pudo crear el administrador."});
    }
}

module.exports = { crearUsuario };