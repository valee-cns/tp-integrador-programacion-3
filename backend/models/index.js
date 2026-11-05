const Categoria = require("./Categoria");
const Producto = require("./Producto");

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

module.exports = {
    Categoria,
    Producto
};