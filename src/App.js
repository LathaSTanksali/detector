import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      // backend sends 0 or 1
      setResult(data.prediction); 
    } catch (error) {
      console.error('Error:', error);
      setResult('error');
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>🔍 Phishing Website Detection</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Enter URL here..."
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Check
        </button>
      </form>

      {loading && <p>Checking...</p>}

      {result !== null && result !== 'error' && !loading && (
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Result: {result === 1 ? '🚨 Phishing' : '✅ Legitimate'}
        </p>
      )}

      {result === 'error' && <p style={{ color: 'red' }}>Error connecting to backend</p>}
    </div>
  );
}

export default App;
