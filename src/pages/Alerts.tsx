import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetData } from "../contexts/AssetContext";

function Alerts() {
  const navigate = useNavigate();
  const { data, loading, error, dbHealth } = useAssetData();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [severityFilter, setSeverityFilter] = useState<"ALL" | "CRITICAL" | "WARNING" | "OVERDUE">("ALL");

  const dismissAlert = (id: string) => {
    setDismissed(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const activeAlerts = useMemo(() => {
    return data
      .filter(a => !dismissed.has(a.asset_id))
      .filter(a => {
        const isCritical = a.failure_within_30_days === 1;
        const isDegraded = (a.condition_rating || 5) <= 2.5;
        const isOverdue = (a.overdue_ratio || 0) > 1.0;

        if (severityFilter === "CRITICAL") return isCritical;
        if (severityFilter === "WARNING") return isDegraded && !isCritical;
        if (severityFilter === "OVERDUE") return isOverdue;

        return isCritical || isDegraded || isOverdue;
      })
      .sort((a, b) => (b.urgency_score || 0) - (a.urgency_score || 0));
  }, [data, dismissed, severityFilter]);

  if (loading && data.length === 0) {
    return (
      <div className="page-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Scanning PostgreSQL database for active alerts...</h2>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <header className="content-header">
        <div>
          <p className="eyebrow">SAFETY & INTEGRITY MONITORING</p>
          <h1>System Alerts</h1>
          <p className="subtitle">Real-time alerts triggered from PostgreSQL asset telemetry and predictive ML signals.</p>
        </div>
        <div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            color: '#3b82f6'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dbHealth?.status === 'connected' ? '#10b981' : '#f59e0b' }}></span>
            {activeAlerts.length} Active System Alerts
          </span>
        </div>
      </header>

      {/* FILTER BUTTONS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={severityFilter === "ALL" ? "primary-btn" : "secondary-btn"}
          onClick={() => setSeverityFilter("ALL")}
          style={{ padding: '6px 14px', fontSize: '0.85rem' }}
        >
          All Alerts ({data.filter(a => !dismissed.has(a.asset_id) && (a.failure_within_30_days === 1 || a.condition_rating <= 2.5 || a.overdue_ratio > 1)).length})
        </button>
        <button
          className={severityFilter === "CRITICAL" ? "primary-btn" : "secondary-btn"}
          onClick={() => setSeverityFilter("CRITICAL")}
          style={{ padding: '6px 14px', fontSize: '0.85rem', backgroundColor: severityFilter === "CRITICAL" ? '#ef4444' : undefined }}
        >
          🚨 Imminent Failures ({data.filter(a => !dismissed.has(a.asset_id) && a.failure_within_30_days === 1).length})
        </button>
        <button
          className={severityFilter === "WARNING" ? "primary-btn" : "secondary-btn"}
          onClick={() => setSeverityFilter("WARNING")}
          style={{ padding: '6px 14px', fontSize: '0.85rem', backgroundColor: severityFilter === "WARNING" ? '#f59e0b' : undefined }}
        >
          ⚠️ Severe Degradation ({data.filter(a => !dismissed.has(a.asset_id) && a.condition_rating <= 2.5 && a.failure_within_30_days !== 1).length})
        </button>
        <button
          className={severityFilter === "OVERDUE" ? "primary-btn" : "secondary-btn"}
          onClick={() => setSeverityFilter("OVERDUE")}
          style={{ padding: '6px 14px', fontSize: '0.85rem' }}
        >
          ⏱ Overdue Inspections ({data.filter(a => !dismissed.has(a.asset_id) && a.overdue_ratio > 1.0).length})
        </button>
      </div>

      <section className="panel" style={{ maxWidth: '900px' }}>
        <div className="panel-header">
          <div>
            <h2>Active High Priority Warnings</h2>
            <p>Showing alerts prioritized by urgency score and asset risk metrics.</p>
          </div>
          {dismissed.size > 0 && (
            <button
              className="secondary-btn"
              onClick={() => setDismissed(new Set())}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              Restore Dismissed ({dismissed.size})
            </button>
          )}
        </div>

        {error && data.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>
        ) : (
          <div className="alerts" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeAlerts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                🎉 No active alerts in this category!
              </p>
            ) : (
              activeAlerts.slice(0, 20).map((alert) => {
                const isCritical = alert.failure_within_30_days === 1;
                const isOverdue = alert.overdue_ratio > 1.0;

                return (
                  <div
                    key={alert.asset_id}
                    className={`alert ${isCritical ? 'error' : 'warning'}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                      border: `1px solid ${isCritical ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                      padding: '16px',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                      <span style={{ fontSize: '1.6rem' }}>
                        {isCritical ? '🚨' : isOverdue ? '⏱' : '⚠️'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <strong style={{ color: isCritical ? '#ef4444' : '#f59e0b', fontSize: '1.05rem' }}>
                            {isCritical ? "Imminent Failure Flagged" : isOverdue ? "Overdue Periodic Inspection" : "Critical Infrastructure Wear"}
                          </strong>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>
                            {alert.asset_id} • {alert.asset_type.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 8px 0', fontSize: '0.9rem', lineHeight: '1.4' }}>
                          Located on <strong>{alert.section_type.replace(/_/g, ' ')}</strong> in the <strong>{alert.zone}</strong> zone.
                          {isCritical
                            ? ` AI model predicts high probability of failure within 30 days.`
                            : ` Condition rating dropped to ${alert.condition_rating.toFixed(1)}/5.0 with corrosion index ${alert.corrosion_index.toFixed(2)}.`}
                          {isOverdue && ` Inspection is overdue (Ratio: ${alert.overdue_ratio.toFixed(2)}x, last checked ${alert.last_inspection_days_ago} days ago).`}
                        </p>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                          <button
                            className="view-all"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            onClick={() => navigate('/block-planning')}
                          >
                            Schedule Maintenance Block
                          </button>
                          <button
                            className="secondary-btn"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            onClick={() => navigate('/defects-assets')}
                          >
                            Inspect in Assets
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => dismissAlert(alert.asset_id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        fontSize: '1.1rem'
                      }}
                      title="Dismiss Alert"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Alerts;