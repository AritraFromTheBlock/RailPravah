
import { useState } from "react";

function TrainSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Please fill all fields");
      return;
    }

    alert(`Searching trains from ${from} to ${to} on ${date}`);
  };

  return (
    <section className="train-search">
      <div className="train-search-container">

        <div className="train-search-header">
          <p className="section-tag">🚆 FIND YOUR TRAIN</p>

          <h2>
            Search <span>Trains</span>
          </h2>

          <p>
            Find the best train for your journey with real-time
            railway information.
          </p>
        </div>

        <div className="search-card">

          <div className="search-field">
            <label>From</label>

            <input
              type="text"
              placeholder="Departure station"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="swap-icon">
            ⇄
          </div>

          <div className="search-field">
            <label>To</label>

            <input
              type="text"
              placeholder="Arrival station"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="search-field">
            <label>Journey Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            className="search-train-btn"
            onClick={handleSearch}
          >
            🔍 Search Trains
          </button>

        </div>

      </div>
    </section>
  );
}

export default TrainSearch;
