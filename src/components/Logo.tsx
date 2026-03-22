interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer ring - dark brown */}
      <circle cx="60" cy="60" r="58" stroke="#3E2723" strokeWidth="4" />
      {/* Gold coin body */}
      <circle cx="60" cy="60" r="54" fill="url(#goldGradient)" />
      {/* Inner ring detail */}
      <circle cx="60" cy="60" r="46" stroke="#BF8C2C" strokeWidth="2" fill="none" />
      <circle cx="60" cy="60" r="42" stroke="#D4A53A" strokeWidth="1" fill="none" />
      {/* Decorative notches around the rim */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const x1 = 60 + 54 * Math.cos(angle);
        const y1 = 60 + 54 * Math.sin(angle);
        const x2 = 60 + 50 * Math.cos(angle);
        const y2 = 60 + 50 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#BF8C2C"
            strokeWidth="1.5"
          />
        );
      })}
      {/* Letter N - elegant serif style */}
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="52"
        fontWeight="bold"
        fill="#3E2723"
      >
        N
      </text>
      {/* Small star above */}
      <polygon
        points="60,16 62,22 68,22 63,26 65,32 60,28 55,32 57,26 52,22 58,22"
        fill="#3E2723"
      />
      {/* Year detail at bottom */}
      <text
        x="60"
        y="100"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="10"
        letterSpacing="3"
        fill="#5D4037"
      >
        NUMIS
      </text>
      <defs>
        <radialGradient
          id="goldGradient"
          cx="40%"
          cy="35%"
          r="60%"
          fx="40%"
          fy="35%"
        >
          <stop offset="0%" stopColor="#F5D77A" />
          <stop offset="40%" stopColor="#D4A53A" />
          <stop offset="70%" stopColor="#C49332" />
          <stop offset="100%" stopColor="#A67B28" />
        </radialGradient>
      </defs>
    </svg>
  );
}
