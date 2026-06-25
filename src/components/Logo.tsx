interface Props {
  size?: number
  className?: string
}

/** Hamba navigation-arrow mark — "go / on the move". */
export function LogoMark({ size = 32, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hamba-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff8a4c" />
          <stop offset="1" stopColor="#ff6a2b" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#hamba-mark)" />
      <path d="M24 11 35 36 24 30.5 13 36 24 11Z" fill="#fff" />
    </svg>
  )
}

export default function Logo({ size = 30 }: Props) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-word">Hamba</span>
    </span>
  )
}
