import { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { fetchCategories, fetchSubcategories, addSubcategory, updateSubcategory, deleteSubcategory, BASE_URL } from '../../services/api';

const Subcategory = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    subCategory_image: null,
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getCategories();
    getSubcategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getSubcategories = async () => {
    try {
      const response = await fetchSubcategories();
      console.log(response.data.subcategories);
      setSubcategories(response.data.subcategories);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
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
      categoryId: '',
      subCategory_image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    try {
      if (isEditMode) {
        await updateSubcategory(editId, form);
        toast.success('Subcategory updated successfully!');
      } else {
        await addSubcategory(form);
        toast.success('Subcategory added successfully!');
      }
      getSubcategories();
      closeModal();
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to save subcategory');
    }
  };

  const handleEdit = (subcategory) => {
    setFormData(subcategory);
    setIsEditMode(true);
    setEditId(subcategory._id);
    openModal();
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubcategory(id);
      getSubcategories();
      toast.success('Subcategory deleted successfully!');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to delete subcategory');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Subcategory Management</h1>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Subcategory
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Image</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories?.map((subcategory) => (
            <tr key={subcategory._id}>
              <td className="border px-4 py-2">{subcategory.name}</td>
              <td className="border px-4 py-2">{subcategory?.categoryId?.name}</td>
              <td className="border px-4 py-2">
                <img src={`${BASE_URL}/images/${subcategory.subCategory_image}`} alt={subcategory?.name} width="50" />
              </td>
              <td className="border px-4 py-2 ">
                <div className="flex gap-2 justify-center">
                    <button
                    onClick={() => handleEdit(subcategory)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                    <FaEdit />
                    </button>
                    <button
                    onClick={() => handleDelete(subcategory._id)}
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
                    {isEditMode ? 'Edit Subcategory' : 'Add Subcategory'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Subcategory Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Subcategory Name"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          className="border p-2 rounded w-full"
                          required
                        >
                          <option value="" disabled>Select a Category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="subCategory_image" className="block text-sm font-medium text-gray-700">Subcategory Image</label>
                        <input
                          type="file"
                          name="subCategory_image"
                          onChange={handleFileChange}
                          className="border p-2 rounded w-full"
                          required={!isEditMode}
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

export default Subcategory;
