import { PageHead } from "../components/PageHead";
import { Section, Head } from "../components/Section";
import { Button } from "../components/Button";
import { PriceMatrix } from "../components/PriceMatrix";
import { ControlPanel } from "../components/ControlPanel";
import { BotPanel, GamePanel } from "../components/ProductPanels";
import { CtaBand } from "../sections/Extras";
import { Network } from "../sections/Network";
import { FAMILIES } from "../data/plans";
import type { Family } from "../data/plans";
import { PRODUCT_PAGES } from "../data/products";
import { useTitle } from "../lib/hooks";

const PANELS: Record<Family, () => React.ReactElement> = {
  vps: ControlPanel,
  game: GamePanel,
  bot: BotPanel,
};

const PANEL_COPY: Record<Family, { label: string; title: string; note: string }> = {
  vps: {
    label: "Control panel",
    title: "Metrics, console, backups and firewall in one place.",
    note: "Every instance exposes the same surface: live resource graphs, a real serial console, self-serve restores and firewall rules enforced outside the guest.",
  },
  game: {
    label: "Game panel",
    title: "Tick rate is a first-class metric, not a support ticket.",
    note: "Console with real stdin, tick and MSPT history for 30 days, cron schedules with in-game warnings, and a snapshot before every restart.",
  },
  bot: {
    label: "Bot panel",
    title: "Shard state, logs and every build you have shipped.",
    note: "Readiness is measured on the gateway. Logs and metrics are retained for 30 days, and any previous build can be put back in one action.",
  },
};

export function ProductPage({ family }: { family: Family }) {
  const meta = FAMILIES.find((f) => f.id === family)!;
  const d = PRODUCT_PAGES[family];
  const Panel = PANELS[family];
  const pc = PANEL_COPY[family];

  useTitle(`${meta.nav} — Asterza`);

  return (
    <>
      <PageHead
        eyebrow={d.eyebrow}
        title={d.h1}
        lead={d.lead}
        strip={d.strip}
        actions={
          <>
            <Button to="/signup">{d.cta}</Button>
            <Button to="/pricing" variant="outline">
              All pricing
            </Button>
          </>
        }
      />

      <Section index="01" label="The argument" rule={false}>
        <div className="arg">
          <div>
            <h2 className="t-h2 arg__title">{d.argument.title}</h2>
            <p className="arg__body">{d.argument.body}</p>
          </div>
          <dl className="arg__points">
            {d.argument.points.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section tone="sunk" bare size="loose">
        <div className="pnl-head">
          <div>
            <p className="t-label">{pc.label}</p>
            <h2 className="t-h2 pnl-title">{pc.title}</h2>
          </div>
          <p className="pnl-note">{pc.note}</p>
        </div>
        <Panel />
      </Section>

      <Section index="02" label={d.catalogue.title}>
        <div className="cat">
          <div>
            <h2 className="t-h3">{d.catalogue.title}</h2>
            <p className="cat__note">{d.catalogue.note}</p>
          </div>
          <ul className="cat__list">
            {d.catalogue.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section index="03" label="Detail">
        <Head
          title={d.detail.title}
          aside="No asterisks, no fair-use policy that means the opposite of fair use."
        />
        <dl className="detail__rows">
          {d.detail.rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section index="04" label="Pricing">
        <Head
          title={`${meta.nav} plans`}
          lead={meta.summary}
          aside={
            <>
              Yearly billing takes 20% off. Everything bundled is listed under
              the table — nothing there is an add-on.
            </>
          }
        />
        <PriceMatrix family={family} showSwitcher={false} />
      </Section>

      <Section index="05" label="Regions">
        <Head
          title="Pick a region, change it later for free."
          aside="Latency is measured hourly from a reference probe in Warsaw. Every region has a public looking glass."
        />
        <Network compact />
      </Section>

      <CtaBand />
    </>
  );
}
