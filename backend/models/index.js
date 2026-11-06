const Categoria = require("./Categoria");
const Producto = require("./Producto");
const Venta = require("./Venta");
const DetalleVenta = require("./DetalleVenta");
const Usuario = require("./Usuario");

Categoria.hasMany(Producto, {
    foreignKey: "categoriaId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

Producto.belongsTo(Categoria, {
    foreignKey: "categoriaId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

Venta.belongsToMany(Producto, {
    through: DetalleVenta,
    foreignKey: "ventaId",
    otherKey: "productoId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

Producto.belongsToMany(Venta, {
    through: DetalleVenta,
    foreignKey: "productoId",
    otherKey: "ventaId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

Venta.hasMany(DetalleVenta, {
    foreignKey: "ventaId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

DetalleVenta.belongsTo(Venta, {
    foreignKey: "ventaId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

Producto.hasMany(DetalleVenta, {
    foreignKey: "productoId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

DetalleVenta.belongsTo(Producto, {
    foreignKey: "productoId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

module.exports = {
    Categoria,
    Producto,
    Venta,
    DetalleVenta,
    Usuario
};