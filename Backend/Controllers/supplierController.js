const Supplier = require('../Models/supplier');

class SupplierController {
    async getAllSupplier(req, res) {
        try {
            res.status(200).send(await Supplier.find({}));
        } catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }

    async getSupplier(req, res) {
        try {
            const alreadySupplier = await Supplier.findOne({ _id: req.params.supplier_id })
            res.status(200).send(alreadySupplier);
        } catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }

    async saveSupplier(req, res) {
        try {
            const alreadySupplier = await Supplier.findOne(
                {
                    name: req.body.supplier_name
                }
            );
            if (alreadySupplier) return res.send({ status: "failed", message: "Already in Supplier" });
            const supplier = new Supplier({
                name: req.body.supplier_name,
                contact: req.body.contact,
                email: req.body.email,
                address: req.body.address
            })
            const result = supplier.save();
            return res.send({ status: "success", message: "Supplier Added" });
        } catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }

    async updateSupplier(req, res) {
        try {
            const alreadySupplier = await Supplier.findOne(
                {
                    name: req.body.supplier_name
                }
            );
            if (alreadySupplier) return res.send({ status: "failed", message: "Already in Supplier" });
            const updatedSupplier = await Supplier.findOneAndUpdate(
                {
                    _id: req.body.supplier_id
                },
                {
                    $set: {
                        name: req.body.supplier_name,
                        contact: req.body.contact,
                        email: req.body.email,
                        address: req.body.address
                    },
                    $inc: {
                        __v: 1,
                    },
                },
                { new: true }
            );
            if (!updatedSupplier) return res.send({ status: "failed", message: "Supplier Not Updated" });
            return res.send({ status: "success", message: "Supplier Updated" });
        } catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }

    async deleteSupplier(req, res) {
        
        try {
            const result = await Supplier.deleteOne({ _id: req.params.supplier_id });
            if (result.deletedCount > 0) {
                res.send({ status: 'success', message: 'Supplier Deleted' });
            } else {
                res.send({ status: 'failed', message: 'Supplier Not Deleted' });
            }
        } catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }
}

module.exports = new SupplierController();