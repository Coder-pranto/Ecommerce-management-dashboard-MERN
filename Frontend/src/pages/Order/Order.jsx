// import { useState, useEffect, useCallback } from 'react';
// import Modal from 'react-modal';
// Modal.setAppElement('#root');
// import { toast } from 'react-toastify';
// import { fetchOrders, updateOrderStatus, deleteOrder } from '../../services/api';
// import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
// import { FcViewDetails } from "react-icons/fc";
// import 'react-tippy/dist/tippy.css';
// import { Tooltip } from 'react-tippy';


// const Order = ({DashboardText}) => {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const getOrders = useCallback(async () => {
//     try {
//       const response = await fetchOrders();
//       console.log(response.data);
//       setOrders(response.data);
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to fetch orders');
//     }
//   }, []);

//   useEffect(() => {
//     getOrders();
//   }, [getOrders]);

//   const handleUpdateStatus = async (orderId, status) => {
//     try {
//       await updateOrderStatus(orderId, status);
//       getOrders();
//       toast.success('Order status updated successfully!');
//     } catch (error) {
//       console.error(error.message);
//       toast.error('Failed to update order status');
//     }
//   };

//   const handleDeleteOrder = async (orderId) => {
//     try {
//       await deleteOrder(orderId);
//       getOrders();
//       toast.success('Order deleted successfully!');
//     } catch (error) {
//       console.error(error.message);
//       toast.error('Failed to delete order');
//     }
//   };

//   const handleDetails = (order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedOrder(null);
//   };

//   return (
//     <div className="p-6">
//     {  DashboardText ? <h1 className="text-3xl font-bold mb-4">Recent Orders</h1> :
//       <h1 className="text-3xl font-bold mb-4">Order Management</h1>}
//       <table className="min-w-full bg-white">
//         <thead>
//           <tr>
//             <th className="py-2">Order ID</th>
//             <th className="py-2">Customer</th>
//             <th className="py-2">Items</th>
//             <th className="py-2">Total Amount</th>
//             <th className="py-2">Details</th>
//             <th className="py-2">Status</th>
//             <th className="py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map(order => (
//             <tr key={order._id}>
//               <td className="border px-4 py-2 ">
//                 <Tooltip
//                   title={`${order._id}`}
//                   position="bottom"
//                   trigger="mouseenter"
//                   className='cursor-pointer'
//                 >
//                   {order._id.slice(0, 6) + (order._id.length > 6 ? '...' : '')}
//                 </Tooltip>
//               </td>
//               <td className="border px-4 py-2">{order?.customer?.name}</td>
//               <td className="border px-4 py-2">
//                 {order.items.map(item => (
//                   <div key={item.product}>
//                     {item.product.name} (x{item.quantity}) - ৳{item.price * item.quantity}
//                   </div>
//                 ))}
//               </td>
//               <td className="border px-4 py-2">৳{order.totalAmount}</td>
//               <td className="border px-4 py-2 text-center">
//                 <button
//                   onClick={() => handleDetails(order)}
//                   className="bg-green-400 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded"
//                 >
//                   <FcViewDetails />
//                 </button>
//               </td>
//               <td className="border px-4 py-2 text-center">
//                 <span
//                   className={`${order.orderStatus === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}
//                 >
//                   {order.orderStatus}
//                 </span>
//               </td>
//               <td className="border px-4 py-2">
//                 <div className="flex gap-x-2 justify-center">
//                   <button
//                     onClick={() => handleUpdateStatus(order._id, 'Accepted')}
//                     className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//                   >
//                     <FaCheck />
//                   </button>
//                   <button
//                     onClick={() => handleUpdateStatus(order._id, 'Rejected')}
//                     className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
//                   >
//                     <FaTimes />
//                   </button>
//                   <button
//                     onClick={() => handleDeleteOrder(order._id)}
//                     className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         contentLabel="Order Details"
//         className="fixed inset-0 flex items-center justify-center z-50"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//       >
//         <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl mx-auto transition-transform transform">
//           {selectedOrder && (
//             <>
//               <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>
//               <div className="border-b pb-4 mb-4">
//                 <h3 className="text-xl font-semibold mb-2">Customer Information</h3>
//                 <p className="mb-1"><strong>Name:</strong> {selectedOrder?.customer?.name}</p>
//                 <p className="mb-1"><strong>Email:</strong> {selectedOrder?.customer?.email}</p>
//                 <p className="mb-1"><strong>Address:</strong> {selectedOrder?.customer?.address}</p>
//                 <p className="mb-1"><strong>Contact Number:</strong> {selectedOrder?.customer?.contactNumber}</p>
//                 <p className="mb-1"><strong>Payment Info:</strong> {selectedOrder?.customer?.paymentInfo}</p>
//               </div>

//               <div className="border-b pb-4 mb-4">
//                 <h3 className="text-xl font-semibold mb-2">Order Items</h3>
//                 <ul>
//                   {selectedOrder.items.map(item => (
//                     <li key={item._id} className="mb-4 border p-4 rounded-lg">
//                       <strong>Product:</strong> {item.product.name} <br />
//                       <strong>Quantity:</strong> {item.quantity} <br />
//                       <strong>Price:</strong> ৳{item.price} <br />
//                       <strong>Size:</strong> {item.size} <br />
//                       <strong>Color:</strong> <span style={{ backgroundColor: item.color }} className="inline-block w-4 h-4 rounded-full"></span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="text-right mt-4">
//                 <button
//                   onClick={closeModal}
//                   className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-all duration-300 ease-in-out transform hover:scale-105"
//                 >
//                   Close
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Order;


import { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root');
import { toast } from 'react-toastify';
import { fetchOrders, updateOrderStatus, deleteOrder } from '../../services/api';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { FcViewDetails } from "react-icons/fc";
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';

const Order = ({ DashboardText }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(3); // Number of orders per page

  const getOrders = useCallback(async () => {
    try {
      const response = await fetchOrders();
      console.log(response.data);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    }
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      getOrders();
      toast.success('Order status updated successfully!');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      getOrders();
      toast.success('Order deleted successfully!');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to delete order');
    }
  };

  const handleDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
      {DashboardText ? <h1 className="text-3xl font-bold mb-4">Recent Orders</h1> :
        <h1 className="text-3xl font-bold mb-4">Order Management</h1>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Order ID</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Items</th>
            <th className="py-2">Total Amount</th>
            <th className="py-2">Details</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map(order => (
            <tr key={order._id}>
              <td className="border px-4 py-2">
                <Tooltip
                  title={`${order._id}`}
                  position="bottom"
                  trigger="mouseenter"
                  className='cursor-pointer'
                >
                  {order._id.slice(0, 6) + (order._id.length > 6 ? '...' : '')}
                </Tooltip>
              </td>
              <td className="border px-4 py-2">{order?.customer?.name}</td>
              <td className="border px-4 py-2">
                {order.items.map(item => (
                  <div key={item.product}>
                    {item.product.name} (x{item.quantity}) - ৳{item.price * item.quantity}
                  </div>
                ))}
              </td>
              <td className="border px-4 py-2">৳{order.totalAmount}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleDetails(order)}
                  className="bg-green-400 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded"
                >
                  <FcViewDetails />
                </button>
              </td>
              <td className="border px-4 py-2 text-center">
                <span
                  className={`${order.orderStatus === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}
                >
                  {order.orderStatus}
                </span>
              </td>
              <td className="border px-4 py-2">
                <div className="flex gap-x-2 justify-center">
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Accepted')}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Rejected')}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <FaTimes />
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Order Details"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl mx-auto transition-transform transform">
          {selectedOrder && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>
              <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-semibold mb-2">Customer Information</h3>
                <p className="mb-1"><strong>Name:</strong> {selectedOrder?.customer?.name}</p>
                <p className="mb-1"><strong>Email:</strong> {selectedOrder?.customer?.email}</p>
                <p className="mb-1"><strong>Address:</strong> {selectedOrder?.customer?.address}</p>
                <p className="mb-1"><strong>Contact Number:</strong> {selectedOrder?.customer?.contactNumber}</p>
                <p className="mb-1"><strong>Payment Info:</strong> {selectedOrder?.customer?.paymentInfo}</p>
              </div>

              <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-semibold mb-2">Order Items</h3>
                <ul>
                  {selectedOrder.items.map(item => (
                    <li key={item._id} className="mb-4 border p-4 rounded-lg">
                      <strong>Product:</strong> {item.product.name} <br />
                      <strong>Quantity:</strong> {item.quantity} <br />
                      <strong>Price:</strong> ৳{item.price} <br />
                      <strong>Size:</strong> {item.size} <br />
                      <strong>Color:</strong> <span style={{ backgroundColor: item.color }} className="inline-block w-4 h-4 rounded-full"></span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-right mt-4">
                <button
                  onClick={closeModal}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Order;


