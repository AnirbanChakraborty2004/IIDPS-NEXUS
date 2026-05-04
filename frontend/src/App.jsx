import React, { useState, useEffect } from 'react';
import './index.css';
import { WS_URL } from './services/api';
import Dashboard from './components/Dashboard';
import VoicePanel from './components/VoicePanel';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Establish WebSocket Connection
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('Connected to IIDPS WebSockets');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'IP_BLOCKED') {
        setAlerts(prev => [data.data, ...prev].slice(0, 50)); // Keep last 50
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSockets');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1>IIDPS // NEXUS</h1>
        <div className="status-indicator">
          <div className="dot" style={{ backgroundColor: isConnected ? '#10b981' : '#ef4444', boxShadow: isConnected ? '0 0 10px #10b981' : '0 0 10px #ef4444' }}></div>
          {isConnected ? 'SYSTEM ONLINE' : 'CONNECTION LOST'}
        </div>
      </header>

      <main className="main-grid">
        <div className="left-column">
          <Dashboard />
          
          <div className="panel" style={{ marginTop: '20px' }}>
            <h2>Real-Time Threat Feed</h2>
            <ul className="alert-list">
              {alerts.length === 0 ? (
                <li style={{ color: '#94a3b8', padding: '10px' }}>No active threats detected.</li>
              ) : (
                alerts.map((alert, idx) => (
                  <li key={idx} className="alert-item">
                    <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    <strong>{alert.ip}</strong> blocked - {alert.reason}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="right-column">
          <VoicePanel />
        </div>
      </main>
    </div>
  );
}

export default App;
