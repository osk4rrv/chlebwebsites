import { PageHead } from "../components/PageHead";
import { Section, Head } from "../components/Section";
import { Button } from "../components/Button";
import { ProductLines } from "../sections/ProductLines";
import { ControlPanel } from "../components/ControlPanel";
import { CtaBand } from "../sections/Extras";
import { PLANS, FAMILIES } from "../data/plans";
import { useTitle } from "../lib/hooks";

const CHOOSE: [string, string][] = [
  [
    "You want full control of the machine",
    "Virtual servers. Root, your own kernel modules, your own stack, our hardware.",
  ],
  [
    "You are running a game community",
    "Game servers. High clock speed, a panel your moderators can use, no root required.",
  ],
  [
    "You have a long-running bot or worker",
    "Bot hosting. Push a repo, we keep the process alive and the logs readable.",
  ],
  [
    "You need something we do not list",
    "Take a VPS. Anything that runs on Linux runs there, and support will help you size it.",
  ],
];

export function Products() {
  useTitle("Products — Asterza");

  return (
    <>
      <PageHead
        eyebrow="3 product lines · 1 account · 1 invoice"
        title="Everything runs on the same platform."
        lead="Three products, shaped differently because the workloads are different. The network, the panel, the API and the people answering support are shared across all of them."
        actions={
          <>
            <Button to="/pricing">Compare pricing</Button>
            <Button to="/docs" variant="outline">
              Documentation
            </Button>
          </>
        }
        strip={FAMILIES.map(
          (f) =>
            [f.nav, `from €${f.from.toFixed(2)}/mo · ${PLANS[f.id].length} plans`] as [
              string,
              string,
            ],
        ).concat([["Regions", "8 · free migration"]])}
      />

      <Section index="01" label="Product lines" rule={false}>
        <ProductLines />
      </Section>

      <Section index="02" label="Choosing">
        <Head
          title="Which one you want, stated plainly."
          aside="If you pick wrong, moving between products is a support message and a prorated balance transfer."
        />
        <dl className="detail__rows">
          {CHOOSE.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="sunk" bare size="loose">
        <div className="pnl-head">
          <div>
            <p className="t-label">Control panel</p>
            <h2 className="t-h2 pnl-title">
              One application for all three products.
            </h2>
          </div>
          <p className="pnl-note">
            Instances, game servers and bots sit in the same sidebar, share
            firewalls and backups, and are billed from the same balance.
          </p>
        </div>
        <ControlPanel />
      </Section>

      <CtaBand />
    </>
  );
}
