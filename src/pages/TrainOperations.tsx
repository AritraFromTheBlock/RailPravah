import "./Dashboard.css";

function TrainOperations() {
  const trains = [
    {
      number: "12301",
      name: "Rajdhani Express",
      route: "New Delhi → Howrah",
      status: "Running",
      platform: "6",
      time: "18:45",
      delay: "On Time",
    },
    {
      number: "12951",
      name: "Mumbai Rajdhani",
      route: "Mumbai Central → New Delhi",
      status: "Delayed",
      platform: "3",
      time: "19:20",
      delay: "+12 min",
    },
    {
      number: "12841",
      name: "Coromandel Express",
      route: "Howrah → Chennai",
      status: "Running",
      platform: "9",
      time: "20:10",
      delay: "On Time",
    },
    {
      number: "12024",
      name: "Jan Shatabdi",
      route: "Patna → Howrah",
      status: "Boarding",
      platform: "2",
      time: "20:35",
      delay: "On Time",
    },
    {
      number: "12302",
      name: "Rajdhani Express",
      route: "Howrah → New Delhi",
      status: "Scheduled",
      platform: "5",
      time: "21:15",
      delay: "On Time",
    },
  ];

  return (
    <div className="dashboard-home train-operations-page">

      {/* ================= HEADER ================= */}

      <div className="content-header">
        <div>
          <h1>Train Operations</h1>
          <p>Monitor and manage active train operations across the network.</p>
        </div>

        <button className="primary-btn">
          + Add Operation
        </button>
      </div>


      {/* ================= SYSTEM STATUS ================= */}

      <div className="system-bar">
        <span className="system-dot"></span>
        <span>Rail Network Operational</span>
        <span className="system-time">
          Last updated: Just now
        </span>
      </div>


      {/* ================= STATS ================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-info">
            <p>Active Trains</p>
            <h2>128</h2>
            <span className="stat-positive">
              +8 today
            </span>
          </div>

          <div className="stat-icon">
            🚆
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Running On Time</p>
            <h2>94</h2>
            <span className="stat-positive">
              73.4%
            </span>
          </div>

          <div className="stat-icon">
            ✓
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Delayed Trains</p>
            <h2>17</h2>
            <span className="stat-negative">
              -3 from yesterday
            </span>
          </div>

          <div className="stat-icon">
            ⚠
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Scheduled</p>
            <h2>42</h2>
            <span>
              Next 6 hours
            </span>
          </div>

          <div className="stat-icon">
            🕐
          </div>
        </div>

      </div>


      {/* ================= OPERATIONS TABLE ================= */}

      <div className="panel">

        <div className="panel-header">
          <div>
            <h3>Live Train Operations</h3>
            <p>Current status of trains operating across the network.</p>
          </div>

          <select className="filter-select">
            <option>All Trains</option>
            <option>Running</option>
            <option>Delayed</option>
            <option>Boarding</option>
            <option>Scheduled</option>
          </select>
        </div>


        <div className="operations-table-wrapper">

          <table className="operations-table">

            <thead>
              <tr>
                <th>TRAIN</th>
                <th>ROUTE</th>
                <th>STATUS</th>
                <th>PLATFORM</th>
                <th>TIME</th>
                <th>DELAY</th>
              </tr>
            </thead>


            <tbody>

              {trains.map((train) => (

                <tr key={train.number}>

                  <td>
                    <div className="operation-train">
                      {train.number} {train.name}
                    </div>
                  </td>


                  <td>
                    <div className="operation-route">
                      {train.route}
                    </div>
                  </td>


                  <td>
                    <span
                      className={`operation-status ${train.status.toLowerCase()}`}
                    >
                      {train.status}
                    </span>
                  </td>


                  <td>
                    <span className="operation-platform">
                      Platform {train.platform}
                    </span>
                  </td>


                  <td>
                    <span className="operation-time">
                      {train.time}
                    </span>
                  </td>


                  <td>
                    <span
                      className={`operation-delay ${
                        train.delay === "On Time"
                          ? "on-time"
                          : "late"
                      }`}
                    >
                      {train.delay}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= BOTTOM PANELS ================= */}

      <div className="bottom-grid operations-summary">

        {/* Operational Summary */}

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Operational Summary</h3>
              <p>Today's network performance</p>
            </div>
          </div>


          <div className="upcoming-row">
            <span>On-Time Performance</span>
            <strong>86.7%</strong>
          </div>


          <div className="upcoming-row">
            <span>Delays Detected</span>
            <strong>17</strong>
          </div>


          <div className="upcoming-row">
            <span>Completed Journeys</span>
            <strong>342</strong>
          </div>

        </div>


        {/* Network Activity */}

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Network Activity</h3>
              <p>Current railway network status</p>
            </div>
          </div>


          <div className="upcoming-row">
            <span>Active Routes</span>
            <strong>48</strong>
          </div>


          <div className="upcoming-row">
            <span>Active Stations</span>
            <strong>156</strong>
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

export default TrainOperations;