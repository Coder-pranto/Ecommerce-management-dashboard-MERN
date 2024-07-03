const ProductItem = require("../Models/productItem");

class StockController {
  async addStock(req, res) {
    try {
      let success = 0;
      let currentTime = Date.now();
      console.log(req.body);
      for (let i = 0; i < Number(req.body.quantity); i++) {
        const stock = new ProductItem({
          product_id: req.body.product_id,
          sku: currentTime.toString() + (10000 + i).toString(),
          status: req.body.status,
          buying_date: req.body.buying_date,
          buying_price: req.body.buying_price,
          selling_price: req.body.selling_price,
          order_id: req.body.order_id,
        });
        const result = await stock.save();
        if (result) success++;
        console.log(stock.sku);
      }
      if (success === req.body.quantity) return res.sendStatus(200);
      else return res.sendStatus(500);
    } catch (error) {
      console.error("Error adding stock: ", error);
      res.status(500);
    }
  }

  async deleteStock(req, res) {
    try {
      const result = await ProductItem.deleteOne({ _id: req.body._id });

      if (result.deletedCount > 0) {
        res.status(200).send({ message: "Stock deleted successfully" });
      } else {
        res.status(404).send({ message: "Stock not found" });
      }
    } catch (error) {
      res.status(500);
    }
  }

  async getStock(req, res) {
    try {
      const stock = await ProductItem.findOne({});
      if (stock) {
        res.status(200).send(stock);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.status(500).send({ error: "An error occurred" });
    }
  }
}

module.exports = new StockController();
