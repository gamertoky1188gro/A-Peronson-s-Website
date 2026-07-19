import {
  r as x,
  b as d,
  u as p,
  j as n,
  c as m,
  m as y,
} from "./index-CNnTWoea.js";
function j({ child: t, scrollYProgress: a, index: r, count: e, overlap: o }) {
  const s = Math.max(0, Math.min(1, (r + 1) / e)),
    c = m(a, [s * 0.3, s * 0.7], [r * o, 0]),
    u = m(a, [s * 0.2, s * 0.5], [0.6, 1]),
    i = m(a, [s * 0.2, s * 0.5], [0.92, 1]);
  return n.jsx(y.div, {
    style: { y: c, opacity: u, scale: i, zIndex: e - r },
    className: "relative",
    children: t,
  });
}
function v({
  children: t,
  className: a = "",
  stackDistance: r = 80,
  overlap: e = 40,
}) {
  const o = x.useRef(null),
    s = d(),
    { scrollYProgress: c } = p({
      target: o,
      offset: ["start end", "end start"],
    });
  if (s) return n.jsx("div", { className: a, children: t });
  const u = Array.isArray(t) ? t.length : 1;
  return n.jsx("div", {
    ref: o,
    className: "relative " + a,
    children: Array.isArray(t)
      ? t.map((i, f) =>
          n.jsx(
            j,
            { child: i, scrollYProgress: c, index: f, count: u, overlap: e },
            f,
          ),
        )
      : t,
  });
}
export { v as C };
