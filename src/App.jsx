import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Order';
import Finance from './pages/Finance';
import Employees from './pages/Employees';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import SignIn from './pages/SignIN';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? <Navigate to="/ " replace /> : children;
};

const AppContent = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Navbar va Sidebar faqat login sahifasidan boshqa sahifalarda ko‘rinadi
  const showNavbar = location.pathname !== '/login';

  return (
    <div style={{ display: 'flex' }}>
      {showNavbar && (
        <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
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

export default App;
