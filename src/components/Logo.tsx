export default function Logo({ light = false, size = 28 }: { light?: boolean; size?: number }) {
  const stroke = light ? "#e8d5a3" : "#6b2c1a";
  const text = light ? "#fbf7f0" : "#6b2c1a";
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
        <path
          d="M32 6c6 11 14 17 24 20C46 29 38 35 32 46 26 35 18 29 8 26 18 23 26 17 32 6z"
          stroke={stroke}
          strokeWidth="2.2"
          fill="none"
        />
        <path
          d="M32 16c4 7 9 11 16 13-7 2-12 6-16 13-4-7-9-11-16-13 7-2 12-6 16-13z"
          stroke={stroke}
          strokeWidth="1.6"
        />
        <circle cx="32" cy="29" r="3.2" fill={stroke} />
      </svg>
      <span className="font-display tracking-[0.28em] text-[1.15rem] leading-none" style={{ color: text }}>
        INDIVA
      </span>
    </span>
  );
}
