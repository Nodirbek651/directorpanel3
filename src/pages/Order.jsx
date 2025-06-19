import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [percent, setPercent] = useState(0.05);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(() => {
    return localStorage.getItem('showHistory') === 'true';
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });

  const fetchPercent = async () => {
    try {
      const res = await axios.get('https://alikafecrm.uz/percent');
      if (res.data && res.data.percent) {
        setPercent(res.data.percent / 100);
      }
    } catch (error) {
      console.error('Foizni olishda xatolik:', error);
      setError('Фоизни олишда хатолик юз берди.');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://alikafecrm.uz/order');
      const updatedOrders = response.data.map(order => {
        const calculatedTotal = order.orderItems?.reduce((acc, item) => {
          return acc + (item.product?.price || 0) * item.count;
        }, 0);
        return {
          ...order,
          totalPrice: calculatedTotal || 0
        };
      });
      setOrders(updatedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Buyurtmalarni olishda xatolik:', error);
      setError('Буюртмаларни олишда хатолик юз берди.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPercent();
    fetchOrders();
    const interval = setInterval(fetchOrders, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = (value) => {
    setShowHistory(value);
    localStorage.setItem('showHistory', value);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getStatusBadge = (status) => {
    const commonStyle = {
      color: '#fff',
      padding: '6px 20px',
      borderRadius: '6px',
      fontWeight: 'bold',
      display: 'inline-block',
      minWidth: '120px',
      textAlign: 'center',
    };
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span style={{ ...commonStyle, backgroundColor: 'red' }}>Янги буюртма</span>;
      case 'cooking':
        return <span style={{ ...commonStyle, backgroundColor: 'orange' }}>Тайёрланмоқда</span>;
      case 'ready':
        return <span style={{ ...commonStyle, backgroundColor: 'green' }}>Буюртма тайёр</span>;
      case 'cancelled':
        return <span style={{ ...commonStyle, backgroundColor: '#555' }}>Бекор қилинди</span>;
      case 'completed':
        return <span style={{ ...commonStyle, backgroundColor: '#228B22' }}>Мижоз олдида</span>;
      case 'archive':
        return <span style={{ ...commonStyle, backgroundColor: 'blue' }}>Тугалланган</span>;
      default:
        return <span style={{ ...commonStyle, backgroundColor: 'gray' }}>Номаълум</span>;
    }
  };

  const getTableStatusBadge = (status) => {
    const style = {
      padding: '5px 10px',
      borderRadius: '6px',
      fontWeight: 'bold',
      color: '#fff',
      display: 'inline-block',
      fontSize: '13px',
    };
    switch (status?.toLowerCase()) {
      case 'busy':
        return <span style={{ ...style, backgroundColor: '#e53935' }}>Банд</span>;
      case 'free':
        return <span style={{ ...style, backgroundColor: '#43a047' }}>Бўш</span>;
      case 'reserved':
        return <span style={{ ...style, backgroundColor: '#fb8c00' }}>Брон қилинган</span>;
      default:
        return <span style={{ ...style, backgroundColor: '#757575' }}>Номаълум</span>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const isHistoryStatus = ['archive', 'completed'].includes(order.status?.toLowerCase());
    const isCurrentStatus = ['pending', 'cooking', 'ready'].includes(order.status?.toLowerCase());
    const matchStatus = showHistory ? isHistoryStatus : isCurrentStatus;
    const matchDate = selectedDate ? isSameDate(order.createdAt, selectedDate) : true;
    return matchStatus && matchDate;
  });

  if (loading) {
    return <div style={styles.loading}>⏳ Юкланмоқда...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📋 Буюртмалар</h2>
      <div style={styles.buttonGroup}>
        <button
          style={{
            ...styles.toggleButton,
            backgroundColor: !showHistory ? '#007bff' : '#e0e0e0',
            color: !showHistory ? '#fff' : '#333',
          }}
          onClick={() => handleToggle(false)}
        >
          Хозирги буюртмалар
        </button>
        <button
          style={{
            ...styles.toggleButton,
            backgroundColor: showHistory ? '#007bff' : '#e0e0e0',
            color: showHistory ? '#fff' : '#333',
          }}
          onClick={() => handleToggle(true)}
        >
          Буюртма тарихи
        </button>
      </div>
      <div style={styles.dateFilterContainer}>
        <label htmlFor="dateFilter" style={styles.dateLabel}>
          Санани танланг:
        </label>
        <input
          id="dateFilter"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.dateInput}
        />
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>№</th>
              <th style={styles.th}>Стол номи</th>
              <th style={styles.th}>Стол рақами</th>
              <th style={styles.th}>Маҳсулотлар</th>
              <th style={styles.th}>Жами нарх</th>
              <th style={styles.th}>Хизмат ҳақи ({(percent * 100).toFixed(1)}%)</th>
              <th style={styles.th}>Умумий тўлов</th>
              <th style={styles.th}>Вақт</th>
              <th style={styles.th}>Стол ҳолати</th>
              <th style={styles.th}>Ҳолати</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => {
              const serviceFee = Math.round(order.totalPrice * percent);
              const grandTotal = order.totalPrice + serviceFee;
              return (
                <tr key={order._id || index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{order.table?.name || 'Номаълум'}</td>
                  <td style={styles.td}>{order.table?.number || '—'}</td>
                  <td style={styles.td}>
                    {order.orderItems?.map(item => `${item.product?.name || 'Номаълум'} (${item.count})`).join(', ')}
                  </td>
                  <td style={styles.td}>{order.totalPrice.toLocaleString()} сўм</td>
                  <td style={styles.td}>{serviceFee.toLocaleString()} сўм</td>
                  <td style={styles.td}>{grandTotal.toLocaleString()} сўм</td>
                  <td style={styles.timeTd}>{formatDateTime(order.createdAt)}</td>
                  <td style={styles.td}>{getTableStatusBadge(order.table?.status)}</td>
                  <td style={styles.td}>{getStatusBadge(order.status)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
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
  buttonGroup: {
    marginBottom: '16px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  toggleButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #ccc',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  dateFilterContainer: {
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  dateLabel: {
    fontWeight: '600',
  },
  dateInput: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px',
  },
  th: {
    backgroundColor: '#1976d2',
    color: '#fff',
    padding: '14px 12px',
    textAlign: 'center',
    fontWeight: '600',
    borderBottom: '1px solid #115293',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #f0f0f0',
    color: '#444',
    fontSize: '14px',
    verticalAlign: 'middle',
    textAlign: 'center',
    lineHeight: '1.4',
  },
  timeTd: {
    padding: '12px 10px',
    borderBottom: '1px solid #f0f0f0',
    color: '#444',
    fontSize: '14px',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    lineHeight: '1.4',
  },
};

export default Orders;