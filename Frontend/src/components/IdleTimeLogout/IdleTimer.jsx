import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';

const IdleTimer = ({ timeout = 300000, warningTimeout = 10000 }) => {
  const [isIdle, setIsIdle] = useState(false);
  const navigate = useNavigate();
  const warningTimerRef = useRef(null);

  const onIdle = () => {
    setIsIdle(true);
    warningTimerRef.current = setTimeout(() => {
      handleLogout();
    }, warningTimeout);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    navigate('/login');
  };

  const handleStayLoggedIn = () => {
    setIsIdle(false);
    clearTimeout(warningTimerRef.current);
  };

  useIdleTimer({
    timeout,
    onIdle,
    debounce: 500,
  });

  return (
    <>
    {isIdle && (
      <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 bg-gray-900 z-50 flex items-center justify-center" >
        <div className="bg-white rounded-lg shadow-md px-8 py-5 overflow-hidden md:w-1/3" >
          <p className="text-base font-medium leading-6 text-gray-700 mb-4">You have been idle for a while. Do you want to stay logged in?</p>
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleStayLoggedIn}
            >
              Stay Logged In
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default IdleTimer;
