const multer = require("multer");

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
            return res.status(413).send("La imagen debe pesar como máximo 2 MiB.");
        }

        if (error) {
            return res.status(400).send("No se pudo recibir el formulario. Volvé a intentarlo.");
        }

        next();
    });
}

module.exports = subirImagenProducto;