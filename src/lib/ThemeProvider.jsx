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
				resolvedTheme: resolved,
				setTheme: (t) => dispatch(setTheme(t)),
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
