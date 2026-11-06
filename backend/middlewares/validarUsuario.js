function validarUsuario(req, res, next) {
    const { correo, password } = req.body ?? {};

    if (typeof correo !== "string") {
        return res.status(400).json({error: "Debe ingresar un correo válido."});
    }

    const correoNormalizado = correo.trim().toLowerCase();

    if (
        correoNormalizado.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)){
        return res.status(400).json({error: "Debe ingresar un correo válido."});
    }

    if (typeof password !== "string" || password.trim() === "" || password.length < 8 || Buffer.byteLength(password, "utf8") > 72){
        return res.status(400).json({error: "La contraseña debe tener al menos 8 caracteres y hasta 72 bytes."});
    }

    req.usuarioValidado = {
        correo: correoNormalizado,
        password
    };

    next();
}

module.exports = validarUsuario;