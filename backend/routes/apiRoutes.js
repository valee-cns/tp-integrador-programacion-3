const express = require("express");
const { listarCategorias } = require("../controllers/categoriasController");
const { listarProductos } = require("../controllers/productosController");
const validarConsultaProductos = require("../middlewares/validarConsultaProductos");

const router = express.Router();

router.get("/categorias", listarCategorias);

router.get(
    "/productos",
    validarConsultaProductos,
    listarProductos
);

router.use((req, res) => {
    res.status(404).json({
        error: "Ruta de API no encontrada."
    });
});

module.exports = router;