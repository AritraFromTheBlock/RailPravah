import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";

import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

import MaintenanceRequests from "./pages/MaintenanceRequests";
import DefectsAssets from "./pages/DefectsAssets";
import BlockPlanning from "./pages/BlockPlanning";
import CorridorMap from "./pages/CorridorMap";
import Reports from "./pages/Reports";

import { AssetProvider } from "./contexts/AssetContext";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC PAGES ================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================= DASHBOARD LAYOUT ================= */}

        <Route element={<AssetProvider><Dashboard /></AssetProvider>}>

          {/* Dashboard Home */}
          <Route
            path="/dashboard"
            element={<DashboardHome />}
          />

          {/* Redirects for removed passenger timetable routes */}
          <Route path="/train-operations" element={<Navigate to="/dashboard" replace />} />
          <Route path="/search" element={<Navigate to="/defects-assets" replace />} />
          <Route path="/live-status" element={<Navigate to="/dashboard" replace />} />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={<Analytics />}
          />


          {/* ================= OPERATIONS ================= */}

          {/* Maintenance Requests */}
          <Route
            path="/maintenance-requests"
            element={<MaintenanceRequests />}
          />

          {/* Defects & Assets */}
          <Route
            path="/defects-assets"
            element={<DefectsAssets />}
          />

          {/* Block Planning */}
          <Route
            path="/block-planning"
            element={<BlockPlanning />}
          />

          {/* Corridor Map */}
          <Route
            path="/corridor-map"
            element={<CorridorMap />}
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={<Reports />}
          />


          {/* ================= MANAGEMENT ================= */}

          {/* Alerts */}
          <Route
            path="/alerts"
            element={<Alerts />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;