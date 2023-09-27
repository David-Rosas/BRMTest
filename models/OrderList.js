const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/databaseConnection");
const User = require("./User");
const Order = require("./Order");
const Product = require("./Product");
const OrderList = sequelize.define(
  "orders_list",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    order_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "orders",
        key: "id",
      },
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "products",
        key: "id",
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    tableName: "orders_list",
  }
);

OrderList.belongsTo(Order, { foreignKey: "order_id" });
Order.hasMany(OrderList, { foreignKey: "order_id" });

OrderList.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(OrderList, { foreignKey: "product_id" });

module.exports = OrderList;
