



import { useEffect, useState } from 'react';
import { fetchAllUsers, updateUserType, deleteUser } from '../../services/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ email: '', contact_no: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); 

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    loadUsers();
  }, []);

  const handleUserTypeChange = async (userId, userType) => {
    try {
      await updateUserType(userId, { user_type: userType });
      setUsers(users.map(user => user._id === userId ? { ...user, user_type: userType } : user));
      toast.success('User type updated successfully');
    } catch (error) {
      console.error('Failed to update user type:', error.message);
      toast.error('Failed to update user type');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error.message);
      toast.error('Failed to delete user');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditedUser({ email: user.email, contact_no: user.contact_no });
  };

  const handleSaveUser = async () => {
    try {
      await updateUserType(editingUser._id, editedUser);
      setUsers(users.map(user => user._id === editingUser._id ? { ...user, ...editedUser } : user));
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    }
  };


  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  return (
    <div className="container mx-auto mt-10 px-6 mb-4">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Contact No</th>
            <th className="py-2">User Type</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 text-center">{user.contact_no}</td>
              <td className="border px-4 py-2 text-center">
                <select
                  value={user.user_type}
                  onChange={(e) => handleUserTypeChange(user._id, e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="border px-4 py-2 ">
                <div className='flex justify-center space-x-2'>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md shadow-md hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md shadow-md hover:bg-gray-400"
        >
          Next
        </button>
      </div>

      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contact No</label>
              <input
                type="text"
                value={editedUser.contact_no}
                onChange={(e) => setEditedUser({ ...editedUser, contact_no: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUser;

