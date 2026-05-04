import React, { useState, useEffect } from 'react';
import { fetchSystemStats } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    packets_per_sec: 0,
    bytes_per_sec: 0,
    active_threats: 0,
    total_blocked_ips: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchSystemStats();
      if (data) setStats(data);
    };

    loadStats();
    // Poll every 5 seconds
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel">
      <h2>Network Telemetry</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Packets / Sec</div>
          <div className="stat-value" style={{ color: '#00f0ff' }}>
            {stats.packets_per_sec.toLocaleString()}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bytes / Sec</div>
          <div className="stat-value" style={{ color: '#00f0ff' }}>
            {(stats.bytes_per_sec / 1024).toFixed(2)} KB
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Threats</div>
          <div className="stat-value" style={{ color: stats.active_threats > 0 ? '#ff003c' : '#10b981' }}>
            {stats.active_threats}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Blocked IPs</div>
          <div className="stat-value" style={{ color: '#eab308' }}>
            {stats.total_blocked_ips}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
