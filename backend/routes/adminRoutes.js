const express = require("express");
const { mostrarLogin, iniciarSesion, consultarSesion, cerrarSesion } = require("../controllers/authController");
const validarLogin = require("../middlewares/validarLogin");
const autenticarAdmin = require("../middlewares/autenticarAdmin");
const { mostrarDashboard, cambiarEstadoProducto, mostrarAltaProducto, guardarProducto, mostrarEdicionProducto } = require("../controllers/adminController");
const subirImagenProducto = require("../middlewares/subirImagenProducto");

const router = express.Router();

router.get("/login", mostrarLogin);
router.post("/login", validarLogin, iniciarSesion);
router.get("/sesion", autenticarAdmin, consultarSesion);
router.get("/dashboard", autenticarAdmin, mostrarDashboard);
router.post("/logout", cerrarSesion);
router.patch("/productos/:id/estado", autenticarAdmin, cambiarEstadoProducto);
router.get("/productos/nuevo", autenticarAdmin, mostrarAltaProducto);
router.post("/productos", autenticarAdmin, subirImagenProducto, guardarProducto);
router.get("/productos/:id/editar", autenticarAdmin, mostrarEdicionProducto);
router.post("/productos/:id/editar", autenticarAdmin, subirImagenProducto, guardarProducto);

module.exports = router;