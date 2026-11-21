const Logo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="aqGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#7e22ce" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#aqGrad)" />
    <text
      x="50"
      y="63"
      textAnchor="middle"
      fill="white"
      fontSize="36"
      fontWeight="700"
      fontFamily="Inter, Arial, sans-serif"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(88,28,135,0.4))' }}
    >
      AQ
    </text>
  </svg>
);

export default Logo;