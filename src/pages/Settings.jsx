import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userRole = localStorage.getItem('userRole') || '';
  const userId = localStorage.getItem('userId');

  const validateInputs = () => {
    if (!newLogin || !newPassword || !confirmPassword) {
      setMessage('⚠️ Барча майдонларни тўлдиринг.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setMessage('❌ Пароллар мос эмас.');
      return false;
    }
    if (newPassword.length < 8) {
      setMessage('❌ Парол камида 8 та белги бўлиши керак.');
      return false;
    }
    return true;
  };

  const handleUpdateCredentials = async () => {
    if (!validateInputs()) return;

    if (userRole !== 'BIGADMIN') {
      setMessage('❌ Фақат Директор логин ва паролни ўзгартира олади.');
      return;
    }

    if (!userId) {
      setMessage('❌ Фойдаланувчи ID топилмади. Қайта киринг.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(`https://alikafecrm.uz/user/${userId}`, {
        username: newLogin,
        password: newPassword,
      });

      if (response.status >= 200 && response.status < 300) {
        setMessage('✅ Маълумотлар сақланди!');
        setNewLogin('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Сақлашда хатолик юз берди.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(
        error.response?.status === 400
          ? '❌ Нотўғри маълумот киритилди.'
          : '🚫 Сервер билан боғланишда хатолик.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>⚙️ Созламалар</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Янги логин"
          value={newLogin}
          onChange={(e) => setNewLogin(e.target.value)}
        />

        <div style={styles.flexInput}>
          <input
            style={{ ...styles.input, marginBottom: 0 }}
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Янги парол"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span style={styles.toggleText} onClick={() => setShowNewPassword((p) => !p)}>
            {showNewPassword ? '👀' : '🙈'}
          </span>
        </div>

        <div style={styles.flexInput}>
          <input
            style={{ ...styles.input, marginBottom: 0 }}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Паролни тасдиқланг"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span style={styles.toggleText} onClick={() => setShowConfirmPassword((p) => !p)}>
            {showConfirmPassword ? '👀' : '🙈'}
          </span>
        </div>

        <button
          onClick={handleUpdateCredentials}
          style={{
            ...styles.saveBtn,
            ...(isLoading || newPassword.length < 8 ? styles.disabledBtn : {}),
          }}
          disabled={isLoading || newPassword.length < 8}
        >
          {isLoading ? '⏳ Юкланмоқда...' : '💾 Сақлаш'}
        </button>

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.includes('✅') ? '#22c55e' : '#dc2626',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#fff',
    borderRadius: '18px',
    padding: '40px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#0f172a',
  },
  input: {
    flex: 1,
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f8fafc',
    color: '#111827',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    marginBottom: '20px',
  },
  flexInput: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    paddingRight: '12px',
    paddingLeft: '0px',
  },
  toggleText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2563eb',
    cursor: 'pointer',
    paddingLeft: '10px',
  },
  saveBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background 0.3s ease',
  },
  disabledBtn: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  message: {
    marginTop: '20px',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '15px',
  },
};

export default Settings;
