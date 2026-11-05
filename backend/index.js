const express = require("express");
const app = express();
const PUERTO = 3000;
const path = require("path");
const sequelize = require("./config/database");
const { Categoria, Producto } = require("./models");
const apiRoutes = require("./routes/apiRoutes");

app.use("/api", apiRoutes);

app.use(express.static(path.join(__dirname, "..", "frontend")));

async function comprobarConexion() {
    try {
        await sequelize.authenticate();
        console.log("Conexión con MySQL establecida");

        await Categoria.sync();
        await Producto.sync();

        console.log("Tablas categorias y productos disponibles");
    } catch (error) {
        console.error("No se pudo conectar con MySQL:", error.message);
    }
}

comprobarConexion();

app.listen(PUERTO, () => {
    console.log(`Servidor disponible en http://localhost:${PUERTO}`);
});