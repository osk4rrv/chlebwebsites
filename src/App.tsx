import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductPage } from "./pages/ProductPage";
import { Servers } from "./pages/Servers";
import { Pricing } from "./pages/Pricing";
import { Docs } from "./pages/Docs";
import { Status } from "./pages/Status";
import { Auth } from "./pages/Auth";
import { NotFound } from "./pages/NotFound";
import "./pages/pages.css";

/** Resets scroll on navigation, but respects in-page anchors. */
function ScrollReset() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollReset />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/vps" element={<ProductPage family="vps" />} />
          <Route path="/game-servers" element={<ProductPage family="game" />} />
          <Route path="/discord-bots" element={<ProductPage family="bot" />} />
          <Route path="/servers" element={<Servers />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/:slug" element={<Docs />} />
          <Route path="/status" element={<Status />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
