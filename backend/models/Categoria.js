const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Categoria = sequelize.define("Categoria", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
}, {
    tableName: "categorias",
    timestamps: false
});

module.exports = Categoria;