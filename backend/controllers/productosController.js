const { Producto } = require("../models");
const { Op, fn, col, where } = require("sequelize");

async function listarProductos(req, res) {
    try {
        const { pagina, limite, offset, categoriaId, nombre } = req.filtrosProductos;

        const condiciones = { activo: true };

        if (categoriaId !== undefined) {
            condiciones.categoriaId = categoriaId;
        }

        if (nombre) {
            condiciones[Op.and] = where(
                fn("LOCATE", nombre.toLowerCase(), fn("LOWER", col("nombre"))),
                { [Op.gt]: 0 });
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