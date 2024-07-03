import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaToggleOn, FaToggleOff, FaTrash } from 'react-icons/fa';
import { fetchCustomers, deleteCustomerProfile, updateCustomerProfile } from '../../services/api';
import Pagination from '../../components/Pagination/Pagination';


const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCustomers, setCurrentCustomers] = useState([]);

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    try {
      const response = await fetchCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async (customerId, status) => {
    try {
      await updateCustomerProfile(customerId, { status });
      getCustomers();
      toast.success(`Customer ${status ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to update customer status');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteCustomerProfile(customerId);
      getCustomers();
      toast.success('Customer deleted successfully!');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to delete customer');
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Contact No</th>
            <th className="py-2">Address</th>
            <th className="py-2">Date of Birth</th>
            <th className="py-2">Gender</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer._id}>
              <td className="border px-4 py-2">{customer.name}</td>
              <td className="border px-4 py-2">{customer.email}</td>
              <td className="border px-4 py-2">{customer.contact_no}</td>
              <td className="border px-4 py-2">{customer.address}</td>
              <td className="border px-4 py-2">{new Date(customer.date_of_birth).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{customer.gender}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleToggleStatus(customer._id, !customer.status)}
                  className={`py-2 px-4 rounded ${customer.status ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-700'
                    } text-white`}
                >
                  {customer.status ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeleteCustomer(customer._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        items={filteredCustomers}
        itemsPerPage={8}
        onPageChange={setCurrentCustomers}
      />
    </div>
  );
};

export default Customer;
