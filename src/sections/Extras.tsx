import { useState } from "react";
import { Button } from "../components/Button";
import { CodeTabs } from "../components/Code";
import { Icon } from "../components/Icon";
import { Mark } from "../components/Logo";
import { Dot } from "../components/Bits";
import { CODE_TABS } from "../data/docs";
import { FAQ, QUOTE, SITE } from "../data/site";
import "./extras.css";

/* --- Customer quote ---------------------------------------------------- */
export function Quote() {
  return (
    <figure className="quote">
      <span className="quote__mark">
        <Mark size={22} />
      </span>
      <blockquote className="quote__text">{QUOTE.text}</blockquote>
      <figcaption className="quote__by">
        <span className="quote__name">{QUOTE.name}</span>
        <span className="quote__role">{QUOTE.role}</span>
        <span className="quote__meta mono">{QUOTE.meta}</span>
      </figcaption>
    </figure>
  );
}

/* --- Developer surface ------------------------------------------------- */
export function DevStrip() {
  return (
    <div className="dev">
      <div className="dev__code">
        <CodeTabs tabs={CODE_TABS} />
      </div>
      <div className="dev__copy">
        <h2 className="t-h2">The panel is just a client of the same API.</h2>
        <p className="t-body dev__body">
          Nothing in the control panel uses a private endpoint. Anything you can
          click, you can script — with the CLI, the Terraform provider, or plain
          HTTP. Rate limits are the same for everyone and are not sold as a
          plan tier.
        </p>
        <dl className="dev__facts">
          <div>
            <dt className="t-label">Base URL</dt>
            <dd className="mono">api.asterza.host/v1</dd>
          </div>
          <div>
            <dt className="t-label">Auth</dt>
            <dd className="mono">Bearer token, scoped, revocable</dd>
          </div>
          <div>
            <dt className="t-label">Limits</dt>
            <dd className="mono">600 rpm read · 60 rpm write</dd>
          </div>
          <div>
            <dt className="t-label">Idempotency</dt>
            <dd className="mono">On every create endpoint</dd>
          </div>
        </dl>
        <div className="dev__cta">
          <Button to="/docs" variant="outline">
            Read the documentation
          </Button>
          <Button to="/docs/api-instances" variant="text" arrow>
            API reference
          </Button>
        </div>
      </div>
    </div>
  );
}

/* --- FAQ --------------------------------------------------------------- */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq">
      <div className="faq__aside">
        <p className="faq__asidetext">
          Anything not answered here, ask before you buy. Support is the same
          people who run the platform.
        </p>
        <a className="link mono faq__mail" href={`mailto:${SITE.support}`}>
          {SITE.support}
        </a>
        <p className="faq__reply mono">
          <Dot tone="ok" pulse /> median first reply 3 m 40 s
        </p>
      </div>

      <ul className="faq__list">
        {FAQ.map((f, i) => {
          const on = open === i;
          return (
            <li className={`faq__item ${on ? "is-open" : ""}`} key={f.q}>
              <button
                className="faq__q"
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
              >
                <span className="faq__qi mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="faq__qt">{f.q}</span>
                <span className="faq__qm">
                  <Icon name={on ? "minus" : "chevron"} size={13} strokeWidth={1.5} />
                </span>
              </button>
              <div className="faq__a" hidden={!on}>
                <p>{f.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* --- Closing band ------------------------------------------------------ */
export function CtaBand() {
  return (
    <section className="band">
      <div className="container band__in">
        <div className="band__copy">
          <h2 className="t-h1 band__h">
            Start with one server.
            <span className="band__h2">Move the rest when it earns it.</span>
          </h2>
          <p className="band__sub">
            Hourly billing, no setup fee and no contract. If the first hour does
            not convince you, delete it and you have spent less than a coffee.
          </p>
        </div>
        <div className="band__act">
          <Button to="/signup" size="lg">
            Deploy a server
          </Button>
          <Button to="/pricing" size="lg" variant="outline">
            See pricing
          </Button>
          <p className="band__note mono">
            €0.0079/hour to start · cancel any hour · 8 regions
          </p>
        </div>
      </div>
    </section>
  );
}
