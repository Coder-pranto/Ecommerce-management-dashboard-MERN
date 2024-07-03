const router = require('express').Router();
const { registerUser, loginUser, deleteUser, updateUser, getUserById, getAllUsers } = require('../../Controllers/userController');
const { authorizationChecker } = require('../../Util/jwt');


router.post('/register', registerUser);
router.post('/login', loginUser);

// Delete a user (Admin only)
router.delete('/users/:userId', authorizationChecker('admin'), deleteUser);

// Update a user (only for user_type change)
router.patch('/users/:userId',authorizationChecker('admin'), updateUser);


router.get('/users/:userId', authorizationChecker('admin'), getUserById);


router.get('/users',authorizationChecker('admin'), getAllUsers);

module.exports = router;
