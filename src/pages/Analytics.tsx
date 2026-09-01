function Analytics() {
  const analytics = [
    { label: "Total Trains", value: "1,284", change: "+8.4%" },
    { label: "On-Time Rate", value: "94.2%", change: "+2.1%" },
    { label: "Average Delay", value: "12 min", change: "-4.6%" },
    { label: "Passengers", value: "2.8M", change: "+11.3%" },
  ];

  const weeklyData = [
    { day: "Mon", value: 72 },
    { day: "Tue", value: 86 },
    { day: "Wed", value: 64 },
    { day: "Thu", value: 91 },
    { day: "Fri", value: 78 },
    { day: "Sat", value: 95 },
    { day: "Sun", value: 83 },
  ];

  return (
    <section className="analytics-page">
      <div className="analytics-container">

        <div className="analytics-header">
          <div>
            <p className="section-tag">📊 RAILWAY INSIGHTS</p>
            <h1>
              Analytics <span>Overview</span>
            </h1>
            <p>
              Monitor railway performance and operational statistics.
            </p>
          </div>

          <select className="analytics-filter">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
        </div>

        <div className="analytics-cards">
          {analytics.map((item) => (
            <div className="analytics-card" key={item.label}>
              <span>{item.label}</span>
              <h2>{item.value}</h2>
              <p>{item.change} from previous period</p>
            </div>
          ))}
        </div>

        <div className="analytics-chart-card">
          <div className="chart-header">
            <div>
              <h2>Train Activity</h2>
              <p>Weekly train movement</p>
            </div>
          </div>

          <div className="bar-chart">
            {weeklyData.map((item) => (
              <div className="bar-column" key={item.day}>
                <div className="bar-value">{item.value}</div>

                <div
                  className="bar"
                  style={{ height: `${item.value}%` }}
                ></div>

                <span>{item.day}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Analytics;