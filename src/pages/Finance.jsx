import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Finance.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// Ой номлари
const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентабрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const Finance = () => {
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [oylikFoydalar, setOyFoydalar] = useState([]);
  const [tanlanganOy, setTanlanganOy] = useState(null);
  const [oyMalumoti, setOyMalumoti] = useState({ daromad: 0, foyda: 0 });
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [xatolik, setXatolik] = useState(null);

  // 🟡 Маълумотларни олиш ва ойлар бўйича гуруҳлаш
  useEffect(() => {
    const malumotlarniYuklash = async () => {
      setYuklanmoqda(true);
      setXatolik(null);
      try {
        const javob = await axios.get('https://alikafecrm.uz/order');

        // Хар бир буюртма учун умумий нархни ҳисоблаш
        const yangilanganBuyurtmalar = javob.data.map(buyurtma => {
          const jami = buyurtma.orderItems?.reduce((acc, item) => {
            return acc + (item.product?.price || 0) * item.count;
          }, 0);
          return { ...buyurtma, totalPrice: jami || 0 };
        });

        setBuyurtmalar(yangilanganBuyurtmalar);

        // 🟢 Ойлар бўйича даромадни гуруҳлаш
        const guruhlangan = {};
        yangilanganBuyurtmalar.forEach(buyurtma => {
          const oy = new Date(buyurtma.createdAt).getMonth();
          if (!guruhlangan[oy]) guruhlangan[oy] = 0;
          guruhlangan[oy] += buyurtma.totalPrice;
        });

        // 🔵 Фойда (ҳозирча умумий даромад деб олинган)
        const foydalar = Object.keys(guruhlangan).map(oy => ({
          month: parseInt(oy),
          revenue: guruhlangan[oy],
          profit: guruhlangan[oy],
        }));

        setOyFoydalar(foydalar);

        if (foydalar.length > 0) setTanlanganOy(foydalar[0].month);
      } catch (err) {
        setXatolik("Маълумотларни олишда хатолик юз берди.");
        console.error(err);
      } finally {
        setYuklanmoqda(false);
      }
    };

    malumotlarniYuklash();
  }, []);

  // 🟠 Танланган ой маълумотини янгилаш
  useEffect(() => {
    if (tanlanganOy === null) return;
    const oy = oylikFoydalar.find(p => p.month === tanlanganOy);
    if (oy) {
      setOyMalumoti({
        daromad: oy.revenue,
        foyda: oy.profit,
      });
    }
  }, [tanlanganOy, oylikFoydalar]);

  // 📊 График учун маълумот
  const grafikMalumot = oylikFoydalar.map(p => ({
    name: monthNames[p.month],
    foyda: p.profit,
  }));

  if (yuklanmoqda) return <div className="finance-loading">⏳ Юкланмоқда...</div>;
  if (xatolik) return <div className="finance-error">{xatolik}</div>;

  return (
    <div className="finance-container">
      <h2 className="finance-title">📊 Фойда таҳлили (Ойлар бўйича)</h2>

      <div className="finance-filterWrapper">
        <label htmlFor="month-select" className="finance-label">Ой танланг:</label>
        <select
          id="month-select"
          value={tanlanganOy ?? ''}
          onChange={e => setTanlanganOy(parseInt(e.target.value))}
          className="finance-select"
        >
          {oylikFoydalar.map(p => (
            <option key={p.month} value={p.month}>
              {monthNames[p.month]}
            </option>
          ))}
        </select>
      </div>

      <div className="finance-cardsRow">
        <div className="finance-card finance-revenueCard">
          <h3 className="finance-cardTitle">Жами Даромад</h3>
          <p className="finance-cardValue">{oyMalumoti.daromad.toLocaleString()} сўм</p>
        </div>
        <div className="finance-card finance-profitCard">
          <h3 className="finance-cardTitle">Ойлик Фойда</h3>
          <p className={`finance-profitValue ${oyMalumoti.foyda >= 0 ? 'positive' : 'negative'}`}>
            {oyMalumoti.foyda.toLocaleString()} сўм
          </p>
        </div>
      </div>

      <div className="finance-chartWrapper">
        <h3 className="finance-cardTitle">📈 График: Фойда ойлар бўйича</h3>
        <div style={{ overflowX: 'auto' }}>
          <BarChart
            width={400}
            height={350}
            data={grafikMalumot}
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

export default Finance;
