import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const goToLogoutPage = () => {
    navigate('/logout');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        background: 'linear-gradient(90deg, #1e3c72, #2a5298)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "'Poppins', sans-serif",
        userSelect: 'none',
      }}
    >
      {/* Left part: hamburger + logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          cursor: 'default',
        }}
      >
        <div
          onClick={toggleSidebar}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') toggleSidebar();
          }}
          tabIndex={0}
          role="button"
          aria-label="Toggle sidebar"
          style={{
            width: '42px',
            height: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                height: '5px',
                borderRadius: '4px',
                background: `linear-gradient(90deg, #ff7e5f, #feb47b)`,
                boxShadow: '0 2px 6px rgba(255, 126, 95, 0.6)',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>
        <h1
          style={{
            color: 'white',
            fontWeight: '700',
            fontSize: '24px',
            letterSpacing: '0.1em',
            userSelect: 'none',
          }}
        >
      
        </h1>
      </div>

      
      <button
        onClick={goToLogoutPage}
        style={{
          padding: '10px 28px',
          fontSize: '16px',
          fontWeight: '600',
          color: 'white',
          background: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(255, 126, 95, 0.7)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 126, 95, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 126, 95, 0.7)';
        }}
        aria-label="Logout"
      >
        Chiqish
      </button>
    </header>
  );
};

export default Navbar;
