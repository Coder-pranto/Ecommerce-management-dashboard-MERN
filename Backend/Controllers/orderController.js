const Order = require('../Models/order');
const Product = require('../Models/product');
const Customer = require('../Models/customer');
const Payment = require('../Models/payment');
const mongoose = require('mongoose');
// Create a new order
// exports.createOrder = async (req, res) => {
//   try {
//     const { customer, items } = req.body;

//     let totalAmount = 0;
//     const orderItems = await Promise.all(items.map(async item => {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         throw new Error(`Product with id ${item.product} not found`);
//       }
//       totalAmount += product.price * item.quantity; 

//       return {
//         product: product._id,
//         quantity: item.quantity,
//         price: product.price

//       };
//     }));

//     const newOrder = new Order({
//       customer,
//       items: orderItems,
//       totalAmount
//     });

//     const savedOrder = await newOrder.save();
//     res.status(201).json(savedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.createOrder = async (req, res) => {
  try {
    const { customer, items } = req.body;

    let totalAmount = 0;
    const orderItems = await Promise.all(items.map(async item => {
    //   const product = await Product.findById(item.product);
    //   if (!product) {
    //     throw new Error(`Product with id ${item.product} not found`);
    //   }
      totalAmount += item.price * item.quantity; 

      return {
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        size:item.size||'',
        color:item.color||''
      };
    }));

    const newOrder = new Order({
      customer,
      items: orderItems,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
      const { orderId, status } = req.body;
    //   console.log(req.body)

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      order.orderStatus = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  
  // Get order history for a customer
exports.getOrderHistory = async (req, res) => {
    try {
      const customerId = req.params.customerId;
  
      const orders = await Order.find({ customer: customerId }).populate('items.product');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.getOrderAllHistory = async (req, res) => {
    try {
      const customerId = req.params.customerId;
  
      const orders = await Order.find({});
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json('No Order Found');
    }

    res.status(200).json('Order deleted');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  

// Process payment (dummy implementation)
exports.processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.totalAmount !== amount) {
      return res.status(400).json({ message: 'Payment amount does not match order total' });
    }

    const payment = new Payment({
      order: orderId,
      amount,
      paymentMethod,
      paymentStatus: 'Completed', // Assume payment is always successful for this dummy implementation
      transactionId: `TXN${Date.now()}`
    });

    const savedPayment = await payment.save();

    order.paymentStatus = 'Paid';
    await order.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

