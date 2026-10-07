/*
  Route: * (catch-all)
  Access: Public

  Purpose:
    - Show a styled 404 page for unknown routes.
    - Set noindex,nofollow so search engines don't index 404 URLs.
*/

import { Link } from "react-router-dom";
import usePageMeta from "../lib/usePageMeta.js";

export default function NotFound() {
	usePageMeta({
		title: "404 — Page Not Found — GarTexHub",
		description: "The page you're looking for doesn't exist or has been moved.",
		robots: "noindex,nofollow",
	});

	return (
		<div class="flex min-h-screen flex-col items-center justify-center bg-[var(--theme-custom-edf6ff)] px-4 text-center dark:bg-[var(--theme-custom-06131f)]">
			<div class="pointer-events-none absolute inset-0 overflow-hidden">
				<div class="absolute -top-24 left-[-8rem] h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
				<div class="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
			</div>

			<div class="relative">
				<p class="text-8xl font-bold tracking-tighter text-sky-500/20 dark:text-sky-400/15">404</p>
				<h1 class="-mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
				<p class="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
					The page you're looking for doesn't exist, has been moved, or is only accessible to
					authenticated users.
				</p>
				<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Link
						to="/"
						class="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
					>
						Go home
					</Link>
					<Link
						to="/help"
						class="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
					>
						Help center
					</Link>
				</div>
			</div>
		</div>
	);
}
