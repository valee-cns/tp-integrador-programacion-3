const sequelize = require("../config/database");
const { Producto, Venta, DetalleVenta } = require("../models");

function convertirACentavos(precio) {
    const [pesos, centavos = ""] = String(precio).split(".");

    return Number(pesos) * 100 +
        Number(centavos.padEnd(2, "0"));
}

function rechazarCompra(mensaje) {
    const error = new Error(mensaje);
    error.status = 400;
    throw error;
}

async function registrarVenta(req, res) {
    const { nombreCliente, productos } = req.ventaValidada;

    try {
        const venta = await sequelize.transaction(async (transaction) => {
            const detalles = [];
            let totalCentavos = 0;

            for (const item of productos) {
                const producto = await Producto.findOne({
                    where: {
                        id: item.productoId,
                        activo: true
                    },
                    transaction
                });

                if (!producto) {
                    rechazarCompra(
                        `El producto ${item.productoId} no existe o está inactivo.`
                    );
                }

                const precioCentavos = convertirACentavos(producto.precio);
                const subtotalCentavos = precioCentavos * item.cantidad;

                if (!Number.isSafeInteger(subtotalCentavos)) {
                    rechazarCompra("El importe del producto es demasiado grande.");
                }

                totalCentavos += subtotalCentavos;

                if (!Number.isSafeInteger(totalCentavos) || totalCentavos > 999999999999) {
                    rechazarCompra("El total supera el importe permitido.");
                }

                detalles.push({
                    productoId: producto.id,
                    cantidad: item.cantidad,
                    precioUnitario: producto.precio
                });
            }

            const nuevaVenta = await Venta.create({
                nombreCliente,
                total: (totalCentavos / 100).toFixed(2)
            }, {
                transaction
            });

            for (const detalle of detalles) {
                await DetalleVenta.create({
                    ventaId: nuevaVenta.id,
                    productoId: detalle.productoId,
                    cantidad: detalle.cantidad,
                    precioUnitario: detalle.precioUnitario
                }, {
                    transaction
                });
            }

            return nuevaVenta;
        });

        res.status(201).json({
            mensaje: "Venta registrada correctamente.",
            ventaId: venta.id,
            total: venta.total
        });
    } catch (error) {
        if (error.status === 400) {
            return res.status(400).json({error: error.message});
        }

        console.error("Error al registrar venta:", error);

        res.status(500).json({
            error: "No se pudo registrar la venta."
        });
    }
}

async function obtenerVenta(req, res) {
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
            return res.status(404).json({
                error: "La venta no existe."
            });
        }

        res.json(venta);
    } catch (error) {
        console.error("Error al consultar venta:", error);

        res.status(500).json({
            error: "No se pudo consultar la venta."
        });
    }
}

module.exports = { registrarVenta, obtenerVenta };