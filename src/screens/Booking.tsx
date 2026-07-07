import { useState } from 'react'
import { LOAD_OPTIONS, serviceById } from '../lib/data'
import { formatZar, calculateQuote } from '../lib/quote'
import { useCountUp } from '../lib/useCountUp'
import type { Booking as BookingT, LoadSize } from '../lib/types'
import Icon from '../components/Icon'
import StepHeader from '../components/StepHeader'
import AddressInput from '../components/AddressInput'

interface Props {
  booking: BookingT
  update: (patch: Partial<BookingT>) => void
  recents: string[]
  onBack: () => void
  onContinue: () => void
}

export default function Booking({ booking, update, recents, onBack, onContinue }: Props) {
  const service = serviceById(booking.service)
  const quote = calculateQuote(booking)
  const animatedTotal = useCountUp(quote.total)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const asap = booking.time === 'ASAP'
  const routeSet = !!booking.pickup.trim() && !!booking.dropoff.trim() && booking.distanceKm > 0
  // Upfront price per load size, Uber vehicle-class style.
  const priceFor = (load: LoadSize) => calculateQuote({ ...booking, load }).total

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
    <div className="screen screen--push">
      <StepHeader step={1} title={service?.name ?? 'Your move'} onBack={onBack} />

      <div className="form-stack">
        <p className="group-label">Route</p>
        <AddressInput
          label="Pickup address"
          marker="a"
          placeholder="From — suburb or area"
          value={booking.pickup}
          recents={recents}
          onChange={(v) => update({ pickup: v })}
        />
        <AddressInput
          label="Drop-off address"
          marker="b"
          placeholder="To — suburb or area"
          value={booking.dropoff}
          recents={recents}
          onChange={(v) => update({ dropoff: v })}
        />

        <p className="group-label">When</p>
        <div className="cat-wrap">
          <button
            className={`cat-chip ${asap ? 'cat-chip--on' : ''}`}
            onClick={() => update({ date: today, time: 'ASAP' })}
            aria-pressed={asap}
          >
            As soon as possible
          </button>
          <button
            className={`cat-chip ${!asap && booking.date ? 'cat-chip--on' : ''}`}
            onClick={() => update({ date: '', time: '' })}
            aria-pressed={!asap && !!booking.date}
          >
            Schedule
          </button>
        </div>
        {!asap && (
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
        )}

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
              {routeSet && <span className="load-price">{formatZar(priceFor(l.id as LoadSize))}</span>}
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
            placeholder="Stairs, fragile items, parking access…"
            value={booking.notes}
            onChange={(e) => update({ notes: e.target.value })}
          />
        </label>
      </div>

      <div className="sticky-cta">
        {showBreakdown && quote.total > 0 && (
          <div className="glass breakdown">
            <div className="breakdown-row"><span>Call-out</span><span>{formatZar(quote.base)}</span></div>
            <div className="breakdown-row"><span>Distance · ~{Math.round(booking.distanceKm)} km</span><span>{formatZar(quote.distance)}</span></div>
            {quote.loadAdjustment > 0 && <div className="breakdown-row"><span>Load size</span><span>{formatZar(quote.loadAdjustment)}</span></div>}
            {quote.helpers > 0 && <div className="breakdown-row"><span>Helpers ({booking.helpers})</span><span>{formatZar(quote.helpers)}</span></div>}
          </div>
        )}
        <button
          className="cta-summary cta-summary--tap"
          onClick={() => setShowBreakdown((v) => !v)}
          disabled={!quote.total}
          aria-expanded={showBreakdown}
        >
          <span>Estimated total {quote.total > 0 && <em className="cta-hint">{showBreakdown ? 'hide' : 'see'} breakdown</em>}</span>
          <strong>{quote.total ? formatZar(animatedTotal) : '—'}</strong>
        </button>
        <button className="primary-btn" disabled={!ready} onClick={onContinue}>
          {ready ? 'Continue to payment' : `Add ${missing[0]} to continue`}
        </button>
      </div>
    </div>
  )
}
