import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Admin Panel</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
          <FaUserCircle className="text-white text-3xl" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
