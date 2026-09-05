import { PageHead } from "../components/PageHead";
import { Section, Head } from "../components/Section";
import { PriceMatrix } from "../components/PriceMatrix";
import { Faq, CtaBand } from "../sections/Extras";
import { Button } from "../components/Button";
import { useTitle } from "../lib/hooks";

const ADDONS: [string, string][] = [
  ["Extra IPv4", "€1.20 / month, justification required by RIPE policy"],
  ["Snapshot storage", "€0.04 / GB / month, kept until you delete it"],
  ["Managed Postgres", "From €3.00 / month, daily logical backups included"],
  ["Extra backup retention", "€0.02 / GB / month beyond the plan's window"],
  ["Windows Server licence", "€14.00 / month per instance, billed at cost"],
  ["Dedicated /29 IPv4", "€7.00 / month, routed to one instance or a firewall"],
];

const NOT_CHARGED: string[] = [
  "DDoS protection, at any attack size",
  "Nightly off-node backups within the plan window",
  "Migrating a server between regions",
  "The control panel, API, CLI and Terraform provider",
  "Support, including out of hours",
  "Bandwidth inside the plan quota",
  "Restores, snapshots taken before a version change, rescue boots",
  "Setup, cancellation or reactivation",
];

export function Pricing() {
  useTitle("Pricing — Asterza");

  return (
    <>
      <PageHead
        eyebrow="hourly billing · capped at the monthly price"
        title="Priced so you can work out the bill yourself."
        lead="Every plan, every spec and the hourly rate to four decimals. Nothing is a call for quote and nothing gets more expensive at renewal."
        actions={
          <>
            <Button to="/signup">Get started</Button>
            <Button to="/docs" variant="outline">
              Read the docs first
            </Button>
          </>
        }
        strip={[
          ["Setup fee", "€0.00, all plans"],
          ["Minimum term", "One hour"],
          ["Yearly discount", "−20%"],
          ["Currency", "EUR, VAT shown at checkout"],
          ["Price changes", "Never on an existing plan"],
        ]}
      />

      <Section index="01" label="Plans" rule={false}>
        <PriceMatrix />
      </Section>

      <Section index="02" label="Extras">
        <Head
          title="The only things that cost more."
          lead="This is the complete list of paid add-ons. If something is not on it, it is included in the plan price."
          aside="Add-ons are billed hourly like everything else and can be removed at any time."
        />
        <div className="pricegrid">
          <div>
            <p className="t-label pricegrid__t">Paid add-ons</p>
            <dl className="detail__rows">
              {ADDONS.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="t-label pricegrid__t">Never charged for</p>
            <ul className="pricegrid__list">
              {NOT_CHARGED.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section index="03" label="Terms" tone="sunk">
        <Head
          title="SLA and credits, in one paragraph."
          aside="Credits are applied automatically. You should not have to ask for money back when we break something."
        />
        <div className="prose">
          <p>
            The availability target is 99.99% monthly per instance, measured from
            outside our network. Credit starts below 99.9%: 10% of that month's
            fee for every 0.1% missed, up to the whole month. Scheduled
            maintenance announced at least seven days in advance and executed
            between 02:00 and 05:00 local time does not count against
            availability — but live migration means it almost never involves
            downtime anyway.
          </p>
          <p>
            Every incident lasting more than five minutes gets a public
            post-mortem within 72 hours, whether or not anyone noticed. Past
            ones are on the status page and we do not delete them.
          </p>
        </div>
      </Section>

      <Section index="04" label="Questions">
        <Head title="Before you enter a card." wide />
        <Faq />
      </Section>

      <CtaBand />
    </>
  );
}
