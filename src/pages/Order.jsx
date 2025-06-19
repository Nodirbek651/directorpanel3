import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [percent, setPercent] = useState(0.1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(() => localStorage.getItem('showHistory') === 'true');
  const [showOnlyDelivery, setShowOnlyDelivery] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    fetchPercent();
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // 5 sekundda yangilanadi
    return () => clearInterval(interval);
  }, []);

  const fetchPercent = async () => {
    try {
      const res = await axios.get('https://alikafecrm.uz/percent');
      if (res.data?.percent) setPercent(res.data.percent / 100);
    } catch {
      setError('Фоизни олишда хатолик.');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://alikafecrm.uz/order');
      const updated = res.data.map(order => {
        const total = order.orderItems?.reduce((acc, item) => acc + (item.product?.price || 0) * item.count, 0);
        return { ...order, totalPrice: total || 0 };
      });
      setOrders(updated);
      setLoading(false);
    } catch {
      setError('Буюртмаларни олишда хатолик.');
      setLoading(false);
    }
  };

  const isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  };

  const handleToggle = (value) => {
    setShowHistory(value);
    setShowOnlyDelivery(false);
    localStorage.setItem('showHistory', value);
  };

  const handleShowDeliveryOnly = () => {
    setShowOnlyDelivery(true);
    setShowHistory(false);
  };

  const formatDateTime = (str) => {
    const d = new Date(str);
    return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status) => {
    const color = {
      pending: 'red',
      cooking: 'orange',
      ready: 'green',
      cancelled: '#777',
      completed: 'forestgreen',
      archive: 'blue'
    };
    const text = {
      pending: 'Янги буюртма',
      cooking: 'Тайёрланмоқда',
      ready: 'Буюртма тайёр',
      cancelled: 'Бекор қилинди',
      completed: 'Мижоз олдида',
      archive: 'Тугалланган'
    };
    return (
      <span style={{
        backgroundColor: color[status?.toLowerCase()] || 'gray',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '6px',
        fontWeight: 'bold'
      }}>{text[status?.toLowerCase()] || 'Номаълум'}</span>
    );
  };

  const filteredTableOrders = orders.filter(order => {
    const isDelivery = !!order.carrierNumber;
    const status = order.status?.toLowerCase();
    const matchStatus = showHistory
      ? ['archive', 'completed'].includes(status)
      : ['pending', 'cooking', 'ready'].includes(status);
    const matchDate = isSameDate(order.createdAt, selectedDate);
    return !isDelivery && matchStatus && matchDate;
  });

  const filteredDeliveryOrders = orders.filter(order =>
    order.carrierNumber && isSameDate(order.createdAt, selectedDate)
  );

  const renderOrderRow = (order, index) => {
    const serviceFee = Math.round(order.totalPrice * percent);
    const total = order.totalPrice + serviceFee;
    return (
      <tr key={order._id}>
        <td style={styles.td}>{index + 1}</td>
        <td style={styles.td}>{order.carrierNumber ? `📞 ${order.carrierNumber}` : order.table?.number || '—'}</td>
        <td style={styles.td}>{order.orderItems?.map(i => `${i.product?.name || 'Номаълум'} (${i.count})`).join(', ')}</td>
        <td style={styles.td}>{order.totalPrice.toLocaleString()} сўм</td>
        <td style={styles.td}>{serviceFee.toLocaleString()} сўм</td>
        <td style={styles.td}>{total.toLocaleString()} сўм</td>
        <td style={styles.td}>{formatDateTime(order.createdAt)}</td>
        <td style={styles.td}>{getStatusBadge(order.status)}</td>
        <td style={styles.td}>
          {order.carrierNumber && (
            <button style={styles.deliveryBtn} onClick={() => setSelectedDelivery(order)}>Доставка</button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📋 Буюртмалар</h2>

      <div style={styles.buttonGroup}>
        <button onClick={() => handleToggle(false)} style={{ ...styles.toggleButton, backgroundColor: !showHistory && !showOnlyDelivery ? '#007bff' : '#e0e0e0' }}>Хозирги</button>
        <button onClick={() => handleToggle(true)} style={{ ...styles.toggleButton, backgroundColor: showHistory ? '#007bff' : '#e0e0e0' }}>Тарих</button>
        <button onClick={handleShowDeliveryOnly} style={{ ...styles.toggleButton, backgroundColor: showOnlyDelivery ? '#007bff' : '#e0e0e0' }}>Даставка</button>
      </div>

      <div style={styles.dateFilterContainer}>
        <label style={styles.dateLabel}>Сана:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={styles.dateInput}
        />
      </div>

      {!showOnlyDelivery && (
        <>
          <h3 style={styles.sectionTitle}>🍽 Зал буюртмалари</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>№</th>
                  <th style={styles.th}>Стол</th>
                  <th style={styles.th}>Маҳсулотлар</th>
                  <th style={styles.th}>Жами нарх</th>
                  <th style={styles.th}>Хизмат ҳақи</th>
                  <th style={styles.th}>Умумий</th>
                  <th style={styles.th}>Вақт</th>
                  <th style={styles.th}>Ҳолати</th>
                </tr>
              </thead>
              <tbody>{filteredTableOrders.map(renderOrderRow)}</tbody>
            </table>
          </div>
        </>
      )}

      {showOnlyDelivery && (
        <>
          <h3 style={styles.sectionTitle}>🚗 Доставка буюртмалари</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>№</th>
                  <th style={styles.th}>Телефон</th>
                  <th style={styles.th}>Маҳсулотлар</th>
                  <th style={styles.th}>Жами нарх</th>
                  <th style={styles.th}>Хизмат ҳақи</th>
                  <th style={styles.th}>Умумий</th>
                  <th style={styles.th}>Вақт</th>
                  <th style={styles.th}>Ҳолати</th>
                  <th style={styles.th}>Доставка</th>
                </tr>
              </thead>
              <tbody>{filteredDeliveryOrders.map(renderOrderRow)}</tbody>
            </table>
          </div>
        </>
      )}

      {selectedDelivery && (
        <div style={styles.modalOverlay} onClick={() => setSelectedDelivery(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '12px' }}>📦 Доставка маълумоти</h3>
            <p><strong>Телефон рақами:</strong> {selectedDelivery.carrierNumber}</p>
            <p><strong>Маҳсулотлар:</strong> {selectedDelivery.orderItems?.map(i => `${i.product?.name || 'Номаълум'} (${i.count})`).join(', ')}</p>
            <p><strong>Жами нарх:</strong> {selectedDelivery.totalPrice.toLocaleString()} сўм</p>
            <p><strong>Хизмат ҳақи:</strong> {Math.round(selectedDelivery.totalPrice * percent).toLocaleString()} сўм</p>
            <p><strong>Умумий:</strong> {(selectedDelivery.totalPrice + Math.round(selectedDelivery.totalPrice * percent)).toLocaleString()} сўм</p>
            <p><strong>Ҳолати:</strong> {selectedDelivery.status}</p>
            <p><strong>Вақт:</strong> {formatDateTime(selectedDelivery.createdAt)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '24px', backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: 'sans-serif' },
  heading: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', margin: '20px 0 10px' },
  buttonGroup: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' },
  toggleButton: { padding: '10px 20px', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', color: 'black' },
  dateFilterContainer: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px', alignItems: 'center' },
  dateLabel: { fontWeight: '600' },
  dateInput: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc' },
  tableWrapper: { overflowX: 'auto', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '900px' },
  th: { backgroundColor: '#1976d2', color: '#fff', padding: '10px', textAlign: 'center' },
  td: { padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee' },
  deliveryBtn: { backgroundColor: '#f9c846', color: '#000', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '500px', width: '90%' }
};

export default Orders;
