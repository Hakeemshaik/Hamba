interface Props {
  name: string
  className?: string
}

/**
 * Colourful flat illustrations used as "picture" icons for services and
 * payment methods. Self-contained inline SVG — no external images, so they
 * load instantly and never break offline.
 */
const ART: Record<string, JSX.Element> = {
  // Long distance move — a moving van. Wheels carry spokes in a .wheel group
  // so contexts wrapped in .truck-anim can spin them via CSS.
  truck: (
    <g>
      <ellipse cx="32" cy="52" rx="24" ry="3.4" fill="#000" opacity="0.06" />
      <g className="truck-body">
        <rect x="6" y="20" width="30" height="24" rx="4" fill="#ffffff" stroke="#d7dee8" strokeWidth="1.5" />
        <path d="M36 26h11.5c1 0 1.9.5 2.5 1.3L56 35v8a2 2 0 0 1-2 2H36V26Z" fill="#3b82f6" />
        <rect x="39" y="29" width="11" height="7" rx="1.5" fill="#bfdbfe" />
        <rect x="6" y="33" width="30" height="3.5" fill="#eef2f7" />
      </g>
      <g className="wheel">
        <circle cx="18" cy="46" r="5" fill="#1f2937" />
        <path d="M18 42.6v6.8M14.6 46h6.8" stroke="#9ca3af" strokeWidth="1.4" />
        <circle cx="18" cy="46" r="1.4" fill="#e5e7eb" />
      </g>
      <g className="wheel">
        <circle cx="46" cy="46" r="5" fill="#1f2937" />
        <path d="M46 42.6v6.8M42.6 46h6.8" stroke="#9ca3af" strokeWidth="1.4" />
        <circle cx="46" cy="46" r="1.4" fill="#e5e7eb" />
      </g>
    </g>
  ),
  // Local removal — stacked boxes
  boxes: (
    <g>
      <ellipse cx="32" cy="52" rx="22" ry="3.2" fill="#000" opacity="0.06" />
      <rect x="10" y="30" width="20" height="18" rx="2.5" fill="#e0ad6e" />
      <rect x="10" y="30" width="20" height="6" rx="2.5" fill="#cf9550" />
      <path d="M18 30h4v6h-4z" fill="#a9712f" />
      <rect x="31" y="22" width="22" height="26" rx="2.5" fill="#edc488" />
      <rect x="31" y="22" width="22" height="7" rx="2.5" fill="#dcab64" />
      <path d="M40 22h4v7h-4z" fill="#b9853c" />
    </g>
  ),
  // Rubble removal — skip / dumpster with debris
  rubble: (
    <g>
      <ellipse cx="32" cy="52" rx="24" ry="3.4" fill="#000" opacity="0.06" />
      <path d="M14 34h28l-6 12H18l-4-12Z" fill="#243b53" opacity="0.18" />
      <circle cx="24" cy="30" r="6" fill="#9aa6b2" />
      <circle cx="34" cy="27" r="7" fill="#b6c0cb" />
      <circle cx="42" cy="31" r="5" fill="#7d8a99" />
      <path d="M10 32h44l-5 14a3 3 0 0 1-3 2H18a3 3 0 0 1-3-2l-5-14Z" fill="#f4b740" />
      <path d="M10 32h44l-1.4 4H11.4L10 32Z" fill="#d99a25" />
    </g>
  ),
  // Tap to pay — card with contactless waves
  tap: (
    <g>
      <rect x="10" y="16" width="34" height="22" rx="4" fill="#6366f1" transform="rotate(-8 27 27)" />
      <rect x="14" y="22" width="9" height="7" rx="1.5" fill="#fcd34d" transform="rotate(-8 27 27)" />
      <g stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round">
        <path d="M45 22a8 8 0 0 1 0 12" />
        <path d="M49 18a14 14 0 0 1 0 20" />
      </g>
    </g>
  ),
  // Card
  card: (
    <g>
      <rect x="8" y="18" width="44" height="28" rx="5" fill="#334155" />
      <rect x="8" y="24" width="44" height="6" fill="#0f172a" />
      <rect x="14" y="35" width="14" height="6" rx="1.5" fill="#fcd34d" />
      <rect x="33" y="37" width="13" height="3" rx="1.5" fill="#94a3b8" />
    </g>
  ),
  // Furniture
  sofa: (
    <g>
      <ellipse cx="32" cy="50" rx="24" ry="3" fill="#000" opacity="0.06" />
      <rect x="14" y="22" width="36" height="16" rx="7" fill="#9b82ff" />
      <rect x="10" y="30" width="44" height="14" rx="6" fill="#7c5cff" />
      <rect x="8" y="32" width="9" height="15" rx="4.5" fill="#6b4ce0" />
      <rect x="47" y="32" width="9" height="15" rx="4.5" fill="#6b4ce0" />
      <rect x="16" y="44" width="5" height="6" rx="1.5" fill="#3a2a8a" />
      <rect x="43" y="44" width="5" height="6" rx="1.5" fill="#3a2a8a" />
    </g>
  ),
  // Appliances (fridge)
  appliance: (
    <g>
      <ellipse cx="32" cy="52" rx="18" ry="2.6" fill="#000" opacity="0.06" />
      <rect x="20" y="12" width="24" height="40" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.2" />
      <path d="M20 28h24" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="38" y="16" width="2.6" height="9" rx="1.3" fill="#94a3b8" />
      <rect x="38" y="32" width="2.6" height="10" rx="1.3" fill="#94a3b8" />
      <rect x="24" y="17" width="6" height="3" rx="1.5" fill="#38bdf8" />
    </g>
  ),
  // Office move (building)
  office: (
    <g>
      <ellipse cx="32" cy="52" rx="22" ry="2.8" fill="#000" opacity="0.06" />
      <rect x="16" y="14" width="32" height="38" rx="4" fill="#2dd4bf" />
      <rect x="16" y="14" width="32" height="7" rx="4" fill="#14b8a6" />
      <g fill="#eafaf4">
        <rect x="21" y="25" width="6" height="6" rx="1.2" />
        <rect x="31" y="25" width="6" height="6" rx="1.2" />
        <rect x="41" y="25" width="3" height="6" rx="1.2" />
        <rect x="21" y="34" width="6" height="6" rx="1.2" />
        <rect x="31" y="34" width="6" height="6" rx="1.2" />
        <rect x="41" y="34" width="3" height="6" rx="1.2" />
      </g>
      <rect x="28" y="43" width="8" height="9" rx="1.5" fill="#0f9488" />
    </g>
  ),
  // Customer avatar (neutral)
  avatar: (
    <g>
      <rect width="64" height="64" rx="32" fill="#ffe7d6" />
      <path d="M12 58c0-11 9-17 20-17s20 6 20 17Z" fill="#ff8a4c" />
      <circle cx="32" cy="27" r="12" fill="#f6c9a8" />
      <path d="M20 25c0-7 6-11 12-11s12 4 12 11c-2-3-5-4-12-4s-10 1-12 4Z" fill="#5b3b2e" />
    </g>
  ),
  // Friendly driver avatar
  driver: (
    <g>
      <rect width="64" height="64" rx="32" fill="#e8f0ff" />
      <path d="M12 58c0-11 9-17 20-17s20 6 20 17Z" fill="#2f6fed" />
      <path d="M24 42h16v6a8 8 0 0 1-16 0Z" fill="#e8b08a" />
      <circle cx="32" cy="28" r="13" fill="#f1c19b" />
      <path d="M19 27c0-8 6-12 13-12s13 4 13 12c-3-3-6-5-13-5s-10 2-13 5Z" fill="#2a2118" />
      <circle cx="27" cy="28" r="1.6" fill="#2a2118" />
      <circle cx="37" cy="28" r="1.6" fill="#2a2118" />
      <path d="M28 33c1.4 1.2 6.6 1.2 8 0" stroke="#9b6a44" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  ),
  // Instant EFT — bank
  bank: (
    <g>
      <ellipse cx="32" cy="50" rx="22" ry="3" fill="#000" opacity="0.06" />
      <path d="M32 12 52 24H12L32 12Z" fill="#14b8a6" />
      <rect x="14" y="24" width="36" height="4" fill="#0f9488" />
      <rect x="17" y="28" width="4" height="16" fill="#2dd4bf" />
      <rect x="27" y="28" width="4" height="16" fill="#2dd4bf" />
      <rect x="37" y="28" width="4" height="16" fill="#2dd4bf" />
      <rect x="46" y="28" width="4" height="16" fill="#2dd4bf" />
      <rect x="13" y="44" width="38" height="4" rx="1.5" fill="#0f9488" />
    </g>
  ),
}

export default function Illustration({ name, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {ART[name] ?? null}
    </svg>
  )
}
