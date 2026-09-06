import { useState, useMemo } from "react";
import { useAssetData } from "../contexts/AssetContext";
import "./Dashboard.css";

interface MaintenanceItem {
  id: string;
  assetId: string;
  asset: string;
  location: string;
  issue: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Pending" | "Completed";
  assigned: string;
  date: string;
}

function MaintenanceRequests() {
  const { data, dbHealth } = useAssetData();

  // Create initial dynamic requests based on real high risk assets from PostgreSQL
  const initialRequests = useMemo<MaintenanceItem[]>(() => {
    if (!data || data.length === 0) return [];
    
    // Pick top critical assets
    const criticalAssets = data
      .filter(a => a.risk_score > 0.45 || a.failure_within_30_days === 1)
      .slice(0, 7);

    const engineers = ["R. Sharma (Signaling)", "A. Das (Track Wing)", "S. Roy (Civil)", "M. Singh (OHE)", "P. Kumar (Mechanical)"];

    return criticalAssets.map((asset, i) => {
      const isCritical = asset.failure_within_30_days === 1 || asset.risk_score > 0.6;
      return {
        id: `MR-${2000 + i}`,
        assetId: asset.asset_id,
        asset: `${asset.asset_type.replace(/_/g, ' ')} (${asset.asset_id})`,
        location: `${asset.zone} • ${asset.section_type.replace(/_/g, ' ')}`,
        issue: isCritical ? "Imminent failure flagged by AI model" : `High corrosion & overdue inspection (${asset.overdue_ratio.toFixed(1)}x)`,
        priority: isCritical ? "Critical" : asset.risk_score > 0.5 ? "High" : "Medium",
        status: i === 0 ? "In Progress" : i === 1 ? "Open" : i === 2 ? "Pending" : "In Progress",
        assigned: engineers[i % engineers.length],
        date: "06 Sep 2026",
      };
    });
  }, [data]);

  const [requests, setRequests] = useState<MaintenanceItem[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Sync initial requests once data loads
  if (!hasInitialized && initialRequests.length > 0) {
    setRequests(initialRequests);
    setHasInitialized(true);
  }

  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    assetId: "",
    issue: "",
    priority: "High" as const,
    assigned: "A. Das (Track Wing)",
  });

  const filteredRequests = useMemo(() => {
    if (statusFilter === "All") return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  const openCount = requests.filter(r => r.status === "Open").length;
  const inProgressCount = requests.filter(r => r.status === "In Progress").length;
  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const completedCount = requests.filter(r => r.status === "Completed").length;

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedAsset = data.find(a => a.asset_id === newRequest.assetId);

    const created: MaintenanceItem = {
      id: `MR-${2100 + requests.length}`,
      assetId: newRequest.assetId || (data[0]?.asset_id || "AST-GEN"),
      asset: matchedAsset ? `${matchedAsset.asset_type.replace(/_/g, ' ')} (${matchedAsset.asset_id})` : (newRequest.assetId || "Custom Asset"),
      location: matchedAsset ? `${matchedAsset.zone} • ${matchedAsset.section_type.replace(/_/g, ' ')}` : "Central Network",
      issue: newRequest.issue || "Routine structural maintenance",
      priority: newRequest.priority,
      status: "Open",
      assigned: newRequest.assigned,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setRequests([created, ...requests]);
    setShowModal(false);
    setNewRequest({ assetId: "", issue: "", priority: "High", assigned: "A. Das (Track Wing)" });
  };

  const handleStatusChange = (id: string, newStatus: MaintenanceItem['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="dashboard-home maintenance-page">

      {/* ================= HEADER ================= */}
      <div className="content-header">
        <div>
          <h1>Maintenance Requests</h1>
          <p>Manage, assign, and track maintenance operations tied to PostgreSQL asset records.</p>
        </div>

        <button className="primary-btn" onClick={() => setShowModal(true)}>
          + New Request
        </button>
      </div>

      {/* ================= STATUS BAR ================= */}
      <div className="system-bar" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span className="system-dot" style={{ backgroundColor: dbHealth?.status === 'connected' ? '#10b981' : '#f59e0b' }}></span>
          <span>
            {dbHealth?.status === 'connected' ? 'Maintenance Workflow Synced with PostgreSQL' : 'Maintenance System Active (Local)'}
          </span>
        </div>
        <span className="system-time">
          {requests.length} Active Tickets Managed
        </span>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <p>Open Requests</p>
            <h2>{openCount}</h2>
            <span className="stat-negative">Awaiting action</span>
          </div>
          <div className="stat-icon">🔧</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>In Progress</p>
            <h2>{inProgressCount}</h2>
            <span className="stat-positive">Crews on-site</span>
          </div>
          <div className="stat-icon">⚙</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Pending</p>
            <h2>{pendingCount}</h2>
            <span>Awaiting parts / schedule</span>
          </div>
          <div className="stat-icon">🕐</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Completed</p>
            <h2>{completedCount}</h2>
            <span className="stat-positive">Resolved</span>
          </div>
          <div className="stat-icon">✓</div>
        </div>
      </div>

      {/* ================= REQUEST TABLE ================= */}
      <div className="panel maintenance-panel">
        <div className="panel-header">
          <div>
            <h3>Active Maintenance Work Orders</h3>
            <p>Real-time tickets linked to high-risk assets.</p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Requests</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="maintenance-table-wrapper">
          <table className="maintenance-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>LINKED ASSET</th>
                <th>LOCATION</th>
                <th>OBSERVED ISSUE</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>ASSIGNED TO</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <span className="maintenance-id">{request.id}</span>
                  </td>
                  <td>
                    <span className="maintenance-asset" style={{ fontWeight: 600, color: '#3b82f6' }}>
                      {request.asset}
                    </span>
                  </td>
                  <td>
                    <span className="maintenance-location">{request.location}</span>
                  </td>
                  <td>
                    <span className="maintenance-issue">{request.issue}</span>
                  </td>
                  <td>
                    <span className={`maintenance-priority ${request.priority.toLowerCase()}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td>
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value as any)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-panel)',
                        color: 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <span className="maintenance-assigned">{request.assigned}</span>
                  </td>
                  <td>
                    <span className="maintenance-date">{request.date}</span>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No maintenance requests in this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= NEW REQUEST MODAL ================= */}
      {showModal && (
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
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-panel, #1e293b)',
              color: 'var(--text-main, #f8fafc)',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '520px',
              width: '100%',
              border: '1px solid var(--border-color, #334155)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Create Maintenance Work Order</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Select Target Asset from Database:
                </label>
                <select
                  value={newRequest.assetId}
                  onChange={(e) => setNewRequest({ ...newRequest, assetId: e.target.value })}
                  className="filter-select"
                  style={{ width: '100%' }}
                >
                  <option value="">-- Choose High Priority Asset --</option>
                  {data.slice(0, 40).map(a => (
                    <option key={a.asset_id} value={a.asset_id}>
                      {a.asset_id} - {a.asset_type.replace(/_/g, ' ')} ({a.zone} Zone, Risk: {a.risk_score?.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Priority:
                  </label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as any })}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Assign Engineer / Crew:
                  </label>
                  <select
                    value={newRequest.assigned}
                    onChange={(e) => setNewRequest({ ...newRequest, assigned: e.target.value })}
                    className="filter-select"
                    style={{ width: '100%' }}
                  >
                    <option value="R. Sharma (Signaling)">R. Sharma (Signaling)</option>
                    <option value="A. Das (Track Wing)">A. Das (Track Wing)</option>
                    <option value="S. Roy (Civil Engineering)">S. Roy (Civil Engineering)</option>
                    <option value="M. Singh (OHE / Electrical)">M. Singh (OHE / Electrical)</option>
                    <option value="P. Kumar (Rolling Stock)">P. Kumar (Rolling Stock)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Work Description & Maintenance Scope:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the defect repair, track replacement or ultrasonic testing required..."
                  value={newRequest.issue}
                  onChange={(e) => setNewRequest({ ...newRequest, issue: e.target.value })}
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
                  onClick={() => setShowModal(false)}
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  style={{ padding: '8px 16px' }}
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default MaintenanceRequests;