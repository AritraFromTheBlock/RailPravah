import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";

import TrainSearch from "./pages/TrainSearch";
import LiveStatus from "./pages/LiveStatus";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

import TrainOperations from "./pages/TrainOperations";
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

          {/* Train Operations */}
          <Route
            path="/train-operations"
            element={<TrainOperations />}
          />

          {/* Train Search */}
          <Route
            path="/search"
            element={<TrainSearch />}
          />

          {/* Live Status */}
          <Route
            path="/live-status"
            element={<LiveStatus />}
          />

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