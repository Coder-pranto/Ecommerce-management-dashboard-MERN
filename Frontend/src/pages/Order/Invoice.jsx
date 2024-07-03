// components/Invoice.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const Invoice = ({ order }) => {
  const generateInvoice = async () => {
    const input = document.getElementById('invoice');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save(`invoice_${order._id}.pdf`);
  };

  return (
    <>
      <button onClick={generateInvoice} className="text-blue-500 hover:text-blue-700">
        <FaFileInvoiceDollar />
      </button>

      <div id="invoice" style={{ display: 'none' }}>
        <h1>Invoice</h1>
        <p>Order ID: {order._id}</p>
        <p>Customer: {order.customer.name}</p>
        <p>Email: {order.customer.email}</p>
        <p>Address: {order.customer.address}</p>
        <p>Contact Number: {order.customer.contactNumber}</p>
        <p>Payment Info: {order.customer.paymentInfo}</p>
        <h2>Items:</h2>
        <ul>
          {order.items.map(item => (
            <li key={item._id}>
              {item.product.name} - Quantity: {item.quantity} - Price: ৳{item.price}
            </li>
          ))}
        </ul>
        <h2>Total Amount: ৳{order.totalAmount}</h2>
      </div>
    </>
  );
};

export default Invoice;
