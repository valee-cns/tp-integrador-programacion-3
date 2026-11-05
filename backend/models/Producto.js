const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define("Producto", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "productos",
    timestamps: false
});

module.exports = Producto;