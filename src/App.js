import { useState, useEffect } from 'react';

export default function CurrencyExchangeApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchExchangeRate();
    }
  }, [amount, fromCurrency, toCurrency, isLoggedIn]);

  const fetchExchangeRate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      const rate = data.rates[toCurrency];
      setExchangeRate(rate);
      setConvertedAmount((parseFloat(amount) * rate).toFixed(2));
    } catch (err) {
      console.error('Error fetching exchange rate:', err);
    }
    setLoading(false);
  };

  const handleAuth = async () => {
    setError('');
    setSuccess('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignup && !formData.email) {
      setError('Email is required for signup');
      return;
    }

    try {
      const endpoint = isSignup ? 'https://currency-converter-backend-qme9.onrender.com/api/auth/signup' : 'https://currency-converter-backend-qme9.onrender.com/api/auth/login';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isSignup) {
          setSuccess('Account created successfully! Please login.');
          setIsSignup(false);
          setFormData({ username: '', email: '', password: '' });
        } else {
          setIsLoggedIn(true);
          setCurrentUser(data.username);
          localStorage.setItem('currentUser', data.username);
          setFormData({ username: '', email: '', password: '' });
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    localStorage.removeItem('currentUser');
    setFormData({ username: '', email: '', password: '' });
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  };

  const cardStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const buttonPrimaryStyle = {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontSize: '14px'
  };

  if (!isLoggedIn) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          
          <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>Currency Exchange System</h1>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '30px' }}>Login or Create Account</p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => { setIsSignup(false); setError(''); setSuccess(''); }}
              style={{
                ...buttonPrimaryStyle,
                backgroundColor: !isSignup ? '#4CAF50' : '#e0e0e0',
                color: !isSignup ? 'white' : '#666'
              }}
            >
              Login
            </button>
            <button
              onClick={() => { setIsSignup(true); setError(''); setSuccess(''); }}
              style={{
                ...buttonPrimaryStyle,
                backgroundColor: isSignup ? '#2196F3' : '#e0e0e0',
                color: isSignup ? 'white' : '#666'
              }}
            >
              Sign Up
            </button>
          </div>

          <div>
            <label style={labelStyle}>Username:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              style={inputStyle}
              placeholder="Enter your username"
            />

            {isSignup && (
              <>
                <label style={labelStyle}>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  style={inputStyle}
                  placeholder="Enter your email"
                />
              </>
            )}

            <label style={labelStyle}>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              style={inputStyle}
              placeholder="Enter your password"
            />

            {error && (
              <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                {success}
              </div>
            )}

            <button
              onClick={handleAuth}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: isSignup ? '#2196F3' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {isSignup ? 'Create Account' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '600px', margin: '30px auto' }}>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: '#333' }}>Currency Converter</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Welcome, {currentUser}!</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>From:</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>To:</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>

          {exchangeRate && (
            <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>Exchange Rate:</p>
              <p style={{ margin: '5px 0 0 0', color: '#1976d2', fontWeight: 'bold', fontSize: '16px' }}>
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </p>
            </div>
          )}

          <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '4px', textAlign: 'center', border: '2px solid #ddd' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '10px' }}>Converted Amount:</p>
            {loading ? (
              <p style={{ margin: 0, fontSize: '28px', color: '#666' }}>Loading...</p>
            ) : (
              <>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                  {convertedAmount}
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '16px' }}>{toCurrency}</p>
              </>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginTop: '20px' }}>
          Real-time currency exchange rates
        </p>
      </div>
    </div>
  );
}