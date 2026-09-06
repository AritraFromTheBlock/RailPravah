import { useState, useMemo } from "react";
import { useAssetData, AssetData } from "../contexts/AssetContext";
import { PriorityResponse } from "../services/api";
import "./Dashboard.css";

function DefectsAssets() {
  const {
    data,
    loading,
    error,
    dbHealth,
    totalCount,
    fetchPriority,
    isFallbackActive,
    loadFallbackData,
  } = useAssetData();

  const isConnected = dbHealth?.status === 'connected';

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [zoneFilter, setZoneFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Modals
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null);
  const [assetAiResult, setAssetAiResult] = useState<PriorityResponse | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSuccessMsg, setReportSuccessMsg] = useState("");

  // New Defect Form State
  const [newDefect, setNewDefect] = useState({
    assetId: "",
    issueType: "Mechanical / Structural",
    severity: "High",
    description: "",
  });

  // Calculate dynamic stats
  const totalAssetsCount = totalCount > 0 ? totalCount : data.length;
  const criticalCount = data.filter(a => a.condition_rating < 2.5 || a.failure_within_30_days === 1).length;
  const goodCount = data.filter(a => a.condition_rating >= 3.5).length;
  const overdueCount = data.filter(a => (a.overdue_ratio || 0) > 1.0).length;

  const healthyPercent = totalAssetsCount > 0
    ? (((goodCount) / (data.length || 1)) * 100).toFixed(1)
    : "95.0";

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return data.filter((asset) => {
      // Search term matching ID, type, or zone
      const matchesSearch =
        searchTerm === "" ||
        asset.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.asset_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.section_type.toLowerCase().includes(searchTerm.toLowerCase());

      // Condition filter
      let matchesCondition = true;
      if (conditionFilter === "Critical") {
        matchesCondition = asset.condition_rating < 2.5 || asset.failure_within_30_days === 1;
      } else if (conditionFilter === "Warning") {
        matchesCondition = asset.condition_rating >= 2.5 && asset.condition_rating < 3.5;
      } else if (conditionFilter === "Good") {
        matchesCondition = asset.condition_rating >= 3.5;
      }

      // Type filter
      const matchesType = typeFilter === "All" || asset.asset_type === typeFilter;

      // Zone filter
      const matchesZone = zoneFilter === "All" || asset.zone === zoneFilter;

      return matchesSearch && matchesCondition && matchesType && matchesZone;
    });
  }, [data, searchTerm, conditionFilter, typeFilter, zoneFilter]);

  // Paginated Assets
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));

  const handleOpenAssetDetails = (asset: AssetData) => {
    setSelectedAsset(asset);
    setAssetAiResult(null);
  };

  const handleRunAiDiagnosis = async (assetId: string) => {
    setIsDiagnosing(true);
    const result = await fetchPriority(assetId);
    setAssetAiResult(result);
    setIsDiagnosing(false);
  };

  const handleReportDefectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSuccessMsg(`Defect successfully logged for ${newDefect.assetId || 'selected asset'}!`);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccessMsg("");
      setNewDefect({ assetId: "", issueType: "Mechanical / Structural", severity: "High", description: "" });
    }, 1800);
  };

  const getConditionBadge = (asset: AssetData) => {
    if (asset.failure_within_30_days === 1 || asset.condition_rating < 2.5) {
      return <span className="asset-condition critical">Critical ({asset.condition_rating}/5)</span>;
    }
    if (asset.condition_rating < 3.5) {
      return <span className="asset-condition warning">Warning ({asset.condition_rating}/5)</span>;
    }
    return <span className="asset-condition good">Good ({asset.condition_rating}/5)</span>;
  };

  return (
    <div className="dashboard-home defects-assets-page">

      {/* ================= HEADER ================= */}
      <div className="content-header">
        <div>
          <h1>Defects & Assets</h1>
          <p>Real-time PostgreSQL asset telemetry, condition monitoring, and defect diagnostics.</p>
        </div>

        <button className="primary-btn" onClick={() => setShowReportModal(true)}>
          + Report Defect
        </button>
      </div>

      {/* ================= SYSTEM STATUS ================= */}
      <div className="system-bar" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span
            className="system-dot"
            style={{
              backgroundColor: dbHealth?.status === 'connected' ? '#10b981' : isFallbackActive ? '#f59e0b' : '#ef4444'
            }}
          ></span>
          <span>
            {dbHealth?.status === 'connected'
              ? `Live PostgreSQL (${dbHealth.engine || 'Supabase'}) Synchronized`
              : isFallbackActive
              ? 'Asset Monitor Operating in Offline Training Fallback Mode'
              : 'PostgreSQL Disconnected (No Records)'}
          </span>
        </div>
        <span className="system-time">
          {filteredAssets.length} matching / {totalAssetsCount.toLocaleString()} total assets
        </span>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <p>Total Assets</p>
            <h2>{totalAssetsCount.toLocaleString()}</h2>
            <span className="stat-positive">Database connected</span>
          </div>
          <div className="stat-icon">🏗</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Critical / Imminent</p>
            <h2>{criticalCount}</h2>
            <span className="stat-negative">Requires immediate inspection</span>
          </div>
          <div className="stat-icon" style={{ color: '#ef4444' }}>⚠</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Overdue Inspections</p>
            <h2>{overdueCount}</h2>
            <span style={{ color: '#f59e0b' }}>Ratio &gt; 1.0</span>
          </div>
          <div className="stat-icon">🔍</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Healthy Assets</p>
            <h2>{healthyPercent}%</h2>
            <span className="stat-positive">Score &gt;= 3.5/5</span>
          </div>
          <div className="stat-icon">✓</div>
        </div>
      </div>

      {/* ================= SEARCH & FILTERS ================= */}
      <div className="panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px' }}>
            <input
              type="text"
              placeholder="Search by Asset ID (e.g. BRG-000011), Zone, or Section..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="filter-select"
            >
              <option value="All">All Asset Types</option>
              <option value="Bridge">Bridge</option>
              <option value="Track">Track</option>
              <option value="Signal">Signal</option>
              <option value="OHE">OHE</option>
              <option value="Level_Crossing">Level Crossing</option>
              <option value="Points_and_Crossing">Points & Crossing</option>
            </select>

            <select
              value={zoneFilter}
              onChange={(e) => { setZoneFilter(e.target.value); setCurrentPage(1); }}
              className="filter-select"
            >
              <option value="All">All Zones</option>
              <option value="Central">Central</option>
              <option value="Eastern">Eastern</option>
              <option value="Northern">Northern</option>
              <option value="NorthEastern">North Eastern</option>
              <option value="Southern">Southern</option>
              <option value="Western">Western</option>
            </select>

            <select
              value={conditionFilter}
              onChange={(e) => { setConditionFilter(e.target.value); setCurrentPage(1); }}
              className="filter-select"
            >
              <option value="All">All Conditions</option>
              <option value="Critical">Critical (&lt; 2.5)</option>
              <option value="Warning">Warning (2.5 - 3.5)</option>
              <option value="Good">Good (&gt;= 3.5)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= ASSET TABLE ================= */}
      <div className="panel defects-panel">
        <div className="panel-header">
          <div>
            <h3>Asset Condition Monitor</h3>
            <p>Live inventory records from PostgreSQL database.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading assets from PostgreSQL...
          </div>
        ) : error && data.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
            Error loading assets: {error}
          </div>
        ) : (
          <div className="defects-table-wrapper">
            <table className="defects-table">
              <thead>
                <tr>
                  <th>ASSET ID</th>
                  <th>TYPE</th>
                  <th>SECTION & ZONE</th>
                  <th>CONDITION</th>
                  <th>RISK SCORE</th>
                  <th>OVERDUE RATIO</th>
                  <th>FAILURES (2Y)</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssets.map((asset) => (
                  <tr key={asset.asset_id}>
                    <td>
                      <button
                        onClick={() => handleOpenAssetDetails(asset)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#3b82f6',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        {asset.asset_id}
                      </button>
                    </td>

                    <td>
                      <span className="asset-type">
                        {asset.asset_type.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td>
                      <span className="asset-location">
                        {asset.zone} • {asset.section_type.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td>{getConditionBadge(asset)}</td>

                    <td>
                      <span style={{ fontWeight: 600, color: asset.risk_score > 0.5 ? '#ef4444' : 'inherit' }}>
                        {asset.risk_score.toFixed(3)}
                      </span>
                    </td>

                    <td>
                      <span style={{ color: asset.overdue_ratio > 1 ? '#ea580c' : 'var(--text-secondary)' }}>
                        {asset.overdue_ratio.toFixed(2)}x
                      </span>
                    </td>

                    <td>
                      <span
                        className={`asset-defects ${
                          (asset.historical_failures_last_2yrs || 0) > 0 ? "has-defects" : "no-defects"
                        }`}
                      >
                        {asset.historical_failures_last_2yrs || 0}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-all"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleOpenAssetDetails(asset)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedAssets.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)' }}>
                      {!isConnected && !isFallbackActive ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.8rem' }}>🔌</span>
                          <strong style={{ color: '#ef4444', fontSize: '1rem' }}>PostgreSQL Disconnected</strong>
                          <p style={{ maxWidth: '420px', fontSize: '0.88rem', margin: '4px 0 12px' }}>
                            Live database records are currently unavailable because the backend is offline. Auto-fallback is off.
                          </p>
                          <button
                            onClick={loadFallbackData}
                            style={{
                              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                              border: 'none',
                              color: '#fff',
                              padding: '8px 18px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                            }}
                          >
                            📥 Pull Local Training Dataset
                          </button>
                        </div>
                      ) : (
                        "No assets match the selected filters."
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Page {currentPage} of {totalPages} ({filteredAssets.length} assets)
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="secondary-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '4px 12px', fontSize: '0.85rem' }}
              >
                Previous
              </button>
              <button
                className="secondary-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '4px 12px', fontSize: '0.85rem' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= ASSET DETAIL MODAL ================= */}
      {selectedAsset && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setSelectedAsset(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-panel, #1e293b)',
              color: 'var(--text-main, #f8fafc)',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--border-color, #334155)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{selectedAsset.asset_id}</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedAsset.asset_type.replace(/_/g, ' ')} • {selectedAsset.section_type.replace(/_/g, ' ')} ({selectedAsset.zone} Zone)
                </span>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* ASSET TELEMETRY GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Condition Rating</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedAsset.condition_rating} / 5.0</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Risk Score</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: selectedAsset.risk_score > 0.5 ? '#ef4444' : 'inherit' }}>
                  {selectedAsset.risk_score.toFixed(3)}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age (Years)</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedAsset.age_years} yrs</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Inspection</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedAsset.last_inspection_days_ago} days ago</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overdue Ratio</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: selectedAsset.overdue_ratio > 1 ? '#f59e0b' : 'inherit' }}>
                  {selectedAsset.overdue_ratio.toFixed(2)}x
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Corrosion Index</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedAsset.corrosion_index.toFixed(2)}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Traffic Density</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedAsset.traffic_density_trains_per_day} trains/day</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max Speed</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedAsset.max_speed_kmph} km/h</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Repair Time</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedAsset.avg_repair_time_hours} hrs</div>
              </div>
            </div>

            {/* AI DIAGNOSIS ACTION */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ margin: 0 }}>Predictive AI Assessment</h4>
                <button
                  className="primary-btn"
                  style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                  onClick={() => handleRunAiDiagnosis(selectedAsset.asset_id)}
                  disabled={isDiagnosing}
                >
                  {isDiagnosing ? 'Running ML Inference...' : '⚡ Run Live XGBoost Diagnosis'}
                </button>
              </div>

              {assetAiResult && (
                <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calculated Priority</span>
                      <div style={{ color: '#3b82f6', fontSize: '1.2rem', fontWeight: 700 }}>
                        {assetAiResult.priority_score.toFixed(1)} / 100
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Failure Probability (30d)</span>
                      <div style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 700 }}>
                        {(assetAiResult.failure_probability * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: '4px 0', fontSize: '0.85rem' }}>
                    <strong>Action:</strong> {assetAiResult.action_plan.recommended_action}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <strong>Assigned Team:</strong> {assetAiResult.action_plan.suggested_team}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= REPORT DEFECT MODAL ================= */}
      {showReportModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setShowReportModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-panel, #1e293b)',
              color: 'var(--text-main, #f8fafc)',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid var(--border-color, #334155)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>🚨 Report Railway Asset Defect</h3>
              <button
                onClick={() => setShowReportModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {reportSuccessMsg ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>
                ✓ {reportSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleReportDefectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Asset ID:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BRG-000011 or select from list"
                    value={newDefect.assetId}
                    onChange={(e) => setNewDefect({ ...newDefect, assetId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-main)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Defect Type:
                    </label>
                    <select
                      value={newDefect.issueType}
                      onChange={(e) => setNewDefect({ ...newDefect, issueType: e.target.value })}
                      className="filter-select"
                      style={{ width: '100%' }}
                    >
                      <option>Mechanical / Structural</option>
                      <option>Electrical / OHE</option>
                      <option>Signalling Anomaly</option>
                      <option>Track Geometry / Gauge</option>
                      <option>Corrosion / Wear</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      Severity:
                    </label>
                    <select
                      value={newDefect.severity}
                      onChange={(e) => setNewDefect({ ...newDefect, severity: e.target.value })}
                      className="filter-select"
                      style={{ width: '100%' }}
                    >
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Detailed Observations:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe observed flaw, location specifics, or sensor telemetry..."
                    value={newDefect.description}
                    onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-main)',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setShowReportModal(false)}
                    style={{ padding: '8px 16px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-btn"
                    style={{ padding: '8px 16px' }}
                  >
                    Submit Defect Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default DefectsAssets;