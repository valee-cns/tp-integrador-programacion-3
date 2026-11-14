const { Categoria, Producto } = require("../models");
const path = require("node:path");
const fs = require("node:fs/promises");
const { randomUUID } = require("node:crypto");
const responderErrorProducto = require("../utils/responderErrorProducto");

async function mostrarDashboard(req, res) {
    try {
        const categorias = await Categoria.findAll({order: [["id", "ASC"]]});

        const productos = await Producto.findAll({order: [["id", "ASC"]]});

        res.setHeader("Cache-Control", "no-store");

        res.render("dashboard", {administrador: req.admin, categorias, productos});
    }catch (error){
        console.error("Error al cargar panel:", error);

        res.status(500).send("No se pudo cargar el panel.");
    }
}

async function cambiarEstadoProducto(req, res) {
    const { id, activo } = req.estadoProductoValidado;

    try {
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({error: "El producto no existe."});
        }

        await producto.update({ activo });

        return res.json({
            id: producto.id,
            activo: producto.activo
        });
    } catch (error) {
        console.error("Error al cambiar el estado del producto:", error);
        return res.status(500).json({error: "No se pudo cambiar el estado del producto."});
    }
}

async function mostrarAltaProducto(req, res, next) {
    try {
        const categorias = await Categoria.findAll({
            order: [["nombre", "ASC"]]
        });

        res.render("altaProducto", { categorias });
    } catch (error) {
        next(error);
    }
}

async function guardarProducto(req, res, next) {
    const { nombre, descripcion, precio, categoriaId, extension, esEdicion } = req.productoValidado;
    
    try {
        let producto;

        if (esEdicion) {
            producto = await Producto.findByPk(req.idProductoValidado);

            if (!producto) {
                return responderErrorProducto(req, res, 404, "Producto no encontrado");
            }
        }

        const categoria = await Categoria.findByPk(Number(categoriaId));

        if (!categoria) {
            return responderErrorProducto(req, res, 400, "La categoría seleccionada no existe");
        }

        const datos = {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio,
            categoriaId: categoria.id
        };

        let rutaNueva;

        if (req.file) {
            const carpeta = path.join(__dirname, "..", "..", "frontend", "img", "productos");
            const nombreArchivo = `${randomUUID()}${extension}`;
            const rutaArchivo = path.join(carpeta, nombreArchivo);

            await fs.mkdir(carpeta, { recursive: true });
            await fs.writeFile(rutaArchivo, req.file.buffer, { flag: "wx" });

            rutaNueva = rutaArchivo;
            datos.imagen = `/img/productos/${nombreArchivo}`;
        }

        try {
            if (esEdicion) {
                await producto.update(datos);
            } else {
                producto = await Producto.create({ ...datos, activo: true });
            }
        } catch (error) {
            if (rutaNueva) {
                try {
                    await fs.unlink(rutaNueva);
                } catch (errorLimpieza) {
                    console.error("No se pudo eliminar la imagen nueva", errorLimpieza);
                }
            }

            throw error;
        }

        if (req.baseUrl === "/api") {
            return res.status(esEdicion ? 200 : 201).json(producto);
        }

        return res.redirect(303, "/admin/dashboard");
    } catch (error) {
        next(error);
    }
}

async function mostrarEdicionProducto(req, res, next) {
    const id = req.idProductoValidado;

    try {
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).send("Producto no encontrado.");
        }

        const categorias = await Categoria.findAll({
            order: [["nombre", "ASC"]]
        });

        return res.render("editarProducto", { producto, categorias });
    } catch (error) {
        next(error);
    }
}

module.exports = { mostrarDashboard, cambiarEstadoProducto, mostrarAltaProducto, guardarProducto, mostrarEdicionProducto };