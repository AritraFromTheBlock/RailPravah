import "./Dashboard.css";

function CorridorMap() {
  const corridors = [
    {
      id: "CR-001",
      name: "Howrah - New Delhi",
      route: "HWH → NDLS",
      distance: "1,445 km",
      trains: 38,
      status: "Operational",
      utilization: "86%",
    },
    {
      id: "CR-002",
      name: "Howrah - Chennai",
      route: "HWH → MAS",
      distance: "1,660 km",
      trains: 31,
      status: "Operational",
      utilization: "79%",
    },
    {
      id: "CR-003",
      name: "Sealdah - Guwahati",
      route: "SDAH → GHY",
      distance: "1,000 km",
      trains: 22,
      status: "Maintenance",
      utilization: "64%",
    },
    {
      id: "CR-004",
      name: "Howrah - Mumbai",
      route: "HWH → CSMT",
      distance: "1,968 km",
      trains: 27,
      status: "Operational",
      utilization: "72%",
    },
    {
      id: "CR-005",
      name: "Kolkata - Patna",
      route: "KOAA → PNBE",
      distance: "532 km",
      trains: 19,
      status: "Operational",
      utilization: "68%",
    },
  ];

  return (
    <div className="dashboard-home corridor-map-page">

      {/* ================= HEADER ================= */}

      <div className="content-header">
        <div>
          <h1>Corridor Map</h1>
          <p>
            Monitor railway corridors, routes and network utilization.
          </p>
        </div>

        <button className="primary-btn">
          + Add Corridor
        </button>
      </div>


      {/* ================= SYSTEM STATUS ================= */}

      <div className="system-bar">
        <span className="system-dot"></span>

        <span>
          Network Mapping System Operational
        </span>

        <span className="system-time">
          Last updated: Just now
        </span>
      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-info">
            <p>Active Corridors</p>
            <h2>48</h2>
            <span className="stat-positive">
              Network wide
            </span>
          </div>

          <div className="stat-icon">
            🗺
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Active Routes</p>
            <h2>156</h2>
            <span>
              Across all corridors
            </span>
          </div>

          <div className="stat-icon">
            🛤
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Network Utilization</p>
            <h2>78%</h2>
            <span className="stat-positive">
              +4.2% this week
            </span>
          </div>

          <div className="stat-icon">
            📈
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Maintenance Zones</p>
            <h2>6</h2>
            <span className="stat-negative">
              2 active
            </span>
          </div>

          <div className="stat-icon">
            🚧
          </div>
        </div>

      </div>


      {/* ================= MAP AREA ================= */}

      <div className="panel corridor-map-panel">

        <div className="panel-header">

          <div>
            <h3>Network Corridor Overview</h3>
            <p>
              Regional railway network activity and route distribution.
            </p>
          </div>

          <select className="filter-select">
            <option>All Corridors</option>
            <option>Operational</option>
            <option>Maintenance</option>
          </select>

        </div>


        <div className="corridor-map">

          <div className="map-grid">

            <div className="map-line line-one"></div>
            <div className="map-line line-two"></div>
            <div className="map-line line-three"></div>

            <div className="station station-one">
              <span></span>
              <label>Howrah</label>
            </div>

            <div className="station station-two">
              <span></span>
              <label>Bandel</label>
            </div>

            <div className="station station-three">
              <span></span>
              <label>Sealdah</label>
            </div>

            <div className="station station-four">
              <span></span>
              <label>Patna</label>
            </div>

            <div className="station station-five">
              <span></span>
              <label>Delhi</label>
            </div>

            <div className="station station-six">
              <span></span>
              <label>Chennai</label>
            </div>

          </div>

          <div className="map-legend">

            <span>
              <i className="legend-dot operational"></i>
              Operational
            </span>

            <span>
              <i className="legend-dot maintenance"></i>
              Maintenance
            </span>

            <span>
              <i className="legend-dot station-dot"></i>
              Station
            </span>

          </div>

        </div>

      </div>


      {/* ================= CORRIDOR TABLE ================= */}

      <div className="panel corridor-table-panel">

        <div className="panel-header">

          <div>
            <h3>Corridor Details</h3>
            <p>
              Current utilization and operational status.
            </p>
          </div>

        </div>


        <div className="corridor-table-wrapper">

          <table className="corridor-table">

            <thead>
              <tr>
                <th>CORRIDOR</th>
                <th>ROUTE</th>
                <th>DISTANCE</th>
                <th>TRAINS</th>
                <th>UTILIZATION</th>
                <th>STATUS</th>
              </tr>
            </thead>


            <tbody>

              {corridors.map((corridor) => (

                <tr key={corridor.id}>

                  <td>
                    <div className="corridor-name">
                      {corridor.name}
                    </div>

                    <span className="corridor-id">
                      {corridor.id}
                    </span>
                  </td>

                  <td>
                    <span className="corridor-route">
                      {corridor.route}
                    </span>
                  </td>

                  <td>
                    <span className="corridor-distance">
                      {corridor.distance}
                    </span>
                  </td>

                  <td>
                    <span className="corridor-trains">
                      {corridor.trains}
                    </span>
                  </td>

                  <td>

                    <div className="utilization-wrapper">

                      <div className="utilization-bar">
                        <span
                          style={{
                            width: corridor.utilization,
                          }}
                        ></span>
                      </div>

                      <strong>
                        {corridor.utilization}
                      </strong>

                    </div>

                  </td>

                  <td>
                    <span
                      className={`corridor-status ${corridor.status.toLowerCase()}`}
                    >
                      {corridor.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= BOTTOM SUMMARY ================= */}

      <div className="bottom-grid corridor-summary">

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Network Capacity</h3>
              <p>Current corridor utilization</p>
            </div>
          </div>

          <div className="upcoming-row">
            <span>Average Utilization</span>
            <strong className="stat-positive">
              78%
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Peak Utilization</span>
            <strong>
              91%
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Available Capacity</span>
            <strong>
              22%
            </strong>
          </div>

        </div>


        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Network Alerts</h3>
              <p>Corridor related notifications</p>
            </div>
          </div>

          <div className="upcoming-row">
            <span>Active Maintenance</span>
            <strong className="stat-negative">
              2
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Route Conflicts</span>
            <strong>
              3
            </strong>
          </div>

          <div className="upcoming-row">
            <span>Network Status</span>
            <strong className="stat-positive">
              Normal
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default CorridorMap;