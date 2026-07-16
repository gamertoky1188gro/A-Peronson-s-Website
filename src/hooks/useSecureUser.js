import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser, clearUser as _clearUser } from "../store/userSlice";
import { getToken } from "../lib/auth";

export function useSecureUser() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.user);

  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  return { user, loading, error };
}

export function usePremiumCheck() {
  const { user, loading } = useSecureUser();
  const isPremium =
    user?.subscription_status?.toLowerCase() === "premium" ||
    user?.entitlements?.plan?.toLowerCase() === "premium";
  return { isPremium, loading, user };
}

export function useEntitlements() {
  const { user, loading } = useSecureUser();
  const hasEntitlement = (feature) => {
    if (!user) return false;
    const entitlements = user.entitlements || {};
    if (
      entitlements?.features &&
      Object.prototype.hasOwnProperty.call(entitlements.features, feature)
    ) {
      return Boolean(entitlements.features[feature]);
    }
    const plan = String(
      entitlements?.plan || user.subscription_status || "",
    ).toLowerCase();
    if (plan === "premium") return true;
    return false;
  };
  return { entitlements: user?.entitlements, hasEntitlement, loading, user };
}

export { clearUser } from "../store/userSlice";
