import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
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
        console.log("Fetched users:", response.data);
        setUsers(response.data);
      } catch (err) {
        console.error("Foydalanuvchilarni olishda xatolik:", err);
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
        * {
          box-sizing: border-box;
        }
        body, #root {
          margin: 0; padding: 0; height: 100vh; width: 100vw;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .login-container {
          background: #1f1f38;
          padding: 40px 30px;
          border-radius: 12px;
          width: 320px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          color: #f0f0f5;
          text-align: center;
          transition: transform 0.3s ease;
        }
        .login-container:hover {
          transform: scale(1.03);
          box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }
        .login-title {
          margin-bottom: 25px;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 1.2px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        input[type="text"],
        input[type="password"] {
          width: 100%;
          max-width: 100%;
          padding: 14px 18px;
          border-radius: 8px;
          border: none;
          font-size: 16px;
          outline: none;
          background-color: #333353;
          color: #eaeaff;
          transition: background-color 0.2s ease;
          box-shadow: inset 0 0 5px #5c5c90;
          box-sizing: border-box;
        }
        input[type="text"]:focus,
        input[type="password"]:focus {
          background-color: #49497a;
          box-shadow: 0 0 8px #8674ff;
        }
        .password-wrapper {
          position: relative;
          width: 100%;
          max-width: 100%;
        }
        .toggle-password {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 18px;
          user-select: none;
          color: #a9a9ff;
          transition: color 0.3s ease;
        }
        .toggle-password:hover {
          color: #fff;
        }
        button {
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #7b68ee;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
          box-shadow: 0 5px 15px rgba(123, 104, 238, 0.5);
        }
        button:hover {
          background: #9a86ff;
          box-shadow: 0 8px 25px rgba(154, 134, 255, 0.7);
        }
        .error-text {
          color: #ff6b6b;
          font-size: 14px;
          margin-bottom: -10px;
        }
        @media (max-width: 400px) {
          .login-container {
            width: 90vw;
            padding: 30px 20px;
          }

          input[type="text"],
          input[type="password"] {
            font-size: 15px;
            padding: 12px 14px;
          }

          button {
            font-size: 16px;
            padding: 12px;
          }
        }
      `}</style>

      <div className="login-container" role="main" aria-label="Login form">
        <h1 className="login-title">Direktor Tizimiga Kirish</h1>
        <form onSubmit={handleSignIn}>
          {error && (
            <p className="error-text">Login, parol yoki rol noto‘g‘ri!</p>
          )}
          <input
            type="text"
            placeholder="Foydalanuvchi nomi"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            aria-label="Foydalanuvchi nomi"
            autoComplete="username"
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Parol"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              aria-label="Parol"
              autoComplete="current-password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              role="button"
              aria-pressed={showPassword}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword); }}
              title={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
            >
              {showPassword ? 'berkitish' : "ko'rsatish"}
            </span>
          </div>
          <button type="submit">Kirish</button>
        </form>
      </div>
    </>
  );
};

export default SignIn;
