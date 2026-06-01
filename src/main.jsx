import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import "lenis/dist/lenis.css";
import { ThemeProvider } from "./lib/ThemeProvider.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
