import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Rostdan ham chiqmoqchimisiz?");
    if (confirmLogout) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      navigate(-1); 
      navigate('/login'); // Login sahifasiga qaytadi
    }
  };

  React.useEffect(() => {
    handleLogout();
  }, []);

  return null;
};

export default Logout;
