import { createContext, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyThemeToDOM, setTheme, syncThemeFromStorage, toggleTheme } from "../store/themeSlice.js";

function resolveTheme(mode) {
	if (mode === "system") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
	return mode === "dark" ? "dark" : "light";
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
	const theme = useSelector((s) => s.theme.theme);
	const dispatch = useDispatch();
	const resolved = useMemo(() => resolveTheme(theme), [theme]);

	useEffect(() => {
		// Canonical theme name is fixed; modes switch values centrally.
		document.documentElement.setAttribute("data-theme", "blue");
	}, []);

	useEffect(() => {
		dispatch(syncThemeFromStorage());
	}, [dispatch]);

	useEffect(() => {
		function handleStorage(e) {
			if (e.key === "theme") {
				dispatch(syncThemeFromStorage());
			}
		}
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, [dispatch]);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			if (theme === "system") {
				applyThemeToDOM("system");
			}
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [theme]);

	return (
		<ThemeContext.Provider
			value={{
				theme: resolved,
				themeMode: theme,
				themeName: "blue",
				resolvedTheme: resolved,
				setTheme: (t) => dispatch(setTheme(t)),
				/** Canonical runtime API: setTheme("blue") keeps the blue theme (mode via dark/light/system). */
				setThemeName: (name) => {
					if (name && name !== "blue") {
						return;
					}
					document.documentElement.setAttribute("data-theme", "blue");
				},
				toggleTheme: () => dispatch(toggleTheme()),
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return ctx;
}
