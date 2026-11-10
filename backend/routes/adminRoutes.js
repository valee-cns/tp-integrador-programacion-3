const express = require("express");
const { mostrarLogin, iniciarSesion, consultarSesion, cerrarSesion } = require("../controllers/authController");
const validarLogin = require("../middlewares/validarLogin");
const autenticarAdmin = require("../middlewares/autenticarAdmin");
const { mostrarDashboard } = require("../controllers/adminController");

const router = express.Router();

router.get("/login", mostrarLogin);
router.post("/login", validarLogin, iniciarSesion);
router.get("/sesion", autenticarAdmin, consultarSesion);
router.get("/dashboard", autenticarAdmin, mostrarDashboard);
router.post("/logout", cerrarSesion);

module.exports = router;