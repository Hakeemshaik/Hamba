import { useState } from 'react'
import ProcessingOverlay from './components/ProcessingOverlay'
import TabBar, { type Tab } from './components/TabBar'
import SignIn from './screens/SignIn'
import Home from './screens/Home'
import Booking from './screens/Booking'
import Payment from './screens/Payment'
import Track from './screens/Track'
import Profile from './screens/Profile'
import EditProfile from './screens/EditProfile'
import Activity from './screens/Activity'
import Help from './screens/Help'
import { estimateDistance, calculateQuote } from './lib/quote'
import { SERVICES, serviceById } from './lib/data'
import { persistBooking, persistCustomer } from './lib/db'
import { loadProfile, saveProfile, clearAccount, topAddresses, recordAddress } from './lib/storage'
import type { Booking as BookingT, Customer, ServiceId } from './lib/types'

type Screen = Tab | 'signin' | 'editProfile' | 'help' | 'booking' | 'payment'

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

const TAB_SCREENS: Screen[] = ['home', 'track', 'activity', 'profile']

export default function App() {
  const [profile, setProfile] = useState<Customer | null>(() => loadProfile())
  const [screen, setScreen] = useState<Screen>(() => (loadProfile() ? 'home' : 'signin'))
  const [booking, setBooking] = useState<BookingT>(EMPTY)
  const [processing, setProcessing] = useState<string | null>(null)
  const [justBooked, setJustBooked] = useState(false)
  const [recents, setRecents] = useState<string[]>(() => topAddresses())

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
    setJustBooked(false)
    setBooking({ ...EMPTY, service: id })
    setScreen('booking')
  }

  const signIn = (c: Customer) => {
    saveProfile(c)
    persistCustomer(c)
    setProfile(c)
    setScreen('home')
  }

  const logout = () => {
    clearAccount()
    setProfile(null)
    setScreen('signin')
  }

  const goToPayment = () => {
    recordAddress(booking.pickup)
    setRecents(recordAddress(booking.dropoff).map((a) => a.value))
    setScreen('payment')
  }

  const showTabs = TAB_SCREENS.includes(screen)

  if (screen === 'signin' || !profile) {
    return (
      <div className="app">
        <main className="app-main">
          <SignIn onSignIn={signIn} />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <ProcessingOverlay label={processing} />

      <main className="app-main">
        {screen === 'home' && (
          <Home name={profile.name} onSelect={startBooking} onProfile={() => setScreen('profile')} />
        )}

        {screen === 'track' && (
          <Track
            justBooked={justBooked}
            onBook={() => setScreen('home')}
            onHelp={() => setScreen('help')}
          />
        )}

        {screen === 'activity' && <Activity onNew={() => startBooking(SERVICES[0].id)} />}

        {screen === 'help' && <Help onBack={() => setScreen('profile')} />}

        {screen === 'profile' && (
          <Profile
            profile={profile}
            onEdit={() => setScreen('editProfile')}
            onActivity={() => setScreen('activity')}
            onHelp={() => setScreen('help')}
            onLogout={logout}
          />
        )}

        {screen === 'editProfile' && (
          <EditProfile
            profile={profile}
            onBack={() => setScreen('profile')}
            onSave={(c) => {
              saveProfile(c)
              setProfile(c)
              setScreen('profile')
            }}
          />
        )}

        {screen === 'booking' && (
          <Booking
            booking={booking}
            update={update}
            recents={recents}
            onBack={() => setScreen('home')}
            onContinue={goToPayment}
          />
        )}

        {screen === 'payment' && (
          <Payment
            booking={booking}
            onBack={() => setScreen('booking')}
            setProcessing={setProcessing}
            onPaid={(m) => {
              const svc = serviceById(booking.service)
              persistBooking({
                id: 'HMB-' + Date.now().toString().slice(-6),
                serviceId: booking.service ?? '',
                serviceName: svc?.name ?? 'Move',
                icon: svc?.icon ?? 'boxes',
                pickup: booking.pickup,
                dropoff: booking.dropoff,
                date: booking.date,
                time: booking.time,
                total: calculateQuote(booking).total,
                method: m,
                status: 'upcoming',
                createdAt: Date.now(),
              })
              setJustBooked(true)
              setScreen('track')
            }}
          />
        )}
      </main>

      {showTabs && (
        <TabBar
          active={screen as Tab}
          onTab={(t) => {
            setJustBooked(false)
            setScreen(t)
          }}
          onNew={() => startBooking(SERVICES[0].id)}
        />
      )}
    </div>
  )
}
