import { ap as i, aq as u, r as c, g as p, ar as m } from "./index-CNnTWoea.js";
function a() {
  const e = i(),
    { user: r, loading: n, error: s } = u((t) => t.user);
  return (
    c.useEffect(() => {
      p() && e(m());
    }, [e]),
    { user: r, loading: n, error: s }
  );
}
function f() {
  var s, t, o;
  const { user: e, loading: r } = a();
  return {
    isPremium:
      ((s = e == null ? void 0 : e.subscription_status) == null
        ? void 0
        : s.toLowerCase()) === "premium" ||
      ((o =
        (t = e == null ? void 0 : e.entitlements) == null ? void 0 : t.plan) ==
      null
        ? void 0
        : o.toLowerCase()) === "premium",
    loading: r,
    user: e,
  };
}
function g() {
  const { user: e, loading: r } = a(),
    n = (s) => {
      if (!e) return !1;
      const t = e.entitlements || {};
      return t != null &&
        t.features &&
        Object.prototype.hasOwnProperty.call(t.features, s)
        ? !!t.features[s]
        : String(
            (t == null ? void 0 : t.plan) || e.subscription_status || "",
          ).toLowerCase() === "premium";
    };
  return {
    entitlements: e == null ? void 0 : e.entitlements,
    hasEntitlement: n,
    loading: r,
    user: e,
  };
}
export { f as a, g as b, a as u };
