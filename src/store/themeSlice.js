import { createSlice } from "@reduxjs/toolkit";

function resolveTheme(mode) {
	if (mode === "system") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
	return mode === "dark" ? "dark" : "light";
}

function getInitialTheme() {
	const stored = localStorage.getItem("theme");
	if (stored === "dark" || stored === "light" || stored === "system") {
		return stored;
	}
	return "system";
}

function applyThemeToDOM(mode) {
	const resolved = resolveTheme(mode);
	const root = document.documentElement;
	// Canonical Blue Theme scope (section 11: runtime dynamic theming).
	root.setAttribute("data-theme", "blue");
	root.setAttribute("data-mode", resolved);
	if (resolved === "dark") {
		root.classList.add("dark");
	} else {
		root.classList.remove("dark");
	}
	window.dispatchEvent(new Event("theme-change"));
	let meta = document.querySelector('meta[name="theme-color"]');
	if (!meta) {
		meta = document.createElement("meta");
		meta.setAttribute("name", "theme-color");
		document.head.appendChild(meta);
	}
	meta.setAttribute("content", resolved === "dark" ? "#0f172a" : "#f8fafc");
}

const initialState = {
	theme: getInitialTheme(),
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setTheme(state, action) {
			const next = action.payload;
			if (next !== "dark" && next !== "light" && next !== "system") {
				return;
			}
			state.theme = next;
			localStorage.setItem("theme", next);
			applyThemeToDOM(next);
		},
		toggleTheme(state) {
			const next = state.theme === "dark" ? "light" : "dark";
			state.theme = next;
			localStorage.setItem("theme", next);
			applyThemeToDOM(next);
		},
		syncThemeFromStorage(state) {
			const stored = localStorage.getItem("theme");
			if (stored === "dark" || stored === "light" || stored === "system") {
				state.theme = stored;
				applyThemeToDOM(stored);
			}
		},
	},
});

export const { setTheme, toggleTheme, syncThemeFromStorage } = themeSlice.actions;
export { applyThemeToDOM };

/**
 * Canonical runtime API (THEME.md): setThemeName("blue").
 * Theme name is fixed; modes (dark/light/system) switch values centrally.
 */
export function setThemeName(name) {
	if (name && name !== "blue") {
		return;
	}
	if (typeof document !== "undefined") {
		document.documentElement.setAttribute("data-theme", "blue");
	}
}

/** Back-compat alias so setTheme("blue") keeps the canonical theme. */
export function setCanonicalTheme(nameOrMode) {
	if (nameOrMode === "blue") {
		setThemeName("blue");
	}
}
export default themeSlice.reducer;
