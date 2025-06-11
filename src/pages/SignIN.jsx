
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
    <div className="body-wrapper">
      <div className="bg-grid"></div>
      <div className="bg-gradient"></div>

      <div className="container">
        <h2 className="title">Kirish</h2>
        {error && <div className="error">Login yoki parol noto‘g‘ri yoki ruxsat yo‘q</div>}

        <form onSubmit={handleSignIn}>
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input
              type="text"
              placeholder="Foydalanuvchi nomi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button type="submit" className="btn">Kirish</button>
        </form>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .body-wrapper {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #0f0f23 0%, #1e1b4b 30%, #312e81 60%, #4c1d95 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .bg-grid {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: 
            linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: pulse 4s ease-in-out infinite;
        }

        .bg-gradient {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 30% 20%, rgba(79, 70, 229, 0.2) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%);
        }

        .container {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 2rem;
          padding: 3rem;
          width: 100%;
          max-width: 480px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(79, 70, 229, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 10;
          animation: slideIn 0.8s ease-out;
          color: #fff;
        }

        .title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, #e0e7ff, #c7d2fe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          margin-bottom: 2rem;
        }

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
          outline: none;
        }

        .input-group input:focus {
          background: rgba(30, 27, 75, 0.7);
          border-color: #4f46e5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .input-group .icon {
          position: absolute;
          top: 50%;
          left: 1rem;
          transform: translateY(-50%);
          color: #a5b4fc;
          font-size: 1.25rem;
        }

        .toggle-password {
          position: absolute;
          top: 50%;
          right: 1rem;
          transform: translateY(-50%);
          color: #a5b4fc;
          cursor: pointer;
          padding: 0.5rem;
        }

        .btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border: none;
          border-radius: 1rem;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 10px 30px rgba(79, 70, 229, 0.4);
        }

        .btn:hover {
          background: linear-gradient(135deg, #4338ca, #6d28d9);
          transform: translateY(-2px);
        }

        .error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 1rem;
          border-radius: 1rem;
          text-align: center;
          margin-bottom: 1.5rem;
          border: 2px solid rgba(239, 68, 68, 0.3);
          font-size: 0.875rem;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .container {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SignIN;
