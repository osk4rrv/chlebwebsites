import { useMemo, useState } from "react";
import { Dot, Meter, Spark } from "./Bits";
import { Icon } from "./Icon";
import { REGIONS } from "../data/regions";
import { useDrift, useSeries, useStagger } from "../lib/hooks";
import "./deploy-panel.css";

const STEPS = [
  { name: "image", detail: "debian-13 · 2.1 GB", t: "1.8s" },
  { name: "volume", detail: "240 GB NVMe RAID10", t: "9.4s" },
  { name: "network", detail: "ipv4 + /64 attached", t: "2.2s" },
  { name: "mitigation", detail: "profile: default", t: "0.3s" },
  { name: "boot", detail: "kernel 6.12.9", t: "24.9s" },
];

const PICKS = ["waw1", "fra1", "ams1", "ash1"];

/**
 * The hero visualisation: a real deploy, then the instance it produced.
 * Region can be changed, which replays the deploy — the interaction is the
 * product, not an animation for its own sake.
 */
export function DeployPanel() {
  const [region, setRegion] = useState("waw1");
  const [run, setRun] = useState(0);

  // `run` is only used as a remount key below, which is what replays the
  // sequence when the region changes.
  const done = useStagger(STEPS.length, 420, 620);
  const cpu = useDrift(34, 3.5, 2400);
  const mem = useDrift(61, 1.8, 3100);
  const io = useDrift(112, 14, 2000);
  const net = useSeries([22, 31, 27, 44, 38, 52, 41, 47, 36, 44, 58, 49], 7, 1900);

  const active = useMemo(
    () => REGIONS.find((r) => r.code === region) ?? REGIONS[0],
    [region],
  );

  const total = useMemo(
    () => STEPS.reduce((a, s) => a + parseFloat(s.t), 0).toFixed(1),
    [],
  );

  const ip = useMemo(() => {
    const map: Record<string, string> = {
      waw1: "194.181.44.117",
      fra1: "45.132.208.61",
      ams1: "185.229.17.204",
      ash1: "38.171.96.42",
    };
    return map[region] ?? map.waw1;
  }, [region]);

  return (
    <div className="dpanel" key={run}>
      <div className="dpanel__bar">
        <span className="dpanel__title mono">
          <Icon name="terminal" size={13} strokeWidth={1.3} />
          asterza&nbsp;cli&nbsp;<span className="dim">v2.14.0</span>
        </span>

        <div className="dpanel__regions" role="group" aria-label="Region">
          {PICKS.map((code) => (
            <button
              key={code}
              className={`dpanel__region mono ${code === region ? "is-on" : ""}`}
              onClick={() => {
                if (code === region) return;
                setRegion(code);
                setRun((n) => n + 1);
              }}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      <div className="dpanel__cmd mono">
        <span className="dpanel__prompt">$</span> asterza vps create --plan{" "}
        <span className="accent">v.8</span> --region{" "}
        <span className="accent">{region}</span> --image debian-13 --wait
      </div>

      <ol className="dpanel__steps">
        {STEPS.map((s, i) => {
          const state = i < done ? "done" : i === done ? "active" : "wait";
          return (
            <li className={`dstep is-${state}`} key={s.name}>
              <span className="dstep__mark">
                {state === "done" ? (
                  <Icon name="check" size={11} strokeWidth={1.8} />
                ) : (
                  <span className="dstep__spin" />
                )}
              </span>
              <span className="dstep__name mono">{s.name}</span>
              <span className="dstep__detail mono">{s.detail}</span>
              <span className="dstep__t mono">{s.t}</span>
            </li>
          );
        })}
      </ol>

      <div className={`dpanel__result ${done === STEPS.length ? "is-on" : ""}`}>
        <span className="mono dpanel__id">vps_8c41f9e2</span>
        <span className="dpanel__ok mono">
          <Dot tone="ok" pulse />
          running
        </span>
        <span className="mono dim dpanel__total">
          {total}s · {active.city}, {active.cc} · {active.facility}
        </span>
      </div>

      {/* Live instance instrumentation */}
      <div className="dpanel__grid">
        <div className="dcell">
          <span className="t-label">CPU · 8 dedicated</span>
          <span className="dcell__v num">{Math.round(cpu)}%</span>
          <Meter value={cpu} segments={14} label={`CPU ${Math.round(cpu)}%`} />
          <span className="dcell__n mono">steal 0.02%</span>
        </div>
        <div className="dcell">
          <span className="t-label">Memory · 16 GB</span>
          <span className="dcell__v num">{(mem * 0.16).toFixed(1)} GB</span>
          <Meter value={mem} segments={14} tone="ok" label="Memory" />
          <span className="dcell__n mono">{Math.round(mem)}% of plan</span>
        </div>
        <div className="dcell">
          <span className="t-label">NVMe</span>
          <span className="dcell__v num">{Math.round(io)}k</span>
          <span className="dcell__spark">
            <Spark values={net.map((v) => v * 1.1)} height={22} tone="idle" />
          </span>
          <span className="dcell__n mono">iops · 0.09 ms p50</span>
        </div>
        <div className="dcell">
          <span className="t-label">Egress</span>
          <span className="dcell__v num">
            {net[net.length - 1].toFixed(0)} Mb/s
          </span>
          <span className="dcell__spark">
            <Spark values={net} height={22} />
          </span>
          <span className="dcell__n mono">10 Gbps port</span>
        </div>
      </div>

      <div className="dpanel__foot mono">
        <span>{ip}</span>
        <span className="dim">2a13:4f80:1e::1/64</span>
        <span className="dpanel__sp" />
        <span className="dim">
          p50 {active.latency} ms · uptime 41d 06:12
        </span>
      </div>
    </div>
  );
}
