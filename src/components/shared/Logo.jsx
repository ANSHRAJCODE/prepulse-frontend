export default function PrepPulseLogo({ size = 32, className = '' }) {
  const uid = `pp-${size}-${Math.random().toString(36).slice(2,6)}`
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5"/>
          <stop offset="55%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#ea580c"/>
        </linearGradient>
        <linearGradient id={`pl-${uid}`} x1="4" y1="0" x2="28" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a5b4fc"/>
          <stop offset="100%" stopColor="#fdba74"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#bg-${uid})`}/>
      <path d="M9 13.5C9 11 10.8 9 13 9C13.5 9 14 9.1 14.4 9.3C14.8 8.5 15.8 8 17 8C19.2 8 21 9.8 21 12C21 12.3 21 12.6 20.9 12.9C22.1 13.4 23 14.6 23 16C23 17.7 21.7 19.1 20 19.4V21C20 21.6 19.6 22 19 22H13C12.4 22 12 21.6 12 21V19.4C10.3 19.1 9 17.7 9 16C9 15.1 9.4 14.3 9.9 13.7C9.3 13.6 9 13.5 9 13.5Z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
      <path d="M5 16L9.5 16L11.5 12L14 20L16.5 13.5L18.5 18.5L20.5 16L27 16" stroke={`url(#pl-${uid})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
