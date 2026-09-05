/**
 * Geometric line icons drawn on a 16-unit grid. Stroke-only, single weight,
 * square caps — they are meant to read as diagram marks, not illustrations.
 */
export type IconName =
  | "arrow"
  | "arrow-down"
  | "chevron"
  | "check"
  | "minus"
  | "close"
  | "menu"
  | "copy"
  | "external"
  | "cpu"
  | "disk"
  | "globe"
  | "shield"
  | "bolt"
  | "terminal"
  | "layers"
  | "clock"
  | "lock"
  | "search";

const P: Record<IconName, string> = {
  arrow: "M2.5 8h11M9.5 4l4 4-4 4",
  "arrow-down": "M8 2.5v11M4 9.5l4 4 4-4",
  chevron: "M5.5 3.5L10.5 8l-5 4.5",
  check: "M2.5 8.5l3.5 3.5 7.5-8",
  minus: "M3 8h10",
  close: "M3.5 3.5l9 9M12.5 3.5l-9 9",
  menu: "M2 4.5h12M2 11.5h12",
  copy: "M5.5 5.5h8v8h-8zM10.5 2.5h-8v8",
  external: "M6 3H3v10h10v-3M9.5 2.5h4v4M13.5 2.5L7 9",
  cpu: "M4.5 4.5h7v7h-7zM6.5 2v1.5M9.5 2v1.5M6.5 12.5V14M9.5 12.5V14M2 6.5h1.5M2 9.5h1.5M12.5 6.5H14M12.5 9.5H14",
  disk: "M2 4.5h12v7H2zM4 7h1M4 9h1M11.5 7h1.5M11.5 9h1.5M7 7h3v2H7z",
  globe: "M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM1.5 8h13M8 1.5c1.8 1.7 2.8 4 2.8 6.5S9.8 12.8 8 14.5M8 1.5C6.2 3.2 5.2 5.5 5.2 8s1 5.3 2.8 6.5",
  shield: "M8 1.8l5.2 2v4.1c0 3-2.1 5.4-5.2 6.3-3.1-.9-5.2-3.3-5.2-6.3V3.8z",
  bolt: "M9 1.5L3.5 9.2H7.5L6.8 14.5 12.5 6.6H8.5z",
  terminal: "M1.8 2.5h12.4v11H1.8zM4.2 6.2l2 1.8-2 1.8M8 10.2h4",
  layers: "M8 1.8L14 5 8 8.2 2 5zM2 8.5l6 3.2 6-3.2M2 11.5l6 3.2 6-3.2",
  clock: "M8 1.8a6.2 6.2 0 100 12.4A6.2 6.2 0 008 1.8zM8 4.6V8l2.6 1.8",
  lock: "M3.5 7h9v7h-9zM5.5 7V4.8a2.5 2.5 0 015 0V7",
  search: "M7.2 2.4a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zM10.8 10.8l3 3",
};

interface Props {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 16, className, strokeWidth = 1.3 }: Props) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      style={{ flex: "none" }}
    >
      <path d={P[name]} />
    </svg>
  );
}
