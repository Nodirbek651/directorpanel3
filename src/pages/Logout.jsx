import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div style={styles.container}>
      <h2>Chiqish</h2>
      <p style={styles.message}>Siz haqiqatan ham tizimdan chiqmoqchimisiz?</p>
      <button onClick={logout} style={styles.logoutButton}>
       Chiqish
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center',
  },
  message: {
    marginBottom: '20px',
    fontSize: '16px',
    color: '#333',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Logout;
