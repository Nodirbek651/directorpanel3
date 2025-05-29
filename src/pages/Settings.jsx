import React from 'react';

const Settings = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sozlamalar</h2>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Profil Rasm</h3>
        <input type="file" style={styles.inputFile} />
      </div>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Parolni Tasdiqlash</h3>
        <div style={styles.passwordContainer}>
          <input type="password" placeholder="Yangi parol" style={styles.input} />
          <input type="password" placeholder="Parolni tasdiqlang" style={styles.input} />
        </div>
      </div>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Xavfsizlik</h3>
        <button style={styles.saveButton}>Saqlash</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f4f4f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333',
  },
  inputFile: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
    cursor: 'pointer',
  },
  passwordContainer: {
    display: 'flex',
    gap: '10px',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginBottom: '10px',
    fontSize: '16px',
  },
  saveButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Settings;
