type AdaMascotProps = {
  className?: string
}

export function AdaMascot({ className }: AdaMascotProps) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label="Ada, a tutora de IA, ilustrada como um robô simpático"
    >
      <ellipse cx="100" cy="205" rx="55" ry="8" fill="#000" opacity="0.12" />

      <rect x="94" y="18" width="4" height="20" rx="2" fill="#fff" opacity="0.9" />
      <circle cx="96" cy="14" r="6" fill="#fff" />
      <circle cx="96" cy="14" r="2.4" fill="#5b21b6" />

      <rect x="55" y="34" width="90" height="70" rx="30" fill="#fff" />
      <rect x="68" y="46" width="64" height="46" rx="20" fill="#1e2233" />
      <path d="M82 66c4-8 10-8 14 0" stroke="#5eead4" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M104 66c4-8 10-8 14 0" stroke="#5eead4" strokeWidth="3.2" strokeLinecap="round" fill="none" />

      <circle cx="52" cy="70" r="7" fill="#fff" />
      <circle cx="148" cy="70" r="7" fill="#fff" />

      <path
        d="M60 96c0 24 12 34 40 34s40-10 40-34"
        fill="none"
        stroke="#fff"
        strokeWidth="0"
      />

      <rect x="50" y="100" width="100" height="76" rx="26" fill="#fff" />
      <circle cx="100" cy="132" r="18" fill="#5b21b6" />
      <circle cx="100" cy="132" r="11" fill="#7c3aed" />
      <rect x="90" y="150" width="20" height="22" rx="8" fill="#e9e7f5" />

      <rect x="16" y="112" width="26" height="14" rx="7" fill="#fff" transform="rotate(-12 29 119)" />
      <rect x="158" y="112" width="26" height="14" rx="7" fill="#fff" transform="rotate(12 171 119)" />

      <g transform="translate(150 96) rotate(28)">
        <rect x="0" y="0" width="8" height="34" rx="4" fill="#fbbf24" />
        <path d="M0 0 8 0 4 -10Z" fill="#f97316" />
      </g>

      <rect x="66" y="176" width="26" height="22" rx="8" fill="#fff" />
      <rect x="108" y="176" width="26" height="22" rx="8" fill="#fff" />
      <rect x="62" y="196" width="34" height="10" rx="5" fill="#e9e7f5" />
      <rect x="104" y="196" width="34" height="10" rx="5" fill="#e9e7f5" />
    </svg>
  )
}
