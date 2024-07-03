const User = require('../../Models/user');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../../Util/HashPassword');

class UserController {
    async getAllUser(req, res) {
        try {
            const users = await User.find({});
            res.status(200).send(users);
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }
    async getNumberofUser(req, res) {
        try {
            const userList = await User.find({}, { _id: 0 });
            res.status(200).send({ value: userList.length });
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async getUserDetailsByUserId(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.id });
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async updatePassword(req, res) {
        try {
            const alreadyUser = await User.findOne({ _id: req.body.id });
            if (alreadyUser) {
                bcrypt.compare(req.body.old_password, alreadyUser.password).then(async function (result) {
                    if (result) {
                        const result = await User.findOneAndUpdate(
                            { _id: req.body.id },
                            {
                                $set: {
                                    password: hashPassword(req.body.new_password)
                                },
                                $inc: {
                                    __v: 1,
                                },
                            },
                            { new: true } // Return the updated document
                        );
                        if (result) {
                            res.status(200).send({ msg: "Password Updated" });
                        } else {
                            res.status(200).send({ msg: "Password Not Updated" });
                        }
                    } else {
                        res.send({ msg: "Previous Password Not Match!" })
                    }
                });
            } else {
                res.status(404).send({ status: 404, msg: "User Not Found" });
            }
        } catch (error) {
            // console.error(error);
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async updateUser(req, res) {
        try {
            const alreadyUser = await User.findOne({ _id: req.params.id });

            const result = await User.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        contact_no: req.body.contact_no,
                        user_type: req.body.user_type
                        // date_of_birth: req.body.date_of_birth,
                        // gender: req.body.gender,
                        // wishlist: req.body.wishlist,
                        // address: req.body.address
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
                res.status(404).send({ status: 404, msg: "User Not Found" });
            }
        } catch (error) {
            res.status(500).send({ error: 'An error occurred' });
        }
    }

    async deleteUser(req, res) {
        try {
            const result = await User.deleteOne({ _id: req.params.id });
            if (result.deletedCount > 0) {
                res.send({ status: 'success', message: 'User Deleted' });
            } else {
                res.send({ status: 'failed', message: 'User Not Deleted' });
            }
        } catch (error) {
            res.send({ status: "failed", message: "Something Went To Wrong" });
        }
    }
}

module.exports = new UserController();



// const User = require('../Models/user');
// const bcrypt = require('bcrypt');
// const { hashPassword } = require('../Util/HashPassword');

// class UserController {
//     async getAllUser(req, res) {
//         try {
//             const user = await User.find({}, { _id: 0, name: 1 });
//             const userNames = user.map(user => user.name);
//             res.status(200).send(userNames);
//         } catch (error) {
//             res.status(500).send({ error: 'An error occurred' });
//         }
//     }
//     async getNumberofUser(req, res) {
//         try {
//             const userList = await User.find({}, { _id: 0 });
//             res.status(200).send({ value: userList.length });
//         } catch (error) {
//             res.status(500).send({ error: 'An error occurred' });
//         }
//     }

//     async updatePassword(req, res) {
//         try {
//             const alreadyUser = await User.findOne({ _id: req.body.id });
//             if (alreadyUser) {
//                 bcrypt.compare(req.body.old_password, alreadyUser.password).then(async function (result) {
//                     if (result) {
//                         const result = await User.findOneAndUpdate(
//                             { _id: req.body.id },
//                             {
//                                 $set: {
//                                     password: hashPassword(req.body.new_password)
//                                 },
//                                 $inc: {
//                                     __v: 1,
//                                 },
//                             },
//                             { new: true } // Return the updated document
//                         );
//                         if (result) {
//                             res.status(200).send({ msg: "Password Updated" });
//                         } else {
//                             res.status(200).send({ msg: "Password Not Updated" });
//                         }
//                     } else {
//                         res.send({ msg: "Previous Password Not Match!" })
//                     }
//                 });
//             } else {
//                 res.status(404).send({ status: 404, msg: "User Not Found" });
//             }
//         } catch (error) {
//             // console.error(error);
//             res.status(500).send({ error: 'An error occurred' });
//         }
//     }
// }

// module.exports = new UserController();