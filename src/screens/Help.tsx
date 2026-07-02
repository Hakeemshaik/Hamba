import Icon from '../components/Icon'

const FAQ = [
  { q: 'How is my price worked out?', a: 'Your quote is based on the service, distance, load size and any helpers. It’s an estimate — your driver confirms the final price before the move begins.' },
  { q: 'Are drivers checked?', a: 'Every driver signs an agreement and is reviewed before joining. Verification and cover badges only show once they’re confirmed for that driver.' },
  { q: 'What if I need to cancel?', a: 'Message us as early as you can. Cancellations made well before your slot are free; late cancellations may carry a small fee.' },
  { q: 'Which areas do you cover?', a: 'We’re live in Johannesburg, with Pretoria and Cape Town coming soon.' },
]

interface Props {
  onBack: () => void
}

export default function Help({ onBack }: Props) {
  return (
    <div className="screen screen--push">
      <div className="topbar">
        <button className="ghost-btn" onClick={onBack} aria-label="Back">
          <Icon name="back" />
        </button>
        <span className="topbar-title">Help &amp; support</span>
        <span className="ghost-spacer" />
      </div>
      <p className="lede">We’re here when you need us. Reach a real person, or browse the common questions below.</p>

      <div className="help-actions">
        <a className="help-btn help-btn--wa" href="https://wa.me/27000000000" target="_blank" rel="noopener">
          <Icon name="message" /> WhatsApp us
        </a>
        <a className="help-btn" href="tel:+27000000000">
          <Icon name="phone" /> Call support
        </a>
      </div>

      <p className="group-label">Common questions</p>
      <div className="faq-list">
        {FAQ.map((f) => (
          <details key={f.q} className="glass faq">
            <summary>{f.q}<span className="faq-mark"><Icon name="chevron" /></span></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
