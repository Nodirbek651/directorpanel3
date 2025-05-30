import React, { useEffect, useState } from 'react';
import axios from 'axios';

const initialFinancialData = {
  revenue: 0,
  expenses: {
    productCost: 0,
    laborCost: 0,
    utilityCost: 0,
    otherCost: 0,
  },
  profit: 0,
  totalExpense: 0,
};

const Finance = () => {
  const [data, setData] = useState(initialFinancialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const ordersRes = await axios.get('https://suddocs.uz/order');
        const expensesRes = await axios.get('https://suddocs.uz/order');

        const orders = ordersRes.data;
        const expenses = expensesRes.data;

       
        const revenue = orders.reduce((sum, order) => sum + order.totalPrice , 0);

        const expenseCategories = {
          productCost: 0,
          laborCost: 0,
          utilityCost: 0,
          otherCost: 0,
        };

        expenses.forEach(({ category, amount }) => {
          switch (category) {
            case 'Mahsulot':
              expenseCategories.productCost += amount;
              break;
            case 'Xodim':
              expenseCategories.laborCost += amount;
              break;
            case 'Kommunal':
              expenseCategories.utilityCost += amount;
              break;
            case 'Boshqa':
              expenseCategories.otherCost += amount;
              break;
            default:
              break;
          }
        });


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
      } catch (err) {
        setError('Maʼlumotlarni olishda xatolik yuz berdi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Yuklanmoqda...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>Moliyaviy Hisobotlar</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={cardStyle}>
          <h3>Jami Daromad</h3>
          <p>{data.revenue.toLocaleString()} so‘m</p>
        </div>
        <div style={cardStyle}>
          <h3>Jami Xarajatlar</h3>
          <p>{data.totalExpense.toLocaleString()} so‘m</p>
        </div>
      </div>

      <div style={{ ...cardStyle, backgroundColor: '#ffe6e6', marginBottom: 20 }}>
        <h3>Oylik Foyda</h3>
        <p style={{ color: data.profit >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
          {data.profit.toLocaleString()} so‘m
        </p>
      </div>

      <div>
        <h3>Xarajatlar Tahlili</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Kategoriya</th>
              <th style={tableHeaderStyle}>Miqdor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableCellStyle}>Mahsulot xarajatlari</td>
              <td style={tableCellStyle}>{data.expenses.productCost.toLocaleString()} so‘m</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>Xodimlar maoshi</td>
              <td style={tableCellStyle}>{data.expenses.laborCost.toLocaleString()} so‘m</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>Kommunal xarajatlar</td>
              <td style={tableCellStyle}>{data.expenses.utilityCost.toLocaleString()} so‘m</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>Boshqa xarajatlar</td>
              <td style={tableCellStyle}>{data.expenses.otherCost.toLocaleString()} so‘m</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cardStyle = {
  padding: '10px',
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  width: '48%',
  boxSizing: 'border-box',
};

const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f9f9f9',
  fontWeight: 'bold',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

export default Finance;
