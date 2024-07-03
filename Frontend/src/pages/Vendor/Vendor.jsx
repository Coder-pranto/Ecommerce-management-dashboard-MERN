

import { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { fetchVendors, addVendor, updateVendor, deleteVendor, toggleVendorStatus } from '../../services/api';

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_no: '',
    national_id: '',
    gender: '',
    business_name: '',
    business_address: {
      address: '',
      city: '',
      district: '',
      state: ''
    },
    status: true,
    user_id: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getVendors();
  }, []);

  const getVendors = async () => {
    try {
      const response = await fetchVendors();
      setVendors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('business_address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        business_address: {
          ...formData.business_address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
    setIsEditMode(false);
    setEditId(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      contact_no: '',
      national_id: '',
      gender: '',
      business_name: '',
      business_address: {
        address: '',
        city: '',
        district: '',
        state: ''
      },
      status: true,
      user_id: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateVendor(editId, formData);
        toast.success('Vendor updated successfully!');
      } else {
        await addVendor(formData);
        toast.success('Vendor added successfully!');
      }
      getVendors();
      closeModal();
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to save vendor');
    }
  };

  const handleEdit = (vendor) => {
    setFormData(vendor);
    setIsEditMode(true);
    setEditId(vendor._id);
    openModal();
  };

  const handleDelete = async (id) => {
    try {
      await deleteVendor(id);
      getVendors();
      toast.success('Vendor deleted successfully!');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to delete vendor');
    }
  };

  const handleToggleStatus = async (id, status) => {
    try {
      await toggleVendorStatus(id, { status: !status });
      getVendors();
      toast.success('Vendor status updated successfully!');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to update vendor status');
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredVendors = vendors.filter((vendor) => {
    return (
      vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor?.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor?.business_address?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor?.contact_no?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Vendor Management</h1>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vendors..."
          className=" rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50"
        />

        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Vendor
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Business Name</th>
            <th className="py-2">Business Address</th>
            <th className="py-2">Contact No</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.map((vendor) => (
            <tr key={vendor._id}>
              <td className="border px-4 py-2">{vendor?.name}</td>
              <td className="border px-4 py-2">{vendor?.business_name}</td>
              <td className="border px-4 py-2">
                {`${vendor.business_address?.address}, ${vendor.business_address?.city}, ${vendor.business_address?.district}, ${vendor.business_address?.state}`}
              </td>
              <td className="border px-4 py-2">{vendor.contact_no}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleToggleStatus(vendor._id, vendor.status)}
                  className={`py-2 px-4 rounded ${vendor.status ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-700'
                    } text-white`}
                >
                  {vendor.status ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center gap-x-2">
                  <button
                    onClick={() => handleEdit(vendor)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(vendor._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {isEditMode ? 'Edit Vendor' : 'Add Vendor'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Name"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact_no" className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input
                          type="text"
                          name="contact_no"
                          value={formData.contact_no}
                          onChange={handleInputChange}
                          placeholder="Contact Number"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="national_id" className="block text-sm font-medium text-gray-700">National ID</label>
                        <input
                          type="text"
                          name="national_id"
                          value={formData.national_id}
                          onChange={handleInputChange}
                          placeholder="National ID"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <input
                          type="text"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          placeholder="Gender"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">Business Name</label>
                        <input
                          type="text"
                          name="business_name"
                          value={formData?.business_name}
                          onChange={handleInputChange}
                          placeholder="Business Name"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="business_address.address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          name="business_address.address"
                          value={formData?.business_address?.address}
                          onChange={handleInputChange}
                          placeholder="Address"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="business_address.city" className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          name="business_address.city"
                          value={formData?.business_address?.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="business_address.district" className="block text-sm font-medium text-gray-700">District</label>
                        <input
                          type="text"
                          name="business_address.district"
                          value={formData?.business_address?.district}
                          onChange={handleInputChange}
                          placeholder="District"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="business_address.state" className="block text-sm font-medium text-gray-700">State</label>
                        <input
                          type="text"
                          name="business_address.state"
                          value={formData?.business_address?.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">User ID</label>
                        <input
                          type="text"
                          name="user_id"
                          value={formData?.user_id}
                          onChange={handleInputChange}
                          placeholder="User ID"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        {isEditMode ? 'Update' : 'Add'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Vendor;
