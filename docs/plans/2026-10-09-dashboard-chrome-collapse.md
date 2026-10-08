# Dashboard Chrome Collapse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Per-page collapsible global NavBar + Footer on Owner, Agent, and Admin dashboards with manual toggle + scroll autohide.

**Architecture:** Each dashboard page owns its collapse state via a shared `usePageChrome(pageKey)` hook that persists to `localStorage`, toggles `body.chrome-nav-hidden` / `body.chrome-footer-hidden` classes, and cleans up on unmount. `src/App.jsx` wraps NavBar/Footer in `.global-navbar` / `.global-footer` divs and renders chrome on admin routes so per-page toggles have something to hide.

**Tech Stack:** React 18, react-router-dom, Tailwind CSS v4 (`src/tailwind.css`), existing `src/hooks/useLocalStorageState.js` pattern. No new dependencies.

## Global Constraints

- Dashboard routes only: `/owner`, `/contracts`, `/leads`, `/verification` (OwnerDashboard), `/agent` (AgentDashboard), `/admin` (AdminPanel), `/admin/governance` (AdminGovernance).
- Storage keys namespaced per page: `chrome:<page>:nav`, `chrome:<page>:footer` with page in `owner | agent | admin | governance`.
- Both nav and footer start expanded; collapsed only from stored user choice.
- Body classes removed on page unmount; Owner state never affects Agent.
- All toggle buttons keyboard-accessible with `aria-expanded`.
- No footer content, nav link, or server changes.
- `npm run build` must pass; no new unit tests (UI-only, per approved spec).

---

### Task 1: `usePageChrome` hook

**Files:**
- Create: `src/hooks/usePageChrome.js`

**Interfaces:**
- Consumes: `src/hooks/useLocalStorageState.js` default export `useLocalStorageState(key, initialValue) -> [value, setAndPersist]`.
- Produces: default export `usePageChrome(pageKey) -> { navCollapsed, footerCollapsed, toggleNav, toggleFooter, autoHiddenNav, autoHiddenFooter }` where all values are booleans and both toggles are `() => void`. Effective visibility is derived by the caller as `navHidden = navCollapsed || autoHiddenNav` (same for footer); manual `collapsed=true` always wins because it ORs over the scroll flag.

- [ ] **Step 1: Create the hook**

```js
import { useCallback, useEffect, useState } from "react";
import useLocalStorageState from "./useLocalStorageState.js";

/**
 * Per-dashboard global-chrome collapse state.
 * Manual toggle persists to localStorage and always wins over scroll autohide.
 * @param {"owner"|"agent"|"admin"|"governance"} pageKey - namespace for storage keys + body classes.
 */
export default function usePageChrome(pageKey) {
	const [navCollapsed, setNavCollapsed] = useLocalStorageState(`chrome:${pageKey}:nav`, false);
	const [footerCollapsed, setFooterCollapsed] = useLocalStorageState(
		`chrome:${pageKey}:footer`,
		false,
	);
	const [autoHiddenNav, setAutoHiddenNav] = useState(false);
	const [autoHiddenFooter, setAutoHiddenFooter] = useState(false);

	const toggleNav = useCallback(() => setNavCollapsed((v) => !v), [setNavCollapsed]);
	const toggleFooter = useCallback(() => setFooterCollapsed((v) => !v), [setFooterCollapsed]);

	useEffect(() => {
		let lastY = window.scrollY;
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			window.requestAnimationFrame(() => {
				const y = window.scrollY;
				const down = y > lastY && y > 200;
				const up = y < lastY;
				if (down) {
					setAutoHiddenNav(true);
					setAutoHiddenFooter(true);
				} else if (up) {
					setAutoHiddenNav(false);
					setAutoHiddenFooter(false);
				}
				lastY = y;
				ticking = false;
			});
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const navHidden = navCollapsed || autoHiddenNav;
	const footerHidden = footerCollapsed || autoHiddenFooter;

	useEffect(() => {
		document.body.classList.toggle("chrome-nav-hidden", navHidden);
		document.body.classList.toggle("chrome-footer-hidden", footerHidden);
		return () => {
			document.body.classList.remove("chrome-nav-hidden");
			document.body.classList.remove("chrome-footer-hidden");
		};
	}, [navHidden, footerHidden]);

	return { navCollapsed, footerCollapsed, toggleNav, toggleFooter, autoHiddenNav, autoHiddenFooter };
}
```

- [ ] **Step 2: Verify no other file imports it yet and the file parses**

Run: `npx prettier --check src/hooks/usePageChrome.js`
Expected: `All matched files use Prettier code style!`

- [ ] **Step 3: Commit**

```bash
git add src/hooks/usePageChrome.js
git commit -n -m "feat(chrome): add usePageChrome per-dashboard collapse hook"
```

---

### Task 2: App shell wrappers + admin chrome opt-in + hide CSS

**Files:**
- Modify: `src/App.jsx:501-549` (AppLayout: `hideChrome`, bare branch, NavBar wrapper, Footer wrapper)
- Modify: `src/tailwind.css` (append hide rules at end of file)
- Modify: `src/pages/AdminPanel.jsx:2971-2973` (root `w-screen` -> `w-full` so it fits inside the app shell)

**Interfaces:**
- Consumes: `usePageChrome` body classes from Task 1 (`chrome-nav-hidden`, `chrome-footer-hidden`).
- Produces: `.global-navbar` / `.global-footer` wrapper divs that Tasks 3-6 hide via those body classes; admin routes render inside the app shell.

- [ ] **Step 1: Edit `src/App.jsx` AppLayout**

Replace:
```jsx
	const isImmersiveRoute = location.pathname === "/chat" || location.pathname === "/call";
	const isAdminRoute = location.pathname.startsWith("/admin");
	const hideChrome = isImmersiveRoute || isAdminRoute;
	const content =
		isAdminRoute || isImmersiveRoute ? (
```
With:
```jsx
	const isImmersiveRoute = location.pathname === "/chat" || location.pathname === "/call";
	const isAdminRoute = location.pathname.startsWith("/admin");
	const hideChrome = isImmersiveRoute;
	const content =
		isImmersiveRoute ? (
```
Replace `{hideChrome ? null : <NavBar />}` with:
```jsx
						{hideChrome ? null : (
							<div className="global-navbar">
								<NavBar />
							</div>
						)}
```
Replace `{!hideChrome && location.pathname !== "/feed" ? <Footer /> : null}` with:
```jsx
						{!hideChrome && location.pathname !== "/feed" ? (
							<div className="global-footer">
								<Footer />
							</div>
						) : null}
```
Leave the FloatingAssistant `hideChrome` gate untouched (admin pages gain the assistant; acceptable, note in manual test).

- [ ] **Step 2: Append hide rules to `src/tailwind.css`**

```css
/* Per-dashboard global chrome collapse (see usePageChrome). Instant hide; no animation. */
body.chrome-nav-hidden .global-navbar {
	display: none;
}
body.chrome-footer-hidden .global-footer {
	display: none;
}
```

- [ ] **Step 3: Fix AdminPanel root width**

In `src/pages/AdminPanel.jsx:2971-2973`, replace `admin-shell h-screen w-screen` with `admin-shell h-screen w-full`. No other AdminPanel markup changes.

- [ ] **Step 4: Build**

Run: `npm run build 2>&1 | Select-Object -Last 5`
Expected: build succeeds (`✓ built` lines, no errors).

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/tailwind.css src/pages/AdminPanel.jsx
git commit -n -m "feat(chrome): shell wrappers, admin chrome opt-in, hide rules"
```

---

### Task 3: OwnerDashboard toggles + pills

**Files:**
- Modify: `src/pages/OwnerDashboard.jsx:443-451` (header `ml-auto` badge div), plus floating pills before the closing of the main content div.

**Interfaces:**
- Consumes: `usePageChrome("owner")` from Task 1; `.global-navbar` / `.global-footer` + body classes from Task 2.
- Produces: nothing (leaf task).

- [ ] **Step 1: Add import**

Add to the hooks import block of `src/pages/OwnerDashboard.jsx`:
```js
import usePageChrome from "../hooks/usePageChrome.js";
```
Inside the component (next to other `useState` calls), add:
```js
	const { navCollapsed, footerCollapsed, toggleNav, toggleFooter } = usePageChrome("owner");
```

- [ ] **Step 2: Add header toggle buttons**

Inside the `ml-auto hidden items-center gap-2 sm:flex` div (`src/pages/OwnerDashboard.jsx:443`), after the Blue-Sky Theme span, add:
```jsx
										<button
											type="button"
											onClick={toggleNav}
											aria-expanded={!navCollapsed}
											className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
										>
											{navCollapsed ? "Show nav" : "Hide nav"}
										</button>
										<button
											type="button"
											onClick={toggleFooter}
											aria-expanded={!footerCollapsed}
											className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
										>
											{footerCollapsed ? "Show footer" : "Hide footer"}
										</button>
```

- [ ] **Step 3: Add floating pills**

Immediately inside the top-level dashboard container (sibling of `<aside>`, so pills show even when header is scrolled away), add:
```jsx
				{(navCollapsed || footerCollapsed) && (
					<div className="fixed bottom-4 right-4 z-40 flex gap-2">
						{navCollapsed && (
							<button
								type="button"
								onClick={toggleNav}
								className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5"
							>
								Show nav
							</button>
						)}
						{footerCollapsed && (
							<button
								type="button"
								onClick={toggleFooter}
								className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5"
							>
								Show footer
							</button>
						)}
					</div>
				)}
```

- [ ] **Step 4: Build**

Run: `npm run build 2>&1 | Select-Object -Last 5`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/pages/OwnerDashboard.jsx
git commit -n -m "feat(chrome): owner dashboard nav/footer toggles"
```

---

### Task 4: AgentDashboard toggles + pills

**Files:**
- Modify: `src/pages/AgentDashboard.jsx:317-327` (dashboard identity card), plus floating pills at container root.

**Interfaces:**
- Consumes: `usePageChrome("agent")` from Task 1; wrappers + body classes from Task 2.
- Produces: nothing (leaf task).

- [ ] **Step 1: Add import + hook**

Add `import usePageChrome from "../hooks/usePageChrome.js";` and inside the component:
```js
	const { navCollapsed, footerCollapsed, toggleNav, toggleFooter } = usePageChrome("agent");
```

- [ ] **Step 2: Add toggle row after the identity card**

After the closing of the identity card div (the `Agent Dashboard` h1 block ending at line 327), insert:
```jsx
					<div className="mt-3 flex gap-2">
						<button
							type="button"
							onClick={toggleNav}
							aria-expanded={!navCollapsed}
							className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
						>
							{navCollapsed ? "Show nav" : "Hide nav"}
						</button>
						<button
							type="button"
							onClick={toggleFooter}
							aria-expanded={!footerCollapsed}
							className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
						>
							{footerCollapsed ? "Show footer" : "Hide footer"}
						</button>
					</div>
```

- [ ] **Step 3: Add floating pills**

Same pill markup as Task 3 Step 3 (fixed bottom-right, `toggleNav`/`toggleFooter`), placed as a direct child of the root container div (`src/pages/AgentDashboard.jsx:311`).

- [ ] **Step 4: Build**

Run: `npm run build 2>&1 | Select-Object -Last 5`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AgentDashboard.jsx
git commit -n -m "feat(chrome): agent dashboard nav/footer toggles"
```

---

### Task 5: AdminGovernance toggles + pills

**Files:**
- Modify: `src/pages/AdminGovernance.jsx:439-448` (header action row), plus floating pills at container root.

**Interfaces:**
- Consumes: `usePageChrome("governance")` from Task 1; wrappers + body classes from Task 2.
- Produces: nothing (leaf task).

- [ ] **Step 1: Add import + hook**

Add `import usePageChrome from "../../hooks/usePageChrome.js";` — verify the relative depth first: `src/pages/AdminGovernance.jsx` imports hooks via `../hooks/`, so use `import usePageChrome from "../hooks/usePageChrome.js";`. Inside the component add:
```js
	const { navCollapsed, footerCollapsed, toggleNav, toggleFooter } = usePageChrome("governance");
```

- [ ] **Step 2: Add header buttons**

In the action row div (`src/pages/AdminGovernance.jsx:439`), after the Reload data Button, add:
```jsx
						<Button variant="secondary" onClick={toggleNav} aria-expanded={!navCollapsed}>
							{navCollapsed ? "Show nav" : "Hide nav"}
						</Button>
						<Button variant="secondary" onClick={toggleFooter} aria-expanded={!footerCollapsed}>
							{footerCollapsed ? "Show footer" : "Hide footer"}
						</Button>
```
`Button` is already imported in that file (used for dark mode / reload).

- [ ] **Step 3: Add floating pills**

Same pill markup as Task 3 Step 3, placed as a direct child of the root container div (`src/pages/AdminGovernance.jsx:413`).

- [ ] **Step 4: Build**

Run: `npm run build 2>&1 | Select-Object -Last 5`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AdminGovernance.jsx
git commit -n -m "feat(chrome): governance console nav/footer toggles"
```

---

### Task 6: AdminPanel toggles + pills

**Files:**
- Modify: `src/pages/AdminPanel.jsx:2994-3012` (sidebar header block), plus floating pills at shell root.

**Interfaces:**
- Consumes: `usePageChrome("admin")` from Task 1; wrappers + body classes from Task 2.
- Produces: nothing (leaf task).

- [ ] **Step 1: Add import + hook**

Add `import usePageChrome from "../hooks/usePageChrome.js";` (verify `../hooks/` matches that file's existing hook imports) and inside `AdminPanel` add:
```js
	const { navCollapsed, footerCollapsed, toggleNav, toggleFooter } = usePageChrome("admin");
```

- [ ] **Step 2: Add sidebar toggle buttons**

After the Admin Matrix chip div (ends `src/pages/AdminPanel.jsx:3011`), inside the header flex container, add:
```jsx
							<div class="mt-3 flex gap-2">
								<button
									type="button"
									onClick={toggleNav}
									aria-expanded={!navCollapsed ? "true" : "false"}
									class="rounded-full border border-slate-200/80 px-3 py-1 text-[11px] font-medium dark:border-white/10"
								>
									{navCollapsed ? "Show nav" : "Hide nav"}
								</button>
								<button
									type="button"
									onClick={toggleFooter}
									aria-expanded={!footerCollapsed ? "true" : "false"}
									class="rounded-full border border-slate-200/80 px-3 py-1 text-[11px] font-medium dark:border-white/10"
								>
									{footerCollapsed ? "Show footer" : "Hide footer"}
								</button>
							</div>
```
Note: this file uses `class=` (not `className=`); match it.

- [ ] **Step 3: Add floating pills**

Same pill markup as Task 3 Step 3 but with `class=` instead of `className=`, placed as a direct child of the `admin-shell` div (`src/pages/AdminPanel.jsx:2971`).

- [ ] **Step 4: Build**

Run: `npm run build 2>&1 | Select-Object -Last 5`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AdminPanel.jsx
git commit -n -m "feat(chrome): admin matrix nav/footer toggles"
```

---

### Task 7: Verification pass

**Files:**
- None (verification only). Restore `dist/` to HEAD after the final build per repo rule (source-only diffs).

**Interfaces:**
- Consumes: all Tasks 1-6.
- Produces: pushed branch, clean tree.

- [ ] **Step 1: Run existing unit tests**

Run: `npm test -- tests/unit/themeRegression.test.js 2>&1 | Select-Object -Last 5`
Expected: `Tests: 37 passed, 37 total`.

- [ ] **Step 2: Final build + restore dist**

Run: `npm run build 2>&1 | Select-Object -Last 5`
Expected: build succeeds. Then run:
```bash
git checkout HEAD -- dist/
git status --porcelain
```
Expected: only the 7 source files modified, no `dist/` entries.

- [ ] **Step 3: Manual checklist (logged in, desktop viewport)**

`/owner`: Hide nav hides top NavBar; Show nav pill restores; Hide footer hides footer; reload persists; scroll down autohides, scroll up reveals; manual Hide persists through scroll-up. Repeat for `/agent`, `/admin`, `/admin/governance`. Navigate `/owner` -> `/feed`: chrome fully restored (no leaked body classes). Verify with DevTools that `body` carries no `chrome-*` class outside dashboards.

- [ ] **Step 4: Push**

```bash
git push origin main
git status --porcelain | Measure-Object | Select-Object -ExpandProperty Count
```
Expected: `0`.
