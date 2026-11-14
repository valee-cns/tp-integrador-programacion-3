const express = require("express");
const { mostrarLogin, iniciarSesion, consultarSesion, cerrarSesion } = require("../controllers/authController");
const validarLogin = require("../middlewares/validarLogin");
const autenticarAdmin = require("../middlewares/autenticarAdmin");
const { mostrarDashboard, cambiarEstadoProducto, mostrarAltaProducto, guardarProducto, mostrarEdicionProducto } = require("../controllers/adminController");
const subirImagenProducto = require("../middlewares/subirImagenProducto");
const validarEstadoProducto = require("../middlewares/validarEstadoProducto");
const validarProducto = require("../middlewares/validarProducto");
const validarIdProducto = require("../middlewares/validarIdProducto");

const router = express.Router();

router.get("/login", mostrarLogin);
router.post("/login", validarLogin, iniciarSesion);
router.get("/sesion", autenticarAdmin, consultarSesion);
router.get("/dashboard", autenticarAdmin, mostrarDashboard);
router.post("/logout", cerrarSesion);
router.patch("/productos/:id/estado", autenticarAdmin, validarEstadoProducto, cambiarEstadoProducto);
router.get("/productos/nuevo", autenticarAdmin, mostrarAltaProducto);
router.post("/productos", autenticarAdmin, subirImagenProducto, validarProducto, guardarProducto);
router.get("/productos/:id/editar", autenticarAdmin, validarIdProducto, mostrarEdicionProducto);
router.post("/productos/:id/editar", autenticarAdmin, validarIdProducto, subirImagenProducto, validarProducto, guardarProducto);

module.exports = router;