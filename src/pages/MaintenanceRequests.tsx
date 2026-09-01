import "./Dashboard.css";

function MaintenanceRequests() {
  const requests = [
    {
      id: "MR-1042",
      asset: "Signal System - Platform 4",
      location: "Howrah Junction",
      issue: "Signal malfunction",
      priority: "High",
      status: "In Progress",
      assigned: "R. Sharma",
      date: "02 Sep 2026",
    },
    {
      id: "MR-1041",
      asset: "Track Section - KM 18",
      location: "Bandel",
      issue: "Track inspection required",
      priority: "Medium",
      status: "Pending",
      assigned: "A. Das",
      date: "02 Sep 2026",
    },
    {
      id: "MR-1040",
      asset: "Point Machine - P12",
      location: "Sealdah",
      issue: "Point machine failure",
      priority: "Critical",
      status: "Open",
      assigned: "S. Roy",
      date: "01 Sep 2026",
    },
    {
      id: "MR-1039",
      asset: "Overhead Equipment",
      location: "Kolkata Terminal",
      issue: "OHE inspection",
      priority: "Low",
      status: "Completed",
      assigned: "M. Singh",
      date: "01 Sep 2026",
    },
    {
      id: "MR-1038",
      asset: "Platform Display",
      location: "Howrah Junction",
      issue: "Display not working",
      priority: "Medium",
      status: "In Progress",
      assigned: "P. Kumar",
      date: "31 Aug 2026",
    },
  ];

  return (
    <div className="dashboard-home maintenance-page">

      {/* ================= HEADER ================= */}

      <div className="content-header">
        <div>
          <h1>Maintenance Requests</h1>
          <p>
            Track, assign and manage railway maintenance activities.
          </p>
        </div>

        <button className="primary-btn">
          + New Request
        </button>
      </div>


      {/* ================= STATUS BAR ================= */}

      <div className="system-bar">
        <span className="system-dot"></span>
        <span>Maintenance System Operational</span>

        <span className="system-time">
          Last updated: Just now
        </span>
      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-info">
            <p>Open Requests</p>
            <h2>24</h2>
            <span className="stat-negative">
              5 high priority
            </span>
          </div>

          <div className="stat-icon">
            🔧
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>In Progress</p>
            <h2>12</h2>
            <span className="stat-positive">
              8 technicians active
            </span>
          </div>

          <div className="stat-icon">
            ⚙
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Pending</p>
            <h2>9</h2>
            <span>
              Awaiting assignment
            </span>
          </div>

          <div className="stat-icon">
            🕐
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Completed</p>
            <h2>87</h2>
            <span className="stat-positive">
              This month
            </span>
          </div>

          <div className="stat-icon">
            ✓
          </div>
        </div>

      </div>


      {/* ================= REQUEST TABLE ================= */}

      <div className="panel maintenance-panel">

        <div className="panel-header">

          <div>
            <h3>Maintenance Requests</h3>
            <p>
              Current maintenance activities across the network.
            </p>
          </div>

          <select className="filter-select">
            <option>All Requests</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>

        </div>


        <div className="maintenance-table-wrapper">

          <table className="maintenance-table">

            <thead>
              <tr>
                <th>REQUEST</th>
                <th>ASSET</th>
                <th>LOCATION</th>
                <th>ISSUE</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>ASSIGNED TO</th>
                <th>DATE</th>
              </tr>
            </thead>


            <tbody>

              {requests.map((request) => (

                <tr key={request.id}>

                  <td>
                    <span className="maintenance-id">
                      {request.id}
                    </span>
                  </td>

                  <td>
                    <span className="maintenance-asset">
                      {request.asset}
                    </span>
                  </td>

                  <td>
                    <span className="maintenance-location">
                      {request.location}
                    </span>
                  </td>

                  <td>
                    <span className="maintenance-issue">
                      {request.issue}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`maintenance-priority ${request.priority.toLowerCase()}`}
                    >
                      {request.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`maintenance-status ${request.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {request.status}
                    </span>
                  </td>

                  <td>
                    <span className="maintenance-assigned">
                      {request.assigned}
                    </span>
                  </td>

                  <td>
                    <span className="maintenance-date">
                      {request.date}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= BOTTOM PANELS ================= */}

      <div className="bottom-grid maintenance-summary">

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Maintenance Overview</h3>
              <p>Current workload</p>
            </div>
          </div>

          <div className="upcoming-row">
            <span>Critical Issues</span>
            <strong className="stat-negative">3</strong>
          </div>

          <div className="upcoming-row">
            <span>High Priority</span>
            <strong>5</strong>
          </div>

          <div className="upcoming-row">
            <span>Average Resolution Time</span>
            <strong>4.2 hrs</strong>
          </div>

        </div>


        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Technician Activity</h3>
              <p>Maintenance team status</p>
            </div>
          </div>

          <div className="upcoming-row">
            <span>Technicians Active</span>
            <strong>8</strong>
          </div>

          <div className="upcoming-row">
            <span>Available</span>
            <strong className="stat-positive">14</strong>
          </div>

          <div className="upcoming-row">
            <span>On Site</span>
            <strong>6</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default MaintenanceRequests;