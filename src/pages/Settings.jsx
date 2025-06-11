import React from 'react';

const Settings = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚙️ Sozlamalar</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Profil Rasm</h3>
        <input type="file" style={styles.inputFile} />
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Parolni Tasdiqlash</h3>
        <div style={styles.passwordContainer}>
          <input
            type="password"
            placeholder="Yangi parol"
            style={styles.input}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Parolni tasdiqlang"
            style={styles.input}
            autoComplete="new-password"
          />
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
    padding: 30,
    maxWidth: 700,
    margin: '40px auto',
    backgroundColor: '#f9fbfd',
    borderRadius: 20,
    boxShadow: '0 20px 40px rgba(30, 60, 114, 0.15)',
    fontFamily: "'Poppins', sans-serif",
    color: '#222',
  },
  title: {
    textAlign: 'center',
    marginBottom: 35,
    fontSize: 28,
    fontWeight: 700,
    color: '#1e3c72',
    letterSpacing: '1.2px',
    textShadow: '0 3px 8px rgba(30, 60, 114, 0.3)',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 25,
    marginBottom: 30,
    borderRadius: 16,
    boxShadow: '0 8px 25px rgba(30, 60, 114, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'default',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 18,
    color: '#0b2645',
  },
  inputFile: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: 10,
    border: '2px solid #d0d7e6',
    backgroundColor: '#f5f7fb',
    fontSize: 16,
    color: '#555',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },
  passwordContainer: {
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
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
  },
  saveButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#1e3c72',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(30, 60, 114, 0.3)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
};

// Adding hover/focus styles dynamically for inputs and button
// Since inline styles do not support :hover/:focus, you might want to handle it via JS or use a CSS-in-JS library
// But here is a simple example with onFocus and onBlur for inputs and onMouseEnter/onMouseLeave for button:

// You can add that logic later if you want interaction.

export default Settings;
