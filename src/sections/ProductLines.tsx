import { Link } from "react-router-dom";
import { Dot, Meter, Spark } from "../components/Bits";
import { Icon } from "../components/Icon";
import { FAMILIES, PLANS } from "../data/plans";
import type { Family } from "../data/plans";
import { useSeries } from "../lib/hooks";
import "./product-lines.css";

/* -------------------------------------------------------------------------
   Each product line gets a figure showing what that product's control
   surface actually looks like. Three different shapes, not three copies of
   the same card.
   ---------------------------------------------------------------------- */

function VpsFigure() {
  const rows = [
    { id: "vps_8c41f9e2", host: "api-01", plan: "v.8", region: "waw1", cpu: 34 },
    { id: "vps_1de70b44", host: "pg-primary", plan: "v.16", region: "waw1", cpu: 62 },
    { id: "vps_a0f92c17", host: "worker-03", plan: "v.4", region: "fra1", cpu: 18 },
  ];
  return (
    <figure className="fig">
      <figcaption className="fig__cap mono">
        <Icon name="layers" size={12} strokeWidth={1.3} />
        instances · 3 running
      </figcaption>
      <table className="fig__table">
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="mono fig__host">
                <Dot tone="ok" />
                {r.host}
              </td>
              <td className="mono fig__mid">{r.plan}</td>
              <td className="mono fig__mid">{r.region}</td>
              <td className="fig__meter">
                <Meter value={r.cpu} segments={10} label={`cpu ${r.cpu}%`} />
              </td>
              <td className="mono fig__num">{r.cpu}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="fig__foot mono">
        steal 0.02% p99 · all cores pinned
      </div>
    </figure>
  );
}

function GameFigure() {
  const tps = useSeries([20, 20, 19.9, 20, 20, 19.8, 20, 20, 20, 19.9, 20, 20], 0.12, 2200);
  const last = tps[tps.length - 1];
  return (
    <figure className="fig">
      <figcaption className="fig__cap mono">
        <Icon name="bolt" size={12} strokeWidth={1.3} />
        survival.northpoint.gg · paper 1.21.8
      </figcaption>
      <div className="fig__tick">
        <div className="fig__tickval">
          <span className="num">{last.toFixed(2)}</span>
          <span className="mono dim">tps</span>
        </div>
        <div className="fig__tickspark">
          {/* Fixed domain: a flat line should look flat. */}
          <Spark values={tps} height={40} tone="ok" domain={[18.5, 20.4]} />
        </div>
      </div>
      <div className="fig__stats">
        <div>
          <span className="t-label">Players</span>
          <span className="mono">48 / 120</span>
        </div>
        <div>
          <span className="t-label">MSPT</span>
          <span className="mono">7.4 ms</span>
        </div>
        <div>
          <span className="t-label">Chunks</span>
          <span className="mono">1 842</span>
        </div>
      </div>
      <div className="fig__foot mono">
        Ryzen 9 7950X · 5.7 GHz · restart 04:00 CET
      </div>
    </figure>
  );
}

function BotFigure() {
  const shards = [
    { id: 0, ping: 41, guilds: "12 480" },
    { id: 1, ping: 38, guilds: "12 511" },
    { id: 2, ping: 44, guilds: "12 396" },
    { id: 3, ping: 39, guilds: "12 502" },
  ];
  return (
    <figure className="fig">
      <figcaption className="fig__cap mono">
        <Icon name="terminal" size={12} strokeWidth={1.3} />
        moderation-bot · build 4a91c2e
      </figcaption>
      <table className="fig__table">
        <tbody>
          {shards.map((s) => (
            <tr key={s.id}>
              <td className="mono fig__host">
                <Dot tone="ok" />
                shard {s.id}
              </td>
              <td className="mono fig__mid">READY</td>
              <td className="mono fig__mid">{s.guilds} guilds</td>
              <td className="mono fig__num">{s.ping} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="fig__foot mono">
        49 889 guilds · 0 restarts in 30 days
      </div>
    </figure>
  );
}

const FIGURES: Record<Family, () => React.ReactElement> = {
  vps: VpsFigure,
  game: GameFigure,
  bot: BotFigure,
};

export function ProductLines() {
  return (
    <div className="prods">
      {FAMILIES.map((f, i) => {
        const Figure = FIGURES[f.id];
        const cheapest = PLANS[f.id][0];
        return (
          <article
            className={`prod ${i === 1 ? "prod--flip" : ""}`}
            key={f.id}
            id={f.id}
          >
            <div className="prod__head">
              <span className="prod__idx mono">{f.id}</span>
              <h3 className="t-h3 prod__name">{f.name}</h3>
              <span className="prod__hw mono">{f.hardware}</span>
            </div>

            <div className="prod__grid">
              <div className="prod__copy">
                <p className="prod__body">{f.body}</p>
                <ul className="prod__bullets">
                  {f.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Link to={f.path} className="prod__link">
                  {f.nav} in detail
                  <Icon name="arrow" size={14} strokeWidth={1.5} />
                </Link>
              </div>

              <div className="prod__fig">
                <Figure />
              </div>

              <aside className="prod__spec">
                <div className="prod__price">
                  <span className="t-label">From</span>
                  <span className="prod__amount num">
                    €{f.from.toFixed(2)}
                    <span className="prod__per mono">/mo</span>
                  </span>
                  <span className="prod__sku mono">
                    {cheapest.sku} · {cheapest.name}
                  </span>
                </div>
                <dl className="prod__kv">
                  <div>
                    <dt className="t-label">Entry</dt>
                    <dd className="mono">
                      {cheapest.cpu} · {cheapest.memory}
                    </dd>
                  </div>
                  <div>
                    <dt className="t-label">Storage</dt>
                    <dd className="mono">{cheapest.storage}</dd>
                  </div>
                  <div>
                    <dt className="t-label">Ready in</dt>
                    <dd className="mono accent">{cheapest.provision}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </article>
        );
      })}
    </div>
  );
}
