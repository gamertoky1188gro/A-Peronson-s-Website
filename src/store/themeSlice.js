import { createSlice } from "@reduxjs/toolkit";

function getInitialTheme() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

function applyThemeToDOM(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
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
  meta.setAttribute("content", theme === "dark" ? "#0f172a" : "#f8fafc");
}

const initialState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action) {
      const next = action.payload === "dark" ? "dark" : "light";
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
      if (stored === "dark" || stored === "light") {
        state.theme = stored;
        applyThemeToDOM(stored);
      }
    },
  },
});

export const { setTheme, toggleTheme, syncThemeFromStorage } =
  themeSlice.actions;
export default themeSlice.reducer;
