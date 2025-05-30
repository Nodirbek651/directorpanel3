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
      navigate('/login'); // Login sahifasiga qaytadi
    } else {
      navigate(-1); // Oldingi sahifaga qaytadi
    }
  };

  React.useEffect(() => {
    handleLogout();
  }, []);

  return null; // Sahifada hech narsa ko‘rsatmaymiz, faqat dialog
};

export default Logout;
