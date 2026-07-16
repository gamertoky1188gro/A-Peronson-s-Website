import { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme, toggleTheme, syncThemeFromStorage } from "../store/themeSlice";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const theme = useSelector((s) => s.theme.theme);
  const dispatch = useDispatch();

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

  return (
    <ThemeContext.Provider
      value={{
        theme,
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
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
