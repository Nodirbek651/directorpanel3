import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import axios from 'axios';

// Танланган ой учун умумий сумма компонент
const GrandSummary = ({ total, fee, totalWithFee, monthName }) => {
  return (
    <div style={styles.totalBox}>
      <h3 style={styles.totalTitle}>📦 {monthName} ойи буйича</h3>
      <p style={styles.totalAmount}>Асосий сумма: {total.toLocaleString()} сўм</p>
      <p style={styles.totalAmount}>Хизмат ҳақи: {Math.round(fee).toLocaleString()} сўм</p>
      <p style={styles.totalAmount}>Жами: {Math.round(totalWithFee).toLocaleString()} сўм</p>
    </div>
  );
};

// Ҳар бир жадвал қатори
const StatRow = memo(({ day, count, total, fee, totalWithFee, index }) => (
  <tr style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
    <td style={styles.td}>{day}</td>
    <td style={styles.td}>{count}</td>
    <td style={styles.td}>{total.toLocaleString()}</td>
    <td style={styles.td}>{Math.round(fee).toLocaleString()}</td>
    <td style={styles.td}>{Math.round(totalWithFee).toLocaleString()}</td>
  </tr>
));

const months = ['Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн', 'Июл', 'Август', 'Сентабр', 'Октябр', 'Ноябр', 'Декабр'];
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const WeeklyMonthlyStats = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const ordersRef = useRef('');
  const year = new Date().getFullYear();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://alikafecrm.uz/order');

      const updatedOrders = response.data.map(order => {
        const calculatedTotal = order.orderItems?.reduce((acc, item) => {
          return acc + (item.product?.price || 0) * item.count;
        }, 0);
        return { ...order, totalPrice: calculatedTotal || 0 };
      });

      const str = JSON.stringify(updatedOrders);
      if (str !== ordersRef.current) {
        ordersRef.current = str;
        setOrders(updatedOrders);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Буюртмаларни олишда хатолик:', error);
    } finally {
      setLoading(false);
    }
  };

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
          const serviceFee = base * 0.04;
          stats[day].count++;
          stats[day].total += base;
          stats[day].fee += serviceFee;
          stats[day].totalWithFee += base + serviceFee;
        }
      });

      const totalCount = Object.values(stats).reduce((a, v) => a + v.count, 0);
      statsByMonth[m] = { stats, totalCount };
    }

    return statsByMonth;
  }, [orders, year]);

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

  return (
    <div style={styles.container}>
      <GrandSummary
        total={grandTotal}
        fee={grandFee}
        totalWithFee={grandWithFee}
        monthName={months[selectedMonth]}
      />

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
        <div>Юкланмоқда...</div>
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
                <td style={styles.td}>{grandTotal.toLocaleString()}</td>
                <td style={styles.td}>{Math.round(grandFee).toLocaleString()}</td>
                <td style={styles.td}>{Math.round(grandWithFee).toLocaleString()}</td>
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
    padding: 24,
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    maxWidth: 1100,
    margin: 'auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  heading: {
    fontSize: 28,
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectContainer: {
    marginBottom: 12,
    textAlign: 'center',
  },
  select: {
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    border: '1px solid #ccc',
    width: 200,
  },
  updated: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
    textAlign: 'center',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 700,
  },
  th: {
    backgroundColor: '#2f80ed',
    color: 'white',
    padding: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottom: '2px solid #2166c4',
  },
  td: {
    padding: 12,
    borderBottom: '1px solid #eee',
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  oddRow: {
    backgroundColor: '#fdfdfd',
  },
  evenRow: {
    backgroundColor: '#f1f6fc',
  },
  summaryRow: {
    backgroundColor: '#eaf2ff',
    fontWeight: 'bold',
  },
  totalBox: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    marginBottom: 20,
    textAlign: 'center',
    borderRadius: 10,
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
  },
  totalTitle: {
    fontSize: 20,
    marginBottom: 6,
    color: '#1565c0',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d47a1',
  },
};

export default WeeklyMonthlyStats;
