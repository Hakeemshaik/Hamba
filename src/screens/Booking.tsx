import { LOAD_OPTIONS, serviceById } from '../lib/data'
import { formatZar, calculateQuote } from '../lib/quote'
import type { Booking as BookingT, LoadSize } from '../lib/types'
import Icon from '../components/Icon'
import StepHeader from '../components/StepHeader'

interface Props {
  booking: BookingT
  update: (patch: Partial<BookingT>) => void
  onBack: () => void
  onContinue: () => void
}

export default function Booking({ booking, update, onBack, onContinue }: Props) {
  const service = serviceById(booking.service)
  const quote = calculateQuote(booking)
  const today = new Date().toISOString().split('T')[0]

  const ready =
    !!booking.pickup.trim() &&
    !!booking.dropoff.trim() &&
    !!booking.date &&
    !!booking.load

  // Tell people exactly what's still needed instead of a generic disabled button.
  const missing: string[] = []
  if (!booking.pickup.trim() || !booking.dropoff.trim()) missing.push('addresses')
  if (!booking.date) missing.push('date')
  if (!booking.load) missing.push('load size')

  return (
    <div className="screen">
      <StepHeader step={1} title={service?.name ?? 'Your move'} onBack={onBack} />

      <div className="form-stack">
        <p className="group-label">Route</p>
        <div className="glass field-group">
          <label className="field field--icon">
            <span className="field-marker field-marker--a" aria-hidden>
              <Icon name="pin" />
            </span>
            <span className="field-body">
              <span className="field-label">Pickup address</span>
              <input
                className="field-input"
                placeholder="From — street, suburb, city"
                autoComplete="off"
                value={booking.pickup}
                onChange={(e) => update({ pickup: e.target.value })}
              />
            </span>
          </label>
          <div className="field-divider" />
          <label className="field field--icon">
            <span className="field-marker field-marker--b" aria-hidden>
              <Icon name="pin" />
            </span>
            <span className="field-body">
              <span className="field-label">Drop-off address</span>
              <input
                className="field-input"
                placeholder="To — street, suburb, city"
                autoComplete="off"
                value={booking.dropoff}
                onChange={(e) => update({ dropoff: e.target.value })}
              />
            </span>
          </label>
        </div>

        <p className="group-label">When</p>
        <div className="glass field-group row2">
          <label className="field">
            <span className="field-label">Date</span>
            <input
              className="field-input"
              type="date"
              min={today}
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

        <p className="group-label">What are we moving?</p>
        <div className="load-grid">
          {LOAD_OPTIONS.map((l) => (
            <button
              key={l.id}
              className={`glass load-card ${booking.load === l.id ? 'load-card--on' : ''}`}
              onClick={() => update({ load: l.id as LoadSize })}
              aria-pressed={booking.load === l.id}
            >
              <span className="load-top">
                <span className="load-label">{l.label}</span>
                {booking.load === l.id && (
                  <span className="load-check" aria-hidden>
                    <Icon name="check" />
                  </span>
                )}
              </span>
              <span className="load-detail">{l.detail}</span>
            </button>
          ))}
        </div>

        <p className="group-label">Extras</p>
        <div className="glass field-group helpers-row">
          <div>
            <div className="field-label">Loading helpers</div>
            <div className="helpers-sub">Extra hands to load &amp; carry</div>
          </div>
          <div className="stepper" role="group" aria-label="Number of helpers">
            <button
              onClick={() => update({ helpers: Math.max(0, booking.helpers - 1) })}
              aria-label="Fewer helpers"
              disabled={booking.helpers === 0}
            >
              −
            </button>
            <span>{booking.helpers}</span>
            <button
              onClick={() => update({ helpers: Math.min(6, booking.helpers + 1) })}
              aria-label="More helpers"
              disabled={booking.helpers === 6}
            >
              +
            </button>
          </div>
        </div>

        <label className="glass field-group">
          <span className="field-label">Notes for the driver (optional)</span>
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
          {ready ? 'Continue to payment' : `Add ${missing[0]} to continue`}
        </button>
      </div>
    </div>
  )
}
