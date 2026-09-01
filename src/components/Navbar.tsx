
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          <span className="logo-icon">🚆</span>
          <span className="logo-text">RailPravah</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/search">Trains</Link>
          <Link to="/live-status">Live Status</Link>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/login" className="get-started-btn">
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;

