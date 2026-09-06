import { useAssetData } from "../contexts/AssetContext";
import "./Dashboard.css";

function BlockPlanning() {
  const { data, loading, error } = useAssetData();

  if (loading) {
    return (
      <div className="page-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Loading Block Planning Data...</h2>
      </div>
    );
  }

  // Get top 20 highest priority assets for block planning
  const priorityAssets = [...data]
    .sort((a, b) => b.final_priority_score - a.final_priority_score)
    .slice(0, 20);

  return (
    <div className="page-layout">
      
      <header className="content-header">
        <div>
          <p className="eyebrow">OPERATIONS</p>
          <h1>Block Planning</h1>
          <p className="subtitle">Schedule and coordinate maintenance blocks for critical assets.</p>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Priority Block Allocation</h2>
            <p>Assets requiring immediate maintenance blocks based on Priority Score.</p>
          </div>
          <button className="view-all">Schedule New Block</button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Type / Section</th>
                <th>Zone</th>
                <th>Priority Score</th>
                <th>Risk Score</th>
                <th>Avg Repair Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {priorityAssets.map((asset) => (
                <tr key={asset.asset_id}>
                  <td><strong>{asset.asset_id}</strong></td>
                  <td>
                    {asset.asset_type.replace(/_/g, ' ')} <br/>
                    <small style={{ color: 'var(--text-muted)' }}>{asset.section_type.replace(/_/g, ' ')}</small>
                  </td>
                  <td>{asset.zone}</td>
                  <td>
                    <span className={`status-badge ${asset.final_priority_score > 0.8 ? 'warning' : 'info'}`}>
                      {asset.final_priority_score.toFixed(2)}
                    </span>
                  </td>
                  <td>{asset.risk_score.toFixed(2)}</td>
                  <td>{asset.avg_repair_time_hours} hrs</td>
                  <td>
                    <button className="view-all" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Allocate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}

export default BlockPlanning;