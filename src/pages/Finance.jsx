import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Finance.css';

const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

const Finance = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [data, setData] = useState({
    revenue: 0,
    expenses: {
      productCost: 0,
      laborCost: 0,
      utilityCost: 0,
      otherCost: 0,
    },
    profit: 0,
    totalExpense: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const ordersRes = await axios.get('https://suddocs.uz/order');
        const orders = ordersRes.data;
        const monthGroups = {};
        orders.forEach(order => {
          const month = new Date(order.createdAt).getMonth();
          if (!monthGroups[month]) monthGroups[month] = [];
          monthGroups[month].push(order);
        });
        const monthsWithOrders = Object.keys(monthGroups).map(m => parseInt(m));
        setAvailableMonths(monthsWithOrders);
        setAllOrders(orders);
        if (monthsWithOrders.length > 0) {
          setSelectedMonth(monthsWithOrders[0]);
        }
      } catch (err) {
        setError('Maʼlumotlarni olishda xatolik yuz berdi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMonth === null) return;
    const monthlyOrders = allOrders.filter(order => {
      const orderMonth = new Date(order.createdAt).getMonth();
      return orderMonth === selectedMonth;
    });
    const revenue = monthlyOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Hozircha xarajatlar qo'lda kiritilgan
    const expenseCategories = {
      productCost: 300000,
      laborCost: 150000,
      utilityCost: 50000,
      otherCost: 20000,
    };

    const totalExpense =
      expenseCategories.productCost +
      expenseCategories.laborCost +
      expenseCategories.utilityCost +
      expenseCategories.otherCost;

    const profit = revenue - totalExpense;

    setData({
      revenue,
      expenses: expenseCategories,
      profit,
      totalExpense,
    });
  }, [selectedMonth, allOrders]);

  if (loading) return <div className="finance-loading">Yuklanmoqda...</div>;
  if (error) return <div className="finance-error">{error}</div>;

  return (
    <div className="finance-container">
      <h2 className="finance-title">📊 Moliyaviy Hisobotlar</h2>

      <div className="finance-filterWrapper">
        <label htmlFor="month-select" className="finance-label">Oy tanlang:</label>
        <select
          id="month-select"
          value={selectedMonth ?? ''}
          onChange={e => setSelectedMonth(parseInt(e.target.value))}
          className="finance-select"
        >
          {availableMonths.map(month => (
            <option key={month} value={month}>
              {monthNames[month]}
            </option>
          ))}
        </select>
      </div>

      <div className="finance-cardsRow">
        <div className="finance-card finance-revenueCard">
          <h3 className="finance-cardTitle">Jami Daromad</h3>
          <p className="finance-cardValue">{data.revenue.toLocaleString()} so‘m</p>
        </div>
        <div className="finance-card finance-expenseCard">
          <h3 className="finance-cardTitle">Jami Xarajatlar</h3>
          <p className="finance-cardValue">{data.totalExpense.toLocaleString()} so‘m</p>
        </div>
      </div>

      <div className="finance-card finance-profitCard">
        <h3 className="finance-cardTitle">Oylik Foyda</h3>
        <p className={`finance-profitValue ${data.profit >= 0 ? 'positive' : 'negative'}`}>
          {data.profit.toLocaleString()} so‘m
        </p>
      </div>

      <div className="finance-expensesAnalysis">
        <h3 className="finance-cardTitle" style={{ marginBottom: 15 }}>Xarajatlar Tahlili</h3>
        <table className="finance-table">
          <thead>
            <tr>
              <th className="finance-th">Kategoriya</th>
              <th className="finance-th">Miqdor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="finance-td">Mahsulot xarajatlari</td>
              <td className="finance-td">{data.expenses.productCost.toLocaleString()} so‘m</td>
            </tr>
            <tr>
              <td className="finance-td">Xodimlar maoshi</td>
              <td className="finance-td">{data.expenses.laborCost.toLocaleString()} so‘m</td>
            </tr>
            <tr>
              <td className="finance-td">Kommunal xarajatlar</td>
              <td className="finance-td">{data.expenses.utilityCost.toLocaleString()} so‘m</td>
            </tr>
            <tr>
              <td className="finance-td">Boshqa xarajatlar</td>
              <td className="finance-td">{data.expenses.otherCost.toLocaleString()} so‘m</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;
