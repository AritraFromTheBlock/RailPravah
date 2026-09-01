interface TrainCardProps {
  trainNumber: string
  trainName: string
  route: string
  status: string
  platform: string
  time: string
}

function TrainCard({
  trainNumber,
  trainName,
  route,
  status,
  platform,
  time,
}: TrainCardProps) {
  return (
    <div className="train-card">

      <div className="train-main">

        <div className="train-icon">
          🚆
        </div>

        <div>
          <p className="train-number">
            #{trainNumber}
          </p>

          <h3>{trainName}</h3>

          <span className="train-route">
            {route}
          </span>
        </div>

      </div>

      <div className="train-info">

        <div>
          <span>Status</span>
          <strong
            className={
              status === 'On Time'
                ? 'status-on-time'
                : 'status-delayed'
            }
          >
            {status}
          </strong>
        </div>

        <div>
          <span>Platform</span>
          <strong>{platform}</strong>
        </div>

        <div>
          <span>Departure</span>
          <strong>{time}</strong>
        </div>

        <button className="details-btn">
          View Details
        </button>

      </div>

    </div>
  )
}

export default TrainCard