import { useState } from 'react'
import { saveDriver } from '../lib/storage'
import { persistDriver } from '../lib/db'
import type { Driver } from '../lib/types'
import Icon from '../components/Icon'
import DriverOnboarding from './DriverOnboarding'
import DriverHome from './DriverHome'
import DriverJobs from './DriverJobs'
import DriverEarnings from './DriverEarnings'
import DriverProfile from './DriverProfile'

interface Props {
  initialDriver: Driver
  demo?: boolean
  onLogout: () => void
}

type DScreen = 'home' | 'jobs' | 'earnings' | 'profile' | 'edit'

const TABS: { id: DScreen; icon: string; label: string }[] = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'jobs', icon: 'list', label: 'Jobs' },
  { id: 'earnings', icon: 'card', label: 'Earnings' },
  { id: 'profile', icon: 'user', label: 'Profile' },
]

export default function DriverApp({ initialDriver, demo, onLogout }: Props) {
  const [driver, setDriver] = useState<Driver>(initialDriver)
  const [screen, setScreen] = useState<DScreen>('home')
  const [online, setOnline] = useState(demo ?? false)

  const save = (d: Driver) => {
    if (!demo) {
      saveDriver(d)
      persistDriver(d)
    }
    setDriver(d)
  }

  const demoBar = demo ? (
    <div className="demo-bar" role="status">
      <span>Demo mode — sample data for preview only</span>
      <button onClick={onLogout}>Exit</button>
    </div>
  ) : null

  if (driver.status === 'incomplete') {
    return (
      <div className="app">
        {demoBar}
        <main className="app-main">
          <DriverOnboarding
            initial={driver}
            onExit={onLogout}
            onSubmit={(d) => {
              save(d)
              setScreen('home')
            }}
          />
        </main>
      </div>
    )
  }

  if (screen === 'edit') {
    return (
      <div className="app">
        {demoBar}
        <main className="app-main">
          <DriverOnboarding
            initial={driver}
            editing
            onExit={() => setScreen('profile')}
            onSubmit={(d) => {
              save({ ...d, status: driver.status })
              setScreen('profile')
            }}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      {demoBar}
      <main className={`app-main ${demo ? 'app-main--demo' : ''}`}>
        {screen === 'home' && (
          <DriverHome driver={driver} online={online} demo={demo} onToggleOnline={() => setOnline((o) => !o)} onJobs={() => setScreen('jobs')} />
        )}
        {screen === 'jobs' && <DriverJobs driver={driver} demo={demo} />}
        {screen === 'earnings' && <DriverEarnings driver={driver} demo={demo} />}
        {screen === 'profile' && <DriverProfile driver={driver} onEdit={() => setScreen('edit')} onLogout={onLogout} />}
      </main>

      <nav className="tabbar glass-dark" aria-label="Driver navigation">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${screen === t.id ? 'tab--on' : ''}`} onClick={() => setScreen(t.id)} aria-current={screen === t.id}>
            <Icon name={t.icon} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
