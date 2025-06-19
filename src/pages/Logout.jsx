import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      const tasdiq = window.confirm('Ростдан ҳам чиқмоқчимисиз?');
      if (tasdiq) {
        localStorage.removeItem('director');
        localStorage.removeItem('userRole');
        navigate('/login');
      } else {
        navigate(-1);
      }
    };
    handleLogout();
  }, [navigate]);

  return null;
};

export default Logout;