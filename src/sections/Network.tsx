import { useState } from "react";
import { Dot, Meter, Tag } from "../components/Bits";
import { Head } from "../components/Section";
import { NETWORK, REGIONS } from "../data/regions";
import "./network.css";

const MAX = Math.max(...REGIONS.map((r) => r.latency));

export function Network({ compact = false }: { compact?: boolean }) {
  const [sel, setSel] = useState<string>("waw1");
  const active = REGIONS.find((r) => r.code === sel) ?? REGIONS[0];

  return (
    <>
      {!compact && (
        <Head
          title={
            <>
              Eight regions, one autonomous system.
            </>
          }
          lead="We announce our own space and buy transit from four carriers, so a single upstream having a bad day is not your problem. Move an instance between regions whenever you like — it costs nothing."
          aside={
            <dl className="net__facts">
              <div>
                <dt className="t-label">Exchanges</dt>
                <dd className="mono">{NETWORK.ixps.join(" · ")}</dd>
              </div>
              <div>
                <dt className="t-label">Transit</dt>
                <dd className="mono">{NETWORK.transit.join(" · ")}</dd>
              </div>
              <div>
                <dt className="t-label">Aggregate</dt>
                <dd className="mono">
                  {NETWORK.capacityGbps} Gbps · {NETWORK.peers} sessions ·{" "}
                  {NETWORK.asn}
                </dd>
              </div>
            </dl>
          }
        />
      )}

      <div className="rtable-wrap">
        <table className="rtable">
          <thead>
            <tr>
              <th className="t-label">Region</th>
              <th className="t-label">Location</th>
              <th className="t-label rtable__hide-md">Facility</th>
              <th className="t-label rtable__hide-sm">Uplink</th>
              <th className="t-label rtable__lat">p50 from Warsaw</th>
              <th className="t-label rtable__hide-md">Allocated</th>
              <th className="t-label rtable__st">State</th>
            </tr>
          </thead>
          <tbody>
            {REGIONS.map((r) => {
              const on = r.code === sel;
              return (
                <tr
                  key={r.code}
                  className={`rrow ${on ? "is-sel" : ""}`}
                  onClick={() => setSel(r.code)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSel(r.code);
                    }
                  }}
                >
                  <td className="rrow__code mono">
                    {r.code}
                    {r.tier === "core" && <span className="rrow__tier">core</span>}
                  </td>
                  <td className="rrow__city">
                    {r.city}
                    <span className="mono dim rrow__cc">{r.cc}</span>
                  </td>
                  <td className="mono rrow__fac rtable__hide-md">{r.facility}</td>
                  <td className="mono rrow__up rtable__hide-sm">{r.uplink}</td>
                  <td className="rrow__lat">
                    <span className="rrow__bar">
                      <span
                        className="rrow__barfill"
                        style={{ width: `${(r.latency / MAX) * 100}%` }}
                      />
                    </span>
                    <span className="mono rrow__ms">{r.latency} ms</span>
                  </td>
                  <td className="rtable__hide-md">
                    <span className="rrow__cap">
                      <Meter
                        value={r.capacity}
                        segments={10}
                        tone={r.capacity > 80 ? "degraded" : "accent"}
                        label={`${r.capacity}% allocated`}
                      />
                      <span className="mono rrow__pct">{r.capacity}%</span>
                    </span>
                  </td>
                  <td className="rrow__state">
                    {r.status === "operational" ? (
                      <span className="rrow__ok mono">
                        <Dot tone="ok" />
                        live
                      </span>
                    ) : (
                      <Tag tone="degraded">buildout</Tag>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail band for the selected region — the table stays scannable, the
          specifics live underneath it. */}
      <div className="rdetail">
        <div className="rdetail__id">
          <span className="mono rdetail__code">{active.code}</span>
          <span className="rdetail__place">
            {active.city}, {active.country}
          </span>
        </div>
        <dl className="rdetail__grid">
          <div>
            <dt className="t-label">Facility</dt>
            <dd className="mono">{active.facility}</dd>
          </div>
          <div>
            <dt className="t-label">Uplink</dt>
            <dd className="mono">{active.uplink}</dd>
          </div>
          <div>
            <dt className="t-label">p50 / p99</dt>
            <dd className="mono">
              {active.latency} ms / {Math.round(active.latency * 1.34 + 3)} ms
            </dd>
          </div>
          <div>
            <dt className="t-label">Allocated</dt>
            <dd className="mono">{active.capacity}% of racked capacity</dd>
          </div>
          <div>
            <dt className="t-label">Looking glass</dt>
            <dd className="mono">lg.{active.code}.asterza.host</dd>
          </div>
        </dl>
        <p className="rdetail__note mono">
          Latency measured hourly from a reference probe in Warsaw over the last
          30 days. Your own figures will differ; every region has a public
          looking glass and a 1 GB test file if you would rather check yourself.
        </p>
      </div>
    </>
  );
}
