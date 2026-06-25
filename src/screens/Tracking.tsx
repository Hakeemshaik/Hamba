import { serviceById } from '../lib/data'
import type { Booking, PaymentMethod } from '../lib/types'
import Icon from '../components/Icon'
import DriverCard from '../components/DriverCard'

interface Props {
  booking: Booking
  method: PaymentMethod | null
  onDone: () => void
}

const STEPS = ['Booked', 'Driver assigned', 'On the way', 'Completed']

/** Stable, human-readable booking reference derived from the booking. */
function reference(booking: Booking): string {
  const text = (booking.pickup + booking.dropoff + booking.date + (booking.service ?? '')).toUpperCase()
  let hash = 0
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  return 'HMB-' + (hash % 100000).toString().padStart(5, '0')
}

export default function Tracking({ booking, method, onDone }: Props) {
  const service = serviceById(booking.service)
  const methodLabel = method === 'tap' ? 'Tap to pay' : method === 'card' ? 'Card' : 'Instant EFT'
  const ref = reference(booking)

  return (
    <div className="screen">
      <div className="confirm-burst">
        <div className="confirm-check"><Icon name="check" /></div>
        <h2 className="confirm-title">You're booked!</h2>
        <p className="confirm-sub">
          {service?.name} · {booking.date || 'soon'}{booking.time ? ` · ${booking.time}` : ''}
        </p>
        <span className="ref-chip">Ref {ref}</span>
      </div>

      <div className="glass map-card">
        <div className="map-grid" />
        <div className="map-eta">
          <Icon name="clock" />
          <span>Live tracking once a driver accepts</span>
        </div>
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

      <p className="group-label">Your driver</p>
      <DriverCard />

      <p className="group-label">Status</p>
      <div className="glass steps-card">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i === 0 ? 'step--done' : ''} ${i === 1 ? 'step--active' : ''}`}>
            <span className="step-dot" />
            <span className="step-label">{s}</span>
            {i === 0 && <span className="step-tick"><Icon name="check" /></span>}
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
