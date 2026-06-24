import { LOAD_OPTIONS, serviceById } from '../lib/data'
import { formatZar, calculateQuote } from '../lib/quote'
import type { Booking as BookingT, LoadSize } from '../lib/types'
import Icon from '../components/Icon'

interface Props {
  booking: BookingT
  update: (patch: Partial<BookingT>) => void
  onBack: () => void
  onContinue: () => void
}

export default function Booking({ booking, update, onBack, onContinue }: Props) {
  const service = serviceById(booking.service)
  const quote = calculateQuote(booking)
  const ready =
    !!booking.pickup.trim() &&
    !!booking.dropoff.trim() &&
    !!booking.date &&
    !!booking.load

  return (
    <div className="screen">
      <div className="topbar">
        <button className="ghost-btn" onClick={onBack} aria-label="Back">
          <Icon name="back" />
        </button>
        <span className="topbar-title">{service?.name}</span>
        <span style={{ width: 36 }} />
      </div>

      <div className="form-stack">
        <div className="glass field-group">
          <label className="field">
            <span className="field-label">Pickup</span>
            <input
              className="field-input"
              placeholder="From — street, suburb, city"
              value={booking.pickup}
              onChange={(e) => update({ pickup: e.target.value })}
            />
          </label>
          <div className="field-divider" />
          <label className="field">
            <span className="field-label">Drop-off</span>
            <input
              className="field-input"
              placeholder="To — street, suburb, city"
              value={booking.dropoff}
              onChange={(e) => update({ dropoff: e.target.value })}
            />
          </label>
        </div>

        <div className="glass field-group row2">
          <label className="field">
            <span className="field-label">Date</span>
            <input
              className="field-input"
              type="date"
              value={booking.date}
              onChange={(e) => update({ date: e.target.value })}
            />
          </label>
          <div className="field-divider field-divider--v" />
          <label className="field">
            <span className="field-label">Time</span>
            <input
              className="field-input"
              type="time"
              value={booking.time}
              onChange={(e) => update({ time: e.target.value })}
            />
          </label>
        </div>

        <div className="section-label">Load size</div>
        <div className="load-grid">
          {LOAD_OPTIONS.map((l) => (
            <button
              key={l.id}
              className={`glass load-card ${booking.load === l.id ? 'load-card--on' : ''}`}
              onClick={() => update({ load: l.id as LoadSize })}
            >
              <span className="load-top">
                <span className="load-label">{l.label}</span>
                {booking.load === l.id && <span className="load-check"><Icon name="check" /></span>}
              </span>
              <span className="load-detail">{l.detail}</span>
            </button>
          ))}
        </div>

        <div className="glass field-group helpers-row">
          <div>
            <div className="field-label">Loading helpers</div>
            <div className="helpers-sub">Hands to load & carry</div>
          </div>
          <div className="stepper">
            <button onClick={() => update({ helpers: Math.max(0, booking.helpers - 1) })}>−</button>
            <span>{booking.helpers}</span>
            <button onClick={() => update({ helpers: Math.min(6, booking.helpers + 1) })}>+</button>
          </div>
        </div>

        <label className="glass field-group">
          <span className="field-label">Notes (optional)</span>
          <textarea
            className="field-input field-textarea"
            placeholder="Stairs, fragile items, gate codes…"
            value={booking.notes}
            onChange={(e) => update({ notes: e.target.value })}
          />
        </label>
      </div>

      <div className="sticky-cta">
        <div className="cta-summary">
          <span>Estimated total</span>
          <strong>{quote.total ? formatZar(quote.total) : '—'}</strong>
        </div>
        <button className="primary-btn" disabled={!ready} onClick={onContinue}>
          {ready ? 'Continue to payment' : 'Fill in your move'}
        </button>
      </div>
    </div>
  )
}
