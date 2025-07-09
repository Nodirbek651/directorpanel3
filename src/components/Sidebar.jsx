import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaChartLine,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaArrowLeft
} from 'react-icons/fa';

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Бош саҳифа", icon: <FaHome /> },
    { to: "/orders", label: "Буюртмалар", icon: <FaClipboardList /> },
    { to: "/employees", label: "Ходимлар", icon: <FaUsers /> },
    { to: "/settings", label: "Созламалар", icon: <FaCog /> },
    { to: "/logout", label: "Чиқиш", icon: <FaSignOutAlt /> },
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: isSidebarOpen ? '260px' : '0',
        overflowX: 'hidden',
        background: 'linear-gradient(180deg, #2a5298, #1e3c72)',
        color: '#fff',
        boxShadow: isSidebarOpen ? '5px 0 20px rgba(0,0,0,0.3)' : 'none',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '20px',
        fontFamily: "'Poppins', sans-serif",
        zIndex: 1200,
        userSelect: 'none',
      }}
    >
      <button
        onClick={closeSidebar}
        aria-label="Ёпиш"
        style={{
          margin: '0 20px 20px',
          padding: '10px 18px',
          background: 'rgba(255, 126, 95, 0.15)',
          border: 'none',
          borderRadius: '8px',
          color: '#ffb997',
          fontWeight: '600',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease, transform 0.3s ease',
          boxShadow: '0 2px 8px rgba(255, 126, 95, 0.4)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 126, 95, 0.4)';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 126, 95, 0.7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 126, 95, 0.15)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.color = '#ffb997';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 126, 95, 0.4)';
        }}
      >
        <FaArrowLeft />
        Орқага
      </button>

      <nav style={{ flexGrow: 1, overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {links.map(({ to, label, icon }) => {
            const isActive = location.pathname === to;
            return (
              <li key={to} style={{ marginBottom: '10px' }}>
                <Link
                  to={to}
                  onClick={closeSidebar}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    color: isActive ? '#ffb997' : '#f0f0f0',
                    background: isActive ? 'rgba(255, 126, 95, 0.25)' : 'transparent',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '17px',
                    textDecoration: 'none',
                    boxShadow: isActive ? '0 4px 10px rgba(255, 126, 95, 0.5)' : 'none',
                    transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 126, 95, 0.15)';
                      e.currentTarget.style.color = '#ffb997';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#f0f0f0';
                    }
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{icon}</span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;