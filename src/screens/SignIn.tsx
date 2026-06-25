import { useState } from 'react'
import { LogoMark } from '../components/Logo'
import type { Customer } from '../lib/types'

interface Props {
  onSignIn: (c: Customer) => void
}

export default function SignIn({ onSignIn }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const ready = name.trim().length > 1 && phone.trim().length >= 9

  return (
    <div className="screen signin">
      <div className="signin-hero">
        <span className="signin-badge" aria-hidden><LogoMark size={56} /></span>
        <span className="wordmark signin-word">Hamba</span>
        <h1 className="signin-title">Move anything,<br />the easy way.</h1>
        <p className="signin-sub">Create your account to book moves, deliveries and rubble removal across Johannesburg.</p>
      </div>

      <div className="form-stack signin-form">
        <label className="glass field-group">
          <span className="field-label">Full name</span>
          <input
            className="field-input"
            placeholder="Your full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="glass field-group">
          <span className="field-label">Mobile number</span>
          <input
            className="field-input"
            type="tel"
            inputMode="tel"
            placeholder="Mobile number"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className="glass field-group">
          <span className="field-label">Email (optional)</span>
          <input
            className="field-input"
            type="email"
            inputMode="email"
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <div className="sticky-cta">
        <p className="secure-note">Your details are saved on this device so you don't re-enter them.</p>
        <button
          className="primary-btn"
          disabled={!ready}
          onClick={() => onSignIn({ name: name.trim(), phone: phone.trim(), email: email.trim(), address: '' })}
        >
          {ready ? 'Create account & continue' : 'Enter your name & number'}
        </button>
      </div>
    </div>
  )
}
