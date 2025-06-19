import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const monthNames = [
  'Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн',
  'Июл', 'Август', 'Сентабр', 'Октябр', 'Ноябр', 'Декабр'
];

const Finance = () => {
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [oylikFoydalar, setOyFoydalar] = useState([]);
  const [tanlanganOy, setTanlanganOy] = useState(null);
  const [oyMalumoti, setOyMalumoti] = useState({ daromad: 0, foyda: 0 });
  const [foiz, setFoiz] = useState(() => {
    const saqlangan = localStorage.getItem('foiz');
    return saqlangan ? parseFloat(saqlangan) : 0.05;
  });
  const [foizInput, setFoizInput] = useState(() => {
    const saqlangan = localStorage.getItem('foiz');
    return saqlangan ? parseFloat(saqlangan) * 100 : 5;
  });
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [xatolik, setXatolik] = useState(null);

  useEffect(() => {
    const yuklash = async () => {
      try {
        const res = await axios.get('https://alikafecrm.uz/order');
        const yangilangan = res.data.map(b => {
          const jami = b.orderItems?.reduce((sum, i) => sum + (i.product?.price || 0) * i.count, 0);
          return { ...b, totalPrice: jami || 0 };
        });
        setBuyurtmalar(yangilangan);
      } catch (err) {
        setXatolik('Маълумотларни юклашда хатолик юз берди.');
        console.error(err);
      } finally {
        setYuklanmoqda(false);
      }
    };
    yuklash();
  }, []);

  useEffect(() => {
    const guruhlangan = {};
    buyurtmalar.forEach(b => {
      const oy = new Date(b.createdAt).getMonth();
      guruhlangan[oy] = (guruhlangan[oy] || 0) + b.totalPrice;
    });

    const foydalar = Object.keys(guruhlangan).map(oy => ({
      month: parseInt(oy),
      revenue: guruhlangan[oy],
      profit: guruhlangan[oy] * foiz
    }));

    setOyFoydalar(foydalar);
    if (foydalar.length > 0) setTanlanganOy(foydalar[0].month);
  }, [buyurtmalar, foiz]);

  useEffect(() => {
    if (tanlanganOy === null) return;
    const o = oylikFoydalar.find(p => p.month === tanlanganOy);
    if (o) setOyMalumoti({ daromad: o.revenue, foyda: o.profit });
  }, [tanlanganOy, oylikFoydalar]);

  const chartData = oylikFoydalar.map(p => ({
    name: monthNames[p.month],
    foyda: p.profit
  }));

  const handleHisoblash = () => {
    const qiymat = parseFloat(foizInput);
    if (!isNaN(qiymat) && qiymat >= 0) {
      const realFoiz = qiymat / 100;
      setFoiz(realFoiz);
      localStorage.setItem('foiz', realFoiz);
    }
  };

  if (yuklanmoqda) return <div style={styles.loading}>⏳ Юкланмоқда...</div>;
  if (xatolik) return <div style={styles.error}>{xatolik}</div>;

  return (
    <div style={styles.financeContainer}>
      <h2 style={styles.financeTitle}>📊 Фойда таҳлили (Ойлар бўйича)</h2>

      <div style={styles.financeFilterWrapper}>
        <label style={styles.financeLabel}>Ой танланг:</label>
        <select
          value={tanlanganOy ?? ''}
          onChange={e => setTanlanganOy(parseInt(e.target.value))}
          style={styles.financeSelect}
        >
          {oylikFoydalar.map(p => (
            <option key={p.month} value={p.month}>
              {monthNames[p.month]}
            </option>
          ))}
        </select>

        <label style={styles.financeLabel}>Фойда фоизи:</label>
        <input
          type="number"
          step="1"
          value={foizInput}
          onChange={e => setFoizInput(e.target.value)}
          style={styles.financeInput}
        />
        <button onClick={handleHisoblash} style={styles.financeButton}>
          Ҳисоблаш
        </button>
      </div>

      <div style={styles.financeCardsRow}>
        <div style={styles.financeCard}>
          <h3 style={styles.financeCardTitle}>Жами Даромад</h3>
          <p style={styles.financeCardValue}>
            {oyMalumoti.daromad.toLocaleString()} сўм
          </p>
        </div>
        <div style={{ ...styles.financeCard, ...styles.financeProfitCard }}>
          <h3 style={styles.financeCardTitle}>Ойлик Фойда ({foizInput}%)</h3>
          <p
            style={{
              ...styles.financeProfitValue,
              color: oyMalumoti.foyda >= 0 ? '#4caf50' : '#ef4444',
            }}
          >
            {oyMalumoti.foyda.toLocaleString(undefined, { maximumFractionDigits: 0 })} сўм
          </p>
        </div>
      </div>

      <div style={styles.financeChartWrapper}>
        <h3 style={styles.financeCardTitle}>📈 График: Фойда ойлар бўйича</h3>
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

const styles = {
  financeContainer: {
    padding: '24px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  financeTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  financeFilterWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  financeLabel: {
    fontWeight: '600',
    fontSize: '16px',
    color: '#333',
    alignSelf: 'center',
  },
  financeSelect: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    minWidth: '150px',
  },
  financeInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100px',
  },
  financeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#1e3c72',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  financeCardsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  financeCard: {
    backgroundColor: '#e3f2fd',
    padding: '16px',
    borderRadius: '10px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
    flex: '1',
    minWidth: '200px',
    textAlign: 'center',
  },
  financeProfitCard: {
    backgroundColor: '#e8f5e9',
  },
  financeCardTitle: {
    fontSize: '20px',
    marginBottom: '8px',
    color: '#1565c0',
  },
  financeCardValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  financeProfitValue: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  financeChartWrapper: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
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
};

export default Finance;