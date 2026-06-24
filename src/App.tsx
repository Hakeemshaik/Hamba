import { useState } from 'react'
import ProcessingOverlay from './components/ProcessingOverlay'
import Home from './screens/Home'
import Booking from './screens/Booking'
import Payment from './screens/Payment'
import Tracking from './screens/Tracking'
import { estimateDistance } from './lib/quote'
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

  return (
    <div className="app">
      <div className="bg-orbs" aria-hidden>
        <span className="orb orb-1" />
        <span className="orb orb-2" />
      </div>

      <ProcessingOverlay label={processing} />

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
              setStep('tracking')
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
