import { useState } from 'react'
import { formatZar, calculateQuote } from '../lib/quote'
import { serviceById, loadById } from '../lib/data'
import type { Booking, PaymentMethod, Quote } from '../lib/types'
import Icon from '../components/Icon'
import Illustration from '../components/Illustration'
import StepHeader from '../components/StepHeader'

interface Props {
  booking: Booking
  onBack: () => void
  onPaid: (method: PaymentMethod) => void
  onInsurance: () => void
  setProcessing: (label: string | null) => void
}

const METHODS: { id: PaymentMethod; label: string; sub: string; icon: string }[] = [
  { id: 'tap', label: 'Tap to pay', sub: 'Card machine · all banks', icon: 'tap' },
  { id: 'card', label: 'Card', sub: 'Visa · Mastercard · Amex', icon: 'card' },
  { id: 'eft', label: 'Instant EFT', sub: 'Pay from your bank app', icon: 'bank' },
]

export default function Payment({ booking, onBack, onPaid, onInsurance, setProcessing }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('tap')
  const quote: Quote = calculateQuote(booking)
  const service = serviceById(booking.service)
  const load = loadById(booking.load)

  const pay = () => {
    const label = method === 'tap' ? 'Tap your card…' : method === 'card' ? 'Authorising…' : 'Opening bank…'
    setProcessing(label)
    // Simulated Yoco flow. Replace with the Yoco SDK / Online Checkout redirect.
    window.setTimeout(() => {
      setProcessing(method === 'tap' ? 'Hold card to reader' : 'Confirming payment')
    }, 1100)
    window.setTimeout(() => {
      setProcessing(null)
      onPaid(method)
    }, 2600)
  }

  return (
    <div className="screen screen--push">
      <StepHeader step={2} title="Payment" onBack={onBack} />

      <p className="group-label">Order summary</p>
      <div className="glass receipt">
        <div className="receipt-head">
          <span className="receipt-icon"><Illustration name={service?.icon ?? 'boxes'} /></span>
          <div>
            <div className="receipt-title">{service?.name}</div>
            <div className="receipt-sub">{load?.label} load · {Math.round(booking.distanceKm)} km</div>
          </div>
        </div>
        <div className="receipt-lines">
          <Line k="Call-out" v={formatZar(quote.base)} />
          <Line k="Distance" v={formatZar(quote.distance)} />
          {quote.loadAdjustment > 0 && <Line k="Load size" v={formatZar(quote.loadAdjustment)} />}
          {quote.helpers > 0 && <Line k={`Helpers (${booking.helpers})`} v={formatZar(quote.helpers)} />}
        </div>
        <div className="receipt-total">
          <span>Estimated total</span>
          <strong>{formatZar(quote.total)}</strong>
        </div>
        <p className="estimate-note">Estimate — your driver confirms the final price before the move begins.</p>
      </div>

      <p className="group-label">Pay with</p>
      <div className="method-list">
        {METHODS.map((m) => (
          <button
            key={m.id}
            className={`glass method-card ${method === m.id ? 'method-card--on' : ''}`}
            onClick={() => setMethod(m.id)}
          >
            <span className="method-icon"><Illustration name={m.icon} /></span>
            <span className="method-text">
              <span className="method-label">{m.label}</span>
              <span className="method-sub">{m.sub}</span>
            </span>
            <span className={`radio ${method === m.id ? 'radio--on' : ''}`} />
          </button>
        ))}
      </div>

      <button className="glass insure-card" onClick={onInsurance}>
        <span className="insure-ico"><Icon name="shield" /></span>
        <span className="insure-text">
          <strong>No cover for your goods?</strong>
          <span>Leave your details — we'll call you with insurance options.</span>
        </span>
        <span className="menu-chev"><Icon name="chevron" /></span>
      </button>

      {method === 'tap' && (
        <div className="glass tap-hint">
          <div className="tap-ring" />
          <p>Hold the client's card or phone to the Yoco reader when prompted.</p>
        </div>
      )}

      <div className="sticky-cta">
        <p className="secure-note">Secured by Yoco · all SA banks accepted</p>
        <button className="primary-btn" onClick={pay}>
          Pay {formatZar(quote.total)}
        </button>
      </div>
    </div>
  )
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="receipt-line">
      <span>{k}</span>
      <span>{v}</span>
    </div>
  )
}
