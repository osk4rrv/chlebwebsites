import { useEffect, useRef, useState } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fires once when the element first enters the viewport. Used for the very
 *  restrained reveal on section entry. */
export function useInView<T extends HTMLElement>(rootMargin = "-12% 0px") {
  const ref = useRef<T | null>(null);
  // Initialised from the motion preference rather than corrected in an effect.
  const [seen, setSeen] = useState(reduced);

  useEffect(() => {
    if (reduced()) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, seen };
}

/** Reveals items one after another with a fixed stagger, once visible. */
export function useStagger(count: number, step = 340, start = 400) {
  const [n, setN] = useState(() => (reduced() ? count : 0));

  useEffect(() => {
    if (reduced()) return;
    const timers: number[] = [];
    for (let i = 1; i <= count; i++) {
      timers.push(window.setTimeout(() => setN(i), start + (i - 1) * step));
    }
    return () => timers.forEach(window.clearTimeout);
  }, [count, step, start]);

  return n;
}

/** Small random walk inside a band — for metrics that should look live
 *  without ever behaving dramatically. */
export function useDrift(
  base: number,
  amplitude: number,
  interval = 2600,
  decimals = 0,
) {
  const [v, setV] = useState(base);

  useEffect(() => {
    if (reduced()) return;
    const id = window.setInterval(() => {
      setV((prev) => {
        const pull = (base - prev) * 0.35;
        const jitter = (Math.random() - 0.5) * amplitude * 2;
        const next = prev + pull + jitter;
        const f = Math.pow(10, decimals);
        return Math.round(next * f) / f;
      });
    }, interval);
    return () => window.clearInterval(id);
  }, [base, amplitude, interval, decimals]);

  return v;
}

/** Rolling series that shifts one sample at a time. */
export function useSeries(seed: number[], amplitude: number, interval = 1800) {
  const [series, setSeries] = useState(seed);

  useEffect(() => {
    if (reduced()) return;
    const id = window.setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const mid = seed.reduce((a, b) => a + b, 0) / seed.length;
        const next = Math.max(
          1,
          last + (mid - last) * 0.3 + (Math.random() - 0.5) * amplitude * 2,
        );
        return [...prev.slice(1), Math.round(next * 10) / 10];
      });
    }, interval);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude, interval]);

  return series;
}

/** Locks the document title per route. */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
