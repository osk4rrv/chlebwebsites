import { Button } from "../components/Button";
import { Eyebrow } from "../components/Bits";
import { DeployPanel } from "../components/DeployPanel";
import "./hero.css";

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__left">
          <Eyebrow>waw1 · 6 ms p50 · provisioning open</Eyebrow>

          <h1 className="t-display hero__h1">
            Fast where it counts.
            <span className="hero__h1-2">Boring everywhere else.</span>
          </h1>

          <p className="t-lead hero__lead">
            Asterza runs dedicated-core AMD EPYC and 5.7 GHz Ryzen nodes on Gen4
            NVMe across eight regions. Virtual servers, game servers and Discord
            bots — reachable about 38 seconds after you ask, billed by the hour.
          </p>

          <div className="hero__cta">
            <Button to="/signup" size="lg">
              Deploy a server
            </Button>
            <Button to="/pricing" size="lg" variant="outline">
              Compare plans
            </Button>
          </div>

          <ul className="hero__facts">
            <li className="mono">No setup fee</li>
            <li className="mono">DDoS and backups included</li>
            <li className="mono">
              From <span className="accent">€1.20</span>/mo
            </li>
          </ul>
        </div>

        <div className="hero__right">
          <DeployPanel />
          <p className="hero__caption mono">
            Live figures from a v.8 instance in our own fleet. Switch region to
            replay the deploy.
          </p>
        </div>
      </div>
    </section>
  );
}
