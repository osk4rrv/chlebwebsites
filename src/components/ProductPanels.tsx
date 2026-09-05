import { useState } from "react";
import { Dot, Meter, Tag } from "./Bits";
import { useDrift, useSeries } from "../lib/hooks";
import "./control-panel.css";

/* Both panels reuse the control-panel stylesheet so every product surface on
   the site is visibly the same application. */

function Area({
  values,
  height = 92,
  domain,
}: {
  values: number[];
  height?: number;
  domain?: [number, number];
}) {
  const max = domain ? domain[1] : Math.max(...values) * 1.06;
  const min = domain ? domain[0] : Math.min(...values) * 0.96;
  const span = max - min || 1;
  const w = 100;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = height - ((v - min) / span) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return (
    <svg
      className="cparea"
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon
        className="cparea__fill"
        points={`0,${height} ${pts.join(" ")} ${w},${height}`}
      />
      <polyline
        className="cparea__line"
        points={pts.join(" ")}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ game */

const MC_LOG = [
  { t: "21:04:11", s: "info", m: "[Server thread/INFO]: Kaspar joined the game" },
  { t: "21:04:11", s: "info", m: "[Server thread/INFO]: Kaspar[/89.64.x.x:52114] logged in at (-812.5, 68.0, 1340.2)" },
  { t: "21:06:38", s: "info", m: "[Paper Watchdog]: tick 20.00 · mspt 7.4 · chunks 1842" },
  { t: "21:08:02", s: "warn", m: "[Server thread/WARN]: Chunk at -51,83 took 62ms to generate" },
  { t: "21:11:45", s: "ok", m: "[asterza]: snapshot bkp_2f81 written (1.9 GB, 11.2s) — world intact" },
  { t: "21:14:20", s: "info", m: "[Server thread/INFO]: 48 players online, view-distance 10" },
];

const SCHEDULES = [
  { name: "Nightly restart", cron: "0 4 * * *", next: "in 6h 44m", act: "restart + backup" },
  { name: "Warn players", cron: "45,55,59 3 * * *", next: "in 6h 29m", act: "say restart in Xm" },
  { name: "Weekly map render", cron: "0 5 * * 1", next: "in 3d 7h", act: "dynmap fullrender" },
  { name: "Prune old backups", cron: "30 5 * * *", next: "in 8h 14m", act: "keep 14" },
];

export function GamePanel() {
  const [tab, setTab] = useState("Performance");
  const tps = useSeries(
    [20, 20, 19.9, 20, 20, 19.8, 19.9, 20, 20, 19.9, 20, 20, 19.95, 20, 20, 19.9, 20, 20],
    0.09,
    2200,
  );
  const players = useDrift(48, 1.4, 4200);
  const last = tps[tps.length - 1];

  return (
    <div className="cp">
      <div className="cp__chrome">
        <span className="cp__crumbs mono">
          northpoint <span className="cp__slash">/</span> game{" "}
          <span className="cp__slash">/</span>{" "}
          <span className="cp__crumb-on">survival</span>
        </span>
        <span className="cp__chrome-sp" />
        <span className="cp__url mono">app.asterza.host</span>
      </div>

      <div className="cp__body cp__body--nosidebar">
        <div className="cp__main">
          <header className="cp__head">
            <div className="cp__title">
              <h4 className="cp__hostname">survival</h4>
              <Tag tone="ok">running</Tag>
              <span className="mono dim cp__since">up 12d 04:51</span>
            </div>
            <dl className="cp__meta">
              <div>
                <dt className="t-label">Runtime</dt>
                <dd className="mono">Paper 1.21.8 · Java 21</dd>
              </div>
              <div>
                <dt className="t-label">Plan</dt>
                <dd className="mono">g.16 · 16 GB · unlimited slots</dd>
              </div>
              <div>
                <dt className="t-label">Connect</dt>
                <dd className="mono">survival.northpoint.gg</dd>
              </div>
              <div>
                <dt className="t-label">Region</dt>
                <dd className="mono">waw1 · 6 ms</dd>
              </div>
            </dl>
          </header>

          <div className="cp__tabs" role="tablist">
            {["Performance", "Console", "Schedules"].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`cp__tab ${tab === t ? "is-on" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="cp__view">
            {tab === "Performance" && (
              <>
                <div className="cp__tiles">
                  <div className="cp__tile">
                    <span className="t-label">Tick rate</span>
                    <span className="cp__tv num">{last.toFixed(2)}</span>
                    <Meter value={(last / 20) * 100} segments={16} tone="ok" />
                    <span className="cp__tn mono">target 20.00 tps</span>
                  </div>
                  <div className="cp__tile">
                    <span className="t-label">MSPT</span>
                    <span className="cp__tv num">
                      7.4 <span className="cp__tu">ms</span>
                    </span>
                    <Meter value={15} segments={16} tone="ok" />
                    <span className="cp__tn mono">budget 50 ms</span>
                  </div>
                  <div className="cp__tile">
                    <span className="t-label">Players</span>
                    <span className="cp__tv num">{Math.round(players)}</span>
                    <Meter value={(players / 120) * 100} segments={16} />
                    <span className="cp__tn mono">peak today 71</span>
                  </div>
                  <div className="cp__tile">
                    <span className="t-label">Heap</span>
                    <span className="cp__tv num">
                      9.1 <span className="cp__tu">GB</span>
                    </span>
                    <Meter value={57} segments={16} />
                    <span className="cp__tn mono">of 16 GB · G1GC</span>
                  </div>
                </div>

                <div className="cp__chart">
                  <div className="cp__charthead">
                    <span className="t-label">Tick rate · last 90 minutes</span>
                    <span className="mono cp__chartval">
                      min {Math.min(...tps).toFixed(2)} · avg{" "}
                      {(tps.reduce((a, b) => a + b, 0) / tps.length).toFixed(2)}
                    </span>
                  </div>
                  <Area values={tps} domain={[18, 20.3]} />
                  <div className="cp__axis mono">
                    <span>-90m</span>
                    <span>-60m</span>
                    <span>-30m</span>
                    <span>now</span>
                  </div>
                </div>
              </>
            )}

            {tab === "Console" && (
              <div className="cp__term">
                <div className="cp__termbar mono">
                  <span>server console · stdin attached</span>
                  <span className="cp__termsp" />
                  <span className="dim">48 players</span>
                </div>
                <ol className="cp__lines">
                  {MC_LOG.map((l, i) => (
                    <li key={i} className={`cp__line is-${l.s}`}>
                      <span className="cp__lt mono">{l.t}</span>
                      <span className="cp__ls mono">{l.s}</span>
                      <span className="cp__lm mono">{l.m}</span>
                    </li>
                  ))}
                </ol>
                <div className="cp__prompt mono">
                  <span className="accent">survival</span>&gt;{" "}
                  <span className="cp__caret" />
                </div>
              </div>
            )}

            {tab === "Schedules" && (
              <div className="cp__pane">
                <div className="cp__panehead">
                  <span className="t-label">4 active schedules</span>
                  <span className="mono dim">timezone Europe/Warsaw</span>
                </div>
                <table className="cp__table">
                  <thead>
                    <tr>
                      <th className="t-label">Task</th>
                      <th className="t-label">Cron</th>
                      <th className="t-label">Next run</th>
                      <th className="t-label">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCHEDULES.map((s) => (
                      <tr key={s.name}>
                        <td className="cp__strong">{s.name}</td>
                        <td className="mono">{s.cron}</td>
                        <td className="mono">{s.next}</td>
                        <td className="mono cp__muted">{s.act}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="cp__panenote mono">
                  Restart warnings are announced in game at 15, 5 and 1 minute.
                  A snapshot is always taken before the process stops.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- bot */

const BOT_LOG = [
  { t: "21:14:02", s: "ok", m: "shard 3 READY · 12 502 guilds · gateway 39ms" },
  { t: "21:14:02", s: "info", m: "registered 41 application commands (0 changed)" },
  { t: "21:15:19", s: "info", m: "automod: deleted 2 messages in #general (invite-link rule)" },
  { t: "21:17:44", s: "warn", m: "bucket /channels/:id/messages 429 · retry_after 0.44s" },
  { t: "21:19:03", s: "info", m: "cache: 1 284 004 members resident · 412 MB rss" },
  { t: "21:22:31", s: "ok", m: "scheduled task purge_expired_cases removed 118 rows in 62ms" },
];

const SHARDS = [
  { id: 0, ping: 41, guilds: "12 480", ram: 58 },
  { id: 1, ping: 38, guilds: "12 511", ram: 61 },
  { id: 2, ping: 44, guilds: "12 396", ram: 55 },
  { id: 3, ping: 39, guilds: "12 502", ram: 63 },
];

const DEPLOYS = [
  { sha: "4a91c2e", msg: "fix: respect per-guild locale on /case", at: "2h ago", dur: "18s", state: "live" },
  { sha: "e7c04b1", msg: "chore: bump discord.js to 14.22.1", at: "3d ago", dur: "21s", state: "ok" },
  { sha: "9f3a77d", msg: "feat: appeal workflow", at: "6d ago", dur: "24s", state: "ok" },
  { sha: "0b12ce8", msg: "refactor: split automod rules", at: "9d ago", dur: "19s", state: "rolled back" },
];

export function BotPanel() {
  const [tab, setTab] = useState("Shards");
  const ping = useDrift(40, 2.5, 2600);

  return (
    <div className="cp">
      <div className="cp__chrome">
        <span className="cp__crumbs mono">
          northpoint <span className="cp__slash">/</span> bots{" "}
          <span className="cp__slash">/</span>{" "}
          <span className="cp__crumb-on">moderation-bot</span>
        </span>
        <span className="cp__chrome-sp" />
        <span className="cp__url mono">app.asterza.host</span>
      </div>

      <div className="cp__body cp__body--nosidebar">
        <div className="cp__main">
          <header className="cp__head">
            <div className="cp__title">
              <h4 className="cp__hostname">moderation-bot</h4>
              <Tag tone="ok">4 shards ready</Tag>
              <span className="mono dim cp__since">0 restarts in 30d</span>
            </div>
            <dl className="cp__meta">
              <div>
                <dt className="t-label">Build</dt>
                <dd className="mono">4a91c2e · node 22</dd>
              </div>
              <div>
                <dt className="t-label">Plan</dt>
                <dd className="mono">b.8 · 4 vCPU / 4 GB</dd>
              </div>
              <div>
                <dt className="t-label">Guilds</dt>
                <dd className="mono">49 889</dd>
              </div>
              <div>
                <dt className="t-label">Gateway</dt>
                <dd className="mono">{Math.round(ping)} ms avg</dd>
              </div>
            </dl>
          </header>

          <div className="cp__tabs" role="tablist">
            {["Shards", "Logs", "Deploys"].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`cp__tab ${tab === t ? "is-on" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="cp__view">
            {tab === "Shards" && (
              <div className="cp__pane">
                <div className="cp__panehead">
                  <span className="t-label">
                    Shard set · autoshard from gateway recommendation
                  </span>
                  <span className="mono dim">identify bucket 0 of 16 used</span>
                </div>
                <table className="cp__table">
                  <thead>
                    <tr>
                      <th className="t-label">Shard</th>
                      <th className="t-label">State</th>
                      <th className="t-label">Guilds</th>
                      <th className="t-label">Memory</th>
                      <th className="t-label">Gateway</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SHARDS.map((s) => (
                      <tr key={s.id}>
                        <td className="mono cp__strong">shard {s.id}</td>
                        <td>
                          <span className="cp__inline">
                            <Dot tone="ok" />
                            <span className="mono">READY</span>
                          </span>
                        </td>
                        <td className="mono">{s.guilds}</td>
                        <td>
                          <span className="cp__inline">
                            <Meter value={s.ram} segments={10} />
                            <span className="mono">{s.ram}%</span>
                          </span>
                        </td>
                        <td className="mono">{s.ping} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="cp__panenote mono">
                  Scaling up adds processes gradually so identify calls stay
                  inside Discord's bucket. No manual shard maths required.
                </p>
              </div>
            )}

            {tab === "Logs" && (
              <div className="cp__term">
                <div className="cp__termbar mono">
                  <span>combined logs · all shards</span>
                  <span className="cp__termsp" />
                  <span className="dim">30 day retention</span>
                </div>
                <ol className="cp__lines">
                  {BOT_LOG.map((l, i) => (
                    <li key={i} className={`cp__line is-${l.s}`}>
                      <span className="cp__lt mono">{l.t}</span>
                      <span className="cp__ls mono">{l.s}</span>
                      <span className="cp__lm mono">{l.m}</span>
                    </li>
                  ))}
                </ol>
                <div className="cp__prompt mono">
                  <span className="accent">asterza</span> bot logs -f{" "}
                  <span className="cp__caret" />
                </div>
              </div>
            )}

            {tab === "Deploys" && (
              <div className="cp__pane">
                <div className="cp__panehead">
                  <span className="t-label">
                    Builds · github.com/northpoint/moderation-bot
                  </span>
                  <span className="mono dim">branch main</span>
                </div>
                <table className="cp__table">
                  <thead>
                    <tr>
                      <th className="t-label">Commit</th>
                      <th className="t-label">Message</th>
                      <th className="t-label">When</th>
                      <th className="t-label">Build</th>
                      <th className="t-label">State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEPLOYS.map((d) => (
                      <tr key={d.sha}>
                        <td className="mono cp__strong">{d.sha}</td>
                        <td className="mono cp__wrap">{d.msg}</td>
                        <td className="mono">{d.at}</td>
                        <td className="mono">{d.dur}</td>
                        <td>
                          {d.state === "live" ? (
                            <Tag tone="ok">live</Tag>
                          ) : d.state === "ok" ? (
                            <Tag>ok</Tag>
                          ) : (
                            <Tag tone="degraded">rolled back</Tag>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="cp__panenote mono">
                  Any previous build can be redeployed in one action. Images are
                  kept for 30 days.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
