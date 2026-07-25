import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./tailwind.css";
import "lenis/dist/lenis.css";
import App from "./App.jsx";
import { TIMEOUTS } from "./lib/constants.js";
import { logEnvStatus } from "./lib/envCheck.js";
import { ThemeProvider } from "./lib/ThemeProvider.jsx";
import { store } from "./store/index.js";

logEnvStatus();

const preventHorizontalOverflow = () => {
	document.documentElement.style.overflowX = "hidden";
	document.body.style.overflowX = "hidden";
	const root = document.getElementById("root");
	if (root) {
		root.style.overflowX = "hidden";
	}
};
preventHorizontalOverflow();
setTimeout(preventHorizontalOverflow, TIMEOUTS.SHORT);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</Provider>
	</StrictMode>,
);
