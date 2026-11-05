const { Producto } = require("../models");

async function listarProductos(req, res) {
    try {
        const { pagina, limite, offset, categoriaId } = req.filtrosProductos;

        const condiciones = { activo: true };

        if (categoriaId !== undefined) {
            condiciones.categoriaId = categoriaId;
        }

        const { count, rows } = await Producto.findAndCountAll({
            where: condiciones,
            order: [["id", "ASC"]],
            limit: limite,
            offset: offset
        });

        res.json({
            productos: rows,
            pagina: pagina,
            limite: limite,
            totalProductos: count,
            totalPaginas: Math.ceil(count / limite)
        });
    } catch (error) {
        console.error("Error al consultar productos:", error.message);

        res.status(500).json({
            error: "No se pudieron obtener los productos."
        });
    }
}

module.exports = { listarProductos };