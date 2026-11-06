const express = require("express");
const { mostrarLogin, iniciarSesion, consultarSesion } = require("../controllers/authController");
const validarLogin = require("../middlewares/validarLogin");
const autenticarAdmin = require("../middlewares/autenticarAdmin");

const router = express.Router();

router.get("/login", mostrarLogin);
router.post("/login", validarLogin, iniciarSesion);
router.get("/sesion", autenticarAdmin, consultarSesion);

module.exports = router;