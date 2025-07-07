import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [percent, setPercent] = useState(0.1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(() => localStorage.getItem('showHistory') === 'true');
  const [showOnlyDelivery, setShowOnlyDelivery] = useState(false);
  const [showDeliveryHistory, setShowDeliveryHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchPercent();
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    const resizeListener = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', resizeListener);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  const fetchPercent = async () => {
    try {
      const res = await axios.get('https://alikafecrm.uz/percent');
      console.log('Fetched percent:', res.data); // Debug: Inspect percent data
      if (res.data?.percent) setPercent(res.data.percent / 100);
    } catch {
      setError('Фоизни олишда хатолик.');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://alikafecrm.uz/order');
      console.log('Fetched orders:', res.data); // Debug: Inspect raw data
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
    if (!date1 || !date2) {
      console.log('Invalid date detected:', { date1, date2 }); // Debug: Log invalid dates
      return false;
    }
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1) || isNaN(d2)) {
      console.log('Invalid date format:', { date1, date2 }); // Debug: Log invalid date formats
      return false;
    }
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const handleToggle = (value) => {
    setShowHistory(value);
    setShowOnlyDelivery(false);
    setShowDeliveryHistory(false);
    localStorage.setItem('showHistory', value);
  };

  const handleShowDeliveryOnly = () => {
    setShowOnlyDelivery(true);
    setShowHistory(false);
    setShowDeliveryHistory(false);
  };

  const handleShowDeliveryHistory = () => {
    setShowDeliveryHistory(true);
    setShowOnlyDelivery(false);
    setShowHistory(false);
  };

  const formatDateTime = (str) => {
    if (!str) return '—';
    const d = new Date(str);
    if (isNaN(d)) return 'Номаълум вақт';
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

  const filteredOrders = (filterFn) => {
    const filtered = orders.filter(filterFn);
    console.log('Filtered orders:', filtered); // Debug: Log filtered orders
    return filtered;
  };

  const renderOrderRow = (order, index) => {
    const serviceFee = Math.round(order.totalPrice * percent);
    const total = order.totalPrice + serviceFee;
    const productGrid = {
      display: 'grid',
      gridTemplateColumns:
        windowWidth < 480 ? '1fr' : windowWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: '6px'
    };

    return (
      <tr key={order._id}>
        <td style={styles.td}>{index + 1}</td>
        <td style={styles.td}>{order.carrierNumber ? `📞 ${order.carrierNumber}` : order.table?.number || '—'}</td>
        <td style={{ ...styles.td, padding: '10px 4px' }}>
          <div style={productGrid}>
            {order.orderItems?.map((i, idx) => (
              <div key={idx} style={styles.productItem}>
                {i.product?.name || 'Номаълум'} ({i.count})
              </div>
            ))}
          </div>
        </td>
        <td style={styles.td}>{order.totalPrice.toLocaleString()} сўм</td>
        <td style={styles.td}>{serviceFee.toLocaleString()} сўм</td>
        <td style={styles.td}>{total.toLocaleString()} сўм</td>
        <td style={styles.td}>{formatDateTime(order.createdAt)}</td>
        <td style={styles.td}>
          {order.carrierNumber ? (
            <button style={styles.deliveryBtn} onClick={() => setSelectedDelivery(order)}>
              Доставка
            </button>
          ) : (
            getStatusBadge(order.status)
          )}
        </td>
      </tr>
    );
  };

  const renderTable = (title, orders) => (
    <>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>№</th>
              <th style={styles.th}>Телефон / Стол</th>
              <th style={styles.th}>Маҳсулотлар</th>
              <th style={styles.th}>Жами нарх</th>
              <th style={styles.th}>Хизмат ҳақи</th>
              <th style={styles.th}>Умумий</th>
              <th style={styles.th}>Вақт</th>
              <th style={styles.th}>Ҳолати</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(renderOrderRow)
            ) : (
              <tr>
                <td colSpan="8" style={{ ...styles.td, textAlign: 'center' }}>
                  Ушбу санада буюртмалар йўқ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const isDelivery = (order) => !!order.carrierNumber;
  const statusMatch = (statuses) => (order) => statuses.includes(order.status?.toLowerCase());
  const dateMatch = (order) => isSameDate(order.createdAt, selectedDate);

  return (
    <div style={styles.container}>
      {loading && <p style={{ textAlign: 'center' }}>Юкланмоқда...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
      <h2 style={styles.heading}>📋 Буюртмалар</h2>
      <div style={styles.buttonGroup}>
        <button onClick={() => handleToggle(false)} style={{ ...styles.toggleButton, backgroundColor: !showHistory && !showOnlyDelivery && !showDeliveryHistory ? '#007bff' : '#e0e0e0' }}>Хозирги</button>
        <button onClick={() => handleToggle(true)} style={{ ...styles.toggleButton, backgroundColor: showHistory ? '#007bff' : '#e0e0e0' }}>Тарих</button>
        <button onClick={handleShowDeliveryOnly} style={{ ...styles.toggleButton, backgroundColor: showOnlyDelivery ? '#007bff' : '#e0e0e0' }}>Даставка</button>
        <button onClick={handleShowDeliveryHistory} style={{ ...styles.toggleButton, backgroundColor: showDeliveryHistory ? '#007bff' : '#e0e0e0' }}>Даставка тарихи</button>
      </div>
      <div style={styles.dateFilterContainer}>
        <label style={styles.dateLabel}>Сана:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value || new Date().toISOString().split('T')[0])}
          style={styles.dateInput}
        />
      </div>
      {!showOnlyDelivery && !showDeliveryHistory && renderTable('🍽 Зал буюртмалари', filteredOrders(order => !isDelivery(order) && (showHistory ? ['archive', 'completed'].includes(order.status?.toLowerCase()) : ['pending', 'cooking', 'ready'].includes(order.status?.toLowerCase())) && dateMatch(order)))}
      {showOnlyDelivery && renderTable('🚗 Доставка буюртмалари', filteredOrders(order => isDelivery(order) && ['pending', 'cooking'].includes(order.status?.toLowerCase()) && dateMatch(order)))}
      {showDeliveryHistory && renderTable('📦 Даставка тарихи', filteredOrders(order => isDelivery(order) && ['ready', 'completed', 'archive'].includes(order.status?.toLowerCase()) && dateMatch(order)))}
      {selectedDelivery && (
        <div style={styles.modalOverlay} onClick={() => setSelectedDelivery(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '12px' }}>📦 Доставка маълумоти</h3>
            <p><strong>Телефон рақами:</strong> {selectedDelivery.carrierNumber}</p>
            <p><strong>Маҳсулотлар:</strong></p>
            <ul>
              {selectedDelivery.orderItems?.map((i, idx) => (
                <li key={idx}>{i.product?.name || 'Номаълум'} ({i.count})</li>
              ))}
            </ul>
            <p><strong>Жами нарх:</strong> {selectedDelivery.totalPrice.toLocaleString()} сўм</p>
            <p><strong>Хизмат ҳақи:</strong> {Math.round(selectedDelivery.totalPrice * percent).toLocaleString()} сўм</p>
            <p><strong>Умумий:</strong> {(selectedDelivery.totalPrice + Math.round(selectedDelivery.totalPrice * percent)).toLocaleString()} сўм</p>
            <p><strong>Вақт:</strong> {formatDateTime(selectedDelivery.createdAt)}</p>
            <p><strong>Ҳолати:</strong> {getStatusBadge(selectedDelivery.status)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '24px', backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: 'sans-serif' },
  heading: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', color: 'black' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', margin: '20px 0 10px' },
  buttonGroup: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '16px' },
  toggleButton: { padding: '10px 20px', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', color: 'black', textAlign: 'center', boxSizing: 'border-box', minWidth: '140px' },
  dateFilterContainer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '16px', alignItems: 'center' },
  dateLabel: { fontWeight: '600' },
  dateInput: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc', minWidth: '150px' },
  tableWrapper: { overflowX: 'auto', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  table: { width: '100%', minWidth: '900px', borderCollapse: 'collapse' },
  th: { backgroundColor: '#1976d2', color: '#fff', padding: '10px', textAlign: 'center', whiteSpace: 'nowrap' },
  td: { padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  deliveryBtn: { backgroundColor: '#f9c846', color: '#000', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingaboriginal: '10px', zIndex: 1000 },
  modal: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '500px', width: '95%', maxHeight: '90vh', overflowY: 'auto' },
  productItem: { backgroundColor: '#f1f1f1', padding: '4px 6px', borderRadius: '4px', fontSize: '13px', textAlign: 'center', whiteSpace: 'normal', wordBreak: 'break-word' }
};

export default Orders;
