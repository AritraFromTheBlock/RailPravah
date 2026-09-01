
import { useState } from "react";

type Train = {
  number: string;
  name: string;
  from: string;
  to: string;
  status: "On Time" | "Delayed" | "Arriving";
  platform: string;
  arrival: string;
};

function LiveStatus() {
  const [search, setSearch] = useState("");

  const trains: Train[] = [
    {
      number: "12301",
      name: "Rajdhani Express",
      from: "Howrah",
      to: "New Delhi",
      status: "On Time",
      platform: "5",
      arrival: "10:30 PM",
    },
    {
      number: "12841",
      name: "Coromandel Express",
      from: "Howrah",
      to: "Chennai",
      status: "Delayed",
      platform: "7",
      arrival: "11:15 PM",
    },
    {
      number: "12021",
      name: "Shatabdi Express",
      from: "Howrah",
      to: "Barbil",
      status: "Arriving",
      platform: "3",
      arrival: "10:45 PM",
    },
    {
      number: "12951",
      name: "Mumbai Rajdhani",
      from: "Mumbai",
      to: "New Delhi",
      status: "On Time",
      platform: "2",
      arrival: "11:40 PM",
    },
  ];

  const filteredTrains = trains.filter(
    (train) =>
      train.number.toLowerCase().includes(search.toLowerCase()) ||
      train.name.toLowerCase().includes(search.toLowerCase()) ||
      train.from.toLowerCase().includes(search.toLowerCase()) ||
      train.to.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="live-status">
      <div className="live-status-container">

        <div className="live-status-header">
          <div>
            <p className="section-tag">🔴 LIVE RAILWAY DATA</p>

            <h2>
              Live Train <span>Status</span>
            </h2>

            <p>
              Track train movements, delays and platform information
              in real time.
            </p>
          </div>

          <div className="live-indicator">
            <span></span>
            LIVE
          </div>
        </div>

        <div className="status-search">
          <input
            type="text"
            placeholder="Search train number, name or station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={() => setSearch("")}>
            Clear
          </button>
        </div>

        <div className="train-status-list">

          {filteredTrains.length > 0 ? (
            filteredTrains.map((train) => (
              <div className="train-status-card" key={train.number}>

                <div className="train-main-info">
                  <div className="train-icon">
                    🚆
                  </div>

                  <div>
                    <h3>{train.name}</h3>
                    <p>Train No. {train.number}</p>
                  </div>
                </div>

                <div className="route-info">
                  <div>
                    <strong>{train.from}</strong>
                    <span>Departure</span>
                  </div>

                  <div className="route-line">
                    ─────────▶
                  </div>

                  <div>
                    <strong>{train.to}</strong>
                    <span>Destination</span>
                  </div>
                </div>

                <div className="train-details">
                  <div>
                    <span>Platform</span>
                    <strong>{train.platform}</strong>
                  </div>

                  <div>
                    <span>Arrival</span>
                    <strong>{train.arrival}</strong>
                  </div>
                </div>

                <div
                  className={`train-status ${train.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {train.status}
                </div>

              </div>
            ))
          ) : (
            <div className="no-trains">
              <h3>No trains found</h3>
              <p>
                Try searching with another train number, name or station.
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default LiveStatus;
