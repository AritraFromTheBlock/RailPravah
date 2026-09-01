import "./Dashboard.css";

function Reports() {
  const reports = [
    {
      id: "RPT-092",
      name: "Daily Train Operations Report",
      type: "Operations",
      generated: "02 Sep 2026, 21:30",
      period: "Today",
      status: "Ready",
    },
    {
      id: "RPT-091",
      name: "Network Performance Report",
      type: "Analytics",
      generated: "02 Sep 2026, 18:00",
      period: "01 Sep 2026",
      status: "Ready",
    },
    {
      id: "RPT-090",
      name: "Maintenance Activity Report",
      type: "Maintenance",
      generated: "02 Sep 2026, 16:45",
      period: "Weekly",
      status: "Ready",
    },
    {
      id: "RPT-089",
      name: "Asset Health Report",
      type: "Assets",
      generated: "01 Sep 2026, 23:00",
      period: "August 2026",
      status: "Ready",
    },
    {
      id: "RPT-088",
      name: "Block Utilization Report",
      type: "Planning",
      generated: "01 Sep 2026, 20:15",
      period: "Weekly",
      status: "Processing",
    },
  ];

  return (
    <div className="dashboard-home reports-page">

      {/* HEADER */}
      <div className="content-header">
        <div>
          <h1>Reports</h1>
          <p>
            Generate, monitor and review railway network reports.
          </p>
        </div>

        <button className="primary-btn">
          + Generate Report
        </button>
      </div>


      {/* SYSTEM STATUS */}
      <div className="system-bar">
        <span className="system-dot"></span>
        <span>Reporting System Operational</span>
        <span className="system-time">
          Last updated: Just now
        </span>
      </div>


      {/* STAT CARDS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-info">
            <p>Reports Generated</p>
            <h2>248</h2>
            <span className="stat-positive">
              +18 this month
            </span>
          </div>

          <div className="stat-icon">
            📑
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Ready Reports</p>
            <h2>42</h2>
            <span className="stat-positive">
              Available to view
            </span>
          </div>

          <div className="stat-icon">
            ✓
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Scheduled Reports</p>
            <h2>12</h2>
            <span>
              Next 7 days
            </span>
          </div>

          <div className="stat-icon">
            📅
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-info">
            <p>Processing</p>
            <h2>3</h2>
            <span>
              Currently generating
            </span>
          </div>

          <div className="stat-icon">
            ⚙
          </div>
        </div>

      </div>


      {/* REPORT GENERATOR */}
      <div className="panel report-generator">

        <div className="panel-header">
          <div>
            <h3>Quick Report Generator</h3>
            <p>
              Select a report type and time period.
            </p>
          </div>
        </div>


        <div className="report-generator-grid">

          <div className="report-field">
            <label>REPORT TYPE</label>

            <select className="report-select">
              <option>Train Operations</option>
              <option>Network Performance</option>
              <option>Maintenance Activity</option>
              <option>Asset Health</option>
              <option>Block Utilization</option>
            </select>
          </div>


          <div className="report-field">
            <label>TIME PERIOD</label>

            <select className="report-select">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom Range</option>
            </select>
          </div>


          <div className="report-field">
            <label>FORMAT</label>

            <select className="report-select">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>
          </div>


          <button className="generate-report-btn">
            Generate
          </button>

        </div>

      </div>


      {/* REPORT TABLE */}
      <div className="panel reports-list-panel">

        <div className="panel-header">

          <div>
            <h3>Recent Reports</h3>
            <p>
              Recently generated network reports.
            </p>
          </div>

          <select className="filter-select">
            <option>All Reports</option>
            <option>Operations</option>
            <option>Analytics</option>
            <option>Maintenance</option>
            <option>Assets</option>
            <option>Planning</option>
          </select>

        </div>


        <div className="reports-table-wrapper">

          <table className="reports-table">

            <thead>
              <tr>
                <th>REPORT ID</th>
                <th>REPORT NAME</th>
                <th>TYPE</th>
                <th>PERIOD</th>
                <th>GENERATED</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>


            <tbody>

              {reports.map((report) => (

                <tr key={report.id}>

                  <td>
                    <span className="report-id">
                      {report.id}
                    </span>
                  </td>

                  <td>
                    <span className="report-name">
                      {report.name}
                    </span>
                  </td>

                  <td>
                    <span className="report-type">
                      {report.type}
                    </span>
                  </td>

                  <td>
                    <span className="report-period">
                      {report.period}
                    </span>
                  </td>

                  <td>
                    <span className="report-generated">
                      {report.generated}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`report-status ${report.status.toLowerCase()}`}
                    >
                      {report.status}
                    </span>
                  </td>

                  <td>
                    {report.status === "Ready" ? (
                      <button className="report-action">
                        View
                      </button>
                    ) : (
                      <span className="report-processing">
                        Processing...
                      </span>
                    )}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* BOTTOM PANELS */}
      <div className="bottom-grid reports-summary">

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Report Categories</h3>
              <p>Generated reports by category</p>
            </div>
          </div>

          <div className="upcoming-row">
            <span>Operations</span>
            <strong>82</strong>
          </div>

          <div className="upcoming-row">
            <span>Maintenance</span>
            <strong>56</strong>
          </div>

          <div className="upcoming-row">
            <span>Analytics</span>
            <strong>48</strong>
          </div>

          <div className="upcoming-row">
            <span>Assets & Planning</span>
            <strong>62</strong>
          </div>

        </div>


        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Scheduled Reports</h3>
              <p>Upcoming automated reports</p>
            </div>
          </div>

          <div className="upcoming-row">
            <span>Daily Operations</span>
            <strong>22:00</strong>
          </div>

          <div className="upcoming-row">
            <span>Weekly Performance</span>
            <strong>Mon 06:00</strong>
          </div>

          <div className="upcoming-row">
            <span>Monthly Asset Health</span>
            <strong>01 Oct</strong>
          </div>

          <div className="upcoming-row">
            <span>Report System</span>
            <strong className="stat-positive">
              Active
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Reports;