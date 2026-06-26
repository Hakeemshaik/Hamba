import { useState } from 'react'
import { LogoMark } from '../components/Logo'
import Icon from '../components/Icon'
import type { Role } from '../lib/types'

interface Props {
  onSignIn: (role: Role, basic: { name: string; phone: string; email: string }) => void
}

export default function SignIn({ onSignIn }: Props) {
  const [role, setRole] = useState<Role>('customer')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const ready = name.trim().length > 1 && phone.trim().length >= 9
  const isDriver = role === 'driver'

  return (
    <div className="screen signin">
      <div className="signin-hero">
        <span className="signin-badge" aria-hidden><LogoMark size={56} /></span>
        <span className="wordmark signin-word">Hamba</span>
        <h1 className="signin-title">{isDriver ? 'Drive with Hamba.' : 'Move anything,\nthe easy way.'}</h1>
        <p className="signin-sub">
          {isDriver
            ? 'Register your vehicle, get verified, and start accepting jobs across Johannesburg.'
            : 'Create your account to book moves, deliveries and rubble removal across Johannesburg.'}
        </p>
      </div>

      <div className="role-picker" role="tablist" aria-label="Account type">
        <button className={`glass role-card ${!isDriver ? 'role-card--on' : ''}`} onClick={() => setRole('customer')} aria-selected={!isDriver}>
          <span className="role-ico"><Icon name="box" /></span>
          <span className="role-name">Book a move</span>
          <span className="role-sub">I’m a customer</span>
        </button>
        <button className={`glass role-card ${isDriver ? 'role-card--on' : ''}`} onClick={() => setRole('driver')} aria-selected={isDriver}>
          <span className="role-ico"><Icon name="truck" /></span>
          <span className="role-name">Drive with Hamba</span>
          <span className="role-sub">I’m a driver</span>
        </button>
      </div>

      <div className="form-stack signin-form">
        <label className="glass field-group">
          <span className="field-label">Full name</span>
          <input className="field-input" placeholder="Your full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="glass field-group">
          <span className="field-label">Mobile number</span>
          <input className="field-input" type="tel" inputMode="tel" placeholder="Mobile number" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="glass field-group">
          <span className="field-label">Email (optional)</span>
          <input className="field-input" type="email" inputMode="email" placeholder="Email address" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>

      <div className="sticky-cta">
        <p className="secure-note">Your details are saved on this device so you don’t re-enter them.</p>
        <button
          className="primary-btn"
          disabled={!ready}
          onClick={() => onSignIn(role, { name: name.trim(), phone: phone.trim(), email: email.trim() })}
        >
          {!ready ? 'Enter your name & number' : isDriver ? 'Continue to driver application' : 'Create account & continue'}
        </button>
      </div>
    </div>
  )
}
