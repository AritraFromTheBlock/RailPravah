import "./Dashboard.css";

function BlockPlanning() {
  const blocks = [
    {
      id: "BLK-204",
      section: "Howrah - Bandel",
      location: "KM 18.4 - KM 20.1",
      type: "Track Maintenance",
      start: "22:30",
      end: "02:30",
      duration: "4 hrs",
      status: "Scheduled",
      priority: "High",
    },
    {
      id: "BLK-203",
      section: "Sealdah - Naihati",
      location: "KM 32.2 - KM 34.0",
      type: "Signal Upgrade",
      start: "23:00",
      end: "03:00",
      duration: "4 hrs",
      status: "Active",
      priority: "Critical",
    },
    {
      id: "BLK-202",
      section: "Bally - Dankuni",
      location: "KM 7.8 - KM 9.2",
      type: "Bridge Inspection",
      start: "10:00",
      end: "14:00",
      duration: "4 hrs",
      status: "Completed",
      priority: "Medium",
    },
    {
      id: "BLK-201",
      section: "Kolkata - Kharagpur",
      location: "KM 45.0 - KM 47.5",
      type: "OHE Maintenance",
      start: "01:00",
      end: "05:00",
      duration: "4 hrs",
      status: "Scheduled",
      priority: "Medium",
    },
    {
      id: "BLK-200",
      section: "Howrah - Santragachi",
      location: "KM 5.2 - KM 6.8",
      type: "Track Inspection",
      start: "09:00",
      end: "11:00",
      duration: "2 hrs",
      status: "Completed",
      priority: "Low",
    },
  ];

  return (
    <div className="dashboard-home block-planning-page">

      {/* ================= HEADER ================= */}

      <div className="content-header">
        <div>
          <h1>Block Planning</h1>
          <p>
            Plan and monitor railway track blocks and maintenance windows.
          </p>
        </div>

        <button className="primary-btn">
          + Create Block
        </button>
      </div>


      {/* ================= SYSTEM STATUS ================= */}

      <div className="system-bar">
        <span className="system-dot"></span>

        <span>
          Block Planning System Operational
        </span>

        <span className="system-time">
          Last updated: Just now
        </span>
      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-info">
            <p>Active Blocks</p>
            <h2>8</h2>
            <span className="stat-negative">
              2 critical
            </span>
          </div>

          <div className="stat-icon">
            🚧
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Scheduled</p>
            <h2>24</h2>
            <span>
              Next 24 hours
            </span>
          </div>

          <div className="stat-icon">
            📅
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Completed</p>
            <h2>41</h2>
            <span className="stat-positive">
              This week
            </span>
          </div>

          <div className="stat-icon">
            ✓
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Track Availability</p>
            <h2>92%</h2>
            <span className="stat-positive">
              Network capacity
            </span>
          </div>

          <div className="stat-icon">
            🛤
          </div>
        </div>

      </div>


      {/* ================= BLOCK TABLE ================= */}

      <div className="panel block-panel">

        <div className="panel-header">

          <div>
            <h3>Planned Track Blocks</h3>
            <p>
              Scheduled maintenance and infrastructure blocks.
            </p>
          </div>

          <select className="filter-select">
            <option>All Blocks</option>
            <option>Active</option>
            <option>Scheduled</option>
            <option>Completed</option>
          </select>

        </div>


        <div className="block-table-wrapper">

          <table className="block-table">

            <thead>
              <tr>
                <th>BLOCK ID</th>
                <th>SECTION</th>
                <th>LOCATION</th>
                <th>ACTIVITY</th>
                <th>TIME</th>
                <th>DURATION</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
              </tr>
            </thead>


            <tbody>

              {blocks.map((block) => (

                <tr key={block.id}>

                  <td>
                    <span className="block-id">
                      {block.id}
                    </span>
                  </td>

                  <td>
                    <span className="block-section">
                      {block.section}
                    </span>
                  </td>

                  <td>
                    <span className="block-location">
                      {block.location}
                    </span>
                  </td>

                  <td>
                    <span className="block-activity">
                      {block.type}
                    </span>
                  </td>

                  <td>
                    <span className="block-time">
                      {block.start} - {block.end}
                    </span>
                  </td>

                  <td>
                    <span className="block-duration">
                      {block.duration}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`block-priority ${block.priority.toLowerCase()}`}
                    >
                      {block.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`block-status ${block.status.toLowerCase()}`}
                    >
                      {block.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= BOTTOM PANELS ================= */}

      <div className="bottom-grid block-summary">

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Block Overview</h3>
              <p>Current network blocks</p>
            </div>
          </div>

          <div className="upcoming-row">
            <span>Active Blocks</span>
            <strong>8</strong>
          </div>

          <div className="upcoming-row">
            <span>Scheduled Today</span>
            <strong>12</strong>
          </div>

          <div className="upcoming-row">
            <span>Completed Today</span>
            <strong className="stat-positive">
              7
            </strong>
          </div>

        </div>


        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Track Availability</h3>
              <p>Network capacity during blocks</p>
            </div>
          </div>

          <div className="upcoming-row">
            <span>Available Sections</span>
            <strong className="stat-positive">
              92%
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Under Block</span>
            <strong>
              8%
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Conflicts Detected</span>
            <strong className="stat-negative">
              2
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default BlockPlanning;