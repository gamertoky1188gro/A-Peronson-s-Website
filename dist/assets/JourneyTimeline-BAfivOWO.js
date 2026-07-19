import { r as l, g, d as f, j as s } from "./index-CNnTWoea.js";
const m = [
  "discovered",
  "matched",
  "contacted",
  "meeting_scheduled",
  "negotiating",
  "contract_drafted",
  "contract_signed",
  "closed",
];
function i(r) {
  return String(r || "")
    .replace(/_/g, " ")
    .replace(/^./, (n) => n.toUpperCase());
}
function _({ title: r = "Journey Timeline", matchId: n = "" }) {
  var x;
  const [e, c] = l.useState(null),
    [d, o] = l.useState("");
  l.useEffect(() => {
    const t = g();
    !t ||
      !n ||
      f(`/workflow/journeys/by-match/${encodeURIComponent(n)}`, { token: t })
        .then((a) => {
          (c(a), o(""));
        })
        .catch(() => {
          (c(null), o("Journey not started yet."));
        });
  }, [n]);
  const u = l.useMemo(
    () => m.indexOf(String((e == null ? void 0 : e.current_state) || "")),
    [e == null ? void 0 : e.current_state],
  );
  return s.jsxs("section", {
    className: "rounded-2xl bg-white p-4 ring-1 ring-slate-200/70",
    children: [
      s.jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-2",
        children: [
          s.jsx("h3", {
            className: "text-sm font-semibold text-slate-900",
            children: r,
          }),
          e != null && e.id
            ? s.jsxs("span", {
                className: "text-[11px] text-slate-500",
                children: ["Journey #", e.id.slice(0, 8)],
              })
            : null,
        ],
      }),
      s.jsx("div", {
        className: "mt-3 flex flex-wrap gap-2",
        children: m.map((t, a) => {
          const p = u >= a;
          return s.jsx(
            "span",
            {
              className: `inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${p ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-50 text-slate-500 ring-slate-200"}`,
              children: i(t),
            },
            t,
          );
        }),
      }),
      (x = e == null ? void 0 : e.transitions) != null && x.length
        ? s.jsxs("div", {
            className: "mt-3 text-xs text-slate-600",
            children: [
              "Recent transitions:",
              s.jsx("ul", {
                className: "mt-1 list-disc pl-5",
                children: e.transitions
                  .slice(-3)
                  .reverse()
                  .map((t) =>
                    s.jsxs(
                      "li",
                      {
                        children: [
                          i(t.from_state),
                          " → ",
                          i(t.to_state),
                          " (",
                          t.event_type,
                          ")",
                        ],
                      },
                      t.id,
                    ),
                  ),
              }),
            ],
          })
        : null,
      !e && d
        ? s.jsx("div", {
            className: "mt-2 text-xs text-slate-500",
            children: d,
          })
        : null,
    ],
  });
}
export { _ as J };
