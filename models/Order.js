const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/databaseConnection");
const User = require("./User");
const Order =sequelize.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      purchase_date: {
        type: Sequelize.DATEONLY,
      },
      price_total: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        }
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

    Order.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Order, { foreignKey: 'user_id' });

module.exports = Order;