import { useState, useEffect } from "react";
import { getUserFromApi, getToken } from "../lib/auth";

export function useSecureUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const freshUser = await getUserFromApi(token);
        if (!cancelled) {
          setUser(freshUser);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}

// Hook specifically for subscription/premium checks - always fetches from API
export function usePremiumCheck() {
  const { user, loading } = useSecureUser();

  const isPremium =
    user?.subscription_status?.toLowerCase() === "premium" ||
    user?.entitlements?.plan?.toLowerCase() === "premium";

  return { isPremium, loading, user };
}

// Hook for entitlement checks - always fetches from API
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
