import { useState } from "react";
import { useAssetData } from "../contexts/AssetContext";

function Alerts() {
  const { data, loading, error } = useAssetData();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div className="page-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Loading Alerts Data...</h2>
      </div>
    );
  }

  // Generate alerts dynamically from dataset based on condition ratings and failure flags
  const activeAlerts = data
    .filter(a => (a.failure_within_30_days === 1 || a.condition_rating <= 2.0) && !dismissed.has(a.asset_id))
    .sort((a, b) => b.urgency_score - a.urgency_score)
    .slice(0, 15); // Top 15 alerts

  const dismissAlert = (id: string) => {
    setDismissed(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="page-layout">
      <header className="content-header">
        <div>
          <p className="eyebrow">MANAGEMENT</p>
          <h1>System Alerts</h1>
          <p className="subtitle">Real-time notifications for critical asset degradation and imminent failures.</p>
        </div>
      </header>

      <section className="panel" style={{ maxWidth: '800px' }}>
        <div className="panel-header">
          <div>
            <h2>Active Alerts</h2>
            <p>Showing top critical alerts requiring attention.</p>
          </div>
        </div>

        <div className="alerts" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeAlerts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No active alerts.</p>
          ) : (
            activeAlerts.map((alert) => {
              const isCritical = alert.failure_within_30_days === 1;
              return (
                <div
                  key={alert.asset_id}
                  className={`alert ${isCritical ? 'error' : 'warning'}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${isCritical ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                    padding: '16px',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {isCritical ? '🚨' : '⚠️'}
                    </span>
                    <div>
                      <strong style={{ color: isCritical ? '#ef4444' : '#f59e0b', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>
                        {isCritical ? "Imminent Failure Detected" : "Severe Degradation"}
                      </strong>
                      <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>
                        {alert.asset_type.replace(/_/g, ' ')} ({alert.asset_id}) in the {alert.zone} zone 
                        {isCritical 
                          ? " is flagged for failure within 30 days." 
                          : ` shows a critical condition rating of ${alert.condition_rating.toFixed(1)}/5.`}
                        <br/>
                        Urgency Score: {alert.urgency_score.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.asset_id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default Alerts;