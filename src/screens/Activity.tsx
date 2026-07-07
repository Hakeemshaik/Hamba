import { formatZar } from '../lib/quote'
import { loadBookings } from '../lib/db'
import Illustration from '../components/Illustration'
import Icon from '../components/Icon'

interface Props {
  onNew: () => void
}

const STATUS_LABEL: Record<string, string> = {
  upcoming: 'Upcoming',
  active: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function Activity({ onNew }: Props) {
  const trips = loadBookings()

  return (
    <div className="screen screen--tabbed">
      <div className="app-bar">
        <span className="wordmark">Your trips</span>
      </div>

      {trips.length === 0 ? (
        <div className="glass trip-empty">
          <span className="trip-empty-art truck-anim truck-anim--idle" aria-hidden><Illustration name="truck" /></span>
          <h3>No trips yet</h3>
          <p>Your bookings and their status will show up here once you make your first one.</p>
        </div>
      ) : (
        <div className="trip-list">
          {trips.map((b, i) => (
            <div key={b.id} className="glass trip-card" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="trip-art" aria-hidden><Illustration name={b.icon} /></span>
              <div className="trip-body">
                <div className="trip-top">
                  <span className="trip-service">{b.serviceName}</span>
                  <span className={`trip-status trip-status--${b.status === 'completed' || b.status === 'cancelled' ? 'done' : 'active'}`}>
                    {STATUS_LABEL[b.status] ?? b.status}
                  </span>
                </div>
                <div className="trip-route">
                  {b.pickup || 'Pickup'} → {b.dropoff || 'Drop-off'}
                </div>
                <div className="trip-meta">
                  <span>{b.date || 'Date TBC'}{b.time ? ` · ${b.time}` : ''} · {b.id}</span>
                  <span className="trip-price">{formatZar(b.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="glass new-trip" onClick={onNew}>
        <Icon name="plus" /> Book a move
      </button>
    </div>
  )
}
