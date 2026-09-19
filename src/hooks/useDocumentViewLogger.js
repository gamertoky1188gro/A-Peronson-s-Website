import { useCallback } from "react";
import { apiRequest } from "../lib/auth.js";

export function useDocumentViewLogger() {
	const logView = useCallback(async (documentId) => {
		if (!documentId) return null;
		try {
			const res = await apiRequest(`/documents/${documentId}/view`, { method: "POST" });
			return res?.view_count ?? null;
		} catch {
			return null;
		}
	}, []);

	const getViews = useCallback(async (documentId) => {
		if (!documentId) return null;
		try {
			return await apiRequest(`/documents/${documentId}/views`);
		} catch {
			return null;
		}
	}, []);

	return { logView, getViews };
}
