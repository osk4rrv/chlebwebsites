import { Link } from "react-router-dom";
import "./logo.css";

/**
 * Asterza mark — a six-armed aster built from three strokes crossing at a
 * single point. The wordmark sets in Archivo at a slightly narrow width.
 */
export function Mark({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className="mark"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="square"
    >
      <path d="M12 2.6v18.8" />
      <path d="M3.85 7.3l16.3 9.4" />
      <path d="M3.85 16.7l16.3-9.4" />
    </svg>
  );
}

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="logo" aria-label="Asterza — home">
      <span className="logo__mark">
        <Mark size={19} />
      </span>
      <span className="logo__word">Asterza</span>
    </Link>
  );
}
