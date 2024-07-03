const OrderStatus = require('../Models/orderStatus');

class OrderStatusController {
  async getOrderStatuses(req, res) {
    try {
      const orderStatus = await OrderStatus.find({}, { _id: 0 });
      const names = orderStatus.map(orderStatus => orderStatus.name);
      res.status(200).send(names);
    } catch (error) {
      res.status(500).send({ error: 'An error occurred' });
    }
  }
}

module.exports = new OrderStatusController();
