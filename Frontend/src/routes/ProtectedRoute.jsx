import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ element }) => {
  const userToken = localStorage.getItem('user_token');

  if (!userToken) {
    toast.warn('You need to log in first.');
    return <Navigate to="/login" replace={true} />;
  }
  return element;
};

export default ProtectedRoute;




