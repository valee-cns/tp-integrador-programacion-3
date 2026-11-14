const responderErrorProducto = require("../utils/responderErrorProducto");

function validarProducto(req, res, next){
    const { nombre, descripcion, precio, categoriaId } = req.body ?? {};
    const id = req.idProductoValidado;
    const esEdicion = id !== undefined;
    const extension = req.file && obtenerExtensionImagen(req.file.buffer);

    if (typeof nombre !== "string" || !nombre.trim() || nombre.trim().length > 100) {
        return responderErrorProducto(req, res, 400, "Revisá el nombre del producto");
    }

    if (typeof descripcion !== "string" || !descripcion.trim()) {
        return responderErrorProducto(req, res, 400, "Revisá la descripción ingresada");
    }

    if (
        typeof precio !== "string" ||
        !/^\d{1,8}(\.\d{1,2})?$/.test(precio) ||
        Number(precio) <= 0
    ) {
        return responderErrorProducto(req, res, 400, "Revisá el precio del producto");
    }

    if (
        typeof categoriaId !== "string" ||
        !/^\d+$/.test(categoriaId) ||
        !Number.isSafeInteger(Number(categoriaId)) ||
        Number(categoriaId) <= 0
    ) {
        return responderErrorProducto(req, res, 400, "Revisá la categoría elegida");
    }

    if ((!esEdicion || req.file) && !extension) {
        return responderErrorProducto(req, res, 400, "Seleccioná una imagen JPEG o PNG");
    }

    req.productoValidado = { nombre, descripcion, precio, categoriaId, extension, esEdicion};
    next();
}

function obtenerExtensionImagen(buffer) {
    const firmaPng = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const firmaJpeg = Buffer.from([255, 216, 255]);

    if (buffer.subarray(0, firmaPng.length).equals(firmaPng)) return ".png";
    if (buffer.subarray(0, firmaJpeg.length).equals(firmaJpeg)) return ".jpg";

    return null;
}

module.exports = validarProducto;