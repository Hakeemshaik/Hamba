import { serviceById } from '../lib/data'
import type { Booking, PaymentMethod } from '../lib/types'
import Icon from '../components/Icon'

interface Props {
  booking: Booking
  method: PaymentMethod | null
  onDone: () => void
}

const STEPS = ['Booked', 'Driver assigned', 'On the way', 'Completed']

export default function Tracking({ booking, method, onDone }: Props) {
  const service = serviceById(booking.service)
  const methodLabel = method === 'tap' ? 'Tap to pay' : method === 'card' ? 'Card' : 'Instant EFT'

  return (
    <div className="screen">
      <div className="confirm-burst">
        <div className="confirm-check"><Icon name="check" /></div>
        <h2 className="confirm-title">You're booked!</h2>
        <p className="confirm-sub">
          {service?.name} · {booking.date || 'soon'} {booking.time}
        </p>
      </div>

      <div className="glass map-card">
        <div className="map-grid" />
        <div className="map-route">
          <span className="pin pin-a"><Icon name="pin" /></span>
          <span className="route-line" />
          <span className="truck-moving"><Icon name="truck" /></span>
          <span className="pin pin-b"><Icon name="pin" /></span>
        </div>
        <div className="map-foot">
          <span>{booking.pickup || 'Pickup'}</span>
          <span>{booking.dropoff || 'Drop-off'}</span>
        </div>
      </div>

      <div className="glass steps-card">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i <= 1 ? 'step--done' : ''}`}>
            <span className="step-dot" />
            <span className="step-label">{s}</span>
            {i <= 1 && <span className="step-tick"><Icon name="check" /></span>}
          </div>
        ))}
      </div>

      <div className="glass paid-card">
        <span>Paid via {methodLabel}</span>
        <span className="paid-badge">Receipt sent</span>
      </div>

      <div className="sticky-cta">
        <button className="primary-btn" onClick={onDone}>Done</button>
      </div>
    </div>
  )
}
