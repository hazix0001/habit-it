type Props = {
  value: number;
  max: number;
  label?: string;
};

export function PixelProgressBar({ value, max, label }: Props) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      {label ? (
        <p className="text-sm font-bold mb-2" aria-live="polite">
          {label}
        </p>
      ) : null}
      <div
        className="pixel-progress"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? "Progress"}
      >
        <div className="pixel-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
