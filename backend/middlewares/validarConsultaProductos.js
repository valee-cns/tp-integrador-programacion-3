function validarConsultaProductos(req, res, next) {
    const { pagina = "1", limite = "3", categoriaId, nombre = "" } = req.query;

    function esEnteroPositivo(valor) {
        return typeof valor === "string"
            && /^[1-9]\d*$/.test(valor)
            && Number.isSafeInteger(Number(valor));
    }

    if (!esEnteroPositivo(pagina) || !esEnteroPositivo(limite)) {
        return res.status(400).json({
            error: "Página y límite deben ser enteros positivos."
        });
    }

    if (Number(limite) > 50) {
        return res.status(400).json({
            error: "El límite máximo es 50."
        });
    }

    if (categoriaId !== undefined && !esEnteroPositivo(categoriaId)) {
        return res.status(400).json({
            error: "La categoría debe ser un identificador entero positivo."
        });
    }

    const offset = (Number(pagina) - 1) * Number(limite);

    if (!Number.isSafeInteger(offset)) {
        return res.status(400).json({
            error: "El número de página es demasiado grande."
        });
    }

    if (typeof nombre !== "string" || nombre.trim().length > 100) {
        return res.status(400).json({
            error: "La búsqueda debe ser un texto de hasta 100 caracteres."
        });
    }

    req.filtrosProductos = {
        pagina: Number(pagina),
        limite: Number(limite),
        offset: offset,
        categoriaId: categoriaId === undefined
            ? undefined
            : Number(categoriaId),
        nombre: nombre.trim()
    };

    next();
}

module.exports = validarConsultaProductos;