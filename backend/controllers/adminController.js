const { Categoria, Producto } = require("../models");

async function mostrarDashboard(req, res) {
    try {
        const categorias = await Categoria.findAll({order: [["id", "ASC"]]});

        const productos = await Producto.findAll({order: [["id", "ASC"]]});

        res.setHeader("Cache-Control", "no-store");

        res.render("dashboard", {administrador: req.admin, categorias, productos});
    }catch (error){
        console.error("Error al cargar panel:", error);

        res.status(500).send("No se pudo cargar el panel.");
    }
}

module.exports = { mostrarDashboard };