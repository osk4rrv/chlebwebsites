import type { ReactNode } from "react";
import "./section.css";

interface SectionProps {
  id?: string;
  /** Two-digit editorial index shown in the rail. */
  index?: string;
  /** Uppercase monospace label shown in the rail. */
  label?: string;
  children: ReactNode;
  /** Hairline above the section. */
  rule?: boolean;
  /** Vertical rhythm multiplier — sections are deliberately not uniform. */
  size?: "tight" | "normal" | "loose";
  /** Drops the rail column entirely for full-width compositions. */
  bare?: boolean;
  tone?: "default" | "sunk";
  className?: string;
}

export function Section({
  id,
  index,
  label,
  children,
  rule = true,
  size = "normal",
  bare = false,
  tone = "default",
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={[
        "sect",
        `sect--${size}`,
        tone === "sunk" ? "sect--sunk" : "",
        rule ? "sect--rule" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={bare ? "container" : "container sect__grid"}>
        {!bare && (
          <div className="sect__rail">
            {index && <span className="sect__idx num">{index}</span>}
            {label && <span className="sect__label t-label">{label}</span>}
          </div>
        )}
        <div className={bare ? "" : "sect__body"}>{children}</div>
      </div>
    </section>
  );
}

/** Section-level heading with an optional aside on the same baseline. */
export function Head({
  title,
  lead,
  aside,
  wide = false,
}: {
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  wide?: boolean;
}) {
  return (
    <header className={`head ${wide ? "head--wide" : ""}`}>
      <div className="head__main">
        <h2 className="t-h2">{title}</h2>
        {lead && <p className="t-lead head__lead">{lead}</p>}
      </div>
      {aside && <div className="head__aside">{aside}</div>}
    </header>
  );
}
