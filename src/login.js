import React, { useState } from 'react';
import './App.css';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin ? { username, password } : { username, password, email };

    try {
      const response = await fetch(`https://YOUR-BACKEND-URL.onrender.com/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        onLogin(data.username);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Server connection failed. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Currency Converter</h1>
        <p className="subtitle">Exchange rates for 9 currencies</p>
        
        <div className="tab-buttons">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Register</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Enter username" />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required={!isLogin} placeholder="Enter email" />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo credentials:</p>
          <p>Username: demo | Password: demo123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;