import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignIN = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://suddocs.uz/user");
        setUsers(response.data);
      } catch (err) {
        console.error("Xatolik:", err);
        setError(true);
      }
    };

    fetchUsers();
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    const foundUser = users.find(user =>
      user.username === username &&
      user.password === password &&
      user.role === "BIGADMIN"
    );

    if (foundUser) {
      localStorage.setItem('authToken', 'dummy-token');
      localStorage.setItem('director', 'true');
      navigate('/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <>
      <style>{`
        /* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Keyframes */
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% { 
    transform: translateY(-30px) rotate(180deg);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.8;
  }
  50% { 
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes shimmer {
  0% { 
    background-position: -200% 0; 
  }
  100% { 
    background-position: 200% 0; 
  }
}

@keyframes glow {
  0%, 100% { 
    box-shadow: 0 0 30px rgba(79, 70, 229, 0.4);
  }
  50% { 
    box-shadow: 0 0 50px rgba(79, 70, 229, 0.6), 0 0 80px rgba(139, 92, 246, 0.3);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Body Styles */
body {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #0f0f23 0%, #1e1b4b 30%, #312e81 60%, #4c1d95 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Background Effects */
.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: pulse 4s ease-in-out infinite;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(79, 70, 229, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%);
}

/* Floating Elements */
.floating-element {
  position: absolute;
  color: rgba(79, 70, 229, 0.3);
  animation: float linear infinite;
  pointer-events: none;
}

/* Main Container */
.container {
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  padding: 3rem;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(79, 70, 229, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 480px;
  z-index: 10;
  animation: slideIn 0.8s ease-out;
  color: #fff;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
  pointer-events: none;
}

.container:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(79, 70, 229, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Title */
.title {
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff, #e0e7ff, #c7d2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: -0.025em;
}

/* Form Groups */
.input-group {
  position: relative;
  margin-bottom: 2rem;
}

.input-group input {
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 3rem;
  background: rgba(30, 27, 75, 0.5);
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-radius: 1rem;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  outline: none;
}

.input-group input::placeholder {
  color: #a5b4fc;
  font-weight: 400;
}

.input-group input:focus {
  background: rgba(30, 27, 75, 0.7);
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

/* Icons */
.input-group .icon {
  position: absolute;
  top: 50%;
  left: 1.25rem;
  transform: translateY(-50%);
  color: #a5b4fc;
  font-size: 1.25rem;
  z-index: 2;
}

.input-group .toggle-password {
  position: absolute;
  top: 50%;
  right: 1.25rem;
  transform: translateY(-50%);
  color: #a5b4fc;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  font-size: 1.25rem;
  z-index: 2;
}

.input-group .toggle-password:hover {
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
}

/* Button */
.btn {
  position: relative;
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  border-radius: 1rem;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(79, 70, 229, 0.4);
  margin-top: 1rem;
}

.btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn:hover {
  background: linear-gradient(135deg, #4338ca, #6d28d9);
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.5);
}

.btn:hover::after {
  left: 100%;
}

.btn:active {
  transform: translateY(0);
}

/* Error States */
.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 2px solid rgba(239, 68, 68, 0.3);
}

/* Card Decorations */
.container::after {
  content: '';
  position: absolute;
  top: -2rem;
  right: -2rem;
  width: 8rem;
  height: 8rem;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(139, 92, 246, 0.2));
  border-radius: 50%;
  filter: blur(3rem);
  pointer-events: none;
}

/* Responsive Design */
@media (max-width: 640px) {
  body {
    padding: 1rem;
  }
  
  .container {
    padding: 2rem;
    border-radius: 1.5rem;
  }
  
  .title {
    font-size: 1.875rem;
  }
  
  .input-group input {
    padding: 1rem 1.25rem 1rem 2.5rem;
  }
  
  .btn {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.5rem;
  }
  
  .container {
    padding: 1.5rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media (prefers-contrast: high) {
  .container {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid #ffffff;
  }
  
  .input-group input {
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid #ffffff;
  }
}
      `}</style>

<div className="bg-grid"></div>
    <div className="bg-gradient"></div>
    
    {/* Floating elements */}
    <div className="floating-elements">
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className="floating-element"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        >
          {i % 4 === 0 && <FontAwesomeIcon icon={faUser} />}
          {i % 4 === 1 && <FontAwesomeIcon icon={faLock} />}
          {i % 4 === 2 && <FontAwesomeIcon icon={faEye} />}
          {i % 4 === 3 && <FontAwesomeIcon icon={faEyeSlash} />}
        </div>
      ))}
    </div>

    <div className="container">
      <div className="title">Direktor Kirish</div>
      
      <form onSubmit={handleSignIn}>
        {error && <div className="error">Login, parol yoki rol noto'g'ri!</div>}

        <div className="input-group">
          <FontAwesomeIcon icon={faUser} className="icon" />
          <input
            type="text"
            placeholder="Foydalanuvchi nomi"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faLock} className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
          />
        </div>

        <button className="btn" type="submit">Kirish</button>
      </form>
    </div>
    </>
  );
};

export default SignIN;
