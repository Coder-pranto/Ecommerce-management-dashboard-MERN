const OrderPaymentType = require('../Models/orderPaymentType');

class UserTypeController {
    async getAllOrderPaymentType(req, res) {
        try {
            const orderPaymentType = await OrderPaymentType.find({}, { name: 1 });
            res.status(200).send(orderPaymentType);
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async saveOrderPaymentType(req, res) {
        try {
            const alreadyOrderPaymentType = await OrderPaymentType.findOne(
                {
                    name: req.body.name
                }
            );
            if (alreadyOrderPaymentType) return res.sendStatus(400);
            const orderPaymentType = new OrderPaymentType({
                name: req.body.name
            })
            const result = orderPaymentType.save();
            return res.sendStatus(200);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    async updateOrderPaymentType(req, res) {
        try {
            const alreadyOrderPaymentType = await OrderPaymentType.findOne(
                {
                    name: req.body.name
                }
            );
            if (alreadyOrderPaymentType) return res.sendStatus(400);
            const updatedOrderPaymentType = await OrderPaymentType.findOneAndUpdate(
                {
                    _id: req.body.id
                },
                {
                    $set: {
                        name: req.body.name
                    },
                    $inc: {
                        __v: 1,
                    },
                },
                { new: true }
            );
            if (!updatedOrderPaymentType) return res.send({ mgs: "Not exist" });
            return res.sendStatus(200);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    async deleteOrderPaymentType(req, res) {
        try {
            const result = await OrderPaymentType.deleteOne({ _id: req.body.id });
            if (result.deletedCount > 0) {
                res.sendStatus(200);
            } else {
                res.status(404).send({ message: 'OrderPaymentType not found' });
            }
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }
}

module.exports = new UserTypeController();