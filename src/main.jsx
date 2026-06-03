import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import "lenis/dist/lenis.css";
import { ThemeProvider } from "./lib/ThemeProvider.jsx";
import App from "./App.jsx";

// Ensure no horizontal overflow at the viewport level
const preventHorizontalOverflow = () => {
  document.documentElement.style.overflowX = "hidden";
  document.body.style.overflowX = "hidden";
  const root = document.getElementById("root");
  if (root) root.style.overflowX = "hidden";
};
preventHorizontalOverflow();
// Re-apply after Lenis might override it
const ro = new ResizeObserver(preventHorizontalOverflow);
ro.observe(document.documentElement);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
