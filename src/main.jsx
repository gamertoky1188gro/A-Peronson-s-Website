import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import "lenis/dist/lenis.css";
import { ThemeProvider } from "./lib/ThemeProvider.jsx";
import App from "./App.jsx";

const preventHorizontalOverflow = () => {
  document.documentElement.style.overflowX = "hidden";
  document.body.style.overflowX = "hidden";
  const root = document.getElementById("root");
  if (root) root.style.overflowX = "hidden";
};
preventHorizontalOverflow();
// Re-apply after any library (Lenis, etc.) might override it
const ro = new ResizeObserver(preventHorizontalOverflow);
ro.observe(document.documentElement);
// Also re-apply after React mounts and Lenis initializes
setTimeout(preventHorizontalOverflow, 500);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
