import React, { useState, useEffect } from 'react';
import './App.css';

function Converter({ username, onLogout }) {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY'];

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  const convertCurrency = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      const exchangeRate = data.rates[toCurrency];
      setRate(exchangeRate);
      setResult((parseFloat(amount) * exchangeRate).toFixed(2));
    } catch (error) {
      console.error('Error:', error);
      setResult('Error fetching rates');
    }
    setLoading(false);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="converter-container">
      <div className="converter-header">
        <div>
          <h2>Welcome, {username}!</h2>
          <p>Currency Converter</p>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div className="converter-box">
        <div className="form-section">
          <div className="form-group">
            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
          </div>

          <div className="currency-row">
            <div className="form-group">
              <label>From</label>
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {currencies.map(curr => <option key={curr} value={curr}>{curr}</option>)}
              </select>
            </div>

            <button onClick={swapCurrencies} className="swap-btn">⇄</button>

            <div className="form-group">
              <label>To</label>
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {currencies.map(curr => <option key={curr} value={curr}>{curr}</option>)}
              </select>
            </div>
          </div>

          <button onClick={convertCurrency} className="convert-btn">Convert</button>
        </div>

        {loading ? (
          <div className="result-box"><p>Loading...</p></div>
        ) : result && (
          <div className="result-box">
            <div className="rate-info">
              <p>Exchange Rate</p>
              <p className="rate">1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}</p>
            </div>
            <div className="converted-amount">
              <p>Converted Amount</p>
              <h2>{result} {toCurrency}</h2>
            </div>
          </div>
        )}

        <div className="supported-currencies">
          <p><strong>Supported Currencies:</strong></p>
          <p>{currencies.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}

export default Converter;