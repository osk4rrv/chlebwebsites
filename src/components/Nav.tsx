import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Dot } from "./Bits";
import { NAV, SITE } from "../data/site";
import { FAMILIES } from "../data/plans";
import { REGIONS, NETWORK } from "../data/regions";
import "./nav.css";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [products, setProducts] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(false);
    setProducts(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  const hold = (v: boolean) => {
    window.clearTimeout(closeTimer.current);
    if (v) setProducts(true);
    else closeTimer.current = window.setTimeout(() => setProducts(false), 120);
  };

  const operational = REGIONS.filter((r) => r.status === "operational").length;

  return (
    <>
      {/* Utility strip — scrolls away, carries live network facts. */}
      <div className="strip">
        <div className="container strip__in">
          <span className="strip__item mono">
            {NETWORK.asn} · {REGIONS.length} regions · {NETWORK.peers} peers
          </span>
          <span className="strip__spacer" />
          <span className="strip__item strip__item--hide mono">
            {SITE.headquarters}
          </span>
          <Link to="/status" className="strip__status mono">
            <Dot tone="ok" pulse />
            {operational}/{REGIONS.length} operational
          </Link>
        </div>
      </div>

      <header className={`nav ${scrolled ? "is-stuck" : ""}`}>
        <div className="container nav__in">
          <Logo />

          <nav className="nav__links" aria-label="Primary">
            <div
              className="nav__group"
              onMouseEnter={() => hold(true)}
              onMouseLeave={() => hold(false)}
            >
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `nav__link ${isActive || products ? "is-open" : ""}`
                }
                onFocus={() => hold(true)}
              >
                Products
                <Icon name="chevron" size={11} strokeWidth={1.6} />
              </NavLink>

              <div className={`pmenu ${products ? "is-open" : ""}`}>
                <div className="pmenu__inner">
                  <ul className="pmenu__list">
                    {FAMILIES.map((f) => (
                      <li key={f.id}>
                        <Link to={f.path} className="pmenu__item">
                          <span className="pmenu__idx mono">{f.index}</span>
                          <span className="pmenu__body">
                            <span className="pmenu__name">{f.nav}</span>
                            <span className="pmenu__sum">{f.summary}</span>
                            <span className="pmenu__hw mono">{f.hardware}</span>
                          </span>
                          <span className="pmenu__price mono">
                            from €{f.from.toFixed(2)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="pmenu__foot">
                    <Link to="/pricing" className="pmenu__foot-link">
                      Compare every plan
                      <Icon name="arrow" size={13} strokeWidth={1.5} />
                    </Link>
                    <span className="mono dim">
                      hourly billing · cancel any hour
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {NAV.filter((n) => n.label !== "Products").map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `nav__link ${isActive ? "is-active" : ""}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav__actions">
            <Link to="/login" className="nav__login">
              Log in
            </Link>
            <Button to="/signup" size="sm">
              Get started
            </Button>
          </div>

          <button
            className="nav__burger"
            onClick={() => setOpenMenu((v) => !v)}
            aria-label={openMenu ? "Close menu" : "Open menu"}
            aria-expanded={openMenu}
          >
            <Icon name={openMenu ? "close" : "menu"} size={18} strokeWidth={1.4} />
          </button>
        </div>
      </header>

      {/* Mobile sheet — a reordered composition, not the desktop nav stacked. */}
      <div className={`sheet ${openMenu ? "is-open" : ""}`} role="dialog" aria-modal="true">
        <div className="sheet__scroll">
          <p className="t-label sheet__label">Products</p>
          <ul className="sheet__products">
            {FAMILIES.map((f) => (
              <li key={f.id}>
                <Link to={f.path} className="sheet__product">
                  <span className="sheet__pname">{f.nav}</span>
                  <span className="sheet__pmeta mono">
                    from €{f.from.toFixed(2)}/mo
                  </span>
                  <span className="sheet__psum">{f.summary}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="t-label sheet__label">Company</p>
          <ul className="sheet__links">
            {NAV.filter((n) => n.label !== "Products").map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="sheet__link">
                  {n.label}
                  <Icon name="arrow" size={14} strokeWidth={1.4} />
                </Link>
              </li>
            ))}
          </ul>

          <div className="sheet__foot">
            <Button to="/signup" size="lg" full>
              Get started
            </Button>
            <Button to="/login" variant="outline" size="lg" full>
              Log in
            </Button>
            <p className="mono dim sheet__note">
              {NETWORK.asn} · {operational}/{REGIONS.length} regions operational
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
