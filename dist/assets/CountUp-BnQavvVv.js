import { ao as p, r as g, b as l, e as E, j as h } from "./index-CNnTWoea.js";
const b = { some: 0, all: 1 };
function w(n, s, { root: c, margin: u, amount: e = "some" } = {}) {
  const a = p(n),
    o = new WeakMap(),
    f = (i) => {
      i.forEach((t) => {
        const d = o.get(t.target);
        if (t.isIntersecting !== !!d)
          if (t.isIntersecting) {
            const m = s(t.target, t);
            typeof m == "function" ? o.set(t.target, m) : r.unobserve(t.target);
          } else typeof d == "function" && (d(t), o.delete(t.target));
      });
    },
    r = new IntersectionObserver(f, {
      root: c,
      rootMargin: u,
      threshold: typeof e == "number" ? e : b[e],
    });
  return (a.forEach((i) => r.observe(i)), () => r.disconnect());
}
function x(
  n,
  { root: s, margin: c, amount: u, once: e = !1, initial: a = !1 } = {},
) {
  const [o, f] = g.useState(a);
  return (
    g.useEffect(() => {
      if (!n.current || (e && o)) return;
      const r = () => (f(!0), e ? void 0 : () => f(!1)),
        i = { root: (s && s.current) || void 0, margin: c, amount: u };
      return w(n.current, r, i);
    }, [s, n, c, e, u]),
    o
  );
}
function D({ value: n, decimals: s = 0, suffix: c = "", className: u = "" }) {
  const e = l(),
    a = g.useRef(null),
    o = x(a, { once: !0, margin: "-60px" }),
    [f, r] = g.useState(e ? n : 0),
    i = E(0, { stiffness: 60, damping: 20, restDelta: 0.001 });
  (g.useEffect(() => {
    !o || e || i.set(n);
  }, [o, n, i, e]),
    g.useEffect(() => {
      if (e) return;
      const d = i.on("change", (m) => {
        r(m);
      });
      return () => d();
    }, [i, e]));
  const t = e
    ? Number(n).toLocaleString(void 0, {
        minimumFractionDigits: s,
        maximumFractionDigits: s,
      })
    : f.toLocaleString(void 0, {
        minimumFractionDigits: s,
        maximumFractionDigits: s,
      });
  return h.jsxs("span", { ref: a, className: u, children: [t, c] });
}
export { D as C };
