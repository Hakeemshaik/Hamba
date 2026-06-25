import Icon from './Icon'
import Illustration from './Illustration'

export interface Driver {
  name: string
  rating: number
  trips: number
  vehicle: string
  plate: string
}

const SAMPLE_DRIVER: Driver = {
  name: 'Sipho M.',
  rating: 4.9,
  trips: 327,
  vehicle: 'Toyota Hi-Ace 2.5T',
  plate: 'JHB · GP 482-217',
}

const BADGES = ['ID verified', 'Licensed', 'Insured load']

/**
 * The "your driver" trust card — verified identity, rating, vehicle and
 * direct contact. This is the single most important trust signal in the app.
 */
export default function DriverCard({ driver = SAMPLE_DRIVER }: { driver?: Driver }) {
  return (
    <div className="glass driver-card">
      <div className="driver-head">
        <span className="driver-avatar" aria-hidden>
          <Illustration name="driver" />
        </span>
        <div className="driver-info">
          <div className="driver-name">{driver.name}</div>
          <div className="driver-meta">
            <span className="driver-rating">
              <Icon name="star" /> {driver.rating.toFixed(1)}
            </span>
            <span className="driver-dot">·</span>
            <span>{driver.trips} trips</span>
          </div>
          <div className="driver-vehicle">{driver.vehicle} · {driver.plate}</div>
        </div>
      </div>

      <div className="driver-badges">
        {BADGES.map((b) => (
          <span key={b} className="verify-pill">
            <Icon name="badge" /> {b}
          </span>
        ))}
      </div>

      <div className="driver-actions">
        <button className="action-btn action-btn--primary">
          <Icon name="phone" /> Call
        </button>
        <button className="action-btn">
          <Icon name="message" /> Message
        </button>
      </div>
    </div>
  )
}
