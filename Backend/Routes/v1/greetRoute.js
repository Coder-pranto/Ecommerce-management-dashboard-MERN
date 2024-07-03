const router = require('express').Router();
const greetingController = require('../../Controllers/greetingController');
const upload = require('../../Middlewares/imageUpload');

// Create a new greeting
router.post('/', upload, greetingController.createGreeting);

// Get all greetings
router.get('/', greetingController.getGreetings);

// Get a single greeting by ID
router.get('/:id', greetingController.getGreetingById);

// Update a greeting by ID
router.patch('/:id', upload, greetingController.updateGreeting);

// Delete a greeting by ID
router.delete('/:id', greetingController.deleteGreeting);

module.exports = router;
