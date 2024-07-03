const Greeting = require('../Models/greeting'); 

// Create a new greeting
exports.createGreeting = async (req, res) => {
  try {
    const { title, content, buttonText, buttonLink, isActive } = req.body;
    let greet_img = req.files?.greet_img ? req.files.greet_img[0].filename : null;
    console.log(req.files)

    const newGreeting = new Greeting({
      title,
      content,
      buttonText,
      buttonLink,
      greet_img,
      isActive,
    });

    await newGreeting.save();
    res.status(201).json(newGreeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all greetings
exports.getGreetings = async (req, res) => {
  try {
    const greetings = await Greeting.find();
    res.status(200).json(greetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single greeting by ID
exports.getGreetingById = async (req, res) => {
  try {
    const greeting = await Greeting.findById(req.params.id);
    if (!greeting) return res.status(404).json({ message: 'Greeting not found' });
    res.status(200).json(greeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a greeting by ID
exports.updateGreeting = async (req, res) => {
    try {
      const { title, content, buttonText, buttonLink, isActive } = req.body;
  
      // Fetch the existing greeting
      const existingGreeting = await Greeting.findById(req.params.id);
      if (!existingGreeting) return res.status(404).json({ message: 'Greeting not found' });
  
      // Check if a new image was uploaded
      const greet_img = req.files?.greet_img ? req.files.greet_img[0].filename : existingGreeting.greet_img;
  
      // Update the greeting with new values, keeping the previous image if no new image was uploaded
      const updatedGreeting = await Greeting.findByIdAndUpdate(
        req.params.id,
        {
          title,
          content,
          buttonText,
          buttonLink,
          greet_img,
          isActive,
        },
        { new: true }
      );
  
      res.status(200).json(updatedGreeting);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
// Delete a greeting by ID
exports.deleteGreeting = async (req, res) => {
  try {
    const deletedGreeting = await Greeting.findByIdAndDelete(req.params.id);
    if (!deletedGreeting) return res.status(404).json({ message: 'Greeting not found' });

    res.status(200).json({ message: 'Greeting deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
