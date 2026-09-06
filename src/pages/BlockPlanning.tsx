import { useState, useMemo } from "react";
import { useAssetData, AssetData } from "../contexts/AssetContext";
import "./Dashboard.css";

function BlockPlanning() {
  const { data, loading, error } = useAssetData();

  const [selectedZone, setSelectedZone] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [searchId, setSearchId] = useState("");

  // Modal State
  const [allocatingAsset, setAllocatingAsset] = useState<AssetData | null>(null);
  const [scheduledBlocks, setScheduledBlocks] = useState<Record<string, string>>({});
  const [allocationForm, setAllocationForm] = useState({
    blockDurationHours: 4,
    date: new Date().toISOString().split('T')[0],
    speedRestrictionKmph: 30,
    assignedCrew: "Track Maintenance Wing 4",
  });
  const [notification, setNotification] = useState("");

  // Filter & Sort by priority
  const priorityAssets = useMemo(() => {
    return data
      .filter((asset) => {
        const matchesZone = selectedZone === "All" || asset.zone === selectedZone;
        const matchesSection = selectedSection === "All" || asset.section_type === selectedSection;
        const matchesId = searchId === "" || asset.asset_id.toLowerCase().includes(searchId.toLowerCase());
        return matchesZone && matchesSection && matchesId;
      })
      .sort((a, b) => (b.final_priority_score || 0) - (a.final_priority_score || 0))
      .slice(0, 30);
  }, [data, selectedZone, selectedSection, searchId]);

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingAsset) return;

    setScheduledBlocks((prev) => ({
      ...prev,
      [allocatingAsset.asset_id]: `${allocationForm.date} (${allocationForm.blockDurationHours} hrs)`
    }));

    setNotification(`Maintenance block scheduled for ${allocatingAsset.asset_id} on ${allocationForm.date}!`);
    setTimeout(() => setNotification(""), 3500);
    setAllocatingAsset(null);
  };

  if (loading && data.length === 0) {
    return (
      <div className="page-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Loading Block Planning Records from PostgreSQL...</h2>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <header className="content-header">
        <div>
          <p className="eyebrow">OPERATIONS & SCHEDULING</p>
          <h1>Block Planning</h1>
          <p className="subtitle">Schedule and allocate railway traffic possession blocks for high-risk assets.</p>
        </div>
      </header>

      {/* SUCCESS NOTIFICATION */}
      {notification && (
        <div style={{
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}>
          ✓ {notification}
        </div>
      )}

      {/* FILTER CONTROLS */}
      <div className="panel" style={{ marginBottom: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 200px' }}>
            <input
              type="text"
              placeholder="Search Asset ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
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

          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
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
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Section Types</option>
            <option value="Main_Line">Main Line</option>
            <option value="Branch_Line">Branch Line</option>
            <option value="Yard">Yard</option>
            <option value="Siding">Siding</option>
          </select>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Priority Block Allocation ({priorityAssets.length} Candidates)</h2>
            <p>Ranked strictly by AI composite priority score and failure probability.</p>
          </div>
        </div>

        {error && data.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            Error fetching assets: {error}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Type / Section</th>
                  <th>Zone</th>
                  <th>Priority Score</th>
                  <th>Risk Score</th>
                  <th>Avg Repair Window</th>
                  <th>Status / Allocation</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {priorityAssets.map((asset) => {
                  const isScheduled = scheduledBlocks[asset.asset_id];
                  const isCritical = (asset.final_priority_score || 0) >= 50;

                  return (
                    <tr key={asset.asset_id}>
                      <td><strong>{asset.asset_id}</strong></td>
                      <td>
                        {asset.asset_type.replace(/_/g, ' ')} <br/>
                        <small style={{ color: 'var(--text-muted)' }}>{asset.section_type.replace(/_/g, ' ')}</small>
                      </td>
                      <td>{asset.zone}</td>
                      <td>
                        <span className={`status-badge ${isCritical ? 'warning' : 'info'}`}>
                          {(asset.final_priority_score || 0).toFixed(1)} / 100
                        </span>
                      </td>
                      <td>{(asset.risk_score || 0).toFixed(3)}</td>
                      <td>{asset.avg_repair_time_hours} hrs</td>
                      <td>
                        {isScheduled ? (
                          <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
                            📅 {isScheduled}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Unscheduled
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="view-all"
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            backgroundColor: isScheduled ? 'transparent' : undefined,
                            border: isScheduled ? '1px solid var(--border-color)' : undefined
                          }}
                          onClick={() => setAllocatingAsset(asset)}
                        >
                          {isScheduled ? 'Re-schedule' : 'Allocate Block'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ALLOCATE BLOCK MODAL */}
      {allocatingAsset && (
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
          onClick={() => setAllocatingAsset(null)}
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
              <div>
                <h3 style={{ margin: 0 }}>Schedule Maintenance Block</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Asset: {allocatingAsset.asset_id} ({allocatingAsset.asset_type.replace(/_/g, ' ')})
                </span>
              </div>
              <button
                onClick={() => setAllocatingAsset(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAllocateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Block Scheduled Date:
                </label>
                <input
                  type="date"
                  required
                  value={allocationForm.date}
                  onChange={(e) => setAllocationForm({ ...allocationForm, date: e.target.value })}
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
                    Possession Window (Hours):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={allocationForm.blockDurationHours}
                    onChange={(e) => setAllocationForm({ ...allocationForm, blockDurationHours: Number(e.target.value) })}
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    Speed Limit (km/h):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={allocationForm.speedRestrictionKmph}
                    onChange={(e) => setAllocationForm({ ...allocationForm, speedRestrictionKmph: Number(e.target.value) })}
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Assigned Maintenance Wing:
                </label>
                <input
                  type="text"
                  value={allocationForm.assignedCrew}
                  onChange={(e) => setAllocationForm({ ...allocationForm, assignedCrew: e.target.value })}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setAllocatingAsset(null)}
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  style={{ padding: '8px 16px' }}
                >
                  Confirm Block Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default BlockPlanning;