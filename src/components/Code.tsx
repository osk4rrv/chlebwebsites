import { useState } from "react";
import { Icon } from "./Icon";
import "./code.css";

/**
 * Deliberately minimal highlighting: comments, quoted strings, CLI flags and
 * the shell prompt. Three tones only — no rainbow tokenising.
 */
// `//` only opens a comment at a line start or after whitespace, so the double
// slash in a URL such as https://api.asterza.host is left alone.
const RE =
  /(#[^\n]*|(?<=^|\s)\/\/[^\n]*|"[^"\n]*"|'[^'\n]*'|`[^`\n]*`|(?<=\s|^)--?[a-zA-Z][\w-]*|(?<=^)\$(?=\s)|(?<=^ {2})ok(?= ))/g;

function classify(tok: string): string {
  if (tok.startsWith("#") || tok.startsWith("//")) return "c-com";
  if (/^["'`]/.test(tok)) return "c-str";
  if (tok === "ok") return "c-ok";
  if (tok === "$") return "c-prompt";
  return "c-flag";
}

function Highlighted({ code }: { code: string }) {
  return (
    <>
      {code.split("\n").map((line, i) => (
        <span className="code__line" key={i}>
          {line.split(RE).map((part, j) => {
            if (part === undefined || part === "") return null;
            // split() with one capture group puts tokens at odd indices.
            return j % 2 === 1 ? (
              <span className={classify(part)} key={j}>
                {part}
              </span>
            ) : (
              <span key={j}>{part}</span>
            );
          })}
          {"\n"}
        </span>
      ))}
    </>
  );
}

function CopyButton({ code }: { code: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="code__copy"
      onClick={() => {
        navigator.clipboard?.writeText(code).then(
          () => {
            setDone(true);
            window.setTimeout(() => setDone(false), 1400);
          },
          () => {},
        );
      }}
      aria-label="Copy to clipboard"
    >
      <Icon name={done ? "check" : "copy"} size={12} strokeWidth={1.4} />
      <span className="mono">{done ? "copied" : "copy"}</span>
    </button>
  );
}

export function CodeBlock({
  code,
  lang,
  file,
}: {
  code: string;
  lang?: string;
  file?: string;
}) {
  return (
    <div className="code">
      <div className="code__bar">
        <span className="code__lang mono">{file ?? lang ?? "text"}</span>
        <CopyButton code={code} />
      </div>
      <pre className="code__pre">
        <code>
          <Highlighted code={code} />
        </code>
      </pre>
    </div>
  );
}

export function CodeTabs({
  tabs,
}: {
  tabs: { id: string; label: string; lang: string; code: string }[];
}) {
  const [on, setOn] = useState(tabs[0].id);
  const active = tabs.find((t) => t.id === on) ?? tabs[0];

  return (
    <div className="code">
      <div className="code__bar code__bar--tabs">
        <div className="code__tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={t.id === on}
              className={`code__tab ${t.id === on ? "is-on" : ""}`}
              onClick={() => setOn(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <CopyButton code={active.code} />
      </div>
      <pre className="code__pre">
        <code>
          <Highlighted code={active.code} />
        </code>
      </pre>
    </div>
  );
}
