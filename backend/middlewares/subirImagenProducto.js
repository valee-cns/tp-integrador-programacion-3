const multer = require("multer");
const responderErrorProducto = require("../utils/responderErrorProducto");

const recibirImagen = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 1,
        fields: 4,
        fieldSize: 16 * 1024
    }
}).single("imagen");

function subirImagenProducto(req, res, next) {
    recibirImagen(req, res, (error) => {
        if (error?.code === "LIMIT_FILE_SIZE") {
            return responderErrorProducto(req, res, 413, "La imagen es muy pesada");
        }

        if (error) {
            return responderErrorProducto(req, res, 400, "No se pudo recibir el formulario. Volvé a intentarlo");
        }

        next();
    });
}

module.exports = subirImagenProducto;