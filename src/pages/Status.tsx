import { useState } from "react";
import { PageHead } from "../components/PageHead";
import { Section, Head } from "../components/Section";
import { Dot, Tag } from "../components/Bits";
import { Icon } from "../components/Icon";
import { COMPONENTS, INCIDENTS, UPTIME_HISTORY } from "../data/status";
import type { Health } from "../data/status";
import { NETWORK } from "../data/regions";
import { useTitle } from "../lib/hooks";
import "./status.css";

const DAYS = 90;

/** Deterministic 90-day history derived from the component's uptime figure,
 *  so the strip always agrees with the number printed next to it. */
function history(name: string, uptime: number): Health[] {
  const bad = Math.round(((100 - uptime) / 100) * DAYS * 6);
  const seed = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const days: Health[] = Array.from({ length: DAYS }, () => "operational");
  for (let i = 0; i < bad; i++) {
    const at = (seed * (i + 7) * 31) % DAYS;
    days[at] = i % 3 === 0 ? "outage" : "degraded";
  }
  if (name.includes("sgp1")) {
    for (let i = DAYS - 9; i < DAYS; i++) days[i] = "maintenance";
  }
  return days;
}

const TONE: Record<Health, "ok" | "degraded" | "down" | "idle"> = {
  operational: "ok",
  degraded: "degraded",
  outage: "down",
  maintenance: "idle",
};

export function Status() {
  useTitle("Status — Asterza");
  const [open, setOpen] = useState<string | null>(INCIDENTS[0].id);

  const anyIssue = COMPONENTS.some((c) => c.health !== "operational");
  const avg =
    UPTIME_HISTORY.reduce((a, b) => a + b.value, 0) / UPTIME_HISTORY.length;

  return (
    <>
      <PageHead
        eyebrow={anyIssue ? "1 component in maintenance" : "all systems operational"}
        eyebrowTone={anyIssue ? "degraded" : "ok"}
        title={
          anyIssue
            ? "Everything is serving. One region is still being built."
            : "Everything is serving traffic."
        }
        lead="This page is generated from the same monitoring that pages our on-call. It is not curated, and incidents are never removed from it."
        strip={[
          ["Checked", "every 20 s from 6 external probes"],
          ["12-month uptime", `${avg.toFixed(3)}%`],
          ["Open incidents", anyIssue ? "1 maintenance" : "none"],
          ["Post-mortems", "within 72 h, always public"],
          ["Autonomous system", NETWORK.asn],
        ]}
      />

      <Section index="01" label="Components" rule={false}>
        <Head
          title="Component health, last 90 days."
          aside="Each mark is one day. Grey is planned maintenance, amber is degraded performance, red is an outage."
        />
        <div className="st">
          {COMPONENTS.map((c) => {
            const days = history(c.name, c.uptime90);
            return (
              <div className="st__row" key={c.name}>
                <div className="st__id">
                  <Dot tone={TONE[c.health]} pulse={c.health === "operational"} />
                  <span className="st__name">{c.name}</span>
                  <span className="st__scope mono">{c.scope}</span>
                </div>
                <div className="st__strip" aria-hidden="true">
                  {days.map((d, i) => (
                    <span key={i} className={`st__day is-${d}`} />
                  ))}
                </div>
                <div className="st__figs">
                  <span className="mono st__pct">{c.uptime90.toFixed(3)}%</span>
                  {c.health === "operational" ? (
                    <span className="mono st__ok">operational</span>
                  ) : (
                    <Tag tone="degraded">{c.health}</Tag>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section index="02" label="Uptime" tone="sunk">
        <Head
          title="Monthly availability, twelve months back."
          aside="Measured per instance from outside our network. SLA credit begins below 99.9%."
        />
        <div className="up">
          {UPTIME_HISTORY.map((m) => {
            const deficit = 100 - m.value;
            const h = Math.max(4, 100 - deficit * 2400);
            return (
              <div className="up__col" key={m.month}>
                <div className="up__barwrap">
                  <div
                    className={`up__bar ${m.value < 99.99 ? "is-under" : ""}`}
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="up__val mono">
                  {m.value === 100 ? "100" : m.value.toFixed(3)}
                </span>
                <span className="up__m mono">{m.month}</span>
              </div>
            );
          })}
        </div>
        <p className="up__note mono">
          Bars are scaled to the missing fraction of a percent, not to 100 — a
          full-height bar is a month with no recorded unavailability.
        </p>
      </Section>

      <Section index="03" label="History" id="history">
        <Head
          title="Incident history."
          aside="Every entry over five minutes has a post-mortem. We keep the embarrassing ones too."
        />
        <ul className="inc">
          {INCIDENTS.map((i) => {
            const on = open === i.id;
            return (
              <li className={`inc__item ${on ? "is-open" : ""}`} key={i.id}>
                <button
                  className="inc__head"
                  onClick={() => setOpen(on ? null : i.id)}
                  aria-expanded={on}
                >
                  <span className="mono inc__date">{i.date}</span>
                  <span className="inc__title">{i.title}</span>
                  <span className="inc__sev">
                    {i.severity === "maintenance" ? (
                      <Tag>maintenance</Tag>
                    ) : i.severity === "major" ? (
                      <Tag tone="down">major</Tag>
                    ) : (
                      <Tag tone="degraded">minor</Tag>
                    )}
                  </span>
                  <span className="mono inc__dur">{i.duration}</span>
                  <span className="inc__chev">
                    <Icon
                      name={on ? "minus" : "chevron"}
                      size={13}
                      strokeWidth={1.5}
                    />
                  </span>
                </button>

                <div className="inc__body" hidden={!on}>
                  <div className="inc__meta mono">
                    <span>{i.id}</span>
                    <span className="dim">scope {i.scope}</span>
                  </div>
                  <p className="inc__sum">{i.summary}</p>
                  <ol className="inc__updates">
                    {i.updates.map((u) => (
                      <li key={u.at}>
                        <span className="mono inc__ut">{u.at}</span>
                        <span className="inc__um">{u.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section index="04" label="Subscribe">
        <div className="sub">
          <div>
            <h2 className="t-h3">Get told before you notice.</h2>
            <p className="sub__body">
              Status changes are published to a JSON feed, an RSS feed and a
              webhook you can point at Discord or Slack. Account holders are
              emailed automatically for anything affecting their own resources.
            </p>
          </div>
          <dl className="sub__list">
            <div>
              <dt className="t-label">JSON</dt>
              <dd className="mono">status.asterza.host/api/v1/summary</dd>
            </div>
            <div>
              <dt className="t-label">RSS</dt>
              <dd className="mono">status.asterza.host/feed.xml</dd>
            </div>
            <div>
              <dt className="t-label">Webhook</dt>
              <dd className="mono">configurable per project in the panel</dd>
            </div>
          </dl>
        </div>
      </Section>
    </>
  );
}
