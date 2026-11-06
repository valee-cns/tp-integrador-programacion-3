function validarLogin(req, res, next) {
    const { correo, password } = req.body ?? {};

    if (typeof correo !== "string" || correo.trim() === "" || correo.trim().length > 254 ||
        typeof password !== "string" || password.trim() === "" || Buffer.byteLength(password, "utf8") > 72){
        return res.status(400).json({error: "Ingrese un correo y una contraseña válidos."});
    }

    req.credenciales = {
        correo: correo.trim().toLowerCase(),
        password
    };

    next();
}

module.exports = validarLogin;