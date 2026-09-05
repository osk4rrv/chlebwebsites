import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CodeBlock } from "../components/Code";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";
import { ARTICLES, DOC_GROUPS } from "../data/docs";
import type { Block } from "../data/docs";
import { useTitle } from "../lib/hooks";
import "./docs.css";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return (
              <p className="doc__p" key={i}>
                {b.text}
              </p>
            );
          case "h":
            return (
              <h2 className="doc__h" id={slugify(b.text)} key={i}>
                {b.text}
              </h2>
            );
          case "ul":
            return (
              <ul className="doc__ul" key={i}>
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          case "code":
            return (
              <div className="doc__code" key={i}>
                <CodeBlock code={b.code} lang={b.lang} file={b.file} />
              </div>
            );
          case "note":
            return (
              <aside className="doc__note" key={i}>
                <span className="t-label">Note</span>
                <p>{b.text}</p>
              </aside>
            );
          case "table":
            return (
              <div className="doc__tablewrap" key={i}>
                <table className="doc__table">
                  <thead>
                    <tr>
                      {b.head.map((h) => (
                        <th className="t-label" key={h}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((c, ci) => (
                          <td className={ci === 0 ? "mono doc__c1" : "mono"} key={ci}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}

export function Docs() {
  const { slug } = useParams();
  const [q, setQ] = useState("");

  const article = slug ? ARTICLES.find((a) => a.slug === slug) : undefined;
  useTitle(
    article ? `${article.title} — Asterza docs` : "Documentation — Asterza",
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ARTICLES;
    return ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(t) ||
        a.summary.toLowerCase().includes(t) ||
        a.group.toLowerCase().includes(t),
    );
  }, [q]);

  const idx = article ? ARTICLES.findIndex((a) => a.slug === article.slug) : -1;
  const prev = idx > 0 ? ARTICLES[idx - 1] : undefined;
  const next = idx >= 0 && idx < ARTICLES.length - 1 ? ARTICLES[idx + 1] : undefined;

  const headings = article
    ? article.blocks.filter((b): b is Extract<Block, { t: "h" }> => b.t === "h")
    : [];

  return (
    <div className="docs">
      <div className="container docs__grid">
        {/* Sidebar */}
        <aside className="docs__side">
          <label className="docs__search">
            <Icon name="search" size={13} strokeWidth={1.4} />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter pages"
              aria-label="Filter documentation pages"
            />
          </label>

          <nav aria-label="Documentation">
            {DOC_GROUPS.map((g) => {
              const items = filtered.filter((a) => a.group === g);
              if (!items.length) return null;
              return (
                <div className="docs__group" key={g}>
                  <p className="t-label docs__gt">{g}</p>
                  <ul>
                    {items.map((a) => (
                      <li key={a.slug}>
                        <Link
                          to={`/docs/${a.slug}`}
                          className={`docs__slink ${
                            a.slug === slug ? "is-on" : ""
                          }`}
                        >
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {!filtered.length && (
              <p className="docs__empty mono">
                Nothing matches “{q}”. Support answers faster than search does.
              </p>
            )}
          </nav>

          <div className="docs__sidefoot">
            <p className="mono">Missing something?</p>
            <a className="link mono" href="mailto:support@asterza.host">
              support@asterza.host
            </a>
          </div>
        </aside>

        {/* Content */}
        <main className="docs__main">
          {!article ? (
            <>
              <header className="docs__head">
                <p className="t-label">Documentation</p>
                <h1 className="t-h1 docs__title">
                  How the platform works, written by the people who run it.
                </h1>
                <p className="t-lead docs__lead">
                  Short pages, real commands, no marketing. Everything here is
                  kept current — each page carries the date it was last touched.
                </p>
                <div className="docs__headcta">
                  <Button to="/docs/quickstart">Start with the quickstart</Button>
                  <Button to="/docs/api-instances" variant="text" arrow>
                    Jump to the API reference
                  </Button>
                </div>
              </header>

              {DOC_GROUPS.map((g) => {
                const items = ARTICLES.filter((a) => a.group === g);
                if (!items.length) return null;
                return (
                  <section className="docs__sec" key={g}>
                    <h2 className="docs__sech">{g}</h2>
                    <ul className="docs__cards">
                      {items.map((a) => (
                        <li key={a.slug}>
                          <Link to={`/docs/${a.slug}`} className="docs__card">
                            <span className="docs__cardtop">
                              <span className="docs__cardtitle">{a.title}</span>
                              <Icon name="arrow" size={14} strokeWidth={1.4} />
                            </span>
                            <span className="docs__cardsum">{a.summary}</span>
                            <span className="docs__cardmeta mono">
                              {a.read} · updated {a.updated}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </>
          ) : (
            <article className="doc">
              <nav className="doc__crumbs mono">
                <Link to="/docs">Docs</Link>
                <span className="doc__sep">/</span>
                <span>{article.group}</span>
              </nav>
              <h1 className="t-h1 doc__title">{article.title}</h1>
              <p className="doc__summary">{article.summary}</p>
              <div className="doc__meta mono">
                <span>{article.read} read</span>
                <span className="dim">updated {article.updated}</span>
              </div>

              {headings.length > 1 && (
                <div className="doc__toc">
                  <span className="t-label">On this page</span>
                  <ul>
                    {headings.map((h) => (
                      <li key={h.text}>
                        <a href={`#${slugify(h.text)}`} className="mono">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="doc__body">
                <Blocks blocks={article.blocks} />
              </div>

              <nav className="doc__pager">
                {prev ? (
                  <Link to={`/docs/${prev.slug}`} className="doc__pl">
                    <span className="t-label">Previous</span>
                    <span className="doc__plt">{prev.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link to={`/docs/${next.slug}`} className="doc__pl doc__pl--next">
                    <span className="t-label">Next</span>
                    <span className="doc__plt">{next.title}</span>
                  </Link>
                )}
              </nav>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
