import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateCredentials = async () => {
    if (!newLogin || !newPassword || !confirmPassword) {
      return setMessage('⚠️ Илтимос, барча майдонларни тўлдиринг.');
    }
    if (newPassword !== confirmPassword) {
      return setMessage('❌ Пароллар мос эмас.');
    }

    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.post(
        'https://alikafecrm.uz/user',
        {
          login: newLogin,
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage('✅ Маълумотлар муваффақиятли ўзгартирилди!');
        setNewLogin('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage('❌ Маълумотларни ўзгартиришда хатолик юз берди.');
      }
    } catch (error) {
      console.error('Xatolik:', error);
      setMessage('🚫 Сервер билан боғланишда муаммо юз берди.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚙️ Созламалар</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>👤 Логин ва Паролни ўзгартириш</h3>
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Янги логин"
            value={newLogin}
            onChange={(e) => setNewLogin(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Янги парол"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Паролни тасдиқланг"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
          <button style={styles.button} onClick={handleUpdateCredentials}>
            💾 Сақлаш
          </button>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: 30,
    maxWidth: 600,
    margin: '40px auto',
    backgroundColor: '#f9fbfd',
    borderRadius: 20,
    boxShadow: '0 20px 40px rgba(30, 60, 114, 0.15)',
    fontFamily: "'Segoe UI', sans-serif",
    color: '#222',
  },
  title: {
    textAlign: 'center',
    marginBottom: 35,
    fontSize: 28,
    fontWeight: 700,
    color: '#1e3c72',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 25,
    marginBottom: 30,
    borderRadius: 16,
    boxShadow: '0 8px 25px rgba(30, 60, 114, 0.1)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 18,
    color: '#0b2645',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: 10,
    border: '2px solid #d0d7e6',
    backgroundColor: '#f9fbfd',
    fontSize: 16,
    color: '#222',
  },
  button: {
    padding: 14,
    backgroundColor: '#1e3c72',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600',
    cursor: 'pointer',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#d32f2f',
  },
};

export default Settings;
