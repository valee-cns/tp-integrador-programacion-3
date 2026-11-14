const express = require("express");
const app = express();
const PUERTO = 3000;
const path = require("path");
const sequelize = require("./config/database");
const { Categoria, Producto, Venta, DetalleVenta, Usuario } = require("./models");
const apiRoutes = require("./routes/apiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRoutes);

app.use("/api", (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ error: "El JSON enviado no es válido." });
    }

    const estado = error.status ?? error.statusCode;

    if (Number.isInteger(estado) && estado >= 400 && estado < 500) {
        return res.status(estado).json({ error: "No se pudo procesar la solicitud." });
    }

    console.error("Error en la API:", error);
    return res.status(500).json({ error: "Ocurrió un error interno." });
});

app.use("/admin", adminRoutes);

app.use(express.static(path.join(__dirname, "..", "frontend")));

async function comprobarConexion() {
    try {
        await sequelize.authenticate();
        console.log("Conexión con MySQL establecida");

        await Categoria.sync();
        await Producto.sync();
        await Venta.sync();
        await DetalleVenta.sync();
        await Usuario.sync();

        console.log("Tablas categorias, productos, ventas y los detalles de venta disponibles");
    } catch (error) {
        console.error("No se pudo conectar con MySQL:", error.message);
    }
}

comprobarConexion();

app.listen(PUERTO, () => {
    console.log(`Servidor disponible en http://localhost:${PUERTO}`);
});