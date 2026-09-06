import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetData } from "../contexts/AssetContext";

function DashboardHome() {
  const navigate = useNavigate();
  const { data, loading, error } = useAssetData();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    const layout = document.querySelector('.dashboard-layout');
    if (layout) {
      if (isDarkMode) {
        layout.classList.add('light-theme');
      } else {
        layout.classList.remove('light-theme');
      }
    }
    setIsDarkMode(!isDarkMode);
  };

  // Compute Metrics
  const totalAssets = data.length;
  const highRiskAssets = data.filter(a => a.risk_score > 0.7).length;
  const overdueInspections = data.filter(a => a.overdue_ratio > 1.0).length;
  const imminentFailures = data.filter(a => a.failure_within_30_days === 1).length;

  // Sorting
  const topPriorityAssets = [...data]
    .sort((a, b) => b.final_priority_score - a.final_priority_score)
    .slice(0, 4);

  const recentAlerts = [...data]
    .filter(a => a.condition_rating < 2.5)
    .sort((a, b) => b.urgency_score - a.urgency_score)
    .slice(0, 3);

  // Group assets by zone for the chart
  const zoneCounts: Record<string, number> = {};
  data.forEach(a => {
    if (a.zone) {
      zoneCounts[a.zone] = (zoneCounts[a.zone] || 0) + 1;
    }
  });
  
  // Get top 6 zones for the chart
  const topZones = Object.entries(zoneCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 6);

  const maxZoneCount = topZones.length > 0 ? Math.max(...topZones.map(([, c]) => c)) : 1;

  if (loading) {
    return (
      <div className="dashboard-home" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Loading Enterprise Asset Data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-home" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#ef4444' }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* HEADER */}
      <header className="content-header">
        <div>
          <p className="eyebrow">ASSET MAINTENANCE</p>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Monitor infrastructure health, risk scores, and block planning priorities.</p>
        </div>
        <div className="header-actions">
          
          {/* THEME TOGGLE */}
          <button 
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'all 0.2s'
            }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <button className="notification" onClick={() => navigate("/alerts")} aria-label="Open alerts">🔔</button>
          <div className="profile">
            <div className="profile-avatar">J</div>
            <div>
              <strong>Jagat</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </header>

      {/* SYSTEM STATUS */}
      <div className="system-bar">
        <div>
          <span className="online-dot"></span>
          RailPravah Data Engine Online
        </div>
        <span>{totalAssets.toLocaleString()} Assets Synced</span>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">🏗️</div>
          <div>
            <p>Total Assets Monitored</p>
            <h2>{totalAssets.toLocaleString()}</h2>
            <small className="positive">Across all zones</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⚠️</div>
          <div>
            <p>High Risk Assets</p>
            <h2>{highRiskAssets.toLocaleString()}</h2>
            <small className="negative">Risk Score &gt; 0.7</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">⏱</div>
          <div>
            <p>Overdue Inspections</p>
            <h2>{overdueInspections.toLocaleString()}</h2>
            <small className="negative">Ratio &gt; 1.0</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>🚨</div>
          <div>
            <p>Imminent Failures (30d)</p>
            <h2 style={{ color: '#ef4444' }}>{imminentFailures.toLocaleString()}</h2>
            <small className="negative">Critical Intervention Required</small>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="main-grid">
        
        {/* CHART SECTION */}
        <section className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h2>Asset Distribution by Zone</h2>
              <p>Top 6 Zones by asset volume</p>
            </div>
          </div>
          <div className="chart" style={{ padding: '2rem 0 1rem', height: '250px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', height: '100%', alignItems: 'flex-end', gap: '2rem', padding: '0 2rem' }}>
              {topZones.map(([zone, count]) => (
                <div key={zone} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{count}</div>
                  <div style={{ 
                    width: '100%', 
                    backgroundColor: '#3b82f6', 
                    borderRadius: '4px 4px 0 0',
                    height: `${(count / maxZoneCount) * 150}px`,
                    transition: 'height 1s ease-out'
                  }}></div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500, textAlign: 'center' }}>
                    {zone}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRIORITY MAINTENANCE LIST */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Critical Maintenance Priorities</h2>
              <p>Assets requiring immediate block allocation</p>
            </div>
            <button className="view-all" onClick={() => navigate("/block-planning")}>Plan Blocks</button>
          </div>
          <div className="train-list" style={{ marginTop: '1rem' }}>
            {topPriorityAssets.map(asset => (
              <div className="train-row" key={asset.asset_id} style={{ padding: '12px 16px' }}>
                <div className="train-left">
                  <div className="train-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>🚨</div>
                  <div>
                    <strong>{asset.asset_id} • {asset.asset_type.replace(/_/g, ' ')}</strong>
                    <span>{asset.zone} Zone • Risk: {asset.risk_score?.toFixed(2) || 'N/A'}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <label className="delayed" style={{ backgroundColor: '#ffedd5', color: '#ea580c' }}>
                    Priority: {asset.final_priority_score?.toFixed(2) || 'N/A'}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* BOTTOM GRID */}
      <div className="bottom-grid">
        
        {/* RECENT ALERTS */}
        <section className="panel" style={{ gridColumn: '1 / -1' }}>
          <div className="panel-header">
            <div>
              <h2>Critical Asset Alerts</h2>
              <p>Based on poor condition ratings</p>
            </div>
            <button className="view-all" onClick={() => navigate("/alerts")}>View All</button>
          </div>
          <div className="alerts" style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {recentAlerts.map(alert => (
              <div className="alert warning" key={alert.asset_id}>
                <span>⚠️</span>
                <div>
                  <strong>{alert.asset_type.replace(/_/g, ' ')} Degradation</strong>
                  <p>{alert.asset_id} in {alert.zone} zone shows a poor condition rating of {alert.condition_rating?.toFixed(1) || 'N/A'}/5.</p>
                </div>
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <div style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No critical condition alerts.</div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default DashboardHome;