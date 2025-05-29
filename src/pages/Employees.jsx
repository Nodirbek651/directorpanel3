import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Lavozimlarni tarjima qilish
const translateRole = (role) => {
  switch (role) {
    case 'CASHIER':
      return 'Ofitsiant';
    case 'KITCHEN':
      return 'Povar';
    case 'CUSTOMER':
      return 'Admin';
    default:
      return role || 'Nomaʼlum';
  }
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://suddocs.uz/user')
      .then(response => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Xatolik:", err);
        setError("Ma'lumotni yuklashda xatolik yuz berdi.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>⏳ Yuklanmoqda...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>📋 Xodimlar Ro'yxati</h2>

      <div style={{
        overflowX: 'auto',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        backgroundColor: '#fff'
      }}>
        <table style={{
          minWidth: '500px',
          width: '100%',
          borderCollapse: 'collapse',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Ism</th>
              <th style={thStyle}>Lavozimi</th>
              <th style={thStyle}>Telefon raqami</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{employee.name}</td>
                <td style={tdStyle}>{translateRole(employee.role)}</td>
                <td style={tdStyle}>{employee.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Style'lar
const thStyle = {
  padding: '12px',
  borderBottom: '2px solid #ddd',
  textAlign: 'left',
  fontWeight: 'bold',
  color: '#333'
};

const tdStyle = {
  padding: '12px',
  textAlign: 'left',
  color: '#444'
};

export default Employees;
