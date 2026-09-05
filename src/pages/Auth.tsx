import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Dot, Eyebrow } from "../components/Bits";
import { Icon } from "../components/Icon";
import { REGIONS } from "../data/regions";
import { PLANS } from "../data/plans";
import { useTitle } from "../lib/hooks";
import "./auth.css";

const STEPS: [string, string][] = [
  ["Account", "Email and a password. No phone number, no sales call."],
  ["Verify", "One click in your inbox. Card details are only needed at deploy."],
  ["Pick a region", "Eight to choose from. Change it later at no cost."],
  ["Deploy", "38 seconds later you have an address and root."],
];

export function Auth({ mode }: { mode: "login" | "signup" }) {
  const login = mode === "login";
  useTitle(login ? "Log in — Asterza" : "Get started — Asterza");

  const [sent, setSent] = useState(false);
  const region = REGIONS[0];
  const plan = PLANS.vps[1];

  return (
    <div className="auth">
      <div className="container auth__grid">
        {/* --- Form ------------------------------------------------------ */}
        <div className="auth__form">
          <Eyebrow tone={login ? "accent" : "ok"} pulse={false}>
            {login ? "app.asterza.host" : "no card required to sign up"}
          </Eyebrow>

          <h1 className="t-h2 auth__title">
            {login ? "Log in to the panel." : "Open an account."}
          </h1>
          <p className="auth__sub">
            {login
              ? "Same credentials for the panel, the CLI and the API. Two-factor is supported with TOTP or a hardware key."
              : "You can look around, price things up and read the docs before you enter any payment details. Nothing provisions until you ask it to."}
          </p>

          <form
            className="auth__fields"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {!login && (
              <label className="field">
                <span className="field__label t-label">Organisation</span>
                <input
                  className="field__input"
                  type="text"
                  name="org"
                  autoComplete="organization"
                  placeholder="Northpoint Network"
                />
              </label>
            )}

            <label className="field">
              <span className="field__label t-label">Email</span>
              <input
                className="field__input"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>

            <label className="field">
              <span className="field__label t-label">
                Password
                {login && (
                  <Link to="/login" className="field__aside">
                    Forgotten?
                  </Link>
                )}
              </span>
              <input
                className="field__input"
                type="password"
                name="password"
                required
                minLength={10}
                autoComplete={login ? "current-password" : "new-password"}
                placeholder={login ? "••••••••••" : "at least 10 characters"}
              />
            </label>

            {!login && (
              <label className="field field--row">
                <input className="field__check" type="checkbox" required />
                <span className="field__ctext">
                  I have read the{" "}
                  <Link to="/docs" className="link">
                    acceptable use policy
                  </Link>{" "}
                  and understand that crypto mining and open proxies are not
                  permitted.
                </span>
              </label>
            )}

            <Button type="submit" size="lg" full>
              {login ? "Log in" : "Create account"}
            </Button>

            {sent && (
              <p className="auth__notice mono">
                <Icon name="lock" size={12} strokeWidth={1.4} />
                This deployment of the site has no billing backend attached, so
                the form validates but does not create an account.
              </p>
            )}
          </form>

          <p className="auth__switch">
            {login ? (
              <>
                No account yet?{" "}
                <Link to="/signup" className="link">
                  Open one
                </Link>
              </>
            ) : (
              <>
                Already registered?{" "}
                <Link to="/login" className="link">
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>

        {/* --- Context column ------------------------------------------- */}
        <aside className="auth__side">
          {login ? (
            <>
              <p className="t-label">Platform status</p>
              <ul className="auth__status">
                {REGIONS.slice(0, 5).map((r) => (
                  <li key={r.code} className="mono">
                    <Dot tone={r.status === "operational" ? "ok" : "degraded"} />
                    {r.code}
                    <span className="dim">{r.city}</span>
                    <span className="auth__ms">{r.latency} ms</span>
                  </li>
                ))}
              </ul>
              <Link to="/status" className="auth__more mono">
                Full status page
                <Icon name="arrow" size={12} strokeWidth={1.4} />
              </Link>

              <div className="auth__block">
                <p className="t-label">Trouble getting in?</p>
                <p className="auth__blocktext">
                  Support can verify you with the last four digits of a payment
                  method and a resource ID. We will never ask for your password
                  or a token.
                </p>
                <a className="link mono" href="mailto:support@asterza.host">
                  support@asterza.host
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="t-label">What happens next</p>
              <ol className="auth__steps">
                {STEPS.map(([k, v], i) => (
                  <li key={k}>
                    <span className="auth__sidx mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="auth__sbody">
                      <span className="auth__sname">{k}</span>
                      <span className="auth__stext">{v}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="auth__block">
                <p className="t-label">A typical first server</p>
                <dl className="auth__quote">
                  <div>
                    <dt>Plan</dt>
                    <dd className="mono">
                      {plan.sku} · {plan.cpu} · {plan.memory}
                    </dd>
                  </div>
                  <div>
                    <dt>Storage</dt>
                    <dd className="mono">{plan.storage}</dd>
                  </div>
                  <div>
                    <dt>Region</dt>
                    <dd className="mono">
                      {region.code} · {region.city}
                    </dd>
                  </div>
                  <div>
                    <dt>Monthly</dt>
                    <dd className="mono accent">€{plan.price.toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt>Hourly</dt>
                    <dd className="mono">€{(plan.price / 730).toFixed(4)}</dd>
                  </div>
                </dl>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
