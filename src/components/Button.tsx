import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import "./button.css";

type Variant = "primary" | "outline" | "quiet" | "text";
type Size = "sm" | "md" | "lg";

interface Base {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  full?: boolean;
}

interface AsLink extends Base {
  to: string;
  href?: never;
  onClick?: never;
  type?: never;
}
interface AsAnchor extends Base {
  href: string;
  to?: never;
  onClick?: never;
  type?: never;
}
interface AsButton extends Base {
  to?: never;
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
}

type Props = AsLink | AsAnchor | AsButton;

export function Button(props: Props) {
  const {
    children,
    variant = "primary",
    size = "md",
    arrow = false,
    className = "",
    full = false,
  } = props;

  const cls = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    full ? "btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {arrow && (
        <span className="btn__arrow">
          <Icon name="arrow" size={14} strokeWidth={1.5} />
        </span>
      )}
    </>
  );

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} className={cls}>
        {inner}
      </Link>
    );
  }
  if ("href" in props && props.href) {
    return (
      <a
        href={props.href}
        className={cls}
        target="_blank"
        rel="noreferrer noopener"
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      type={(props as AsButton).type ?? "button"}
      onClick={(props as AsButton).onClick}
      className={cls}
    >
      {inner}
    </button>
  );
}
