import { useState } from "react";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <section className="settings-page">
      <div className="settings-container">

        <div className="settings-header">
          <div>
            <p className="section-tag">⚙️ APPLICATION CONTROL</p>

            <h1>
              Account <span>Settings</span>
            </h1>

            <p>
              Manage your RailPravah preferences and notifications.
            </p>
          </div>
        </div>

        <div className="settings-grid">

          <div className="settings-card">

            <h2>Preferences</h2>

            <div className="setting-item">
              <div>
                <h3>🔔 Notifications</h3>
                <p>Receive important railway alerts.</p>
              </div>

              <button
                className={`toggle ${notifications ? "active" : ""}`}
                onClick={() => setNotifications(!notifications)}
              >
                <span></span>
              </button>
            </div>

            <div className="setting-item">
              <div>
                <h3>📡 Live Updates</h3>
                <p>Show real-time train information.</p>
              </div>

              <button
                className={`toggle ${liveUpdates ? "active" : ""}`}
                onClick={() => setLiveUpdates(!liveUpdates)}
              >
                <span></span>
              </button>
            </div>

            <div className="setting-item">
              <div>
                <h3>🌙 Dark Mode</h3>
                <p>Use the dark dashboard appearance.</p>
              </div>

              <button
                className={`toggle ${darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <span></span>
              </button>
            </div>

          </div>

          <div className="settings-card">

            <h2>Account</h2>

            <div className="profile-box">
              <div className="profile-avatar">
                J
              </div>

              <div>
                <h3>Jagat</h3>
                <p>Administrator</p>
              </div>
            </div>

            <div className="account-info">
              <div>
                <span>Email</span>
                <strong>admin@railpravah.com</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>Administrator</strong>
              </div>
            </div>

          </div>

        </div>

        <div className="settings-actions">

          {saved && (
            <span className="save-message">
              ✓ Settings saved
            </span>
          )}

          <button
            className="save-settings-btn"
            onClick={handleSave}
          >
            Save Changes
          </button>

        </div>

      </div>
    </section>
  );
}

export default Settings;