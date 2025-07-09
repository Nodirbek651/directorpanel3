import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar';
import Sidebar from "./components/Sidebar";
import WeeklyMonthlyStats from './pages/WeeklyMonthlyStats';
import Orders from './pages/Order';
import Employees from './pages/Employees';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import SignIn from './pages/SignIN';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('director') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('director') === 'true';
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const AppContent = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const showNavbar = location.pathname !== '/login';

  return (
    <div style={{ display: 'flex' }}>
      {showNavbar && (
        <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      )}
      <div
        style={{
          marginLeft: showNavbar && isSidebarOpen ? '260px' : '0',
          transition: 'margin-left 0.3s ease',
          flex: 1,
          width: '100%',
        }}
      >
        {showNavbar && <Navbar toggleSidebar={toggleSidebar} />}
        <div style={{ padding: showNavbar ? '20px' : '0' }}>
          <Routes>
            <Route path="/" element={<PrivateRoute><WeeklyMonthlyStats /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><WeeklyMonthlyStats /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
            <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
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