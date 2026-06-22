import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./tailwind.css";
import "lenis/dist/lenis.css";
import { ThemeProvider } from "./lib/ThemeProvider.jsx";
import { store } from "./store/index.js";
import App from "./App.jsx";

const preventHorizontalOverflow = () => {
  document.documentElement.style.overflowX = "hidden";
  document.body.style.overflowX = "hidden";
  const root = document.getElementById("root");
  if (root) root.style.overflowX = "hidden";
};
preventHorizontalOverflow();
const ro = new ResizeObserver(preventHorizontalOverflow);
ro.observe(document.documentElement);
setTimeout(preventHorizontalOverflow, 500);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
