const Order = require("../models/Order");
const OrderList = require("../models/OrderList");
const Product = require("../models/Product");
const User = require("../models/User");

module.exports = {
  async createOrder(req, res) {
    try {
      
      const newOrder = await Order.create({
        purchase_date: new Date(),
        price_total: 0,
        user_id: req.user.idUser,
      });

      const products = req.body.products;

      for (const product of products) {
        const { product_id, quantity } = product;
        
        const productP = await Product.findByPk(product_id);
        //verificar si el producto existe
        if (!productP) {
          return res.status(400).json({ error: "Producto no encontrado." });
        }
        //verificar si hay suficiente cantidad de productos
        if (productP.quantity_available < quantity) {
          return res.status(400).json({
            error: "Cantidad disponible insuficiente para el producto.",
          });
        }
        await OrderList.create({ order_id: newOrder.id, product_id, quantity });

        const productPrice = productP.price;

        newOrder.price_total += productPrice * quantity;

        //Descontamos la cantidad disponible
        productP.quantity_available -= quantity;
        await productP.save();
      }

      await newOrder.save();

      return res.status(201).json(newOrder);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al crear la orden y agregar productos." });
    }
  },

  async getInvoice(req, res) {
    try {
      const orderId = req.params.orderId;

      const order = await Order.findOne({
        where: {
          id: orderId,
          user_id: req.user.idUser,
        },
        include: [{ model: OrderList, include: [Product] }, User],
      });

      if (!order) {
        return res.status(404).json({ error: "Compra no encontrada." });
      }
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener la factura." });
    }
  },
  async purchaseHistory(req, res) {
    try {
      const orders = await Order.findAll({
        where: { user_id: req.user.idUser },
        include: [{ model: OrderList, include: [Product] }],
      });

      return res.status(200).json(orders);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al obtener el historial de compras." });
    }
  },
  async getAllCustomerPurchases(req, res) {
    try {
      const userRole = req.user.role;
      if (userRole !== "administrator") {
        return res
          .status(401)
          .send({ error: "No estas autorizado para ver todos los productos" });
      }
      const allPurchases = await Order.findAll({
        include: [
          { model: User, attributes: ['name', 'email'] }, 
          {
            model: OrderList,
            include: [
              Product,
            ],
          },
        ],
      });
  
      return res.status(200).json(allPurchases);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener todas las compras de los clientes.' });
    }
  }
  
};
