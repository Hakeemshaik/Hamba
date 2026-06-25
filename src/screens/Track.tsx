import { useState } from 'react'
import { formatZar } from '../lib/quote'
import { latestBooking, updateBookingStatus } from '../lib/storage'
import Icon from '../components/Icon'
import Illustration from '../components/Illustration'
import DriverCard from '../components/DriverCard'

interface Props {
  justBooked: boolean
  onBook: () => void
  onHelp: () => void
}

const STEPS = ['Booked', 'Driver assigned', 'On the way', 'Arrived', 'Completed']
const DONE_AT: Record<string, number> = { upcoming: 1, active: 3, completed: 5, cancelled: 1 }

export default function Track({ justBooked, onBook, onHelp }: Props) {
  const [, force] = useState(0)
  const booking = latestBooking()

  if (!booking || booking.status === 'cancelled' || booking.status === 'completed') {
    return (
      <div className="screen screen--tabbed">
        <div className="app-bar"><span className="wordmark">Track</span></div>
        <div className="glass trip-empty">
          <span className="trip-empty-art" aria-hidden><Illustration name="truck" /></span>
          <h3>{booking?.status === 'cancelled' ? 'Booking cancelled' : 'Nothing on the move'}</h3>
          <p>When you have an active booking, you’ll track your driver here in real time.</p>
        </div>
        <button className="glass new-trip" onClick={onBook}><Icon name="plus" /> Book a move</button>
      </div>
    )
  }

  const done = DONE_AT[booking.status] ?? 1
  const active = booking.status === 'active'

  const cancel = () => {
    updateBookingStatus(booking.id, 'cancelled')
    force((n) => n + 1)
  }

  return (
    <div className="screen screen--tabbed">
      <div className="app-bar"><span className="wordmark">Track</span></div>

      {justBooked && (
        <div className="track-banner">
          <span className="track-banner-tick"><Icon name="check" /></span>
          <div>
            <strong>Booking confirmed</strong>
            <span>Reference {booking.id}</span>
          </div>
        </div>
      )}

      <div className="glass map-card">
        <div className="map-grid" />
        <div className="map-eta">
          <Icon name="clock" />
          <span>{active ? 'Driver on the way' : 'Live tracking once a driver accepts'}</span>
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
          <div key={s} className={`step ${i < done ? 'step--done' : ''} ${i === done ? 'step--active' : ''}`}>
            <span className="step-dot" />
            <span className="step-label">{s}</span>
            {i < done && <span className="step-tick"><Icon name="check" /></span>}
          </div>
        ))}
      </div>

      <p className="group-label">Booking</p>
      <div className="glass track-summary">
        <div className="track-sum-row"><span>Service</span><span>{booking.serviceName}</span></div>
        <div className="track-sum-row"><span>When</span><span>{booking.date || 'TBC'}{booking.time ? ` · ${booking.time}` : ''}</span></div>
        <div className="track-sum-row"><span>Reference</span><span>{booking.id}</span></div>
        <div className="track-sum-row track-sum-total"><span>Paid</span><span>{formatZar(booking.total)}</span></div>
      </div>

      <div className="track-actions">
        <button className="help-btn help-btn--wa" onClick={onHelp}><Icon name="message" /> Get help</button>
        <button className="help-btn track-cancel" onClick={cancel}>Cancel booking</button>
      </div>
    </div>
  )
}
