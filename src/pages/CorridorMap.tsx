import { useMemo, useState } from "react";
import { useAssetData } from "../contexts/AssetContext";
import "./Dashboard.css";

interface CorridorItem {
  id: string;
  name: string;
  route: string;
  distance: string;
  trains: number;
  zones: string[];
}

function CorridorMap() {
  const { data, dbHealth } = useAssetData();
  const [filterStatus, setFilterStatus] = useState("All Corridors");

  const baseCorridors: CorridorItem[] = [
    {
      id: "CR-001",
      name: "Howrah - New Delhi",
      route: "HWH → NDLS",
      distance: "1,445 km",
      trains: 38,
      zones: ["Eastern", "Northern"],
    },
    {
      id: "CR-002",
      name: "Howrah - Chennai",
      route: "HWH → MAS",
      distance: "1,660 km",
      trains: 31,
      zones: ["Eastern", "Southern"],
    },
    {
      id: "CR-003",
      name: "Sealdah - Guwahati",
      route: "SDAH → GHY",
      distance: "1,000 km",
      trains: 22,
      zones: ["Eastern", "NorthEastern"],
    },
    {
      id: "CR-004",
      name: "Howrah - Mumbai",
      route: "HWH → CSMT",
      distance: "1,968 km",
      trains: 27,
      zones: ["Eastern", "Western", "Central"],
    },
    {
      id: "CR-005",
      name: "Kolkata - Patna",
      route: "KOAA → PNBE",
      distance: "532 km",
      trains: 19,
      zones: ["Eastern"],
    },
  ];

  // Calculate live health metrics for each corridor based on PostgreSQL data
  const corridors = useMemo(() => {
    return baseCorridors.map((c) => {
      const matchingAssets = data.filter((a) => c.zones.includes(a.zone));
      const criticalCount = matchingAssets.filter(
        (a) => a.failure_within_30_days === 1 || (a.condition_rating || 5) < 2.5
      ).length;

      const avgCond = matchingAssets.length > 0
        ? matchingAssets.reduce((sum, a) => sum + (a.condition_rating || 0), 0) / matchingAssets.length
        : 3.5;

      const isMaintenance = criticalCount >= 4 || avgCond < 3.0;
      const utilizationVal = Math.min(95, Math.max(55, Math.round(70 + (c.trains * 0.5) - (isMaintenance ? 10 : 0))));

      return {
        ...c,
        status: isMaintenance ? "Maintenance" : "Operational",
        utilization: `${utilizationVal}%`,
        assetCount: matchingAssets.length,
        criticalCount,
        avgCondition: avgCond.toFixed(1),
      };
    });
  }, [data]);

  const filteredCorridors = corridors.filter((c) => {
    if (filterStatus === "Operational") return c.status === "Operational";
    if (filterStatus === "Maintenance") return c.status === "Maintenance";
    return true;
  });

  const maintenanceCount = corridors.filter((c) => c.status === "Maintenance").length;
  const operationalCount = corridors.filter((c) => c.status === "Operational").length;

  return (
    <div className="dashboard-home corridor-map-page">

      {/* ================= HEADER ================= */}
      <div className="content-header">
        <div>
          <h1>Corridor Map</h1>
          <p>Monitor railway corridors, telemetry health, and track possession status.</p>
        </div>
      </div>

      {/* ================= SYSTEM STATUS ================= */}
      <div className="system-bar" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span className="system-dot" style={{ backgroundColor: dbHealth?.status === 'connected' ? '#10b981' : '#f59e0b' }}></span>
          <span>
            {dbHealth?.status === 'connected' ? 'Live Telemetry Active Across All Corridors' : 'Corridor Monitoring Active (Offline Mode)'}
          </span>
        </div>
        <span className="system-time">
          {corridors.length} High-Capacity Corridors Monitored
        </span>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <p>Active Corridors</p>
            <h2>{corridors.length}</h2>
            <span className="stat-positive">Trunk network routes</span>
          </div>
          <div className="stat-icon">🗺</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Operational Corridors</p>
            <h2>{operationalCount}</h2>
            <span className="stat-positive">Optimal track conditions</span>
          </div>
          <div className="stat-icon">✓</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Possession / Maintenance</p>
            <h2>{maintenanceCount}</h2>
            <span className="stat-negative">{maintenanceCount > 0 ? 'Active block possessions' : 'Clear'}</span>
          </div>
          <div className="stat-icon">🔧</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Monitored Corridor Assets</p>
            <h2>{data.length.toLocaleString()}</h2>
            <span className="stat-positive">Synchronized from PostgreSQL</span>
          </div>
          <div className="stat-icon">🏗</div>
        </div>
      </div>

      {/* ================= MAP AREA ================= */}
      <div className="panel corridor-map-panel">
        <div className="panel-header">
          <div>
            <h3>Network Corridor Overview</h3>
            <p>Regional railway network route topology and real-time corridor condition.</p>
          </div>

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
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
              Maintenance / Possession
            </span>
            <span>
              <i className="legend-dot station-dot"></i>
              Station Terminal
            </span>
          </div>
        </div>
      </div>

      {/* ================= CORRIDOR TABLE ================= */}
      <div className="panel corridor-table-panel">
        <div className="panel-header">
          <div>
            <h3>Corridor Details & Infrastructure Health</h3>
            <p>Live health metrics calculated from PostgreSQL assets along each corridor.</p>
          </div>
        </div>

        <div className="corridor-table-wrapper">
          <table className="corridor-table">
            <thead>
              <tr>
                <th>CORRIDOR</th>
                <th>ROUTE</th>
                <th>DISTANCE</th>
                <th>ACTIVE TRAINS</th>
                <th>CORRIDOR ASSETS</th>
                <th>UTILIZATION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCorridors.map((corridor) => (
                <tr key={corridor.id}>
                  <td>
                    <div className="corridor-name">{corridor.name}</div>
                    <span className="corridor-id">{corridor.id}</span>
                  </td>

                  <td>
                    <span className="corridor-route">{corridor.route}</span>
                  </td>

                  <td>
                    <span className="corridor-distance">{corridor.distance}</span>
                  </td>

                  <td>
                    <span className="corridor-trains">{corridor.trains}</span>
                  </td>

                  <td>
                    <span>
                      {corridor.assetCount} assets
                      {corridor.criticalCount > 0 && (
                        <small style={{ color: '#ef4444', display: 'block' }}>
                          {corridor.criticalCount} critical
                        </small>
                      )}
                    </span>
                  </td>

                  <td>
                    <div className="utilization-wrapper">
                      <div className="utilization-bar">
                        <span style={{ width: corridor.utilization }}></span>
                      </div>
                      <strong>{corridor.utilization}</strong>
                    </div>
                  </td>

                  <td>
                    <span className={`corridor-status ${corridor.status.toLowerCase()}`}>
                      {corridor.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default CorridorMap;