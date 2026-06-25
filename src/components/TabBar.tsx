import Icon from './Icon'

export type Tab = 'home' | 'track' | 'activity' | 'profile'

interface Props {
  active: Tab
  onTab: (t: Tab) => void
  onNew: () => void
}

const LEFT: { id: Tab; icon: string; label: string }[] = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'track', icon: 'pin', label: 'Track' },
]
const RIGHT: { id: Tab; icon: string; label: string }[] = [
  { id: 'activity', icon: 'list', label: 'Trips' },
  { id: 'profile', icon: 'user', label: 'Profile' },
]

export default function TabBar({ active, onTab, onNew }: Props) {
  const item = (t: { id: Tab; icon: string; label: string }) => (
    <button
      key={t.id}
      className={`tab ${active === t.id ? 'tab--on' : ''}`}
      onClick={() => onTab(t.id)}
      aria-label={t.label}
      aria-current={active === t.id}
    >
      <Icon name={t.icon} />
      <span>{t.label}</span>
    </button>
  )

  return (
    <nav className="tabbar glass-dark" aria-label="Primary">
      {LEFT.map(item)}
      <button className="tab-fab" onClick={onNew} aria-label="New booking">
        <Icon name="plus" />
      </button>
      {RIGHT.map(item)}
    </nav>
  )
}
