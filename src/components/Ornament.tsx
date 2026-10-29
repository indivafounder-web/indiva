export function Lotus({ className = "", gold = true }: { className?: string; gold?: boolean }) {
  const c = gold ? "#c4a35a" : "#6b2c1a";
  return (
    <svg viewBox="0 0 80 64" className={className} fill="none" aria-hidden>
      <path d="M40 58c-8-10-18-16-30-18 12-2 22-8 30-18 8 10 18 16 30 18-12 2-22 8-30 18z" stroke={c} strokeWidth="1.4" />
      <path d="M40 50c-5-7-12-11-20-12 8-1 15-5 20-12 5 7 12 11 20 12-8 1-15 5-20 12z" stroke={c} strokeWidth="1.2" />
      <path d="M40 8c2 8 8 14 16 18-8 2-14 8-16 18-2-10-8-16-16-18 8-4 14-10 16-18z" stroke={c} strokeWidth="1.4" />
      <circle cx="40" cy="32" r="3" fill={c} />
    </svg>
  );
}

export function Filigree({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden>
      <circle cx="100" cy="100" r="88" stroke="#c4a35a" strokeWidth="0.6" opacity="0.55" />
      <circle cx="100" cy="100" r="62" stroke="#c4a35a" strokeWidth="0.5" opacity="0.4" />
      <path d="M100 12c18 28 40 44 72 52-32 8-54 24-72 52-18-28-40-44-72-52 32-8 54-24 72-52z" stroke="#c4a35a" strokeWidth="0.7" opacity="0.7" />
      <path d="M100 40c10 16 24 26 42 30-18 4-32 14-42 30-10-16-24-26-42-30 18-4 32-14 42-30z" stroke="#e8d5a3" strokeWidth="0.6" />
    </svg>
  );
}

export function Corner({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M8 72C8 32 32 8 72 8" stroke="#c4a35a" strokeWidth="1.2" />
      <path d="M8 58C8 28 28 8 58 8" stroke="#c4a35a" strokeWidth="0.6" opacity="0.7" />
      <circle cx="16" cy="16" r="2" fill="#c4a35a" />
    </svg>
  );
}
