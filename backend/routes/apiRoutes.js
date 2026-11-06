const express = require("express");
const { listarCategorias } = require("../controllers/categoriasController");
const { listarProductos } = require("../controllers/productosController");
const validarConsultaProductos = require("../middlewares/validarConsultaProductos");
const { registrarVenta, obtenerVenta } = require("../controllers/ventasController");
const validarVenta = require("../middlewares/validarVenta");
const validarIdVenta = require("../middlewares/validarIdVenta");
const { descargarTicketPdf } = require("../controllers/ticketController");
const { crearUsuario } = require("../controllers/usuariosController");
const autorizarAltaAdmin = require("../middlewares/autorizarAltaAdmin");
const validarUsuario = require("../middlewares/validarUsuario");

const router = express.Router();

router.get("/categorias", listarCategorias);
router.get("/productos", validarConsultaProductos, listarProductos);
router.post("/ventas", validarVenta, registrarVenta);
router.get("/ventas/:id", validarIdVenta, obtenerVenta);
router.get("/ventas/:id/pdf", validarIdVenta, descargarTicketPdf);
router.post("/usuarios", autorizarAltaAdmin, validarUsuario, crearUsuario);

router.use((req, res) => {
    res.status(404).json({
        error: "Ruta de API no encontrada."
    });
});

module.exports = router;