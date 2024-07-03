import { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { fetchProducts, addProduct, updateProduct, deleteProduct, fetchCategories, fetchSubcategories, fetchBrands, fetchVendors } from '../../services/api';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    description: '',
    category: '',
    subcategory: '',
    price: '',
    colors: [],
    discount: 0,
    stock: 0,
    brand: '',
    thumb_image: null,
    media: [],
    vendor_id: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getProducts();
    getCategories();
    getSubcategories();
    getBrands();
    getVendors();
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetchProducts();
      console.log("products",response)
      setProducts(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetchCategories();
      console.log("categories", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getSubcategories = async () => {
    try {
      const response = await fetchSubcategories();
      console.log("sucategries",response.data.subcategories)
      setSubcategories(response.data.subcategories);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getBrands = async () => {
    try {
      const response = await fetchBrands();
      setBrands(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getVendors = async () => {
    try {
      const response = await fetchVendors();
      setVendors(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'thumb_image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: Array.from(files) });
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
      rating: 0,
      description: '',
      category: '',
      subcategory: '',
      price: '',
      colors: [],
      discount: 0,
      stock: 0,
      brand: '',
      thumb_image: null,
      media: [],
      vendor_id: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (let key in formData) {
      if (key === 'colors') {
        const colorArray = formData[key].split(',').map(color => color.trim());
        colorArray.forEach(color => form.append(key, color));
      } else if (key === 'media') {
        formData.media.forEach((file) => form.append('media', file));
      } else {
        form.append(key, formData[key]);
      }
    }
    console.log(form);

    try {
      if (isEditMode) {
        await updateProduct(editId, form);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(form);
        toast.success('Product added successfully!');
      }
      getProducts();
      closeModal();
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to save product');
    }
};


  const handleEdit = (product) => {
    setFormData({
      ...product,
      colors: product.colors.join(', '),
    });
    setIsEditMode(true);
    setEditId(product._id);
    openModal();
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      getProducts();
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Price</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border px-4 py-2">{product?.name}</td>
              <td className="border px-4 py-2">{product?.category?.name}</td>
              <td className="border px-4 py-2">৳{product?.price}</td>
              <td className="border px-4 py-2">
                <div className="flex justify-center gap-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
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
                    {isEditMode ? 'Edit Product' : 'Add Product'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Product Name"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                          Rating
                        </label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          placeholder="Rating"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Description"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="border p-2 rounded w-full"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                          Subcategory
                        </label>
                        <select
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleInputChange}
                          className="border p-2 rounded w-full"
                        >
                          <option value="">Select Subcategory</option>
                          {subcategories.map((subcategory) => (
                            <option key={subcategory._id} value={subcategory._id}>
                              {subcategory.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                          Brand
                        </label>
                        <select
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="border p-2 rounded w-full"
                        >
                          <option value="">Select Brand</option>
                          {brands.map((brand) => (
                            <option key={brand._id} value={brand._id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="vendor_id" className="block text-sm font-medium text-gray-700">
                          Vendor
                        </label>
                        <select
                          name="vendor_id"
                          value={formData.vendor_id}
                          onChange={handleInputChange}
                          className="border p-2 rounded w-full"
                          required
                        >
                          <option value="">Select Vendor</option>
                          {vendors.map((vendor) => (
                            <option key={vendor._id} value={vendor._id}>
                              {vendor.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="Price"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="colors" className="block text-sm font-medium text-gray-700">
                          Colors (comma separated)
                        </label>
                        <input
                          type="text"
                          name="colors"
                          value={formData.colors}
                          onChange={handleInputChange}
                          placeholder="Colors"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                          Discount
                        </label>
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleInputChange}
                          placeholder="Discount"
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Stock
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          placeholder="Stock"
                          className="border p-2 rounded w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="thumb_image" className="block text-sm font-medium text-gray-700">
                          Thumbnail Image
                        </label>
                        <input
                          type="file"
                          name="thumb_image"
                          onChange={handleFileChange}
                          className="border p-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="media" className="block text-sm font-medium text-gray-700">
                          Media Images
                        </label>
                        <input
                          type="file"
                          name="media"
                          onChange={handleFileChange}
                          multiple
                          className="border p-2 rounded w-full"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                      >
                        {isEditMode ? 'Update Product' : 'Add Product'}
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

export default Product;
