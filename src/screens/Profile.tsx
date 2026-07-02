import Icon from '../components/Icon'
import Illustration from '../components/Illustration'
import type { Customer } from '../lib/types'

interface Props {
  profile: Customer
  onEdit: () => void
  onActivity: () => void
  onHelp: () => void
  onContact: () => void
  onComplaint: () => void
  onNotifications: () => void
  onSettings: () => void
  onLogout: () => void
}

export default function Profile({ profile, onEdit, onActivity, onHelp, onContact, onComplaint, onNotifications, onSettings, onLogout }: Props) {
  const rows = [
    { icon: 'user', label: 'Personal information', go: onEdit },
    { icon: 'list', label: 'My bookings', go: onActivity },
    { icon: 'bell', label: 'Notifications', go: onNotifications },
    { icon: 'settings', label: 'Settings', go: onSettings },
    { icon: 'mail', label: 'Contact us', go: onContact },
    { icon: 'alert', label: 'Report a problem', go: onComplaint },
    { icon: 'help', label: 'Help & support', go: onHelp },
  ]

  return (
    <div className="screen screen--tabbed">
      <div className="profile-hero">
        <button className="profile-avatar" onClick={onEdit} aria-label="Edit profile photo">
          <Illustration name="avatar" />
        </button>
        <div>
          <h1 className="profile-name">{profile.name || 'Your name'}</h1>
          <p className="profile-mail">{profile.email || 'Add your details'}</p>
        </div>
        <button className="edit-link" onClick={onEdit}>Edit</button>
      </div>

      <div className="menu-list">
        {rows.map((r, i) => (
          <button
            key={r.label}
            className="glass menu-row"
            style={{ animationDelay: `${i * 45}ms` }}
            onClick={r.go}
          >
            <span className="menu-ico"><Icon name={r.icon} /></span>
            <span className="menu-label">{r.label}</span>
            <span className="menu-chev"><Icon name="chevron" /></span>
          </button>
        ))}
      </div>

      <button className="glass menu-row menu-row--danger" onClick={onLogout}>
        <span className="menu-ico"><Icon name="logout" /></span>
        <span className="menu-label">Log out</span>
      </button>
    </div>
  )
}
