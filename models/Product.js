const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/databaseConnection");

const Product =sequelize.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      number_lot: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER
      },
      quantity_available: {
        type: Sequelize.INTEGER,
      },
      date_of_admission: {
        type: Sequelize.DATEONLY,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });


module.exports = Product;