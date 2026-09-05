import { useState } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { FAMILIES, INCLUDED, PLANS } from "../data/plans";
import type { Family, Plan } from "../data/plans";
import "./price-matrix.css";

type Cycle = "monthly" | "yearly";

const ROWS: { label: string; get: (p: Plan) => string; note?: string }[] = [
  { label: "Processor", get: (p) => p.cpu, note: "1 vCPU = 1 pinned core" },
  { label: "Allocation", get: (p) => p.cpuNote },
  { label: "Memory", get: (p) => p.memory },
  { label: "Storage", get: (p) => p.storage, note: "Gen4 NVMe, RAID10" },
  { label: "Bandwidth", get: (p) => p.bandwidth },
  { label: "Uplink", get: (p) => p.uplink },
  { label: "Backups", get: (p) => p.backups, note: "off-node" },
  { label: "Provision", get: (p) => p.provision, note: "p95 measured" },
];

export function PriceMatrix({
  family: fixedFamily,
  showSwitcher = true,
}: {
  family?: Family;
  showSwitcher?: boolean;
}) {
  const [family, setFamily] = useState<Family>(fixedFamily ?? "vps");
  const [cycle, setCycle] = useState<Cycle>("monthly");

  const plans = PLANS[family];
  const meta = FAMILIES.find((f) => f.id === family)!;
  const price = (p: Plan) => (cycle === "monthly" ? p.price : p.priceAnnual);

  const rows = [
    ...ROWS.slice(0, 6),
    { label: plans[0].extraLabel, get: (p: Plan) => p.extra },
    ...ROWS.slice(6),
  ];

  return (
    <div className="pm">
      {/* Controls: two square segmented groups, no pills, no toggles. */}
      <div className="pm__controls">
        {showSwitcher && (
          <div className="seg" role="tablist" aria-label="Product family">
            {FAMILIES.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={family === f.id}
                className={`seg__btn ${family === f.id ? "is-on" : ""}`}
                onClick={() => setFamily(f.id)}
              >
                {f.nav}
              </button>
            ))}
          </div>
        )}

        <div className="pm__cycle">
          <div className="seg seg--sm" role="group" aria-label="Billing cycle">
            <button
              className={`seg__btn ${cycle === "monthly" ? "is-on" : ""}`}
              onClick={() => setCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`seg__btn ${cycle === "yearly" ? "is-on" : ""}`}
              onClick={() => setCycle("yearly")}
            >
              Yearly
              <span className="seg__save mono">−20%</span>
            </button>
          </div>
          <p className="pm__hw mono">{meta.hardware}</p>
        </div>
      </div>

      {/* --- Desktop / tablet: comparison matrix ------------------------- */}
      <div className="pm__scroll">
        <table className="pm__table">
          <colgroup>
            <col className="pm__col-label" />
            {plans.map((p) => (
              <col key={p.sku} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="pm__corner">
                <span className="t-label">{meta.nav} plans</span>
                <span className="pm__cornernote mono">
                  {cycle === "yearly" ? "paid yearly, per month" : "billed monthly"}
                </span>
              </th>
              {plans.map((p) => (
                <th
                  key={p.sku}
                  className={`pm__ph ${p.featured ? "is-featured" : ""}`}
                >
                  {p.featured && (
                    <span className="pm__flag mono">most chosen</span>
                  )}
                  <span className="pm__sku mono">{p.sku}</span>
                  <span className="pm__name">{p.name}</span>
                  <span className="pm__price num">
                    <span className="pm__cur">€</span>
                    {price(p).toFixed(2)}
                    <span className="pm__per mono">/mo</span>
                  </span>
                  {cycle === "yearly" && (
                    <span className="pm__was mono">
                      €{p.price.toFixed(2)} monthly
                    </span>
                  )}
                  <span className="pm__fit">{p.fit}</span>
                  <Button
                    to="/signup"
                    size="sm"
                    variant={p.featured ? "primary" : "outline"}
                    full
                  >
                    Deploy {p.sku}
                  </Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className="pm__rl">
                  {r.label}
                  {r.note && <span className="pm__rn mono">{r.note}</span>}
                </th>
                {plans.map((p) => (
                  <td
                    key={p.sku}
                    className={`pm__cell mono ${p.featured ? "is-featured" : ""}`}
                  >
                    {r.get(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="pm__lastrow">
              <th scope="row" className="pm__rl">
                Hourly rate
                <span className="pm__rn mono">capped at the monthly price</span>
              </th>
              {plans.map((p) => (
                <td
                  key={p.sku}
                  className={`pm__cell mono ${p.featured ? "is-featured" : ""}`}
                >
                  €{(p.price / 730).toFixed(4)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- Mobile: a different composition, not the table squeezed ----- */}
      <ul className="pm__stack">
        {plans.map((p) => (
          <li key={p.sku} className={`pms ${p.featured ? "is-featured" : ""}`}>
            <div className="pms__top">
              <div>
                <span className="pms__sku mono">{p.sku}</span>
                <h4 className="pms__name">{p.name}</h4>
              </div>
              <div className="pms__pricebox">
                <span className="pms__price num">€{price(p).toFixed(2)}</span>
                <span className="pms__per mono">/mo</span>
              </div>
            </div>
            <p className="pms__fit">{p.fit}</p>
            <dl className="pms__specs">
              {rows.slice(0, 7).map((r) => (
                <div key={r.label}>
                  <dt className="t-label">{r.label}</dt>
                  <dd className="mono">{r.get(p)}</dd>
                </div>
              ))}
            </dl>
            <Button
              to="/signup"
              variant={p.featured ? "primary" : "outline"}
              full
            >
              Deploy {p.sku}
            </Button>
          </li>
        ))}
      </ul>

      {/* Included with every plan — stated as prose rows, not tick marks. */}
      <div className="pm__inc">
        <p className="t-label pm__inctitle">
          Included with every {meta.nav.toLowerCase()} plan
        </p>
        <dl className="pm__inclist">
          {INCLUDED[family].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="pm__fineprint mono">
          Prices exclude VAT. EU consumers are charged VAT at their local rate,
          shown before payment. No setup fee, no charge for DDoS protection,
          backups or region migration. <Icon name="minus" size={11} /> We have
          never raised the price of an existing plan.
        </p>
      </div>
    </div>
  );
}
