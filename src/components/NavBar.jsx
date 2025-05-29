import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/logout');
  };

  return (
    <header style={styles.header}>
      <div style={styles.hamburger} onClick={toggleSidebar}>
        <div style={styles.bar}></div>
        <div style={styles.bar}></div>
        <div style={styles.bar}></div>
      </div>

      <div style={styles.rightSection}>
        <button style={styles.button} onClick={logout}>
          Chiqish
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 90,
  },
  hamburger: {
    cursor: 'pointer',
    padding: '10px',
  },
  bar: {
    width: '30px',
    height: '4px',
    backgroundColor: '#fff',
    margin: '7px 0',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#555',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Navbar;
