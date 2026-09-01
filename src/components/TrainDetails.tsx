interface TrainDetailsProps {
  trainName: string
  trainNumber: string
  route: string
}

function TrainDetails({
  trainName,
  trainNumber,
  route,
}: TrainDetailsProps) {
  return (
    <div className="train-details">

      <div className="details-header">
        <div>
          <p>TRAIN DETAILS</p>
          <h2>{trainName}</h2>
          <span>#{trainNumber}</span>
        </div>

        <div className="details-status">
          ● Live
        </div>
      </div>

      <div className="details-route">
        <span>{route}</span>
      </div>

      <div className="details-grid">

        <div>
          <span>Current Station</span>
          <strong>Howrah Junction</strong>
        </div>

        <div>
          <span>Next Station</span>
          <strong>Barddhaman</strong>
        </div>

        <div>
          <span>Platform</span>
          <strong>5</strong>
        </div>

        <div>
          <span>Expected Delay</span>
          <strong>On Time</strong>
        </div>

      </div>

    </div>
  )
}

export default TrainDetails