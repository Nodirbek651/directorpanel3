import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Order';
import Finance from './pages/Finance';
import Employees from './pages/Employees';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import SignIn from './pages/SignIN';

import { Link } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const AppContent = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Navbar faqat login sahifasida ko‘rinmas bo‘lsin
  const showNavbar = location.pathname !== '/login';

  return (
    <div style={{ display: 'flex' }}>
      {showNavbar && (
        <div
          style={{
            padding: '0',
            width: isSidebarOpen ? '250px' : '0',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            backgroundColor: '#333',
            height: '100vh',
            color: '#fff',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 100,
          }}
        >
          <button
            onClick={closeSidebar}
            style={{
              margin: '10px',
              padding: '10px',
              backgroundColor: '#444',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
            }}
          >
            ← Back
          </button>
          <ul style={{ listStyle: 'none', padding: '20px' }}>
            <li><Link to="/dashboard" onClick={closeSidebar} style={linkStyle}>Bosh sahifa</Link></li>
            <li><Link to="/orders" onClick={closeSidebar} style={linkStyle}>Buyurtmalar</Link></li>
            <li><Link to="/finance" onClick={closeSidebar} style={linkStyle}>Moliyaviy hisobotlar</Link></li>
            <li><Link to="/employees" onClick={closeSidebar} style={linkStyle}>Xodimlar</Link></li>
            <li><Link to="/settings" onClick={closeSidebar} style={linkStyle}>Sozlamalar</Link></li>
            <li><Link to="/logout" onClick={closeSidebar} style={linkStyle}>Chiqish</Link></li>
          </ul>
        </div>
      )}

      <div
        style={{
          marginLeft: showNavbar && isSidebarOpen ? '250px' : '0',
          transition: 'margin-left 0.3s ease',
          flex: 1,
          width: '100%',
        }}
      >
        {showNavbar && <Navbar toggleSidebar={toggleSidebar} />}
        <div style={{ padding: showNavbar ? '20px' : '0' }}>
          <Routes>
            {/* Asosiy sahifalar uchun private route */}
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } />
            <Route path="/finance" element={
              <PrivateRoute>
                <Finance />
              </PrivateRoute>
            } />
            <Route path="/employees" element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            <Route path="/logout" element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            } />

            {/* Login uchun public route */}
            <Route path="/login" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  display: 'block',
  padding: '8px 0',
};

export default App;
