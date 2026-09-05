import { SPEC_SHEET } from "../data/site";
import "./spec-sheet.css";

export function SpecSheet() {
  return (
    <div className="spec">
      {SPEC_SHEET.map((g) => (
        <section className="spec__group" key={g.group}>
          <div className="spec__gh">
            <h3 className="spec__gtitle">{g.group}</h3>
            <span className="spec__gcount mono">{g.rows.length} entries</span>
          </div>
          <dl className="spec__rows">
            {g.rows.map(([k, v]) => (
              <div className="spec__row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
