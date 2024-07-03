const Vendor = require('../Models/vendor');

// Create a new vendor
const createVendor = async (req, res) => {
  const { name, email, contact_no, national_id, gender, business_name, business_address, status, user_id } = req.body;

  if (!name || !business_name || !business_address || !user_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newVendor = new Vendor({
      name,
      email,
      contact_no,
      national_id,
      gender,
      business_name,
      business_address,
      status,
      user_id
    });

    const savedVendor = await newVendor.save();
    res.status(201).json(savedVendor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating vendor', error: error.message });
  }
};

// Update an existing vendor
const updateVendor = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json(updatedVendor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating vendor', error: error.message });
  }
};

// Delete a vendor
const deleteVendor = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVendor = await Vendor.findByIdAndDelete(id);
    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vendor', error: error.message });
  }
};

// Get a vendor by ID
const getVendorById = async (req, res) => {
  const { id } = req.params;

  try {
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor', error: error.message });
  }
};

// Get all vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors', error: error.message });
  }
};

module.exports = {
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorById,
  getAllVendors
};
