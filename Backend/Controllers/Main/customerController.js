const Customer = require('../../Models/customer');
const User = require('../../Models/user');

const { hashPassword } = require('../../Util/HashPassword');

class CustomerController {
    async getAllCustomers(req, res) {
        try {
            const customers = await Customer.find({});
            const names = customers.map(customers => customers.name);
            res.status(200).send(customers);
            // console.log(customers);
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async registrationWithEmail(req, res) {
        try {
            if (req.body.email) {
                const alreadyUser = await User.findOne({ email: req.body.email });

                if (!alreadyUser) {
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        contact_no: req.body.contact_no ? req.body.contact_no : 'n/a',
                        password: hashPassword(req.body.password),
                        user_type: 'coustomer'
                    });
                    const userResult = await user.save();

                    const customer = new Customer({
                        name: req.body.name,
                        email: req.body.email,
                        contact_no: req.body.contact_no ? req.body.contact_no : 'n/a',
                        address: req.body.address ? req.body.address : 'n/a',
                        date_of_birth: req.body.date_of_birth,
                        gender: req.body.gender,
                        wishlist: req.body.wishlist ? req.body.wishlist : [],
                        user_id: userResult._id
                    });
                    const customerResult = await customer.save();
                    res.send(customerResult);
                }

                if (alreadyUser) {
                    res.send({ msg: "Alrady Existed User" });
                }
            } else {
                res.send({ msg: "email number not found" });
            }

        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async registrationWithContactNo(req, res) {
        try {
            if (req.body.contact_no) {
                const alreadyUser = await User.findOne({ contact_no: req.body.contact_no });

                if (!alreadyUser) {
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email ? req.body.email : 'n/a',
                        contact_no: req.body.contact_no,
                        password: hashPassword(req.body.password),
                        user_type: 'coustomer'
                    });
                    const userResult = await user.save();

                    const customer = new Customer({
                        name: req.body.name,
                        email: req.body.email ? req.body.email : 'n/a',
                        contact_no: req.body.contact_no,
                        address: req.body.address ? req.body.address : 'n/a',
                        date_of_birth: req.body.date_of_birth,
                        gender: req.body.gender,
                        wishlist: req.body.wishlist ? req.body.wishlist : [],
                        user_id: userResult._id
                    });
                    const customerResult = await customer.save();
                    res.send(customerResult);
                }
                if (alreadyUser) {
                    res.send({ msg: "Alrady Existed User" });
                }
            } else {
                res.send({ msg: "contact number not found" });
            }

        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async getCustomerDetailsByUserId(req, res) {
        // console.log(req.params);
        try {
            const customer = await Customer.findOne({ _id: req.params.id });
            res.status(200).send(customer);
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async getCustomerDetailsByUserEmail(req, res) {
        try {
            const customer = await Customer.findOne({ email: req.params.email }, { projection: { _id: 0 } }).populate('user_id');
            res.status(200).send(customer);
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async getCustomerDetailsByUserContactNo(req, res) {
        try {
            const customer = await Customer.findOne({ contact_no: req.params.contact }, { projection: { _id: 0 } }).populate('user_id');
            res.status(200).send(customer);
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async updateCustomer(req, res) {
        // console.log(req.body);
        try {
            const alredyCustomer = await Customer.findOne({ _id: req.params.id });
            // console.log(alredyCustomer);
            const allAddress={
                preAddress: alredyCustomer.address,
                newAddress: req.body.address
            }
            const result = await Customer.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        contact_no: req.body.contact,
                        date_of_birth: req.body.date_of_birth,
                        gender: req.body.gender,
                        wishlist: req.body.wishlist,
                        address: req.body.address
                    },
                    $inc: {
                        __v: 1,
                    },
                    
                },
                { new: true } // Return the updated document
            );
            // console.log(result);
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ status: 404, msg: "Customer Not Found" });
            }
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }
    async deleteCustomer(req, res) {
        // console.log(req.params);
        // res.send({ status: 'success', message: 'Customer Deleted' });
        try {
            const result = await Customer.deleteOne({ _id: req.params.id });
            if (result.deletedCount > 0) {
                res.send({ status: 'success', message: 'Customer Deleted' });
            } else {
                res.send({ status: 'failed', message: 'Customer Not Deleted' });
            }
        } catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }
}

module.exports = new CustomerController();