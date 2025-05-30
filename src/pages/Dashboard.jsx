import React, { useEffect, useState, useRef, memo, useMemo } from 'react';
import axios from 'axios';
import isEqual from 'lodash.isequal';

const StatRow = memo(({ day, count, total, fee, totalWithFee }) => (
  <tr>
    <td style={styles.td}>{day}</td>
    <td style={styles.td}>{count}</td>
    <td style={styles.td}>{total.toLocaleString()}</td>
    <td style={styles.td}>{Math.round(fee).toLocaleString()}</td>
    <td style={styles.td}>{Math.round(totalWithFee).toLocaleString()}</td>
  </tr>
));

const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const WeeklyMonthlyStats = () => {
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const ordersRef = useRef([]);

  const year = new Date().getFullYear();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://suddocs.uz/order');
      if (!isEqual(data, ordersRef.current)) {
        ordersRef.current = data;
        setOrders(data);
      }
    } catch (error) {
      console.error('Xatolik:', error);
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
          const base = order.totalPrice;
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

    if (!filtered.includes(selectedMonth)) {
      filtered.push(selectedMonth);
    }

    return filtered.sort((a, b) => a - b);
  }, [monthStats, selectedMonth]);

  const totalCount = useMemo(() => {
    return Object.values(currentStats).reduce((a, v) => a + v.count, 0);
  }, [currentStats]);

  const grandTotal = useMemo(() => {
    return Object.values(currentStats).reduce((a, v) => a + v.total, 0);
  }, [currentStats]);

  const grandFee = useMemo(() => {
    return Object.values(currentStats).reduce((a, v) => a + v.fee, 0);
  }, [currentStats]);

  const grandWithFee = useMemo(() => {
    return Object.values(currentStats).reduce((a, v) => a + v.totalWithFee, 0);
  }, [currentStats]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{months[selectedMonth]} oyi statistikasi</h2>

      <div style={styles.selectContainer}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          style={styles.select}
        >
          {availableMonths.map((index) => (
            <option key={index} value={index}>
              {months[index]}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Yuklanmoqda...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Kun</th>
                <th style={styles.th}>Buyurtmalar soni</th>
                <th style={styles.th}>Asl summa</th>
                <th style={styles.th}>Xizmat haqi (4%)</th>
                <th style={styles.th}>Jami summa</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(daysCount)].map((_, idx) => {
                const day = idx + 1;
                const { count, total, fee, totalWithFee } = currentStats[day] || {};
                return (
                  <StatRow
                    key={day}
                    day={day}
                    count={count || 0}
                    total={total || 0}
                    fee={fee || 0}
                    totalWithFee={totalWithFee || 0}
                  />
                );
              })}
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                <td style={styles.td}>Jami</td>
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
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    maxWidth: 1000,
    margin: 'auto'
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    color: 'black'
  },
  selectContainer: {
    marginBottom: 20,
    textAlign: 'left'
  },
  select: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: '1px solid #ccc',
    width: '100%',
    maxWidth: 250
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd'
  },
  td: {
    padding: 12,
    borderBottom: '1px solid #eee',
    wordBreak: 'break-word'
  }
};

export default WeeklyMonthlyStats;
