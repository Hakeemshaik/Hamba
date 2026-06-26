import { useState } from 'react'
import { persistMessage } from '../lib/db'
import { SUPPORT, whatsappLink, telLink, mailLink } from '../lib/contact'
import Icon from '../components/Icon'

interface Props {
  name: string
  onBack: () => void
}

export default function ContactUs({ name, onBack }: Props) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const channels = [
    { icon: 'message', label: 'WhatsApp', value: 'Chat to our team', href: whatsappLink },
    { icon: 'phone', label: 'Call us', value: SUPPORT.phone, href: telLink },
    { icon: 'mail', label: 'Email', value: SUPPORT.email, href: mailLink },
  ]

  const send = () => {
    persistMessage({ id: 'MSG-' + Date.now().toString().slice(-6), name, message: message.trim(), createdAt: Date.now() })
    setMessage('')
    setSent(true)
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="ghost-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
        <span className="topbar-title">Contact us</span>
        <span className="ghost-spacer" />
      </div>

      <p className="lede">Reach us any way you like — we’re open {SUPPORT.hours}.</p>

      <div className="contact-list">
        {channels.map((c) => (
          <a key={c.label} className="glass contact-row" href={c.href} target="_blank" rel="noopener">
            <span className="contact-ico"><Icon name={c.icon} /></span>
            <span className="contact-text">
              <span className="contact-label">{c.label}</span>
              <span className="contact-value">{c.value}</span>
            </span>
            <span className="menu-chev"><Icon name="arrow" /></span>
          </a>
        ))}
      </div>

      <p className="group-label">Send us a message</p>
      {sent ? (
        <div className="glass contact-sent">
          <span className="contact-sent-tick"><Icon name="check" /></span>
          <div>
            <strong>Message sent</strong>
            <span>We’ll get back to you shortly.</span>
          </div>
        </div>
      ) : (
        <>
          <label className="glass field-group">
            <span className="field-label">Your message</span>
            <textarea
              className="field-input field-textarea"
              placeholder="How can we help?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <button className="primary-btn contact-send" disabled={message.trim().length < 5} onClick={send}>
            Send message
          </button>
        </>
      )}
    </div>
  )
}
