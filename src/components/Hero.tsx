
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <p className="hero-tag">
          🚆 SMART RAILWAY EXPERIENCE
        </p>

        <h1>
          Your Journey,
          <span> Simplified.</span>
        </h1>

        <p className="hero-description">
          Search trains, check live status, and plan your journey
          with RailPravah.
        </p>

        <div className="hero-buttons">

          <Link
            to="/search"
            className="hero-primary-btn"
          >
            Search Trains
          </Link>

          <Link
            to="/live-status"
            className="hero-secondary-btn"
          >
            Check Live Status
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Hero;

