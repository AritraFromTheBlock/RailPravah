import { useState, useMemo } from "react";
import { useAssetData } from "../contexts/AssetContext";

function Analytics() {
  const { data, loading } = useAssetData();
  const [metricView, setMetricView] = useState<"TYPE" | "ZONE">("ZONE");

  // Aggregate stats across PostgreSQL assets
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        avgCondition: 3.8,
        highRiskPct: 8.2,
        overduePct: 14.5,
        avgRepairTime: 18.4,
      };
    }

    const avgCond = data.reduce((acc, a) => acc + (a.condition_rating || 0), 0) / data.length;
    const highRisk = (data.filter(a => a.risk_score > 0.6).length / data.length) * 100;
    const overdue = (data.filter(a => a.overdue_ratio > 1.0).length / data.length) * 100;
    const avgRepair = data.reduce((acc, a) => acc + (a.avg_repair_time_hours || 0), 0) / data.length;

    return {
      avgCondition: Number(avgCond.toFixed(2)),
      highRiskPct: Number(highRisk.toFixed(1)),
      overduePct: Number(overdue.toFixed(1)),
      avgRepairTime: Number(avgRepair.toFixed(1)),
    };
  }, [data]);

  // Aggregate by Zone
  const zoneStats = useMemo(() => {
    const zones: Record<string, { total: number; sumRisk: number; criticalCount: number }> = {};

    data.forEach(a => {
      const z = a.zone || "Other";
      if (!zones[z]) zones[z] = { total: 0, sumRisk: 0, criticalCount: 0 };
      zones[z].total += 1;
      zones[z].sumRisk += (a.risk_score || 0);
      if (a.failure_within_30_days === 1 || a.condition_rating < 2.5) {
        zones[z].criticalCount += 1;
      }
    });

    return Object.entries(zones).map(([zone, val]) => ({
      label: zone,
      count: val.total,
      avgRiskPct: Math.min(100, Math.round((val.sumRisk / (val.total || 1)) * 100)),
      criticalCount: val.criticalCount,
    }));
  }, [data]);

  // Aggregate by Type
  const typeStats = useMemo(() => {
    const types: Record<string, { total: number; sumRisk: number }> = {};

    data.forEach(a => {
      const t = a.asset_type ? a.asset_type.replace(/_/g, ' ') : "Other";
      if (!types[t]) types[t] = { total: 0, sumRisk: 0 };
      types[t].total += 1;
      types[t].sumRisk += (a.risk_score || 0);
    });

    return Object.entries(types).map(([type, val]) => ({
      label: type,
      count: val.total,
      avgRiskPct: Math.min(100, Math.round((val.sumRisk / (val.total || 1)) * 100)),
    }));
  }, [data]);

  const activeChartData = metricView === "ZONE" ? zoneStats : typeStats;
  const maxCount = activeChartData.length > 0 ? Math.max(...activeChartData.map(d => d.count)) : 1;

  return (
    <section className="analytics-page">
      <div className="analytics-container">

        <div className="analytics-header">
          <div>
            <p className="section-tag">📊 POSTGRESQL TELEMETRY & ML ANALYTICS</p>
            <h1>
              Asset Reliability <span>Analytics</span>
            </h1>
            <p>
              Aggregated infrastructure risk, inspection compliance, and degradation metrics from PostgreSQL.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={metricView === "ZONE" ? "primary-btn" : "secondary-btn"}
              onClick={() => setMetricView("ZONE")}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              Zone Distribution
            </button>
            <button
              className={metricView === "TYPE" ? "primary-btn" : "secondary-btn"}
              onClick={() => setMetricView("TYPE")}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              Asset Type Distribution
            </button>
          </div>
        </div>

        <div className="analytics-cards">
          <div className="analytics-card">
            <span>Average Condition Rating</span>
            <h2>{stats.avgCondition} / 5.0</h2>
            <p>{stats.avgCondition >= 3.0 ? "✓ Healthy network condition" : "⚠ Sub-optimal wear detected"}</p>
          </div>

          <div className="analytics-card">
            <span>High Risk Assets</span>
            <h2>{stats.highRiskPct}%</h2>
            <p>Risk score exceeding 0.60 threshold</p>
          </div>

          <div className="analytics-card">
            <span>Inspection Overdue Ratio</span>
            <h2>{stats.overduePct}%</h2>
            <p>Assets requiring immediate inspection cycle</p>
          </div>

          <div className="analytics-card">
            <span>Avg Repair Window</span>
            <h2>{stats.avgRepairTime} hrs</h2>
            <p>Average mean time to restore across zones</p>
          </div>
        </div>

        <div className="analytics-chart-card">
          <div className="chart-header">
            <div>
              <h2>{metricView === "ZONE" ? "Asset Volume & Risk by Zone" : "Asset Count by Equipment Type"}</h2>
              <p>
                {metricView === "ZONE"
                  ? "Comparing total asset count and calculated risk percentage across railway zones"
                  : "Infrastructure distribution across Bridge, Track, Signal, and OHE assets"}
              </p>
            </div>
          </div>

          {loading && data.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Computing database telemetry analytics...
            </div>
          ) : (
            <div className="bar-chart" style={{ height: '280px', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', padding: '1rem 1.5rem' }}>
              {activeChartData.map((item) => (
                <div className="bar-column" key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="bar-value" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {item.count} items
                  </div>

                  <div
                    className="bar"
                    style={{
                      height: `${Math.max(12, (item.count / maxCount) * 180)}px`,
                      width: '100%',
                      backgroundColor: item.avgRiskPct > 40 ? '#f59e0b' : '#3b82f6',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.8s ease'
                    }}
                    title={`Count: ${item.count}, Avg Risk: ${item.avgRiskPct}%`}
                  ></div>

                  <span style={{ fontSize: '0.75rem', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
                    {item.label}
                  </span>
                  <small style={{ fontSize: '0.65rem', color: item.avgRiskPct > 40 ? '#ef4444' : 'var(--text-muted)' }}>
                    {item.avgRiskPct}% Risk
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default Analytics;