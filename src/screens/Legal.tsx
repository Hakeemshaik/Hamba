import { useState } from 'react'
import { SUPPORT } from '../lib/contact'
import Icon from '../components/Icon'

interface Props {
  initialTab?: 'terms' | 'privacy'
  onBack: () => void
}

export default function Legal({ initialTab = 'terms', onBack }: Props) {
  const [tab, setTab] = useState<'terms' | 'privacy'>(initialTab)

  return (
    <div className="screen screen--push">
      <div className="topbar">
        <button className="ghost-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
        <span className="topbar-title">Legal</span>
        <span className="ghost-spacer" />
      </div>

      <div className="seg" role="tablist" aria-label="Legal documents">
        <button role="tab" aria-selected={tab === 'terms'} className={`seg-opt ${tab === 'terms' ? 'seg-opt--on' : ''}`} onClick={() => setTab('terms')}>
          Terms of Service
        </button>
        <button role="tab" aria-selected={tab === 'privacy'} className={`seg-opt ${tab === 'privacy' ? 'seg-opt--on' : ''}`} onClick={() => setTab('privacy')}>
          Privacy Policy
        </button>
      </div>

      {tab === 'terms' ? (
        <div className="glass legal-doc">
          <p className="legal-updated">Last updated July 2026</p>
          <h3>1. The service</h3>
          <p>Hamba connects customers who need goods moved with independent drivers. Hamba arranges the move; the transport service itself is performed by the driver who accepts your booking.</p>
          <h3>2. Quotes and payment</h3>
          <p>Prices shown in the app are estimates based on the details you provide. The final price is confirmed with you before the move begins. Payment is processed securely; Hamba does not store your card details.</p>
          <h3>3. Bookings, changes and cancellations</h3>
          <p>You may cancel or reschedule via the app or by contacting support. Cancellations made close to the scheduled time may carry a reasonable fee. If a driver cannot be assigned, you will be refunded in full.</p>
          <h3>4. Your responsibilities</h3>
          <p>Provide accurate pickup, drop-off and load details; ensure items are ready and reasonably packed; and do not book the transport of dangerous, illegal or perishable goods, cash or jewellery.</p>
          <h3>5. Goods in transit</h3>
          <p>Cover for your goods depends on the option shown on your booking. Items packed by you, and excluded categories above, may not be covered. Report any damage within 48 hours with photos.</p>
          <h3>6. Liability</h3>
          <p>To the extent permitted by South African law, including the Consumer Protection Act, Hamba's liability is limited to the value of the affected booking or the applicable cover limit, whichever is greater.</p>
          <h3>7. Complaints</h3>
          <p>Use "Report a problem" in the app or contact {SUPPORT.phone}. We aim to respond within one business day.</p>
          <p className="legal-note">This is a plain-language summary template. Have it reviewed by a South African attorney before relying on it commercially.</p>
        </div>
      ) : (
        <div className="glass legal-doc">
          <p className="legal-updated">Last updated July 2026</p>
          <h3>1. What we collect</h3>
          <p>Your name, contact number, email, pickup and drop-off areas, booking details, and — for drivers — the identity, licence, vehicle and banking information needed for vetting and payouts.</p>
          <h3>2. Why we collect it</h3>
          <p>To arrange and fulfil your bookings, verify drivers, process payments, provide support, and — only with your consent — contact you about insurance options.</p>
          <h3>3. POPIA</h3>
          <p>We process personal information in line with the Protection of Personal Information Act. We collect only what we need, use it only for the purposes above, and do not sell your information.</p>
          <h3>4. Sharing</h3>
          <p>Your assigned driver sees only what they need to perform your move. Payment details are handled by our payment provider. Verification documents are shared with accredited screening partners for driver vetting.</p>
          <h3>5. Storage and security</h3>
          <p>Data is stored securely with access controls. Booking records are kept for as long as needed for tax, dispute and safety purposes, then deleted.</p>
          <h3>6. Your rights</h3>
          <p>You may ask what we hold about you, request corrections, or ask for deletion by contacting {SUPPORT.email} or {SUPPORT.phone}.</p>
          <p className="legal-note">Template pending attorney review and Information Regulator registration details.</p>
        </div>
      )}
    </div>
  )
}
