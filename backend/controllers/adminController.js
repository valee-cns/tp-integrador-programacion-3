const { Categoria, Producto } = require("../models");
const path = require("node:path");
const fs = require("node:fs/promises");
const { randomUUID } = require("node:crypto");

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
    const id = Number(req.params.id);
    const activo = req.body?.activo;

    if (!Number.isSafeInteger(id) || id < 1 || typeof activo !== "boolean") {
        return res.status(400).json({error: "El ID debe ser un entero positivo y el estado debe ser true o false."});
    }

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

function obtenerExtensionImagen(buffer) {
    const firmaPng = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const firmaJpeg = Buffer.from([255, 216, 255]);

    if (buffer.subarray(0, firmaPng.length).equals(firmaPng)) return ".png";
    if (buffer.subarray(0, firmaJpeg.length).equals(firmaJpeg)) return ".jpg";

    return null;
}

async function guardarProducto(req, res, next) {
    const { nombre, descripcion, precio, categoriaId } = req.body ?? {};
    const extension = req.file && obtenerExtensionImagen(req.file.buffer);
    const id = req.params.id;
    const esEdicion = id !== undefined;

    if (typeof nombre !== "string" || !nombre.trim() || nombre.trim().length > 100) {
        return res.status(400).send("Revisá el nombre del producto");
    }

    if (typeof descripcion !== "string" || !descripcion.trim()) {
        return res.status(400).send("Revisá la descripción ingresada");
    }

    if (
        typeof precio !== "string" ||
        !/^\d{1,8}(\.\d{1,2})?$/.test(precio) ||
        Number(precio) <= 0
    ) {
        return res.status(400).send("Revisá el precio del producto");
    }

    if (
        typeof categoriaId !== "string" ||
        !/^\d+$/.test(categoriaId) ||
        !Number.isSafeInteger(Number(categoriaId)) ||
        Number(categoriaId) <= 0
    ) {
        return res.status(400).send("Revisá la categoría elegida");
    }

    if ((!esEdicion || req.file) && !extension) {
        return res.status(400).send("Seleccioná una imagen JPEG o PNG.");
    }

    try {
        let producto;

        if (esEdicion) {
            const idProducto = Number(id);

            if (!/^\d+$/.test(id) || !Number.isSafeInteger(idProducto) || idProducto < 1) {
                return res.status(400).send("El ID de producto no es válido.");
            }

            producto = await Producto.findByPk(idProducto);

            if (!producto) {
                return res.status(404).send("Producto no encontrado.");
            }
        }

        const categoria = await Categoria.findByPk(Number(categoriaId));

        if (!categoria) {
            return res.status(400).send("La categoría seleccionada no existe.");
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
                await Producto.create({ ...datos, activo: true });
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

        return res.redirect(303, "/admin/dashboard");
    } catch (error) {
        next(error);
    }
}

async function mostrarEdicionProducto(req, res, next) {
    const id = Number(req.params.id);

    if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1) {
        return res.status(400).send("El ID de producto no es válido.");
    }

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