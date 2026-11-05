const { Categoria } = require("../models");

async function listarCategorias(req, res) {
    try {
        const categorias = await Categoria.findAll({
            order: [["id", "ASC"]]
        });

        res.json(categorias);
    } catch (error) {
        console.error("Error al consultar categorías:", error.message);

        res.status(500).json({
            error: "No se pudieron obtener las categorías."
        });
    }
}

module.exports = { listarCategorias };