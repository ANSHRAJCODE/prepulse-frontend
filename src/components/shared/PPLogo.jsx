// PPLogo.jsx — PrepPulse brand logo React component
// Open book + upward arrow badge: knowledge → career growth
export default function PPLogo({ size = 36, variant = 'full', theme = 'auto' }) {
  const uid = 'pp' + Math.random().toString(36).slice(2, 6)
  const Icon = () => (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PrepPulse logo" role="img">
      <defs>
        <linearGradient id={`${uid}-l1`} x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2D5BE3" />
          <stop offset="100%" stopColor="#1A3FA8" />
        </linearGradient>
        <linearGradient id={`${uid}-l2`} x1="0" y1="38" x2="38" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1A3FA8" stopOpacity=".7" />
          <stop offset="100%" stopColor="#4A7AFF" stopOpacity=".9" />
        </linearGradient>
      </defs>
      <rect x="3" y="8" width="32" height="22" rx="3" fill="#1A3FA8" opacity=".3" />
      <path d="M5 10 C5 8.9 5.9 8 7 8 L18 8 L18 30 L7 30 C5.9 30 5 29.1 5 28 Z" fill={`url(#${uid}-l1)`} />
      <path d="M20 8 L31 8 C32.1 8 33 8.9 33 10 L33 28 C33 29.1 32.1 30 31 30 L20 30 Z" fill={`url(#${uid}-l2)`} />
      <rect x="17.5" y="8" width="3" height="22" fill="#0E2870" />
      <line x1="8.5" y1="13" x2="16" y2="13" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
      <line x1="8.5" y1="17" x2="16" y2="17" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
      <line x1="8.5" y1="21" x2="14" y2="21" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="13" x2="29.5" y2="13" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="17" x2="29.5" y2="17" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="21" x2="27" y2="21" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="29" cy="9" r="6.5" fill="#F7F5F0" />
      <path d="M29 13 L29 6.5 M26.5 9 L29 6.5 L31.5 9" stroke="#2D5BE3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
  if (variant === 'icon') return <Icon />
  const textColor = theme === 'dark' ? '#F0EEE8' : theme === 'light' ? '#16150F' : undefined
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(size * 0.3) }}>
      <Icon />
      <span style={{ fontFamily: "'Instrument Serif','Georgia',serif", fontSize: size * 0.62, fontWeight: 400, letterSpacing: '-0.2px', lineHeight: 1, color: textColor ?? 'var(--text, #16150F)' }}>
        Prep<span style={{ color: '#2D5BE3' }}>Pulse</span>
      </span>
    </div>
  )
}
