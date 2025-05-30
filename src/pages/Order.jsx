import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(() => {
    return localStorage.getItem('showHistory') === 'true';
  });

  const fetchOrders = () => {
    axios.get('https://suddocs.uz/order')
      .then(response => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Buyurtmalarni olishda xatolik:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 50000);
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
      case "pending":
        return <span style={{ ...commonStyle, backgroundColor: 'red' }}>Yangi buyurtma</span>;
      case "cooking":
        return <span style={{ ...commonStyle, backgroundColor: 'orange' }}>Tayyorlanmoqda</span>;
      case "ready":
        return <span style={{ ...commonStyle, backgroundColor: 'green' }}>Buyurtma tayyor</span>;
      case "cancelled":
        return <span style={{ ...commonStyle, backgroundColor: '#555' }}>Bekor qilindi</span>;
      case "completed":
        return <span style={{ ...commonStyle, backgroundColor: '#228B22' }}>Bajarildi</span>;
      case "archive":
        return <span style={{ ...commonStyle, backgroundColor: 'blue' }}>Tugallangan</span>;
      default:
        return <span style={{ ...commonStyle, backgroundColor: 'gray' }}>Nomaʼlum</span>;
    }
  };

  const filteredOrders = showHistory
    ? orders.filter(order =>
        ['completed', 'cancelled', 'archive'].includes(order.status?.toLowerCase())
      )
    : orders.filter(order =>
        ['pending', 'cooking', 'ready'].includes(order.status?.toLowerCase())
      );

  if (loading) {
    return <div style={styles.loading}>Yuklanmoqda...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Buyurtmalar</h2>

      <div style={styles.buttonGroup}>
        <button
          style={{
            ...styles.toggleButton,
            backgroundColor: !showHistory ? '#007bff' : '#e0e0e0',
            color: !showHistory ? '#fff' : '#333',
          }}
          onClick={() => handleToggle(false)}
        >
          Hozirgi buyurtmalar
        </button>
        <button
          style={{
            ...styles.toggleButton,
            backgroundColor: showHistory ? '#007bff' : '#e0e0e0',
            color: showHistory ? '#fff' : '#333',
          }}
          onClick={() => handleToggle(true)}
        >
          Buyurtma tarixi
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Stol raqami</th>
              <th style={styles.th}>Mahsulotlar</th>
              <th style={styles.th}>Jami narx</th>
              <th style={styles.th}>Xizmat xaqi</th>
              <th style={styles.th}>Umumiy to'lov</th>
              <th style={styles.th}>Vaqt</th>
              <th style={styles.th}>Holati</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order._id || index}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{order.tableId || 'Nomaʼlum'}</td>
                <td style={styles.td}>
                  {order.orderItems?.map(item => `${item.product.name} (${item.count})`).join(', ')}
                </td>
                <td style={styles.td}>{order.totalPrice} so'm</td>
                <td style={styles.td}>{Math.round(order.totalPrice * 0.04)} so'm</td>
                <td style={styles.td}>{Math.round(order.totalPrice * 1.04)} so'm</td>
                <td style={styles.timeTd}>{formatDateTime(order.createdAt)}</td>
                <td style={styles.td}>{getStatusBadge(order.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '16px',
    color: '#222',
  },
  loading: {
    textAlign: 'center',
    marginTop: '40px',
    fontSize: '18px',
  },
  buttonGroup: {
    marginBottom: '16px',
    display: 'flex',
    gap: '12px',
  },
  toggleButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  th: {
    backgroundColor: '#f4f4f4',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    wordBreak: 'break-word',
  },
  timeTd: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    wordBreak: 'break-word',
    width: '150px',
    whiteSpace: 'nowrap',
  },
};

export default Orders;
