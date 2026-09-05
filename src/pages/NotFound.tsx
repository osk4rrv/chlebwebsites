import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { NAV } from "../data/site";
import { useTitle } from "../lib/hooks";
import "./notfound.css";

export function NotFound() {
  useTitle("404 — Asterza");

  return (
    <div className="nf">
      <div className="container nf__grid">
        <div>
          <p className="mono nf__code">HTTP 404 · no route</p>
          <h1 className="t-h1 nf__title">
            That page is not here.
            <span className="nf__sub">Your servers are, though.</span>
          </h1>
          <p className="nf__body">
            Either the link is old or we moved something without leaving a
            redirect. If you followed a link from our own site, that is our bug —
            tell support and it gets fixed the same day.
          </p>
          <div className="nf__cta">
            <Button to="/">Back to the front page</Button>
            <Button to="/status" variant="outline">
              Check status
            </Button>
          </div>
        </div>
        <nav className="nf__links" aria-label="Site sections">
          <p className="t-label">Everything else</p>
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/login">Log in</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
