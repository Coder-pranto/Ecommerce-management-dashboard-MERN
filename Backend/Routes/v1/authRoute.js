const router = require('express').Router();
const { loginAdmin } = require('../../Controllers/userController');

router.post('/login', loginAdmin);

module.exports = router;
