import { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const BASE_URL = 'http://localhost:4500/api/v1';

const fetchStock = () => axios.get(`${BASE_URL}/product/get-stock`);
const addStock = (stockData) => axios.post(`${BASE_URL}/product/add-stock`, stockData);
const deleteStock = (id) => axios.delete(`${BASE_URL}/product/delete-stock`, { data: { _id: id } });

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: 1, // Assuming quantity is added for the number of stocks to add
    status: '',
    buying_date: '',
    buying_price: '',
    selling_price: '',
    order_id: '',
  });

  useEffect(() => {
    getStock();
  }, []);

  const getStock = async () => {
    try {
      const response = await fetchStock();
      console.log('Fetch Stock Response:', response.data);
  
      // Check if the response is an array
      const stockArray = Array.isArray(response.data) ? response.data : [response.data];
      setStocks(stockArray);
    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      product_id: '',
      quantity: 1, // Reset quantity as well
      status: '',
      buying_date: '',
      buying_price: '',
      selling_price: '',
      order_id: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)

    try {
      const response = await addStock(formData);
      console.log('Add Stock Response:', response);
      toast.success('Stock added successfully!');
      getStock();
      closeModal();
    } catch (error) {
      console.error('Error adding stock:', error);
      toast.error('Failed to save stock');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStock(id);
      getStock();
      toast.success('Stock deleted successfully!');
    } catch (error) {
      console.error('Error deleting stock:', error);
      toast.error('Failed to delete stock');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Stock Management</h1>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Stock
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Product ID</th>
            <th className="py-2">SKU</th>
            <th className="py-2">Status</th>
            <th className="py-2">Buying Date</th>
            <th className="py-2">Buying Price</th>
            <th className="py-2">Selling Price</th>
            <th className="py-2">Order ID</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks?.map((stock) => (
            <tr key={stock._id}>
              <td className="border px-4 py-2">{stock.product_id}</td>
              <td className="border px-4 py-2">{stock.sku}</td>
              <td className="border px-4 py-2">{stock.status}</td>
              <td className="border px-4 py-2">{new Date(stock.buying_date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{stock.buying_price}</td>
              <td className="border px-4 py-2">{stock.selling_price}</td>
              <td className="border px-4 py-2">{stock.order_id}</td>
              <td className="border px-4 py-2">
                <div className="flex gap-2 justify-center">
                  {/* <button
                    onClick={() => {}}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaEdit />
                  </button> */}
                  <button
                    onClick={() => handleDelete(stock._id)}
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
                    Add Stock
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Product ID</label>
                        <input
                          type="text"
                          name="product_id"
                          value={formData.product_id}
                          onChange={handleInputChange}
                          placeholder="Product ID"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          placeholder="Quantity"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <input
                          type="text"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          placeholder="Status"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="buying_date" className="block text-sm font-medium text-gray-700">Buying Date</label>
                        <input
                          type="date"
                          name="buying_date"
                          value={formData.buying_date}
                          onChange={handleInputChange}
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="buying_price" className="block text-sm font-medium text-gray-700">Buying Price</label>
                        <input
                          type="number"
                          name="buying_price"
                          value={formData.buying_price}
                          onChange={handleInputChange}
                          placeholder="Buying Price"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700">Selling Price</label>
                        <input
                          type="number"
                          name="selling_price"
                          value={formData.selling_price}
                          onChange={handleInputChange}
                          placeholder="Selling Price"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="order_id" className="block text-sm font-medium text-gray-700">Order ID</label>
                        <input
                          type="text"
                          name="order_id"
                          value={formData.order_id}
                          onChange={handleInputChange}
                          placeholder="Order ID"
                          className="border p-2 rounded w-full"
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
                       Add
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

export default Stock;
