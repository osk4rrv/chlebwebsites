import { PageHead } from "../components/PageHead";
import { Section, Head } from "../components/Section";
import { Button } from "../components/Button";
import { Network } from "../sections/Network";
import { SpecSheet } from "../sections/SpecSheet";
import { CtaBand } from "../sections/Extras";
import { MetricRow } from "../components/Bits";
import { NETWORK, REGIONS } from "../data/regions";
import { useTitle } from "../lib/hooks";
import "./servers.css";

const HARDWARE = [
  {
    role: "General compute",
    cpu: "AMD EPYC 9354P",
    detail: "32 cores / 64 threads · 3.25 GHz base, 3.8 GHz all-core",
    ram: "384 GB DDR5-4800 ECC",
    disk: "8 × 3.84 TB Gen4 NVMe, RAID10 + hot spare",
    net: "2 × 25 Gbps LACP",
    use: "VPS plans v.2 – v.16, bot containers",
  },
  {
    role: "High-frequency",
    cpu: "Ryzen 9 7950X",
    detail: "16 cores / 32 threads · 4.5 GHz base, 5.7 GHz boost",
    ram: "128 GB DDR5-6000",
    disk: "4 × 2 TB Gen4 NVMe, RAID10",
    net: "2 × 10 Gbps LACP",
    use: "Game plans g.4 – g.32",
  },
  {
    role: "Storage / backup",
    cpu: "AMD EPYC 9124",
    detail: "16 cores / 32 threads",
    ram: "192 GB DDR5 ECC",
    disk: "24 × 20 TB SAS, RAIDZ2, NVMe SLOG",
    net: "2 × 25 Gbps LACP",
    use: "Off-node backups, snapshots, images",
  },
];

const METRICS = [
  { value: "480 Gbps", label: "Aggregate network capacity", sub: "across 8 regions" },
  { value: "412", label: "Peering sessions", sub: "5 exchanges, 4 transit carriers" },
  { value: "4.2 Tbps", label: "DDoS scrubbing capacity", sub: "on-net, always enabled" },
  { value: "0.09 ms", label: "NVMe read latency p50", sub: "0.41 ms at p99" },
  { value: "< 0.5%", label: "CPU steal target at p99", sub: "nodes pulled from sales above it" },
];

export function Servers() {
  useTitle("Servers & network — Asterza");

  return (
    <>
      <PageHead
        eyebrow={`${NETWORK.asn} · ${REGIONS.length} regions · ${NETWORK.peers} peers`}
        title="Our own hardware, our own address space."
        lead="We buy the machines, rack them, and announce our own prefixes. That means we can tell you exactly what your workload is running on — down to the drive model — and change it when it is the wrong answer."
        actions={
          <>
            <Button to="/signup">Deploy a server</Button>
            <Button to="/status" variant="outline">
              Live status
            </Button>
          </>
        }
      />

      <div className="container">
        <MetricRow items={METRICS} />
      </div>

      <Section index="01" label="Regions" rule={false}>
        <Network />
      </Section>

      <Section index="02" label="Hardware">
        <Head
          title="Three node types. Nothing else in the fleet."
          lead="We keep the fleet deliberately narrow. Fewer configurations means fewer surprises, spares that always fit, and a capacity model we can actually reason about."
          aside="Drive and CPU models change as generations turn over. When they do, existing customers are migrated onto the newer node at no cost."
        />
        <div className="hw">
          {HARDWARE.map((h) => (
            <article className="hw__row" key={h.role}>
              <div className="hw__head">
                <span className="t-label">{h.role}</span>
                <h3 className="hw__cpu">{h.cpu}</h3>
                <p className="hw__detail mono">{h.detail}</p>
              </div>
              <dl className="hw__specs">
                <div>
                  <dt className="t-label">Memory</dt>
                  <dd className="mono">{h.ram}</dd>
                </div>
                <div>
                  <dt className="t-label">Storage</dt>
                  <dd className="mono">{h.disk}</dd>
                </div>
                <div>
                  <dt className="t-label">Uplink</dt>
                  <dd className="mono">{h.net}</dd>
                </div>
                <div>
                  <dt className="t-label">Serves</dt>
                  <dd className="mono">{h.use}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <Section index="03" label="Connectivity" tone="sunk">
        <Head
          title="Four carriers and five exchanges, so no single upstream matters."
          aside="Routes are re-optimised continuously; a carrier with packet loss is drained rather than escalated."
        />
        <div className="conn">
          <div className="conn__col">
            <p className="t-label conn__title">Transit</p>
            <ul className="conn__list">
              {NETWORK.transit.map((t) => (
                <li key={t} className="mono">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="conn__col">
            <p className="t-label conn__title">Internet exchanges</p>
            <ul className="conn__list">
              {NETWORK.ixps.map((t) => (
                <li key={t} className="mono">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="conn__col conn__col--wide">
            <p className="t-label conn__title">Policy</p>
            <p className="conn__body">
              We are open to peering with anyone at the exchanges above — no
              minimum traffic, no ratio requirement. Prefixes are RPKI-signed and
              we filter our customers' announcements. A looking glass is
              published per region, and MANRS actions are implemented.
            </p>
            <p className="conn__body">
              Egress is never shaped below the plan's port speed while you are
              inside quota. Past quota we drop to 1 Gbps instead of invoicing
              you for overage you did not agree to.
            </p>
          </div>
        </div>
      </Section>

      <Section index="04" label="Specification" id="spec">
        <Head
          title="The full specification sheet."
          aside="Written once, kept current. If a line here stops being true we change it the same week."
        />
        <SpecSheet />
      </Section>

      <CtaBand />
    </>
  );
}
