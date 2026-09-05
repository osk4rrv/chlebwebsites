import type { ReactNode } from "react";
import "./bits.css";

type Tone = "ok" | "degraded" | "down" | "accent" | "idle";

/** A 6px square status indicator. Pulses only when live and only once a
 *  cycle — it is a signal, not decoration. */
export function Dot({ tone = "ok", pulse = false }: { tone?: Tone; pulse?: boolean }) {
  return (
    <span
      className={`dot dot--${tone} ${pulse ? "dot--pulse" : ""}`}
      aria-hidden="true"
    />
  );
}

/** Rectangular technical tag. Not a pill. */
export function Tag({
  children,
  tone = "idle",
  mono = true,
}: {
  children: ReactNode;
  tone?: Tone;
  mono?: boolean;
}) {
  return (
    <span className={`tag tag--${tone} ${mono ? "mono" : ""}`}>{children}</span>
  );
}

/** Eyebrow used above hero and page headers: dot + monospace status text. */
export function Eyebrow({
  children,
  tone = "ok",
  pulse = true,
}: {
  children: ReactNode;
  tone?: Tone;
  pulse?: boolean;
}) {
  return (
    <div className="eyebrow">
      <Dot tone={tone} pulse={pulse} />
      <span className="eyebrow__text mono">{children}</span>
    </div>
  );
}

/** Horizontal capacity / utilisation bar built from discrete segments so it
 *  reads as instrumentation rather than a progress bar. */
export function Meter({
  value,
  segments = 20,
  tone = "accent",
  label,
}: {
  value: number;
  segments?: number;
  tone?: Tone;
  label?: string;
}) {
  const filled = Math.round((value / 100) * segments);
  return (
    <span
      className={`meter meter--${tone}`}
      role="img"
      aria-label={label ?? `${value}%`}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          className={`meter__seg ${i < filled ? "is-on" : ""}`}
          style={{ transitionDelay: `${i * 9}ms` }}
        />
      ))}
    </span>
  );
}

/** Definition row: label left, monospace value right, hairline between. */
export function KV({
  k,
  v,
  note,
}: {
  k: ReactNode;
  v: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="kv">
      <dt className="kv__k">{k}</dt>
      <dd className="kv__v">
        {v}
        {note && <span className="kv__note">{note}</span>}
      </dd>
    </div>
  );
}

/** Full-bleed grid of headline numbers, divided by vertical hairlines and
 *  intentionally unequal in width. */
export function MetricRow({
  items,
}: {
  items: { value: string; label: string; sub?: string }[];
}) {
  return (
    <div className="mrow">
      {items.map((m) => (
        <div className="mrow__cell" key={m.label}>
          <div className="mrow__val num">{m.value}</div>
          <div className="mrow__label">{m.label}</div>
          {m.sub && <div className="mrow__sub mono">{m.sub}</div>}
        </div>
      ))}
    </div>
  );
}

/** Inline sparkline for uptime / latency history. */
export function Spark({
  values,
  height = 28,
  tone = "accent",
  domain,
}: {
  values: number[];
  height?: number;
  tone?: Tone;
  /** Fixed y-domain. Without it the series is auto-scaled, which makes tiny
   *  variation look dramatic — wrong for things like tick rate. */
  domain?: [number, number];
}) {
  const min = domain ? domain[0] : Math.min(...values);
  const max = domain ? domain[1] : Math.max(...values);
  const span = max - min || 1;
  const w = 100;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = height - 2 - ((v - min) / span) * (height - 4);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return (
    <svg
      className={`spark spark--${tone}`}
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline points={pts.join(" ")} fill="none" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
