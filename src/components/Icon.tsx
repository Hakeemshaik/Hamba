interface IconProps {
  name: string
  className?: string
}

/**
 * Minimal SF Symbols-style line icons. Single stroke weight, currentColor,
 * so they inherit text colour and stay monochrome and calm.
 */
const PATHS: Record<string, JSX.Element> = {
  truck: (
    <>
      <path d="M3 6.5h11v9H3z" />
      <path d="M14 9.5h3.6l2.4 3v3H14z" />
      <circle cx="7" cy="17" r="1.6" />
      <circle cx="17" cy="17" r="1.6" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
      <path d="M4 7l8 4 8-4" />
      <path d="M12 11v10" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  contactless: (
    <>
      <path d="M8 6.5a8 8 0 0 1 0 11" />
      <path d="M11.5 4.5a13 13 0 0 1 0 15" />
      <path d="M15 2.8a18 18 0 0 1 0 18.4" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
    </>
  ),
  bank: (
    <>
      <path d="M4 9.5 12 4l8 5.5" />
      <path d="M5 9.5v8M9.5 9.5v8M14.5 9.5v8M19 9.5v8" />
      <path d="M3.5 20h17" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  back: <path d="m15 6-6 6 6 6" />,
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6l-7-3Z" />
    </>
  ),
  star: <path d="m12 4 2.3 4.9 5.2.6-3.9 3.6 1.1 5.3L12 16.3 7.2 18.4l1.1-5.3-3.9-3.6 5.2-.6L12 4Z" />,
  pin: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
}

export default function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? null}
    </svg>
  )
}
