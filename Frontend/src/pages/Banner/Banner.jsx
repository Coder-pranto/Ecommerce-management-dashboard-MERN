import { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { fetchBanners, addBanner, updateBanner, deleteBanner, BASE_URL } from '../../services/api';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    priority: 0,
    active: true,
    banner_img: null,
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    try {
      const response = await fetchBanners();
      setBanners(response.data);
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
    setFormData({ ...formData, banner_img: file });
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
      link: '',
      priority: 0,
      active: true,
      banner_img: null,
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
        await updateBanner(editId, form);
        console.log(formData)
        toast.success('Banner updated successfully!');
      } else {
        await addBanner(form);
        toast.success('Banner added successfully!');
      }
      getBanners();
      closeModal();
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to save banner');
    }
  };

  

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  
  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      link: banner.link,
      priority: banner.priority,
      active: banner.active,
      banner_img: null,
    });
    setIsEditMode(true);
    setEditId(banner._id);
    setImagePreviewUrl(`${BASE_URL}/images/${banner.banner_img}`);
    openModal();
  };
  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      getBanners();
      toast.success('Banner deleted successfully!');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to delete banner');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Banner Management</h1>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Banner
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2 ">Priority</th>
            <th className="py-2">Active</th>
            <th className="py-2">Image</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner._id}>
              <td className="border px-4 py-2 text-center">{banner.title}</td>
              <td className="border px-4 py-2 text-center">{banner.priority}</td>
              <td className="border px-4 py-2 text-center">{banner.active ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">
              <img src={`${BASE_URL}/images/${banner.banner_img}`} alt={banner.title} className="h-16 w-auto mx-auto" />
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center gap-x-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
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
                    {isEditMode ? 'Edit Banner' : 'Add Banner'}
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
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                          Link
                        </label>
                        <input
                          type="text"
                          name="link"
                          value={formData.link}
                          onChange={handleInputChange}
                          placeholder="Link"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <input
                          type="number"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          placeholder="Priority"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="active" className="block text-sm font-medium text-gray-700">
                          Active
                        </label>
                        <input
                          type="checkbox"
                          name="active"
                          checked={formData.active}
                          onChange={handleInputChange}
                          className="border p-2 rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="banner_img" className="block text-sm font-medium text-gray-700">
                          Banner Image
                        </label>
                        <input
                          type="file"
                          name="banner_img"
                          onChange={handleFileChange}
                          className="border p-2 rounded w-full"
                          accept="image/*"
                          required={!isEditMode}
                        />
                        {imagePreviewUrl && (
                            <img src={imagePreviewUrl} alt="Banner Preview" className="h-32 mt-2 w-auto mx-auto" />
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-x-2">
                      <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={closeModal}
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

export default Banner;
