import { Link } from "react-router-dom";
import { Mark } from "./Logo";
import { Dot } from "./Bits";
import { Icon } from "./Icon";
import { SITE } from "../data/site";
import { NETWORK, REGIONS } from "../data/regions";
import "./footer.css";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Products",
    links: [
      { label: "Virtual servers", to: "/vps" },
      { label: "Game servers", to: "/game-servers" },
      { label: "Discord bot hosting", to: "/discord-bots" },
      { label: "All products", to: "/products" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Regions & network", to: "/servers" },
      { label: "Specification sheet", to: "/servers#spec" },
      { label: "Status", to: "/status" },
      { label: "Incident history", to: "/status#history" },
      { label: "SLA", to: "/docs" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "API reference", to: "/docs/api-instances" },
      { label: "CLI", to: "/docs/quickstart" },
      { label: "Terraform provider", to: "/docs/quickstart" },
      { label: "Changelog", to: "/status#history" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Log in", to: "/login" },
      { label: "Get started", to: "/signup" },
      { label: "Support", to: "/docs" },
      { label: "Acceptable use", to: "/docs" },
      { label: "Privacy & DPA", to: "/docs" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="container foot__top">
        <div className="foot__brand">
          <span className="foot__mark">
            <Mark size={26} />
          </span>
          <p className="foot__pitch">
            Independent infrastructure operated out of {SITE.headquarters}.
            Own hardware, own network, {NETWORK.asn}.
          </p>
          <dl className="foot__facts">
            <div>
              <dt className="t-label">Founded</dt>
              <dd className="mono">{SITE.founded}</dd>
            </div>
            <div>
              <dt className="t-label">Capacity</dt>
              <dd className="mono">{NETWORK.capacityGbps} Gbps</dd>
            </div>
            <div>
              <dt className="t-label">Support</dt>
              <dd className="mono">{SITE.support}</dd>
            </div>
            <div>
              <dt className="t-label">Abuse</dt>
              <dd className="mono">{SITE.abuse}</dd>
            </div>
          </dl>
        </div>

        <div className="foot__cols">
          {COLUMNS.map((c) => (
            <nav className="foot__col" key={c.title} aria-label={c.title}>
              <p className="t-label foot__coltitle">{c.title}</p>
              <ul>
                {c.links.map((l) => (
                  <li key={l.label + l.to}>
                    <Link to={l.to} className="foot__link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Region ribbon — the network stated plainly, in monospace. */}
      <div className="foot__regions">
        <div className="container foot__regions-in">
          <span className="t-label">Regions</span>
          <ul className="foot__rlist">
            {REGIONS.map((r) => (
              <li key={r.code} className="foot__region mono">
                <Dot tone={r.status === "operational" ? "ok" : "degraded"} />
                {r.code}
                <span className="dim">{r.city}</span>
                <span className="foot__rlat">{r.latency} ms</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container foot__bar">
        <p className="mono foot__legal">
          © {year} {SITE.legal} · {SITE.vat}
        </p>
        <span className="foot__spacer" />
        <Link to="/status" className="foot__health mono">
          <Dot tone="ok" pulse />
          All systems operational
        </Link>
        <a
          className="foot__ext mono"
          href="https://bgp.tools/as/204213"
          target="_blank"
          rel="noreferrer noopener"
        >
          {NETWORK.asn}
          <Icon name="external" size={11} strokeWidth={1.4} />
        </a>
      </div>
    </footer>
  );
}
