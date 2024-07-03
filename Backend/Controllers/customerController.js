const Customer = require('../Models/customer');
const User = require('../Models/user');

// Create Customer Profile
const createCustomerProfile = async (req, res) => {
  try {
    const { userId, name, email, contact_no, address, date_of_birth, gender, wishlist, status } = req.body;
    console.log(userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingCustomer = await Customer.findOne({ user_id: userId });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer profile already exists' });
    }

    const customer = new Customer({
      name,
      email,
      contact_no,
      address,
      date_of_birth,
      gender,
      wishlist,
      user_id: userId,
      status
    });

    user.user_type = "customer";
    await user.save();

    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate('user_id');
    res.json(customers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Customer by ID
const getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findOne({ user_id: customerId }).populate('user_id');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Customer Profile
const updateCustomerProfile = async (req, res) => {
  try {
    const { customerId } = req.params;
    const updates = req.body;
    
    const customer = await Customer.findByIdAndUpdate(customerId, updates, { new: true });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json("customer updated");
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Customer Profile
const deleteCustomerProfile = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findByIdAndDelete(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const user = await User.findByIdAndDelete(customer.user_id);
    res.json({ message: 'Customer and user account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { 
  createCustomerProfile, 
  getCustomers, 
  getCustomerById, 
  updateCustomerProfile, 
  deleteCustomerProfile 
};
