import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetData } from "../contexts/AssetContext";
import { PriorityResponse } from "../services/api";

function DashboardHome() {
  const navigate = useNavigate();
  const {
    data,
    loading,
    error,
    dbHealth,
    totalCount,
    refreshData,
    fetchPriority,
    isFallbackActive,
    autoFallbackEnabled,
    setAutoFallbackEnabled,
    loadFallbackData,
  } = useAssetData();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [diagnosingId, setDiagnosingId] = useState<string | null>(null);
  const [activeDiagnosis, setActiveDiagnosis] = useState<PriorityResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPullingFallback, setIsPullingFallback] = useState(false);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const handlePullFallback = async () => {
    setIsPullingFallback(true);
    await loadFallbackData();
    setIsPullingFallback(false);
  };

  const handleRunDiagnosis = async (assetId: string) => {
    setDiagnosingId(assetId);
    const result = await fetchPriority(assetId);
    setActiveDiagnosis(result);
    setDiagnosingId(null);
  };

  // Compute Metrics over the loaded dataset
  const displayTotal = totalCount > 0 ? totalCount : data.length;
  const highRiskAssets = data.filter(a => a.risk_score > 0.6).length;
  const overdueInspections = data.filter(a => a.overdue_ratio > 1.0).length;
  const imminentFailures = data.filter(a => a.failure_within_30_days === 1).length;

  // Sorting
  const topPriorityAssets = [...data]
    .sort((a, b) => (b.final_priority_score || 0) - (a.final_priority_score || 0))
    .slice(0, 5);

  const recentAlerts = [...data]
    .filter(a => a.condition_rating < 2.5 || a.failure_within_30_days === 1)
    .sort((a, b) => (b.urgency_score || 0) - (a.urgency_score || 0))
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

  if (loading && data.length === 0) {
    return (
      <div className="dashboard-home" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '2.5rem' }}>⚡</div>
        <h2 style={{ color: 'var(--text-muted)' }}>Checking PostgreSQL Database Connection...</h2>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="dashboard-home" style={{ padding: '2rem 1rem' }}>
        <div
          style={{
            maxWidth: '650px',
            margin: '3rem auto',
            padding: '2.5rem',
            background: 'var(--bg-panel, #1e293b)',
            border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔌</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ef4444' }}>
            PostgreSQL Database Disconnected
          </h2>
          <p style={{ color: 'var(--text-muted, #94a3b8)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            The live database at <code style={{ color: '#f87171' }}>http://localhost:8000</code> is currently offline or unreachable.
            Auto-fallback is disabled so old training data is not loaded into your workspace without your permission.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button
              className="primary-btn"
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.95rem',
              }}
            >
              <span>🔄</span> {isRefreshing ? 'Testing Connection...' : 'Retry PostgreSQL Connection'}
            </button>

            <button
              onClick={handlePullFallback}
              disabled={isPullingFallback}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              <span>📥</span> {isPullingFallback ? 'Loading Dataset...' : 'Pull Local Training Dataset'}
            </button>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary, #cbd5e1)',
            }}
          >
            <input
              type="checkbox"
              id="auto-fallback-toggle-home"
              checked={autoFallbackEnabled}
              onChange={(e) => setAutoFallbackEnabled(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="auto-fallback-toggle-home" style={{ cursor: 'pointer' }}>
              Auto-fallback to local dataset on future disconnects
            </label>
          </div>
        </div>
      </div>
    );
  }

  const isConnected = dbHealth?.status === 'connected';

  return (
    <div className="dashboard-home">
      {/* HEADER */}
      <header className="content-header">
        <div>
          <p className="eyebrow">ENTERPRISE ASSET MANAGEMENT</p>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Real-time PostgreSQL telemetry, AI predictive risk, and maintenance priorities.</p>
        </div>
        <div className="header-actions">
          
          <button 
            onClick={handleRefresh}
            className="secondary-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            disabled={isRefreshing}
            title="Refresh database records"
          >
            <span style={{ display: 'inline-block', transform: isRefreshing ? 'rotate(360deg)' : 'none', transition: 'transform 0.6s ease' }}>🔄</span>
            {isRefreshing ? 'Syncing...' : 'Sync DB'}
          </button>

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

      {/* SYSTEM STATUS BAR */}
      <div className="system-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="online-dot"
            style={{
              backgroundColor: isConnected ? '#10b981' : isFallbackActive ? '#f59e0b' : '#ef4444',
              boxShadow: isConnected ? '0 0 8px #10b981' : isFallbackActive ? '0 0 8px #f59e0b' : '0 0 8px #ef4444'
            }}
          ></span>
          <strong>
            {isConnected
              ? `PostgreSQL (${dbHealth?.engine || 'Supabase'}) Connected`
              : isFallbackActive
              ? 'Operating on Local Training Dataset (Manual Fallback)'
              : 'PostgreSQL Disconnected'}
          </strong>
          {isConnected && dbHealth?.latency_ms && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              • Latency: {dbHealth.latency_ms}ms
            </span>
          )}
          {isFallbackActive && (
            <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>
              • Offline Training Data Active
            </span>
          )}
        </div>
        <span>{displayTotal.toLocaleString()} Database Records {isFallbackActive ? '(Offline Set)' : 'Synced'}</span>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">🏗️</div>
          <div>
            <p>Total Assets Monitored</p>
            <h2>{displayTotal.toLocaleString()}</h2>
            <small className="positive">Active in PostgreSQL</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⚠️</div>
          <div>
            <p>High Risk Assets</p>
            <h2>{highRiskAssets.toLocaleString()}</h2>
            <small className="negative">Risk Score &gt; 0.6</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">⏱</div>
          <div>
            <p>Overdue Inspections</p>
            <h2>{overdueInspections.toLocaleString()}</h2>
            <small className="negative">Inspection Overdue Ratio &gt; 1.0</small>
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
              <p>Live density breakdown from PostgreSQL records</p>
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
              <div className="train-row" key={asset.asset_id} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="train-left">
                  <div className="train-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>🚨</div>
                  <div>
                    <strong>{asset.asset_id} • {asset.asset_type?.replace(/_/g, ' ')}</strong>
                    <span>{asset.zone} Zone • Risk: {asset.risk_score?.toFixed(2) || 'N/A'} • Cond: {asset.condition_rating}/5</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    className="view-all"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    onClick={() => handleRunDiagnosis(asset.asset_id)}
                    disabled={diagnosingId === asset.asset_id}
                  >
                    {diagnosingId === asset.asset_id ? 'Diagnosing...' : 'AI Diagnose'}
                  </button>
                  <label className="delayed" style={{ backgroundColor: '#ffedd5', color: '#ea580c', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                    Priority: {asset.final_priority_score?.toFixed(1) || 'N/A'}
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
              <p>Triggered by poor condition rating or imminent failure risk</p>
            </div>
            <button className="view-all" onClick={() => navigate("/alerts")}>View All Alerts</button>
          </div>
          <div className="alerts" style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {recentAlerts.map(alert => (
              <div className="alert warning" key={alert.asset_id}>
                <span>⚠️</span>
                <div>
                  <strong>{alert.asset_type?.replace(/_/g, ' ')} ({alert.asset_id})</strong>
                  <p>
                    {alert.zone} zone • Condition: {alert.condition_rating?.toFixed(1)}/5 • 
                    {alert.failure_within_30_days ? ' Imminent Failure Flagged!' : ` Overdue ratio: ${alert.overdue_ratio}`}
                  </p>
                </div>
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <div style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>No critical condition alerts.</div>
            )}
          </div>
        </section>

      </div>

      {/* AI DIAGNOSIS MODAL */}
      {activeDiagnosis && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setActiveDiagnosis(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-panel, #1e293b)',
              color: 'var(--text-main, #f8fafc)',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '540px',
              width: '100%',
              border: '1px solid var(--border-color, #334155)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color, #334155)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>🤖 Live AI Diagnostic Report</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Asset ID: {activeDiagnosis.asset_id}</span>
              </div>
              <button onClick={() => setActiveDiagnosis(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority Score</span>
                <h2 style={{ margin: '4px 0', color: '#3b82f6' }}>{activeDiagnosis.priority_score.toFixed(1)} / 100</h2>
                <small>Urgency: <strong>{activeDiagnosis.action_plan.urgency_level}</strong></small>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Failure Probability</span>
                <h2 style={{ margin: '4px 0', color: '#ef4444' }}>{(activeDiagnosis.failure_probability * 100).toFixed(1)}%</h2>
                <small>Risk Metric: {(activeDiagnosis.risk_score).toFixed(3)}</small>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem' }}>Recommended Action Plan:</h4>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                <p style={{ margin: '0 0 6px 0' }}><strong>Action:</strong> {activeDiagnosis.action_plan.recommended_action}</p>
                <p style={{ margin: 0 }}><strong>Assigned Team:</strong> {activeDiagnosis.action_plan.suggested_team}</p>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem' }}>Top Risk Factors Detected:</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {activeDiagnosis.top_risk_factors.map((factor, idx) => (
                  <li key={idx}>{factor}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="primary-btn"
                style={{ padding: '8px 16px' }}
                onClick={() => {
                  setActiveDiagnosis(null);
                  navigate('/block-planning');
                }}
              >
                Schedule Maintenance Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardHome;