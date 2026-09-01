import "./Dashboard.css";

function DefectsAssets() {
  const assets = [
    {
      id: "AST-2048",
      asset: "Signal Unit S-14",
      type: "Signalling",
      location: "Howrah Junction",
      condition: "Critical",
      defects: 2,
      lastInspection: "02 Sep 2026",
    },
    {
      id: "AST-2047",
      asset: "Point Machine P-12",
      type: "Track",
      location: "Sealdah",
      condition: "Warning",
      defects: 1,
      lastInspection: "01 Sep 2026",
    },
    {
      id: "AST-2046",
      asset: "OHE Section O-31",
      type: "Electrical",
      location: "Bandel",
      condition: "Good",
      defects: 0,
      lastInspection: "31 Aug 2026",
    },
    {
      id: "AST-2045",
      asset: "Platform Display D-08",
      type: "Passenger Info",
      location: "Kolkata Terminal",
      condition: "Warning",
      defects: 1,
      lastInspection: "30 Aug 2026",
    },
    {
      id: "AST-2044",
      asset: "Track Section T-22",
      type: "Track",
      location: "Bally",
      condition: "Good",
      defects: 0,
      lastInspection: "29 Aug 2026",
    },
  ];

  return (
    <div className="dashboard-home defects-assets-page">

      {/* ================= HEADER ================= */}

      <div className="content-header">
        <div>
          <h1>Defects & Assets</h1>
          <p>
            Monitor railway assets, defects and inspection conditions.
          </p>
        </div>

        <button className="primary-btn">
          + Report Defect
        </button>
      </div>


      {/* ================= SYSTEM STATUS ================= */}

      <div className="system-bar">
        <span className="system-dot"></span>

        <span>
          Asset Monitoring System Operational
        </span>

        <span className="system-time">
          Last updated: Just now
        </span>
      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-info">
            <p>Total Assets</p>
            <h2>1,284</h2>
            <span className="stat-positive">
              +18 this month
            </span>
          </div>

          <div className="stat-icon">
            🏗
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Active Defects</p>
            <h2>32</h2>
            <span className="stat-negative">
              7 high priority
            </span>
          </div>

          <div className="stat-icon">
            ⚠
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Under Inspection</p>
            <h2>18</h2>
            <span>
              6 inspections today
            </span>
          </div>

          <div className="stat-icon">
            🔍
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Healthy Assets</p>
            <h2>1,234</h2>
            <span className="stat-positive">
              96.1% network health
            </span>
          </div>

          <div className="stat-icon">
            ✓
          </div>
        </div>

      </div>


      {/* ================= ASSET TABLE ================= */}

      <div className="panel defects-panel">

        <div className="panel-header">

          <div>
            <h3>Asset Condition Monitor</h3>
            <p>
              Current condition of critical railway infrastructure.
            </p>
          </div>

          <select className="filter-select">
            <option>All Assets</option>
            <option>Critical</option>
            <option>Warning</option>
            <option>Good</option>
          </select>

        </div>


        <div className="defects-table-wrapper">

          <table className="defects-table">

            <thead>
              <tr>
                <th>ASSET ID</th>
                <th>ASSET</th>
                <th>TYPE</th>
                <th>LOCATION</th>
                <th>CONDITION</th>
                <th>DEFECTS</th>
                <th>LAST INSPECTION</th>
              </tr>
            </thead>


            <tbody>

              {assets.map((asset) => (

                <tr key={asset.id}>

                  <td>
                    <span className="asset-id">
                      {asset.id}
                    </span>
                  </td>


                  <td>
                    <span className="asset-name">
                      {asset.asset}
                    </span>
                  </td>


                  <td>
                    <span className="asset-type">
                      {asset.type}
                    </span>
                  </td>


                  <td>
                    <span className="asset-location">
                      {asset.location}
                    </span>
                  </td>


                  <td>
                    <span
                      className={`asset-condition ${asset.condition.toLowerCase()}`}
                    >
                      {asset.condition}
                    </span>
                  </td>


                  <td>
                    <span
                      className={`asset-defects ${
                        asset.defects > 0
                          ? "has-defects"
                          : "no-defects"
                      }`}
                    >
                      {asset.defects}
                    </span>
                  </td>


                  <td>
                    <span className="asset-inspection">
                      {asset.lastInspection}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= BOTTOM PANELS ================= */}

      <div className="bottom-grid defects-summary">

        {/* Defect Summary */}

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Defect Summary</h3>
              <p>Current reported defects</p>
            </div>
          </div>

          <div className="upcoming-row">
            <span>Critical</span>
            <strong className="stat-negative">
              4
            </strong>
          </div>

          <div className="upcoming-row">
            <span>High</span>
            <strong>
              7
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Medium</span>
            <strong>
              13
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Low</span>
            <strong className="stat-positive">
              8
            </strong>
          </div>

        </div>


        {/* Asset Health */}

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Asset Health</h3>
              <p>Network infrastructure condition</p>
            </div>
          </div>

          <div className="upcoming-row">
            <span>Healthy</span>
            <strong className="stat-positive">
              96.1%
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Needs Attention</span>
            <strong>
              3.1%
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Critical</span>
            <strong className="stat-negative">
              0.8%
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Last Audit</span>
            <strong>
              Today
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default DefectsAssets;