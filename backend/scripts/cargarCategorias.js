const sequelize = require("../config/database");
const Categoria = require("../models/Categoria");

async function cargarCategorias() {
    try {
        await sequelize.authenticate();
        await Categoria.sync();

        const nombres = ["Magic: The Gathering", "Videojuegos"];

        for (const nombre of nombres) {
            const [categoria, creada] = await Categoria.findOrCreate({
                where: { nombre: nombre }
            });

            console.log(
                `${categoria.nombre}: ${creada ? "creada" : "ya existía"}`
            );
        }
    } catch (error) {
        console.error("No se pudieron cargar las categorías:", error.message);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

cargarCategorias();