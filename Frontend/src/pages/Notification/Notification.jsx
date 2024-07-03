import { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { fetchGreetings, addGreeting, updateGreeting, deleteGreeting, BASE_URL } from '../../services/api';

const Notification = () => {
  const [greets, setGreets] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    greet_img: null,
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getGreets();
  }, []);

  const getGreets = async () => {
    try {
      const response = await fetchGreetings();
      setGreets(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setFormData({ ...formData, greet_img: file });
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
      title: '',
      content: '',
      buttonText: '',
      buttonLink: '',
      isActive: true,
      greet_img: null,
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
        await updateGreeting(editId, form);
        toast.success('Greeting updated successfully!');
      } else {
        await addGreeting(form);
        toast.success('Greeting added successfully!');
      }
      getGreets();
      closeModal();
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to save greeting');
    }
  };

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleEdit = (greet) => {
    setFormData({
      title: greet.title,
      content: greet.content,
      buttonText: greet.buttonText,
      buttonLink: greet.buttonLink,
      isActive: greet.isActive,
      greet_img: null,
    });
    setIsEditMode(true);
    setEditId(greet._id);
    setImagePreviewUrl(`${BASE_URL}/images/${greet.greet_img}`);
    openModal();
  };

  const handleDelete = async (id) => {
    try {
      await deleteGreeting(id);
      getGreets();
      toast.success('Greeting deleted successfully!');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to delete greeting');
    }
  };

  const handleToggleActive = async (greet) => {
    const updatedGreet = { ...greet, isActive: !greet.isActive };
  
    const form = new FormData();
    for (let key in updatedGreet) {
      form.append(key, updatedGreet[key]);
    }
  
    try {
      await updateGreeting(greet._id, form);
      toast.success('Greeting status updated successfully!');
      getGreets(); // Refresh the list
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to update greeting status');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch((error) => {
      console.error('Failed to copy text: ', error.message);
      toast.error('Failed to copy link');
    });
  };
  
  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Notification Management</h1>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Notification Info
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Content</th>
            <th className="py-2">Button text</th>
            <th className="py-2">Link</th>
            <th className="py-2">Image</th>
            <th className="py-2">Active</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {greets.map((greet) => (
            <tr key={greet._id}>
              <td className="border px-4 py-2 text-center">{greet.title}</td>
            <td className="border px-4 py-2 text-center cursor-progress">
                <span title={greet.content}>
                    {greet.content.length > 30 ? `${greet.content.substring(0, 50)}...` : greet.content}
                </span>
            </td>

              <td className="border px-4 py-2 text-center">{greet.buttonText ? greet.buttonText :'Not Provided'}</td>
                <td className="border px-4 py-2 text-center italic">
                    {greet.buttonLink ? (
                        <span
                            className="text-blue-500 underline cursor-pointer"
                            onClick={() => copyToClipboard(greet.buttonLink)}
                            title="Click to copy link"
                        >
                            {greet.buttonLink}
                        </span>
                    ) : (
                        'Not Provided'
                    )}
                </td>

              <td className="border px-4 py-2">
                <img src={`${BASE_URL}/images/${greet.greet_img}`} alt={greet.title} className="h-16 w-auto mx-auto" />
              </td>
            <td className="border px-4 py-2 text-center">
                <input
                    type="checkbox"
                    checked={greet.isActive}
                    onChange={() => handleToggleActive(greet)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
            </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center gap-x-2">
                  <button
                    onClick={() => handleEdit(greet)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(greet._id)}
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {isEditMode ? 'Edit Greeting' : 'Add Greeting'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Title"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                          Content
                        </label>
                        <textarea
                          name="content"
                          value={formData.content}
                          onChange={handleInputChange}
                          placeholder="Content"
                          className="border p-2 rounded w-full"
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700">
                          Button Text
                        </label>
                        <input
                          type="text"
                          name="buttonText"
                          value={formData.buttonText}
                          onChange={handleInputChange}
                          placeholder="Button Text"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700">
                          Button Link
                        </label>
                        <input
                          type="text"
                          name="buttonLink"
                          value={formData.buttonLink}
                          onChange={handleInputChange}
                          placeholder="Button Link"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div className="flex items-center gap-x-2">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
                          Active
                        </label>
                      </div>
                      <div>
                        <label htmlFor="greet_img" className="block text-sm font-medium text-gray-700">
                          Image
                        </label>
                        <input
                          type="file"
                          name="greet_img"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="border p-2 rounded w-full"
                        />
                        {imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" className="h-16 w-auto mt-2" />}
                      </div>
                      <div className="mt-4">
                        <button
                          type="submit"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-700"
                        >
                          {isEditMode ? 'Update' : 'Add'} Greeting
                        </button>
                        <button
                          type="button"
                          className="ml-4 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 border border-transparent rounded-md hover:bg-gray-200"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                      </div>
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

export default Notification;
