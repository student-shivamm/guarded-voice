interface Props { bars?: number; className?: string; }
export function Waveform({ bars = 48, className = "" }: Props) {
  return (
    <div className={`flex h-16 items-center justify-center gap-[3px] ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="wave-bar w-[3px] rounded-full bg-gradient-to-t from-primary to-accent"
          style={{
            height: `${20 + ((i * 37) % 80)}%`,
            animationDelay: `${(i % 12) * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
