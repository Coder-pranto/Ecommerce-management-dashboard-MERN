const bcrypt = require('bcrypt');
const User = require('../Models/user');
const Customer = require('../Models/customer');
const { generateToken } = require('../Util/jwt');

const registerUser = async (req, res) => {
  try {
    const { name, email, contact_no, password } = req.body;

    if (!name || !email || !contact_no || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      contact_no,
      password: hashedPassword,
    });

    const newUser = await user.save();

    const userResponse = { ...newUser._doc };
    delete userResponse.password;

    res.status(201).json({
      ...userResponse,
      user_token : generateToken(userResponse),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// admin login only
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.user_type !=='admin') {
      console.log(user.user_type)
      return res
        .status(403)
        .json({ message: 'Unauthorized access: You are not an admin' });
    } 

    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.json({
      msg: 'success',
      ...userResponse,
      user_token: generateToken(userResponse),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.json({
      msg: 'success',
      ...userResponse,
      user_token: generateToken(userResponse),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete User (Admin Only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const customer = await Customer.findOneAndDelete({ user_id: userId });
    if (customer) {
      return res.json({ message: 'User data deleted successfully', customer });
    } else {
      return res.json({
        message: 'User and corresponding customer data deleted successfully',
        customer,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    // Remove passwords from user objects before sending the response
    const usersWithoutPassword = users.map(user => {
      const userObj = user.toObject(); // Convert Mongoose document to plain JavaScript object
      delete userObj.password; // Remove the password field
      return userObj;
    });

    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update User ->(for change user_type )
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateUser = req.body;

    const user = await User.findByIdAndUpdate(userId, updateUser, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser, loginAdmin, loginUser, deleteUser, updateUser , getUserById, getAllUsers  };
