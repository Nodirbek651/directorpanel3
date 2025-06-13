import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Finance.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const monthNames = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

const Finance = () => {
  const [orders, setOrders] = useState([]);
  const [monthlyProfits, setMonthlyProfits] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [currentMonthData, setCurrentMonthData] = useState({ revenue: 0, profit: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ma'lumotlarni yuklash va oylar bo'yicha guruhlash
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://alikafecrm.uz/order');

        // totalPrice ni orderItems asosida hisoblash
        const updatedOrders = response.data.map(order => {
          const calculatedTotal = order.orderItems?.reduce((acc, item) => {
            return acc + (item.product?.price || 0) * item.count;
          }, 0);
          return { ...order, totalPrice: calculatedTotal || 0 };
        });

        setOrders(updatedOrders);

        // Oylar bo'yicha daromadlarni guruhlash
        const grouped = {};
        updatedOrders.forEach(order => {
          const month = new Date(order.createdAt).getMonth();
          if (!grouped[month]) grouped[month] = 0;
          grouped[month] += order.totalPrice;
        });

        // Foyda (hozircha jami daromad sifatida olinmoqda)
        const profits = Object.keys(grouped).map(month => ({
          month: parseInt(month),
          revenue: grouped[month],
          profit: grouped[month], // agar xizmat haqi yoki boshqa hisoblar bo‘lsa, bu yerda qo‘shish mumkin
        }));

        setMonthlyProfits(profits);

        if (profits.length > 0) setSelectedMonth(profits[0].month);
      } catch (err) {
        setError('Maʼlumotlarni olishda xatolik yuz berdi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Tanlangan oy uchun ma'lumotlarni yangilash
  useEffect(() => {
    if (selectedMonth === null) return;
    const monthProfit = monthlyProfits.find(p => p.month === selectedMonth);
    if (monthProfit) {
      setCurrentMonthData({
        revenue: monthProfit.revenue,
        profit: monthProfit.profit,
      });
    }
  }, [selectedMonth, monthlyProfits]);

  // Grafik uchun ma'lumot
  const chartData = monthlyProfits.map(p => ({
    name: monthNames[p.month],
    foyda: p.profit,
  }));

  if (loading) return <div className="finance-loading">Yuklanmoqda...</div>;
  if (error) return <div className="finance-error">{error}</div>;

  return (
    <div className="finance-container">
      <h2 className="finance-title">📊 Foyda Tahlili (Oylar bo‘yicha)</h2>

      <div className="finance-filterWrapper">
        <label htmlFor="month-select" className="finance-label">Oy tanlang:</label>
        <select
          id="month-select"
          value={selectedMonth ?? ''}
          onChange={e => setSelectedMonth(parseInt(e.target.value))}
          className="finance-select"
        >
          {monthlyProfits.map(p => (
            <option key={p.month} value={p.month}>
              {monthNames[p.month]}
            </option>
          ))}
        </select>
      </div>

      <div className="finance-cardsRow">
        <div className="finance-card finance-revenueCard">
          <h3 className="finance-cardTitle">Jami Daromad</h3>
          <p className="finance-cardValue">{currentMonthData.revenue.toLocaleString()} so‘m</p>
        </div>
        <div className="finance-card finance-profitCard">
          <h3 className="finance-cardTitle">Oylik Foyda</h3>
          <p className={`finance-profitValue ${currentMonthData.profit >= 0 ? 'positive' : 'negative'}`}>
            {currentMonthData.profit.toLocaleString()} so‘m
          </p>
        </div>
      </div>

      <div className="finance-chartWrapper">
        <h3 className="finance-cardTitle">📈 Grafik: Foyda Oylar bo‘yicha</h3>
        <div style={{ overflowX: 'auto' }}>
          <BarChart
            width={400}
            height={350}
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 50, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" />
            <YAxis domain={[0, max => Math.ceil(max * 1.2)]} />
            <Tooltip />
            <Bar dataKey="foyda" fill="#4caf50" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Finance;
