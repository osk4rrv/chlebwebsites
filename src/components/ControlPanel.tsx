import { useState } from "react";
import { Dot, Meter, Tag } from "./Bits";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { useDrift, useSeries } from "../lib/hooks";
import "./control-panel.css";

const SIDE: { group: string; items: { label: string; icon: IconName; badge?: string; on?: boolean }[] }[] = [
  {
    group: "Compute",
    items: [
      { label: "Instances", icon: "layers", badge: "12", on: true },
      { label: "Game servers", icon: "bolt", badge: "18" },
      { label: "Bots", icon: "terminal", badge: "4" },
      { label: "Images", icon: "disk" },
    ],
  },
  {
    group: "Platform",
    items: [
      { label: "Network", icon: "globe" },
      { label: "Firewalls", icon: "shield", badge: "3" },
      { label: "Backups", icon: "clock" },
      { label: "API tokens", icon: "lock" },
    ],
  },
];

const TABS = ["Overview", "Console", "Backups", "Network"] as const;
type Tab = (typeof TABS)[number];

function Area({ values, height = 92 }: { values: number[]; height?: number }) {
  const max = Math.max(...values) * 1.18;
  const w = 100;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = height - (v / max) * height;
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

const CONSOLE_LINES = [
  { t: "20:14:02", s: "info", m: "systemd[1]: Started containerd.service." },
  { t: "20:14:03", s: "info", m: "podman[812]: api-01 listening on 0.0.0.0:8080" },
  { t: "20:14:07", s: "warn", m: "postgres[941]: checkpoint took 4.2s, consider raising max_wal_size" },
  { t: "20:14:19", s: "info", m: "nginx[1204]: reopening logs after rotation" },
  { t: "20:15:41", s: "ok", m: "asterza-agent: backup snapshot bkp_71f2 uploaded (2.4 GB, 18.7s)" },
  { t: "20:16:02", s: "info", m: "kernel: nvme0n1: queue depth 1024, no errors since boot" },
  { t: "20:18:33", s: "ok", m: "asterza-agent: live migration source ready, guest paused 0.31s" },
];

const BACKUPS = [
  { id: "bkp_71f2c9", at: "2026-09-05 02:14", size: "2.4 GB", kind: "scheduled", keep: "9 days" },
  { id: "bkp_6ed418", at: "2026-09-04 02:14", size: "2.4 GB", kind: "scheduled", keep: "8 days" },
  { id: "bkp_6c19aa", at: "2026-09-03 19:02", size: "2.3 GB", kind: "manual", keep: "forever" },
  { id: "bkp_6bf03d", at: "2026-09-03 02:14", size: "2.3 GB", kind: "scheduled", keep: "6 days" },
];

const RULES = [
  { dir: "in", proto: "tcp", port: "443", from: "any", note: "https" },
  { dir: "in", proto: "tcp", port: "22", from: "5.173.0.0/16", note: "office" },
  { dir: "in", proto: "tcp", port: "5432", from: "vps_1de70b44", note: "postgres" },
  { dir: "out", proto: "any", port: "any", from: "—", note: "unrestricted" },
];

export function ControlPanel() {
  const [tab, setTab] = useState<Tab>("Overview");
  const cpu = useDrift(37, 4, 2500);
  const mem = useDrift(58, 2, 3200);
  const series = useSeries(
    [21, 26, 24, 33, 30, 41, 36, 45, 39, 34, 44, 51, 43, 38, 46, 40, 35, 42, 48, 37],
    5,
    2100,
  );

  return (
    <div className="cp">
      {/* Application chrome */}
      <div className="cp__chrome">
        <span className="cp__crumbs mono">
          northpoint <span className="cp__slash">/</span> waw1{" "}
          <span className="cp__slash">/</span>{" "}
          <span className="cp__crumb-on">api-01</span>
        </span>
        <span className="cp__chrome-sp" />
        <span className="cp__url mono">app.asterza.host</span>
      </div>

      <div className="cp__body">
        {/* Sidebar */}
        <nav className="cp__side" aria-label="Panel navigation">
          {SIDE.map((g) => (
            <div className="cp__sgroup" key={g.group}>
              <p className="t-label cp__sgtitle">{g.group}</p>
              <ul>
                {g.items.map((it) => (
                  <li key={it.label}>
                    <span className={`cp__sitem ${it.on ? "is-on" : ""}`}>
                      <Icon name={it.icon} size={13} strokeWidth={1.25} />
                      <span className="cp__slabel">{it.label}</span>
                      {it.badge && (
                        <span className="cp__sbadge mono">{it.badge}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="cp__sfoot mono">
            <Dot tone="ok" pulse />
            all regions ok
          </div>
        </nav>

        {/* Main */}
        <div className="cp__main">
          <header className="cp__head">
            <div className="cp__title">
              <h4 className="cp__hostname">api-01</h4>
              <Tag tone="ok">running</Tag>
            </div>
            <dl className="cp__meta">
              <div>
                <dt className="t-label">Plan</dt>
                <dd className="mono">v.8 · 8 vCPU / 16 GB</dd>
              </div>
              <div>
                <dt className="t-label">Region</dt>
                <dd className="mono">waw1 · Warsaw</dd>
              </div>
              <div>
                <dt className="t-label">Address</dt>
                <dd className="mono">194.181.44.117</dd>
              </div>
              <div>
                <dt className="t-label">Uptime</dt>
                <dd className="mono">41d 06:12</dd>
              </div>
            </dl>
          </header>

          <div className="cp__tabs" role="tablist">
            {TABS.map((t) => (
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
            {tab === "Overview" && (
              <>
                <div className="cp__tiles">
                  <div className="cp__tile">
                    <span className="t-label">CPU</span>
                    <span className="cp__tv num">{Math.round(cpu)}%</span>
                    <Meter value={cpu} segments={16} />
                    <span className="cp__tn mono">8 cores · steal 0.02%</span>
                  </div>
                  <div className="cp__tile">
                    <span className="t-label">Memory</span>
                    <span className="cp__tv num">
                      {(mem * 0.16).toFixed(1)} <span className="cp__tu">GB</span>
                    </span>
                    <Meter value={mem} segments={16} tone="ok" />
                    <span className="cp__tn mono">of 16 GB DDR5 ECC</span>
                  </div>
                  <div className="cp__tile">
                    <span className="t-label">NVMe</span>
                    <span className="cp__tv num">
                      112 <span className="cp__tu">GB</span>
                    </span>
                    <Meter value={47} segments={16} />
                    <span className="cp__tn mono">of 240 GB · 0.09 ms p50</span>
                  </div>
                  <div className="cp__tile">
                    <span className="t-label">Transfer</span>
                    <span className="cp__tv num">
                      3.1 <span className="cp__tu">TB</span>
                    </span>
                    <Meter value={13} segments={16} />
                    <span className="cp__tn mono">of 24 TB this month</span>
                  </div>
                </div>

                <div className="cp__chart">
                  <div className="cp__charthead">
                    <span className="t-label">Egress · last 60 minutes</span>
                    <span className="mono cp__chartval">
                      {series[series.length - 1].toFixed(0)} Mb/s
                    </span>
                  </div>
                  <Area values={series} />
                  <div className="cp__axis mono">
                    <span>-60m</span>
                    <span>-45m</span>
                    <span>-30m</span>
                    <span>-15m</span>
                    <span>now</span>
                  </div>
                </div>

                <div className="cp__events">
                  <p className="t-label cp__evtitle">Recent events</p>
                  <ul>
                    <li>
                      <span className="mono cp__evt">02:18</span>
                      <Dot tone="ok" />
                      <span className="cp__evm">
                        Live migrated to host waw1-b14 for kernel update
                      </span>
                      <span className="mono cp__evd">0.31s pause</span>
                    </li>
                    <li>
                      <span className="mono cp__evt">02:14</span>
                      <Dot tone="ok" />
                      <span className="cp__evm">
                        Scheduled backup completed
                      </span>
                      <span className="mono cp__evd">2.4 GB · 18.7s</span>
                    </li>
                    <li>
                      <span className="mono cp__evt">Sep 1</span>
                      <Dot tone="accent" />
                      <span className="cp__evm">
                        Resized v.4 to v.8 by marek@northpoint.gg
                      </span>
                      <span className="mono cp__evd">14s reboot</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {tab === "Console" && (
              <div className="cp__term">
                <div className="cp__termbar mono">
                  <span>serial console · ttyS0</span>
                  <span className="cp__termsp" />
                  <span className="dim">attached · 1 session</span>
                </div>
                <ol className="cp__lines">
                  {CONSOLE_LINES.map((l, i) => (
                    <li key={i} className={`cp__line is-${l.s}`}>
                      <span className="cp__lt mono">{l.t}</span>
                      <span className="cp__ls mono">{l.s}</span>
                      <span className="cp__lm mono">{l.m}</span>
                    </li>
                  ))}
                </ol>
                <div className="cp__prompt mono">
                  <span className="accent">root@api-01</span>:~#{" "}
                  <span className="cp__caret" />
                </div>
              </div>
            )}

            {tab === "Backups" && (
              <div className="cp__pane">
                <div className="cp__panehead">
                  <span className="t-label">
                    14 daily + 4 weekly retained off-node
                  </span>
                  <span className="mono dim">window 02:00–04:00 CET</span>
                </div>
                <table className="cp__table">
                  <thead>
                    <tr>
                      <th className="t-label">Snapshot</th>
                      <th className="t-label">Taken</th>
                      <th className="t-label">Size</th>
                      <th className="t-label">Kind</th>
                      <th className="t-label">Retention</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {BACKUPS.map((b) => (
                      <tr key={b.id}>
                        <td className="mono cp__strong">{b.id}</td>
                        <td className="mono">{b.at}</td>
                        <td className="mono">{b.size}</td>
                        <td>
                          {b.kind === "manual" ? (
                            <Tag tone="accent">manual</Tag>
                          ) : (
                            <Tag>scheduled</Tag>
                          )}
                        </td>
                        <td className="mono">{b.keep}</td>
                        <td className="cp__act">
                          <span className="cp__actlink">Restore</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="cp__panenote mono">
                  Restores are self-serve and boot from the snapshot in place.
                  Median restore time for a 240 GB volume is 2 m 40 s.
                </p>
              </div>
            )}

            {tab === "Network" && (
              <div className="cp__pane">
                <div className="cp__panehead">
                  <span className="t-label">Firewall · web (default deny)</span>
                  <span className="mono dim">attached to 4 instances</span>
                </div>
                <table className="cp__table">
                  <thead>
                    <tr>
                      <th className="t-label">Dir</th>
                      <th className="t-label">Protocol</th>
                      <th className="t-label">Port</th>
                      <th className="t-label">Source</th>
                      <th className="t-label">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RULES.map((r, i) => (
                      <tr key={i}>
                        <td className="mono cp__strong">{r.dir}</td>
                        <td className="mono">{r.proto}</td>
                        <td className="mono">{r.port}</td>
                        <td className="mono">{r.from}</td>
                        <td className="mono cp__muted">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <dl className="cp__addr">
                  <div>
                    <dt className="t-label">IPv4</dt>
                    <dd className="mono">194.181.44.117 · rDNS api-01.northpoint.gg</dd>
                  </div>
                  <div>
                    <dt className="t-label">IPv6</dt>
                    <dd className="mono">2a13:4f80:1e::1/64 routed</dd>
                  </div>
                  <div>
                    <dt className="t-label">Mitigation</dt>
                    <dd className="mono">
                      always-on · 3 events absorbed in 90 days
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
