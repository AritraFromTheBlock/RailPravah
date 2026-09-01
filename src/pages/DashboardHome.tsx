import { useNavigate } from "react-router-dom";

function DashboardHome() {

  const navigate = useNavigate();

  return (
    <div className="dashboard-home">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="content-header">

        <div>

          <p className="eyebrow">
            RAILWAY OPERATIONS
          </p>

          <h1>
            Dashboard Overview
          </h1>

          <p className="subtitle">
            Monitor trains, railway traffic and live operations.
          </p>

        </div>


        <div className="header-actions">

          <button
            className="notification"
            onClick={() => navigate("/alerts")}
            aria-label="Open alerts"
          >
            🔔
          </button>


          <div className="profile">

            <div className="profile-avatar">
              J
            </div>

            <div>

              <strong>
                Jagat
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* =================================================
          SYSTEM STATUS
      ================================================= */}

      <div className="system-bar">

        <div>

          <span className="online-dot"></span>

          All railway systems operational

        </div>

        <span>
          Last updated: Just now
        </span>

      </div>


      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="stats-grid">


        {/* Active Trains */}

        <div className="stat-card">

          <div className="stat-icon blue">
            🚆
          </div>

          <div>

            <p>
              Active Trains
            </p>

            <h2>
              128
            </h2>

            <small className="positive">
              ↑ 8.4% today
            </small>

          </div>

        </div>


        {/* On Time */}

        <div className="stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div>

            <p>
              On-Time Rate
            </p>

            <h2>
              94%
            </h2>

            <small className="positive">
              ↑ 2.1% today
            </small>

          </div>

        </div>


        {/* Delayed */}

        <div className="stat-card">

          <div className="stat-icon orange">
            ⏱
          </div>

          <div>

            <p>
              Delayed Trains
            </p>

            <h2>
              17
            </h2>

            <small className="negative">
              ↓ 3 from yesterday
            </small>

          </div>

        </div>


        {/* Stations */}

        <div className="stat-card">

          <div className="stat-icon purple">
            🚉
          </div>

          <div>

            <p>
              Stations
            </p>

            <h2>
              156
            </h2>

            <small className="positive">
              All operational
            </small>

          </div>

        </div>

      </div>


      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="main-grid">


        {/* =================================================
            TRAIN ACTIVITY
        ================================================= */}

        <section className="panel activity-panel">

          <div className="panel-header">

            <div>

              <h2>
                Train Activity
              </h2>

              <p>
                Train movement across the network
              </p>

            </div>


            <select>

              <option>
                Today
              </option>

              <option>
                7 Days
              </option>

              <option>
                30 Days
              </option>

            </select>

          </div>


          {/* Chart */}

          <div className="chart">

            <div className="chart-values">

              <span>150</span>

              <span>100</span>

              <span>50</span>

              <span>0</span>

            </div>


            <div className="chart-body">

              <div className="chart-line"></div>

              <div className="chart-line line-two"></div>

              <div className="chart-line line-three"></div>

              <div className="chart-line line-four"></div>


              <div className="bars">

                <i style={{ height: "35%" }}></i>

                <i style={{ height: "55%" }}></i>

                <i style={{ height: "45%" }}></i>

                <i style={{ height: "72%" }}></i>

                <i style={{ height: "60%" }}></i>

                <i style={{ height: "85%" }}></i>

                <i style={{ height: "68%" }}></i>

                <i style={{ height: "92%" }}></i>

                <i style={{ height: "76%" }}></i>

                <i style={{ height: "62%" }}></i>

                <i style={{ height: "80%" }}></i>

                <i style={{ height: "50%" }}></i>

              </div>


              <div className="chart-labels">

                <span>6 AM</span>

                <span>8 AM</span>

                <span>10 AM</span>

                <span>12 PM</span>

                <span>2 PM</span>

                <span>4 PM</span>

                <span>6 PM</span>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            LIVE TRAIN STATUS
        ================================================= */}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Live Train Status
              </h2>

              <p>
                Currently running trains
              </p>

            </div>


            <button
              className="view-all"
              onClick={() => navigate("/live-status")}
            >
              View All
            </button>

          </div>


          <div className="train-list">


            {/* Train 1 */}

            <div className="train-row">

              <div className="train-left">

                <div className="train-icon">
                  🚆
                </div>

                <div>

                  <strong>
                    12301 Rajdhani
                  </strong>

                  <span>
                    Delhi → Howrah
                  </span>

                </div>

              </div>

              <label className="running">
                Running
              </label>

            </div>


            {/* Train 2 */}

            <div className="train-row">

              <div className="train-left">

                <div className="train-icon">
                  🚆
                </div>

                <div>

                  <strong>
                    12951 Mumbai Rajdhani
                  </strong>

                  <span>
                    Mumbai → Delhi
                  </span>

                </div>

              </div>

              <label className="delayed">
                +12 min
              </label>

            </div>


            {/* Train 3 */}

            <div className="train-row">

              <div className="train-left">

                <div className="train-icon">
                  🚆
                </div>

                <div>

                  <strong>
                    12841 Coromandel
                  </strong>

                  <span>
                    Howrah → Chennai
                  </span>

                </div>

              </div>

              <label className="running">
                Running
              </label>

            </div>


            {/* Train 4 */}

            <div className="train-row">

              <div className="train-left">

                <div className="train-icon">
                  🚆
                </div>

                <div>

                  <strong>
                    12024 Jan Shatabdi
                  </strong>

                  <span>
                    Patna → Howrah
                  </span>

                </div>

              </div>

              <label className="delayed">
                +7 min
              </label>

            </div>

          </div>

        </section>

      </div>


      {/* =================================================
          BOTTOM GRID
      ================================================= */}

      <div className="bottom-grid">


        {/* =================================================
            RECENT ALERTS
        ================================================= */}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Recent Alerts
              </h2>

              <p>
                Latest railway notifications
              </p>

            </div>


            <button
              className="view-all"
              onClick={() => navigate("/alerts")}
            >
              View All
            </button>

          </div>


          <div className="alerts">


            <div className="alert warning">

              <span>
                ⚠️
              </span>

              <div>

                <strong>
                  Train Delay
                </strong>

                <p>
                  Train 12951 delayed by 12 minutes.
                </p>

              </div>

            </div>


            <div className="alert info">

              <span>
                ℹ️
              </span>

              <div>

                <strong>
                  Platform Change
                </strong>

                <p>
                  Train 12301 moved to Platform 6.
                </p>

              </div>

            </div>


            <div className="alert success">

              <span>
                ✓
              </span>

              <div>

                <strong>
                  Track Clear
                </strong>

                <p>
                  Track maintenance completed successfully.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            UPCOMING TRAINS
        ================================================= */}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Upcoming Trains
              </h2>

              <p>
                Next scheduled departures
              </p>

            </div>


            <button
              className="view-all"
              onClick={() => navigate("/search")}
            >
              Search
            </button>

          </div>


          <div className="upcoming">


            <div className="upcoming-row">

              <div>

                <strong>
                  12302 Rajdhani Express
                </strong>

                <span>
                  Howrah → New Delhi
                </span>

              </div>

              <b>
                22:45
              </b>

            </div>


            <div className="upcoming-row">

              <div>

                <strong>
                  12842 Coromandel Express
                </strong>

                <span>
                  Chennai → Howrah
                </span>

              </div>

              <b>
                23:10
              </b>

            </div>


            <div className="upcoming-row">

              <div>

                <strong>
                  12023 Jan Shatabdi
                </strong>

                <span>
                  Howrah → Patna
                </span>

              </div>

              <b>
                23:40
              </b>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default DashboardHome;