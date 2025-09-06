import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./App.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [explain, setExplain] = useState("");
  const [stats, setStats] = useState({ phishing: 0, legitimate: 0 });

  const backendUrl = "https://your-backend.onrender.com"; // 🔗 replace with your Flask backend URL

  // Handle URL classification
  const classify = async () => {
    if (!url) return;

    try {
      const response = await fetch(`${backendUrl}/api/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data.prediction === 1 ? "phishing" : "legitimate");
      setExplain(data.top_features?.join(", ") || "N/A");

      updateStats();
    } catch (error) {
      console.error("Error classifying URL:", error);
    }
  };

  // Fetch stats from backend
  const updateStats = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/stats`);
      const data = await res.json();
      setStats({ phishing: data.phishing, legitimate: data.legitimate });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    updateStats();
  }, []);

  // Chart.js dataset
  const chartData = {
    labels: ["Phishing", "Legitimate"],
    datasets: [
      {
        data: [stats.phishing, stats.legitimate],
        backgroundColor: ["red", "green"],
      },
    ],
  };

  return (
    <div className="app">
      <div className="card">
        <h2>🔍 ALERTA PHISH</h2>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
        <button onClick={classify}>Check</button>

        {result && (
          <h3 className={result === "phishing" ? "phishing" : "legitimate"}>
            {result === "phishing"
              ? "🚨 Phishing Website Detected!"
              : "✅ Legitimate Website"}
          </h3>
        )}

        {result && <p>Key indicators: {explain}</p>}

        <h4>📊 Dashboard</h4>
        <div className="chart">
          <Doughnut data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default App;
