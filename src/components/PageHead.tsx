import type { ReactNode } from "react";
import { Eyebrow } from "./Bits";
import "./page-head.css";

/**
 * Page-level header. Asymmetric by default: title left, supporting matter in
 * a narrower right column, technical strip beneath on a hairline.
 */
export function PageHead({
  eyebrow,
  eyebrowTone = "ok",
  title,
  sub,
  lead,
  actions,
  strip,
  aside,
}: {
  eyebrow?: string;
  eyebrowTone?: "ok" | "degraded" | "accent";
  title: ReactNode;
  sub?: string;
  lead?: ReactNode;
  actions?: ReactNode;
  strip?: [string, string][];
  aside?: ReactNode;
}) {
  return (
    <header className="phead">
      <div className="container">
        <div className="phead__grid">
          <div className="phead__main">
            {eyebrow && <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>}
            <h1 className="t-h1 phead__title">
              {title}
              {sub && <span className="phead__sub">{sub}</span>}
            </h1>
          </div>
          <div className="phead__side">
            {lead && <p className="t-lead phead__lead">{lead}</p>}
            {actions && <div className="phead__actions">{actions}</div>}
            {aside}
          </div>
        </div>

        {strip && (
          <dl className="phead__strip">
            {strip.map(([k, v]) => (
              <div key={k}>
                <dt className="t-label">{k}</dt>
                <dd className="mono">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  );
}
