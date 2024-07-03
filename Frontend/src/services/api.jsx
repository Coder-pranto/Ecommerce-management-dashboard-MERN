import axios from 'axios';

export const BASE_URL = 'http://localhost:4500/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});


const getToken = () => {
  const token = localStorage.getItem('user_token');
  return token ? `Bearer ${token}` : '';
};


// Greets API endpoints
export const fetchGreetings = () => api.get('/greets');
export const addGreeting = (greet) => api.post('/greets', greet, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateGreeting = (id, greet) => api.patch(`/greets/${id}`, greet, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteGreeting = (id) => api.delete(`/greets/${id}`);


//* User Registration

export const userRegistration = (userCredential) => api.post('/user/register', userCredential);

//* Admin Login

export const adminLogin = (adminCredential) => api.post('/auth/login', adminCredential);


//* User API methods
export const fetchAllUsers = () => api.get('/user/users', { headers: { Authorization: getToken() } });

export const updateUserType = (userId, userData) => api.patch(`/user/users/${userId}`, userData, { headers: { Authorization: getToken() } });

export const deleteUser = (userId) => api.delete(`/user/users/${userId}`, { headers: { Authorization: getToken() } });



//* Product API methods

export const fetchProducts = () => api.get('/products');

export const addProduct = (productData) => api.post('/products', productData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const updateProduct = (id, productData) => api.patch(`/products/${id}`, productData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const deleteProduct = (id) => api.delete(`/products/${id}`);



// Brand API methods
export const fetchBrands = () => api.get('/brand');

export const addBrand = (brandData) => api.post('/brand', brandData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

export const updateBrand = (id, brandData) => api.patch(`/brand/${id}`, brandData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

export const deleteBrand = (id) => api.delete(`/brand/${id}`);



// Category API methods
export const fetchCategories = () => api.get('/categories');
export const addCategory = (categoryData) => api.post('/categories', categoryData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});
export const updateCategory = (id, categoryData) => api.patch(`/categories/${id}`, categoryData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});
export const deleteCategory = (id) => api.delete(`/categories/${id}`);


// Subcategory API methods
export const fetchSubcategories = () => api.get('/sub-categories');

export const fetchSubcategoryById = (id) => api.get(`/sub-categories/${id}`);

export const fetchSubcategoriesByCategoryId = (categoryId) => api.get(`/sub-categories/category/${categoryId}`);

export const addSubcategory = (subCategoryData) => api.post('/sub-categories', subCategoryData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

export const updateSubcategory = (id, subCategoryData) => api.patch(`/sub-categories/${id}`, subCategoryData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

export const deleteSubcategory = (id) => api.delete(`/sub-categories/${id}`);


//* Banner API methods

export const fetchBanners = () => api.get('/banner');

export const addBanner = (bannerData) => api.post('/banner', bannerData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const updateBanner = (id, bannerData) => api.patch(`/banner/${id}`, bannerData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const deleteBanner = (id) => api.delete(`/banner/${id}`);



// Vendor API methods

export const fetchVendors = () => api.get('/vendor');

export const addVendor = (vendorData) => api.post('/vendor', vendorData);

export const updateVendor = (id, vendorData) => api.patch(`/vendor/${id}`, vendorData);

export const deleteVendor = (id) => api.delete(`/vendor/${id}`);

export const toggleVendorStatus = (id, statusData) => api.patch(`/vendor/${id}`, statusData);


// Customer API methods


export const fetchCustomers = () => api.get('/customer', { headers: { Authorization: getToken() } });

export const addCustomer = (customerData) => api.post('/customer', customerData, { headers: { Authorization: getToken() } });

 export const updateCustomerProfile = (customerId, status) => api.patch(`/customer/${customerId}`, {status},{ headers: { Authorization: getToken() } });

export const deleteCustomerProfile = (userId) => api.delete(`/user/users/${userId}`, { headers: { Authorization: getToken() } });


//* Order API methods

export const fetchOrders = () => api.get('/orders/history');
export const updateOrderStatus = (orderId, status) => api.patch('/orders/status', { orderId, status });
export const deleteOrder = (orderId) => api.delete(`/orders/${orderId}`);