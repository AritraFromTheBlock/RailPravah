import { useState } from "react";

type AlertType = "Critical" | "Warning" | "Info";

type Alert = {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  time: string;
};

function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "Critical",
      title: "Train Delay Detected",
      message: "Train 12841 is delayed by approximately 35 minutes.",
      time: "5 min ago",
    },
    {
      id: 2,
      type: "Warning",
      title: "Platform Change",
      message: "Train 12301 has been moved from Platform 4 to Platform 5.",
      time: "18 min ago",
    },
    {
      id: 3,
      type: "Info",
      title: "Schedule Updated",
      message: "The schedule for tomorrow's trains has been updated.",
      time: "42 min ago",
    },
  ]);

  const removeAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <section className="alerts-page">
      <div className="alerts-container">

        <div className="alerts-header">
          <div>
            <p className="section-tag">🔔 SYSTEM NOTIFICATIONS</p>

            <h1>
              Railway <span>Alerts</span>
            </h1>

            <p>
              Important updates and operational notifications.
            </p>
          </div>

          <div className="alert-count">
            {alerts.length} Active
          </div>
        </div>

        <div className="alerts-list">

          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                className={`alert-card ${alert.type.toLowerCase()}`}
                key={alert.id}
              >

                <div className="alert-icon">
                  {alert.type === "Critical"
                    ? "🚨"
                    : alert.type === "Warning"
                    ? "⚠️"
                    : "ℹ️"}
                </div>

                <div className="alert-content">
                  <div className="alert-title-row">
                    <h3>{alert.title}</h3>
                    <span>{alert.type}</span>
                  </div>

                  <p>{alert.message}</p>

                  <small>{alert.time}</small>
                </div>

                <button
                  className="dismiss-alert"
                  onClick={() => removeAlert(alert.id)}
                >
                  ×
                </button>

              </div>
            ))
          ) : (
            <div className="no-alerts">
              <h2>🎉 No Active Alerts</h2>
              <p>Everything looks good right now.</p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default Alerts;