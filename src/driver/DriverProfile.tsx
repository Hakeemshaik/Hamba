import Icon from '../components/Icon'
import Illustration from '../components/Illustration'
import type { Driver } from '../lib/types'

interface Props {
  driver: Driver
  onEdit: () => void
  onLogout: () => void
}

const STATUS_LABEL: Record<string, string> = {
  incomplete: 'Incomplete',
  pending: 'Under review',
  approved: 'Approved',
  suspended: 'Suspended',
}

export default function DriverProfile({ driver, onEdit, onLogout }: Props) {
  const docs = [
    { label: 'SA ID document', on: !!driver.docId },
    { label: 'Driver’s licence', on: !!driver.docLicence },
    { label: 'Vehicle licence disc', on: !!driver.docDisc },
    { label: 'Insurance certificate', on: !!driver.docInsurance },
  ]
  const acct = driver.bankAccount ? `••••${driver.bankAccount.slice(-4)}` : '—'

  return (
    <div className="screen screen--tabbed">
      <div className="profile-hero">
        <span className="profile-avatar" aria-hidden><Illustration name="driver" /></span>
        <div>
          <h1 className="profile-name">{driver.name}</h1>
          <p className="profile-mail">{driver.phone}</p>
        </div>
        <span className={`driver-badge driver-badge--${driver.status}`}>{STATUS_LABEL[driver.status]}</span>
      </div>

      <p className="group-label">Vehicle</p>
      <div className="glass info-card">
        <div className="info-row"><span>Type</span><span>{driver.vehicleType || '—'}</span></div>
        <div className="info-row"><span>Vehicle</span><span>{[driver.vehicleMake, driver.vehicleModel].filter(Boolean).join(' ') || '—'}</span></div>
        <div className="info-row"><span>Registration</span><span>{driver.vehicleReg || '—'}</span></div>
        <div className="info-row"><span>Year</span><span>{driver.vehicleYear || '—'}</span></div>
      </div>

      <p className="group-label">Licence</p>
      <div className="glass info-card">
        <div className="info-row"><span>Number</span><span>{driver.licenceNumber || '—'}</span></div>
        <div className="info-row"><span>Code</span><span>{driver.licenceCode || '—'}</span></div>
        <div className="info-row"><span>Expiry</span><span>{driver.licenceExpiry || '—'}</span></div>
      </div>

      <p className="group-label">Documents</p>
      <div className="glass info-card">
        {docs.map((d) => (
          <div key={d.label} className="info-row">
            <span>{d.label}</span>
            <span className={d.on ? 'doc-ok' : 'doc-missing'}>{d.on ? 'Uploaded' : 'Missing'}</span>
          </div>
        ))}
      </div>

      <p className="group-label">Payout</p>
      <div className="glass info-card">
        <div className="info-row"><span>Bank</span><span>{driver.bankName || '—'}</span></div>
        <div className="info-row"><span>Account</span><span>{acct}</span></div>
      </div>

      <div className="menu-list" style={{ marginTop: 14 }}>
        <button className="glass menu-row" onClick={onEdit}>
          <span className="menu-ico"><Icon name="user" /></span>
          <span className="menu-label">Edit application</span>
          <span className="menu-chev"><Icon name="chevron" /></span>
        </button>
        <button className="glass menu-row menu-row--danger" onClick={onLogout}>
          <span className="menu-ico"><Icon name="logout" /></span>
          <span className="menu-label">Log out</span>
        </button>
      </div>
    </div>
  )
}
