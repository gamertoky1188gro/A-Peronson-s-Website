import { b as c, j as r, m as d } from "./index-CNnTWoea.js";
const v = (i, n) => ({
    hidden: {},
    visible: { transition: { staggerChildren: n, delayChildren: i } },
  }),
  x = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };
function M({
  children: i,
  className: n = "",
  staggerDelay: t = 0,
  staggerChildren: o = 0.06,
  as: a = "div",
  ...e
}) {
  if (c()) {
    const g = a;
    return r.jsx(g, { className: n, ...e, children: i });
  }
  const u = d[a];
  return r.jsx(u, {
    className: n,
    variants: v(t, o),
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: !0, margin: "-60px" },
    ...e,
    children: i,
  });
}
function j({ children: i, className: n = "", as: t = "div", ...o }) {
  if (c()) {
    const s = t;
    return r.jsx(s, { className: n, ...o, children: i });
  }
  const e = d[t];
  return r.jsx(e, { className: n, variants: x, ...o, children: i });
}
export { M as S, j as a };
