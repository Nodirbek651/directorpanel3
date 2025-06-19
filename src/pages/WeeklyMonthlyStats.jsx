import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import axios from 'axios';

const GrandSummary = ({ total, fee, totalWithFee, monthName }) => {
  return (
    <div style={styles.totalBox}>
      <h3 style={styles.totalTitle}>📦 {monthName} ойи бўйича</h3>
      <p style={styles.totalAmount}>Асосий сумма: {total.toLocaleString()} сўм</p>
      <p style={styles.totalAmount}>Хизмат ҳақи: {Math.round(fee).toLocaleString()} сўм</p>
      <p style={styles.totalAmount}>Жами: {Math.round(totalWithFee).toLocaleString()} сўм</p>
    </div>
  );
};

const StatRow = memo(({ day, count, total, fee, totalWithFee, index }) => (
  <tr style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
    <td style={styles.td}>{day}</td>
    <td style={styles.td}>{count}</td>
    <td style={styles.td}>{total.toLocaleString()} сўм</td>
    <td style={styles.td}>{Math.round(fee).toLocaleString()} сўм</td>
    <td style={styles.td}>{Math.round(totalWithFee).toLocaleString()} сўм</td>
  </tr>
));

const months = ['Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн', 'Июл', 'Август', 'Сентабр', 'Октябр', 'Ноябр', 'Декабр'];
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const WeeklyMonthlyStats = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [percent, setPercent] = useState(0.04);
  const ordersRef = useRef('');
  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://alikafecrm.uz/order');
        const updatedOrders = response.data.map(order => {
          let totalPrice = 0;
          if (Array.isArray(order.orderItems)) {
            totalPrice = order.orderItems.reduce((acc, item) => {
              const itemTotal = (item.product?.price || 0) * item.count;
              return acc + itemTotal;
            }, 0);
          }
          return { ...order, totalPrice };
        });

        const str = JSON.stringify(updatedOrders);
        if (str !== ordersRef.current) {
          ordersRef.current = str;
          setOrders(updatedOrders);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error('Буюртмаларни олишда хатолик:', error);
        setError('Буюртмаларни олишда хатолик юз берди.');
      } finally {
        setLoading(false);
      }
    };

    const fetchPercent = async () => {
      try {
        const res = await axios.get('https://alikafecrm.uz/percent');
        const val = Array.isArray(res.data) ? res.data[0]?.percent : res.data?.percent;
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) setPercent(parsed / 100);
      } catch (error) {
        console.error('Фоизни олишда хатолик:', error);
        setError('Фоизни олишда хатолик юз берди.');
      }
    };

    fetchOrders();
    fetchPercent();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const monthStats = useMemo(() => {
    const statsByMonth = {};
    for (let m = 0; m < 12; m++) {
      const daysCount = getDaysInMonth(year, m);
      const stats = {};
      for (let d = 1; d <= daysCount; d++) {
        stats[d] = { count: 0, total: 0, fee: 0, totalWithFee: 0 };
      }

      orders.forEach(order => {
        const date = new Date(order.createdAt);
        if (date.getMonth() === m && date.getFullYear() === year) {
          const day = date.getDate();
          const base = order.totalPrice || 0;
          const fee = base * percent;
          stats[day].count++;
          stats[day].total += base;
          stats[day].fee += fee;
          stats[day].totalWithFee += base + fee;
        }
      });

      const totalCount = Object.values(stats).reduce((a, v) => a + v.count, 0);
      statsByMonth[m] = { stats, totalCount };
    }

    return statsByMonth;
  }, [orders, year, percent]);

  const currentStats = monthStats[selectedMonth]?.stats || {};
  const daysCount = Object.keys(currentStats).length;

  const availableMonths = useMemo(() => {
    const filtered = Object.entries(monthStats)
      .filter(([_, data]) => data.totalCount > 0)
      .map(([index]) => Number(index));
    if (!filtered.includes(selectedMonth)) filtered.push(selectedMonth);
    return filtered.sort((a, b) => a - b);
  }, [monthStats, selectedMonth]);

  const totalCount = useMemo(() => Object.values(currentStats).reduce((a, v) => a + v.count, 0), [currentStats]);
  const grandTotal = useMemo(() => Object.values(currentStats).reduce((a, v) => a + v.total, 0), [currentStats]);
  const grandFee = useMemo(() => Object.values(currentStats).reduce((a, v) => a + v.fee, 0), [currentStats]);
  const grandWithFee = useMemo(() => Object.values(currentStats).reduce((a, v) => a + v.totalWithFee, 0), [currentStats]);

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <GrandSummary total={grandTotal} fee={grandFee} totalWithFee={grandWithFee} monthName={months[selectedMonth]} />

      <h2 style={styles.heading}>{months[selectedMonth]} ойи статистикаси</h2>

      <div style={styles.selectContainer}>
        <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} style={styles.select}>
          {availableMonths.map(index => (
            <option key={index} value={index}>
              {months[index]}
            </option>
          ))}
        </select>
      </div>

      {lastUpdated && (
        <div style={styles.updated}>Сўнгги янгиланиш: {lastUpdated.toLocaleTimeString()}</div>
      )}

      {loading ? (
        <div style={styles.loading}>⏳ Юкланмоқда...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Кун</th>
                <th style={styles.th}>Буюртмалар</th>
                <th style={styles.th}>Асосий сумма</th>
                <th style={styles.th}>Хизмат ҳақи</th>
                <th style={styles.th}>Жами</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(daysCount)].map((_, idx) => {
                const day = idx + 1;
                const { count, total, fee, totalWithFee } = currentStats[day] || {};
                return (
                  <StatRow
                    key={day}
                    index={idx}
                    day={day}
                    count={count || 0}
                    total={total || 0}
                    fee={fee || 0}
                    totalWithFee={totalWithFee || 0}
                  />
                );
              })}
              <tr style={styles.summaryRow}>
                <td style={styles.td}>Жами</td>
                <td style={styles.td}>{totalCount}</td>
                <td style={styles.td}>{grandTotal.toLocaleString()} сўм</td>
                <td style={styles.td}>{Math.round(grandFee).toLocaleString()} сўм</td>
                <td style={styles.td}>{Math.round(grandWithFee).toLocaleString()} сўм</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#f7f9fc',
    borderRadius: '12px',
    maxWidth: '1100px',
    margin: '0 auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1e3c72',
    textAlign: 'center',
  },
  totalBox: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '20px',
    textAlign: 'center',
  },
  totalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0b2645',
    marginBottom: '10px',
  },
  totalAmount: {
    fontSize: '16px',
    color: '#333',
    margin: '5px 0',
  },
  selectContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    minWidth: '150px',
  },
  updated: {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#666',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '20px',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '20px',
    color: '#d32f2f',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  th: {
    backgroundColor: '#1e3c72',
    color: '#fff',
    padding: '14px 12px',
    textAlign: 'center',
    fontWeight: '600',
    borderBottom: '1px solid #115293',
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #f0f0f0',
    color: '#444',
    fontSize: '14px',
    textAlign: 'center',
  },
  evenRow: {
    backgroundColor: '#f9fbfd',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  summaryRow: {
    backgroundColor: '#e3f2fd',
    fontWeight: '600',
  },
};

export default WeeklyMonthlyStats;