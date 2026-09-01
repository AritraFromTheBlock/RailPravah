import { NavLink, Outlet } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        {/* ================= LOGO ================= */}

        <div className="logo">

          <div className="logo-icon">
            🚆
          </div>

          <div>
            <h2>RailPravah</h2>
            <span>Railway Intelligence</span>
          </div>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="sidebar-nav">

          <p className="nav-title">
            MAIN MENU
          </p>


          {/* ================= DASHBOARD ================= */}

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>▣</span>
            Dashboard
          </NavLink>


          {/* ================= TRAIN OPERATIONS ================= */}

          <NavLink
            to="/train-operations"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🚆</span>
            Train Operations
          </NavLink>


          {/* ================= TRAIN SEARCH ================= */}

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🔎</span>
            Train Search
          </NavLink>


          {/* ================= LIVE STATUS ================= */}

          <NavLink
            to="/live-status"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🚆</span>
            Live Status
          </NavLink>


          {/* ================= ANALYTICS ================= */}

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>📊</span>
            Analytics
          </NavLink>


          {/* =================================================
              OPERATIONS
          ================================================= */}

          <p className="nav-title second">
            OPERATIONS
          </p>


          {/* ================= MAINTENANCE ================= */}

          <NavLink
            to="/maintenance-requests"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🔧</span>
            Maintenance Requests
          </NavLink>


          {/* ================= DEFECTS & ASSETS ================= */}

          <NavLink
            to="/defects-assets"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🛠</span>
            Defects & Assets
          </NavLink>


          {/* ================= BLOCK PLANNING ================= */}

          <NavLink
            to="/block-planning"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🚧</span>
            Block Planning
          </NavLink>


          {/* ================= CORRIDOR MAP ================= */}

          <NavLink
            to="/corridor-map"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>🗺</span>
            Corridor Map
          </NavLink>


          {/* ================= REPORTS ================= */}

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>📑</span>
            Reports
          </NavLink>


          {/* =================================================
              MANAGEMENT
          ================================================= */}

          <p className="nav-title second">
            MANAGEMENT
          </p>


          {/* ================= ALERTS ================= */}

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>⚠</span>

            Alerts

            <b className="alert-count">
              3
            </b>

          </NavLink>


          {/* ================= SETTINGS ================= */}

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>⚙</span>
            Settings
          </NavLink>

        </nav>


        {/* =================================================
            SIDEBAR USER
        ================================================= */}

        <div className="sidebar-bottom">

          <div className="user-avatar">
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

      </aside>


      {/* =====================================================
          MAIN CONTENT

          All dashboard child pages render here
      ===================================================== */}

      <main className="dashboard-content">

        <Outlet />

      </main>

    </div>
  );
}

export default Dashboard;