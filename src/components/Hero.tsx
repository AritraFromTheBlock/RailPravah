
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <p className="hero-tag">
          ⚡ AI INFRASTRUCTURE & PREDICTIVE SAFETY
        </p>

        <h1>
          Railway Assets,
          <span> Optimized.</span>
        </h1>

        <p className="hero-description">
          Monitor 10,000+ railway assets live from PostgreSQL, predict critical degradation with XGBoost, and coordinate traffic block planning.
        </p>

        <div className="hero-buttons">

          <Link
            to="/dashboard"
            className="hero-primary-btn"
          >
            Enter Dashboard
          </Link>

          <Link
            to="/defects-assets"
            className="hero-secondary-btn"
          >
            Inspect Assets
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Hero;

