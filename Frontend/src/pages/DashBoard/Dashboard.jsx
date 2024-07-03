import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaShoppingCart, FaMoneyBillAlt, FaClipboardList, FaTruck, FaChartPie } from 'react-icons/fa';
import { MdOutlinePendingActions } from "react-icons/md";
import { PiStackBold } from "react-icons/pi";
import Order from '../Order/Order';
import { fetchOrders } from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const detailCardColors = ['#0C9488', '#FB933C', '#36A2EB', '#0891B3', '#05976A'];
  const orderCardColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const [detailCards, setDetailCards] = useState([]);
  const [orderCards, setOrderCards] = useState([]);
  const [weeklySalesData, setWeeklySalesData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const { data: orders } = await fetchOrders();

      // Process orders to calculate the necessary metrics
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().split('-').slice(0, 2).join('-');
      const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('-').slice(0, 2).join('-');

      let todayOrders = 0, yesterdayOrders = 0, thisMonthOrders = 0, lastMonthOrders = 0, allTimeSales = 0;
      let totalOrders = 0, orderPending = 0, orderProcessing = 0, orderDelivered = 0;
      let todayCash = 0, todayCredit = 0, todayCard = 0;
      let yesterdayCash = 0, yesterdayCredit = 0, yesterdayCard = 0;

      orders.forEach(order => {
        const orderDate = order.createdAt.split('T')[0];
        const orderMonth = order.createdAt.split('-').slice(0, 2).join('-');
        const orderTotalAmount = Number(order.totalAmount);
        const paymentInfo = order?.customer?.paymentInfo.toLowerCase();

        if (!isNaN(orderTotalAmount)) {
          allTimeSales += orderTotalAmount;
        }
        totalOrders += 1;

        if (orderDate === today && !isNaN(orderTotalAmount)) {
          todayOrders += orderTotalAmount;
          if (paymentInfo === 'cash') todayCash += orderTotalAmount;
          if (paymentInfo === 'credit') todayCredit += orderTotalAmount;
          if (paymentInfo === 'card') todayCard += orderTotalAmount;
        }

        if (orderDate === yesterday && !isNaN(orderTotalAmount)) {
          yesterdayOrders += orderTotalAmount;
          if (paymentInfo === 'cash') yesterdayCash += orderTotalAmount;
          if (paymentInfo === 'credit') yesterdayCredit += orderTotalAmount;
          if (paymentInfo === 'card') yesterdayCard += orderTotalAmount;
        }

        if (orderMonth === thisMonth && !isNaN(orderTotalAmount)) thisMonthOrders += orderTotalAmount;
        if (orderMonth === lastMonth && !isNaN(orderTotalAmount)) lastMonthOrders += orderTotalAmount;

        if (order.orderStatus === 'Pending') orderPending += 1;
        if (order.orderStatus === 'Processing') orderProcessing += 1;
        if (order.orderStatus === 'Delivered') orderDelivered += 1;
      });

      setDetailCards([
        { title: "Today's Orders", value: `৳${todayOrders}`, cash: `৳${todayCash}`, credit: `৳${todayCredit}`, card: `৳${todayCard}`, icon: PiStackBold },
        { title: "Yesterday's Orders", value: `৳${yesterdayOrders}`, cash: `৳${yesterdayCash}`, credit: `৳${yesterdayCredit}`, card: `৳${yesterdayCard}`, icon: PiStackBold },
        { title: "This Month", value: `৳${thisMonthOrders}`, icon: FaShoppingCart },
        { title: "Last Month", value: `৳${lastMonthOrders}`, icon: FaMoneyBillAlt },
        { title: "All Time Sales", value: `৳${allTimeSales}`, icon: FaMoneyBillAlt }
      ]);

      setOrderCards([
        { title: 'Total Orders', value: `${totalOrders}`, icon: FaClipboardList },
        { title: 'Order Pending', value: `${orderPending}`, icon: MdOutlinePendingActions },
        { title: 'Order Processing', value: `${orderProcessing}`, icon: FaTruck },
        { title: 'Order Delivered', value: `${orderDelivered}`, icon: FaChartPie }
      ]);

      // Mock data for weekly sales and pie chart
      setWeeklySalesData([
        { name: 'Mon', sales: 400 },
        { name: 'Tue', sales: 300 },
        { name: 'Wed', sales: 500 },
        { name: 'Thu', sales: 700 },
        { name: 'Fri', sales: 600 },
        { name: 'Sat', sales: 800 },
        { name: 'Sun', sales: 900 },
      ]);

      setPieChartData([
        { name: 'Product A', value: 400 },
        { name: 'Product B', value: 300 },
        { name: 'Product C', value: 300 },
        { name: 'Product D', value: 200 },
      ]);

    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch dashboard data');
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {detailCards.map((card, index) => (
          <div key={index} className={`p-4 text-white rounded-lg shadow-md flex flex-col items-center`} style={{ backgroundColor: detailCardColors[index] }}>
            <card.icon className="text-3xl mb-2" />
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-2xl mb-2">{card.value}</p>
            {card.cash && (
              <div className="flex justify-around w-full">
                <span>Cash: {card.cash}</span>
                <span>Credit: {card.credit}</span>
                <span>Card: {card.card}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {orderCards.map((card, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center gap-x-4">
            <div className={`p-2 rounded-full text-white`} style={{ backgroundColor: orderCardColors[index] }}>
              <card.icon className="text-2xl" />
            </div>
            <div>
              <h2 className="text-md mb-2">{card.title}</h2>
              <p className="text-xl font-semibold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Weekly Sales Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Best Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Order DashboardText={true} />
    </div>
  );
};

export default Dashboard;
