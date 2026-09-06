import { Link } from "react-router-dom";
import Logo from "./Logo";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" style={{ textDecoration: "none" }}>
          <Logo size={32} />
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/block-planning">Block Planning</Link>
          <Link to="/maintenance-requests">Requests</Link>
          <Link to="/corridor-map">Corridor Map</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/dashboard" className="get-started-btn">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

