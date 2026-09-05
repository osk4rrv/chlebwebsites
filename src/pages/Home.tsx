import { Hero } from "../sections/Hero";
import { Section, Head } from "../components/Section";
import { MetricRow } from "../components/Bits";
import { ProductLines } from "../sections/ProductLines";
import { Network } from "../sections/Network";
import { ControlPanel } from "../components/ControlPanel";
import { SpecSheet } from "../sections/SpecSheet";
import { PriceMatrix } from "../components/PriceMatrix";
import { CtaBand, DevStrip, Faq, Quote } from "../sections/Extras";
import { Button } from "../components/Button";
import { METRICS } from "../data/site";
import { useTitle } from "../lib/hooks";

export function Home() {
  useTitle("Asterza — VPS, game server and bot hosting");

  return (
    <>
      <Hero />

      {/* Headline numbers as a divided data row, not a card grid. */}
      <div className="container">
        <MetricRow items={METRICS} />
      </div>

      <Section index="01" label="Product lines" rule={false}>
        <Head
          title="Three products, one platform underneath."
          lead="The panel, the API, the network and the support queue are shared. What changes between products is the shape of the machine and the tooling wrapped around it."
          aside={
            <>
              Everything is billed on the same account, from the same balance,
              with one invoice. Nothing is upsold twice.
            </>
          }
        />
        <ProductLines />
      </Section>

      <Section index="02" label="Network">
        <Network />
      </Section>

      {/* Full-width product section — different rhythm to everything above. */}
      <Section tone="sunk" bare size="loose">
        <div className="pnl-head">
          <div>
            <p className="t-label">Control panel</p>
            <h2 className="t-h2 pnl-title">
              This is the whole thing. There is no second dashboard.
            </h2>
          </div>
          <p className="pnl-note">
            Metrics, console, backups and firewall rules for every product live
            in one place. The screenshots below are the live interface — click
            through the tabs.
          </p>
        </div>
        <ControlPanel />
        <div className="pnl-foot">
          <span className="mono">
            app.asterza.host · 12 instances · 18 game servers · 4 bots
          </span>
          <Button to="/signup" variant="text" arrow>
            Open an account
          </Button>
        </div>
      </Section>

      <Section index="03" label="Platform">
        <Head
          title="The specification sheet, in full."
          lead="Hardware, storage, network and operating policy. If something matters to your workload and is not written here, ask and we will add it."
          aside={
            <>
              We would rather lose a sale to an honest spec than win one and
              spend six months arguing about steal time.
            </>
          }
        />
        <SpecSheet />
      </Section>

      <Section label="Customers" size="tight">
        <Quote />
      </Section>

      <Section index="04" label="Pricing">
        <Head
          title="Transparent to the fourth decimal."
          lead="Compare the plans side by side. Hourly rate, provisioning time and what is bundled are all on the table — there is no configurator that quietly triples the number."
          aside={
            <>
              Yearly billing takes 20% off. Everything else is the same price
              for everyone, including you in month twelve.
            </>
          }
        />
        <PriceMatrix />
      </Section>

      <Section index="05" label="Developers" tone="sunk">
        <DevStrip />
      </Section>

      <Section index="06" label="Questions">
        <Head title="Questions we get before people sign up." wide />
        <Faq />
      </Section>

      <CtaBand />
    </>
  );
}
