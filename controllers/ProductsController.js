const Product = require("../models/Product");
const moment = require("moment");

module.exports = {
  async createProduct(req, res) {
    try {
      const userRole = req.user.role;
      if (userRole !== "administrator") {
        return res
          .status(401)
          .send({ error: "No estas autorizado para crear productos" });
      }
      const { number_lot, name, price, quantity_available, date_of_admission } =
        req.body;

      const newProduct = await Product.create({
        number_lot: number_lot,
        name: name,
        price: price,
        quantity_available: quantity_available,
        date_of_admission: moment(date_of_admission, "YYYY/MM/DD").toDate(),
      });

      return res.status(201).send(newProduct);
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },

  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      return res.status(200).send(products);
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },

  async getProductById(req, res) {
    try {
      const { productId } = req.params;
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).send({ error: "Producto no encontrado" });
      }

      return res.status(200).send(product);
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },

  async updateProduct(req, res) {
    try {
      const userRole = req.user.role;
      if (userRole !== "administrator") {
        return res
          .status(401)
          .send({ error: "No estas autorizado para editar productos" });
      }
      const { productId } = req.params;
      const { number_lot, name, price, quantity_available, date_of_admission } =
        req.body;

      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).send({ error: "Producto no encontrado" });
      }

      // Actualiza los campos del producto
      product.number_lot = number_lot;
      product.name = name;
      product.price = price;
      product.quantity_available = quantity_available;
      product.date_of_admission = date_of_admission;

      await product.save();

      return res.status(200).send(product);
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },

  async deleteProduct(req, res) {
    try {
      const userRole = req.user.role;
      if (userRole !== "administrator") {
        return res
          .status(401)
          .send({ error: "No estas autorizado para eliminar productos" });
      }
      const { productId } = req.params;

      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).send({ error: "Producto no encontrado" });
      }

      await product.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },
};
