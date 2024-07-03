
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaShoppingCart, FaMoneyBillAlt, FaClipboardList, FaTruck, FaChartPie } from 'react-icons/fa';
import { MdOutlinePendingActions } from "react-icons/md";
import { PiStackBold } from "react-icons/pi";
import Order from '../Order/Order';

const Dashboard = () => {
  const detailCardColors = ['#0C9488', '#FB933C', '#36A2EB', '#0891B3', '#05976A'];
  const orderCardColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

  const DetailCards = [
    { title: "Today's Orders", value: '৳1,000', cash: '100tk', credit: '200tk', card: '160tk', icon: PiStackBold },
    { title: "Yesterday's Orders", value: '৳2,000',cash: '100tk', credit: '200tk', card: '160tk', icon: PiStackBold },
    { title: "This Month", value: '৳15,000', icon: FaShoppingCart },
    { title: "Last Month", value: '৳20,000', icon: FaMoneyBillAlt },
    { title: "All Times Sales", value: '৳50,000', icon: FaMoneyBillAlt }
  ];

  const OrderCards = [
    { title: 'Total Orders', value: '1500', icon: FaClipboardList },
    { title: 'Order Pending', value: '100', icon: MdOutlinePendingActions },
    { title: 'Order Processing', value: '200', icon: FaTruck },
    { title: 'Order Delivered', value: '1200', icon: FaChartPie }
  ];

  const weeklySalesData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 500 },
    { name: 'Thu', sales: 700 },
    { name: 'Fri', sales: 600 },
    { name: 'Sat', sales: 800 },
    { name: 'Sun', sales: 900 },
  ];

  const pieChartData = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 300 },
    { name: 'Product D', value: 200 },
  ];

  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {DetailCards.map((card, index) => (
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
        {OrderCards.map((card, index) => (
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

      <Order DashboardText={true}/>
    </div>
  );
};

export default Dashboard;
