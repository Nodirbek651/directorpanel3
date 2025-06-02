import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
          margin: 0;
          padding: 0;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #1c1c3c, #3a3a85);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Poppins', sans-serif;
        }

        .login-container {
          background: #ffffff0d;
          padding: 40px;
          border-radius: 16px;
          backdrop-filter: blur(14px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 400px;
          text-align: center;
          color: #f0f0f0;
          transition: transform 0.3s ease;
        }

        .login-container:hover {
          transform: translateY(-5px);
        }

        .login-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 30px;
          color: #ffffff;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        input[type="text"],
        input[type="password"] {
          padding: 14px 18px;
          border-radius: 10px;
          border: none;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
        }

        input[type="text"]:focus,
        input[type="password"]:focus {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 8px #8a76ff;
        }

        .password-wrapper {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          color: #bbb;
          cursor: pointer;
          user-select: none;
          font-size: 14px;
        }

        .toggle-password:hover {
          color: #fff;
        }

        button {
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: #6c63ff;
          color: white;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(108, 99, 255, 0.4);
          transition: all 0.3s ease;
        }

        button:hover {
          background: #867aff;
          box-shadow: 0 8px 25px rgba(134, 122, 255, 0.6);
        }

        .error-text {
          background: rgba(255, 0, 0, 0.1);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          color: #ff6b6b;
          margin-bottom: -10px;
        }

        @media (max-width: 500px) {
          .login-container {
            padding: 30px 20px;
          }

          input, button {
            font-size: 15px;
          }

          .login-title {
            font-size: 24px;
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
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword);
              }}
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

export default SignIN;
