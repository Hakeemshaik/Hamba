import { useMemo, useState } from 'react'
import DynamicIsland, { type IslandState } from './components/DynamicIsland'
import Home from './screens/Home'
import Booking from './screens/Booking'
import Payment from './screens/Payment'
import Tracking from './screens/Tracking'
import { serviceById } from './lib/data'
import { calculateQuote, estimateDistance, formatZar } from './lib/quote'
import type { Booking as BookingT, PaymentMethod, ServiceId } from './lib/types'

type Step = 'home' | 'booking' | 'payment' | 'tracking'

const EMPTY: BookingT = {
  service: null,
  pickup: '',
  dropoff: '',
  date: '',
  time: '',
  load: null,
  distanceKm: 0,
  notes: '',
  helpers: 0,
}

export default function App() {
  const [step, setStep] = useState<Step>('home')
  const [booking, setBooking] = useState<BookingT>(EMPTY)
  const [processing, setProcessing] = useState<string | null>(null)
  const [paidWith, setPaidWith] = useState<PaymentMethod | null>(null)
  const [justPaid, setJustPaid] = useState(false)

  const update = (patch: Partial<BookingT>) => {
    setBooking((prev) => {
      const next = { ...prev, ...patch }
      if (patch.pickup !== undefined || patch.dropoff !== undefined) {
        next.distanceKm = estimateDistance(next.pickup, next.dropoff)
      }
      return next
    })
  }

  const selectService = (id: ServiceId) => {
    setBooking({ ...EMPTY, service: id })
    setStep('booking')
  }

  const quote = useMemo(() => calculateQuote(booking), [booking])

  const island: IslandState = useMemo(() => {
    if (processing) return { kind: 'processing', label: processing }
    if (step === 'tracking') {
      return justPaid
        ? { kind: 'success', label: 'Payment approved' }
        : { kind: 'tracking', eta: '18 min', status: 'Driver on the way', progress: 62 }
    }
    if ((step === 'booking' || step === 'payment') && quote.total > 0) {
      const service = serviceById(booking.service)
      return { kind: 'quote', total: formatZar(quote.total), service: service?.name ?? 'Quote' }
    }
    return { kind: 'idle' }
  }, [processing, step, quote.total, booking.service, justPaid])

  return (
    <div className="app">
      <div className="bg-orbs" aria-hidden>
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>

      <DynamicIsland state={island} />

      <main className="app-main">
        {step === 'home' && <Home onSelect={selectService} />}

        {step === 'booking' && (
          <Booking
            booking={booking}
            update={update}
            onBack={() => setStep('home')}
            onContinue={() => setStep('payment')}
          />
        )}

        {step === 'payment' && (
          <Payment
            booking={booking}
            onBack={() => setStep('booking')}
            setProcessing={setProcessing}
            onPaid={(m) => {
              setPaidWith(m)
              setJustPaid(true)
              setStep('tracking')
              window.setTimeout(() => setJustPaid(false), 2200)
            }}
          />
        )}

        {step === 'tracking' && (
          <Tracking
            booking={booking}
            method={paidWith}
            onDone={() => {
              setBooking(EMPTY)
              setPaidWith(null)
              setStep('home')
            }}
          />
        )}
      </main>
    </div>
  )
}
