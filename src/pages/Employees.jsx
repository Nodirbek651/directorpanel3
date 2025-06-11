import React, { useState, useEffect } from 'react';
import axios from 'axios';

const translateRole = (role) => {
  switch (role) {
    case 'CASHIER':
      return 'Ofitsiant';
    case 'KITCHEN':
      return 'Povar';
    case 'CUSTOMER':
      return 'Admin';
    case 'BIGADMIN':
      return 'Direktor';
    default:
      return 'Nomaʼlum';
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

  if (loading) return (
    <p style={{
      padding: 30,
      textAlign: 'center',
      fontSize: 18,
      color: '#555',
      fontFamily: "'Poppins', sans-serif",
    }}>⏳ Yuklanmoqda...</p>
  );

  if (error) return (
    <p style={{
      padding: 30,
      textAlign: 'center',
      fontSize: 18,
      color: 'red',
      fontFamily: "'Poppins', sans-serif",
    }}>{error}</p>
  );

  return (
    <div style={{
      padding: 30,
      fontFamily: "'Poppins', sans-serif",
      maxWidth: 900,
      margin: '0 auto',
      backgroundColor: '#f9fbfd',
      borderRadius: 20,
      boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        marginBottom: 25,
        color: '#1e3c72',
        fontWeight: 700,
        fontSize: 28,
        textAlign: 'center',
        textShadow: '0 2px 5px rgba(30, 60, 114, 0.3)'
      }}>
        📋 Xodimlar Ro'yxati
      </h2>

      <div style={{
        overflowX: 'auto',
        boxShadow: '0 8px 20px rgba(30, 60, 114, 0.15)',
        borderRadius: 16,
        backgroundColor: '#fff',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          minWidth: 600,
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#1e3c72',
              color: '#fff',
              fontWeight: 600,
              userSelect: 'none',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}>
              <th style={{
                padding: '16px 24px',
                borderBottom: '3px solid #144270',
                borderTopLeftRadius: 16,
                textAlign: 'left',
              }}>ID</th>
              <th style={{
                padding: '16px 24px',
                borderBottom: '3px solid #144270',
                textAlign: 'left',
              }}>Ism</th>
              <th style={{
                padding: '16px 24px',
                borderBottom: '3px solid #144270',
                textAlign: 'left',
              }}>Lavozimi</th>
              <th style={{
                padding: '16px 24px',
                borderBottom: '3px solid #144270',
                borderTopRightRadius: 16,
                textAlign: 'left',
              }}>Telefon raqami</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr
                key={employee.id}
                style={{
                  borderBottom: '1px solid #eee',
                  transition: 'background-color 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eaf3ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{
                  padding: '14px 24px',
                  color: '#333',
                  fontSize: 16,
                  fontWeight: '600',
                  minWidth: 30,
                }}>{index + 1}</td>
                <td style={{
                  padding: '14px 24px',
                  color: '#222',
                  fontSize: 16,
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                }}>{employee.name}</td>
                <td style={{
                  padding: '14px 24px',
                  color: '#555',
                  fontSize: 15,
                  fontWeight: '500',
                }}>{translateRole(employee.role)}</td>
                <td style={{
                  padding: '14px 24px',
                  color: '#666',
                  fontSize: 15,
                  fontWeight: '400',
                  whiteSpace: 'nowrap',
                }}>{employee.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
