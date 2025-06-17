import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chiqish = () => {
  const navigate = useNavigate();

  const chiqishniBajarish = () => {
    const tasdiq = window.confirm("Ростдан ҳам чиқмоқчимисиз?");
    if (tasdiq) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      navigate(-1); // Олдинги саҳифага қайтиш
      navigate('/login'); // Кейин логин саҳифасига ўтиш (ихтиёрий)
    }
  };

  React.useEffect(() => {
    chiqishniBajarish();
  }, []);

  return null;
};

export default Chiqish;
