const sequelize = require("../config/database");
const { Categoria, Producto } = require("../models");

async function cargarProductos() {
    try {
        await sequelize.authenticate();

        await Categoria.sync();
        await Producto.sync();

        const grupos = [
            {
                categoria: "Magic: The Gathering",
                productos: [
                    {
                        nombre: "Sobre de Magic - Foundations",
                        descripcion: "Sobre sellado de cartas de la colección Foundations.",
                        precio: "8500.00"
                    },
                    {
                        nombre: "Bundle de Magic - Foundations",
                        descripcion: "Pack sellado de la colección Foundations.",
                        precio: "75000.00"
                    },
                    {
                        nombre: "Mazo de Magic - Commander",
                        descripcion: "Mazo preconstruido para jugar Commander.",
                        precio: "65000.00"
                    },
                    {
                        nombre: "Carta individual - Llanowar Elves",
                        descripcion: "Carta individual de Magic para ampliar tu colección.",
                        precio: "1500.00"
                    }
                ]
            },
            {
                categoria: "Videojuegos",
                productos: [
                    {
                        nombre: "Minecraft - Nintendo Switch",
                        descripcion: "Videojuego físico de construcción y exploración.",
                        precio: "55000.00"
                    },
                    {
                        nombre: "Mario Kart 8 Deluxe - Nintendo Switch",
                        descripcion: "Videojuego físico de carreras.",
                        precio: "85000.00"
                    },
                    {
                        nombre: "God of War Ragnarök - PS5",
                        descripcion: "Videojuego físico de acción y aventura.",
                        precio: "78000.00"
                    },
                    {
                        nombre: "Gran Turismo 7 - PS5",
                        descripcion: "Videojuego físico de conducción.",
                        precio: "70000.00"
                    }
                ]
            }
        ];

        for (const grupo of grupos) {
            const categoria = await Categoria.findOne({
                where: { nombre: grupo.categoria }
            });

            if (!categoria) {
                throw new Error(
                    `Falta la categoría ${grupo.categoria}. Ejecutá cargarCategorias.js.`
                );
            }

            for (const datos of grupo.productos) {
                const [producto, creado] = await Producto.findOrCreate({
                    where: {
                        nombre: datos.nombre,
                        categoriaId: categoria.id
                    },
                    defaults: {
                        descripcion: datos.descripcion,
                        precio: datos.precio,
                        imagen: "/img/producto-pendiente.png"
                    }
                });

                console.log(
                    `${producto.nombre}: ${creado ? "creado" : "ya existía"}`
                );
            }
        }
    } catch (error) {
        console.error("No se pudieron cargar los productos:", error.message);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

cargarProductos();