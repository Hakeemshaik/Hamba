import { useState } from 'react'
import ProcessingOverlay from './components/ProcessingOverlay'
import TabBar, { type Tab } from './components/TabBar'
import Home from './screens/Home'
import Booking from './screens/Booking'
import Payment from './screens/Payment'
import Tracking from './screens/Tracking'
import Profile from './screens/Profile'
import EditProfile from './screens/EditProfile'
import Activity from './screens/Activity'
import Help from './screens/Help'
import { estimateDistance } from './lib/quote'
import { SERVICES } from './lib/data'
import type { Booking as BookingT, Customer, PaymentMethod, ServiceId } from './lib/types'

type Screen = Tab | 'editProfile' | 'booking' | 'payment' | 'tracking'

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

const DEFAULT_PROFILE: Customer = {
  name: 'Lerato Khumalo',
  phone: '+27 82 145 9930',
  email: 'lerato@email.co.za',
  address: 'Bryanston, Johannesburg',
}

const TAB_SCREENS: Screen[] = ['home', 'activity', 'help', 'profile']

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [booking, setBooking] = useState<BookingT>(EMPTY)
  const [processing, setProcessing] = useState<string | null>(null)
  const [paidWith, setPaidWith] = useState<PaymentMethod | null>(null)
  const [profile, setProfile] = useState<Customer>(DEFAULT_PROFILE)

  const update = (patch: Partial<BookingT>) => {
    setBooking((prev) => {
      const next = { ...prev, ...patch }
      if (patch.pickup !== undefined || patch.dropoff !== undefined) {
        next.distanceKm = estimateDistance(next.pickup, next.dropoff)
      }
      return next
    })
  }

  const startBooking = (id: ServiceId) => {
    setBooking({ ...EMPTY, service: id })
    setScreen('booking')
  }

  const showTabs = TAB_SCREENS.includes(screen)

  return (
    <div className="app">
      <ProcessingOverlay label={processing} />

      <main className="app-main">
        {screen === 'home' && (
          <Home name={profile.name} onSelect={startBooking} onProfile={() => setScreen('profile')} />
        )}

        {screen === 'activity' && <Activity onNew={() => startBooking(SERVICES[0].id)} />}

        {screen === 'help' && <Help />}

        {screen === 'profile' && (
          <Profile
            profile={profile}
            onEdit={() => setScreen('editProfile')}
            onActivity={() => setScreen('activity')}
            onHelp={() => setScreen('help')}
          />
        )}

        {screen === 'editProfile' && (
          <EditProfile
            profile={profile}
            onBack={() => setScreen('profile')}
            onSave={(c) => {
              setProfile(c)
              setScreen('profile')
            }}
          />
        )}

        {screen === 'booking' && (
          <Booking
            booking={booking}
            update={update}
            onBack={() => setScreen('home')}
            onContinue={() => setScreen('payment')}
          />
        )}

        {screen === 'payment' && (
          <Payment
            booking={booking}
            onBack={() => setScreen('booking')}
            setProcessing={setProcessing}
            onPaid={(m) => {
              setPaidWith(m)
              setScreen('tracking')
            }}
          />
        )}

        {screen === 'tracking' && (
          <Tracking
            booking={booking}
            method={paidWith}
            onDone={() => {
              setBooking(EMPTY)
              setPaidWith(null)
              setScreen('home')
            }}
          />
        )}
      </main>

      {showTabs && (
        <TabBar
          active={screen as Tab}
          onTab={(t) => setScreen(t)}
          onNew={() => startBooking(SERVICES[0].id)}
        />
      )}
    </div>
  )
}
