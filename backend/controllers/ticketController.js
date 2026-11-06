const path = require("path");
const ejs = require("ejs");
const { Venta, DetalleVenta, Producto } = require("../models");

function mostrarImporte(importe) {
    return Number(importe).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS"
    });
}

async function descargarTicketPdf(req, res) {
    try {
        const venta = await Venta.findByPk(req.idVenta, {
            include: [
                {
                    model: DetalleVenta,
                    include: [
                        {
                            model: Producto,
                            attributes: ["id", "nombre"]
                        }
                    ]
                }
            ]
        });

        if (!venta) {
            return res.status(404).json({error: "La venta no existe."});
        }

        const rutaPlantilla = path.join(
            __dirname,
            "..",
            "views",
            "ticketPdf.ejs"
        );

        const html = await ejs.renderFile(rutaPlantilla, {
            venta,
            fechaFormateada: new Date(venta.fecha).toLocaleString("es-AR", {timeZone: "America/Argentina/Buenos_Aires"}),
            mostrarImporte
        });

        const { default: puppeteer } = await import("puppeteer");
        const navegador = await puppeteer.launch({headless: true});

        let pdf;

        try {
            const pagina = await navegador.newPage();

            await pagina.setContent(html, {waitUntil: "load"});

            pdf = await pagina.pdf({
                format: "A4",
                printBackground: true,
                margin: {
                    top: "20mm",
                    bottom: "20mm",
                    left: "15mm",
                    right: "15mm"
                }
            });
        } finally {
            await navegador.close();
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="ticket-${venta.id}.pdf"`);

        res.send(Buffer.from(pdf));
    } catch (error) {
        console.error("Error al generar ticket PDF:", error);

        res.status(500).json({error: "No se pudo generar el ticket PDF."});
    }
}

module.exports = { descargarTicketPdf };