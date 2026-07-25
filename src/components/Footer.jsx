import { Link } from "react-router-dom";
import { getCurrentUser } from "../lib/auth.js";
import { isRouteValid } from "../lib/routeHealthCheck.js";
import ScrollReveal from "./ScrollReveal.jsx";

/**
 * Renders the application footer.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
export default function Footer() {
	const user = getCurrentUser();

	if (!user) {
		return (
			<ScrollReveal
				as="footer"
				class="shadow-dividerT dark:shadow-dividerTDark bg-white py-8 dark:bg-slate-950"
			>
				<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div class="flex flex-col items-center justify-center gap-4 text-center">
						<div class="flex items-center gap-2">
							<span class="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-2 py-0.5 text-xs font-semibold text-white">
								B2B
							</span>
							<span class="text-lg font-bold text-slate-900 dark:text-white">GarTexHub</span>
						</div>
						<div class="flex gap-6 text-sm text-slate-600 dark:text-slate-400">
							<Link to="/terms" class="hover:text-gtBlue">
								Terms & Conditions
							</Link>
							<Link to="/privacy" class="hover:text-gtBlue">
								Privacy Policy
							</Link>
						</div>
						<p class="text-xs text-slate-500 dark:text-slate-400">
							© 2026 GarTexHub. All Rights Reserved.
						</p>
					</div>
				</div>
			</ScrollReveal>
		);
	}

	return (
		<ScrollReveal
			as="footer"
			class="shadow-dividerT dark:shadow-dividerTDark bg-white pt-12 pb-8 dark:bg-slate-950"
		>
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					{/* Company Identity */}
					<div class="lg:col-span-1">
						<div class="flex items-center gap-2 mb-4">
							<span class="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-2 py-0.5 text-xs font-semibold text-white">
								B2B
							</span>
							<span class="text-lg font-bold text-slate-900 dark:text-white">GarTexHub</span>
						</div>
						<p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
							Trusted B2B Marketplace for Garments & Textile Industry. Connecting International
							Buyers, Buying Houses, and Verified Factories through structured communication and
							professional digital workflows.
						</p>
						<div class="mt-6 flex gap-4">
							<a href="#" class="text-slate-400 hover:text-gtBlue transition-colors">
								LinkedIn
							</a>
							<a href="#" class="text-slate-400 hover:text-gtBlue transition-colors">
								Facebook
							</a>
							<a href="#" class="text-slate-400 hover:text-gtBlue transition-colors">
								YouTube
							</a>
						</div>
					</div>

					{/* Quick Links & Account Types */}
					<div>
						<h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
							Quick Navigation
						</h3>
						<ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
							<li>
								<Link to="/" class="hover:text-gtBlue">
									Home
								</Link>
							</li>
							<li>
								<Link to="/search" class="hover:text-gtBlue">
									Search
								</Link>
							</li>
							<li>
								<Link to="/buyer-requests" class="hover:text-gtBlue">
									Buyer Requests
								</Link>
							</li>
							<li>
								<Link to="/product-management" class="hover:text-gtBlue">
									Company Products
								</Link>
							</li>
							<li>
								<Link to="/pricing" class="hover:text-gtBlue">
									Subscription Plans
								</Link>
							</li>
							<li>
								<Link to="/help" class="hover:text-gtBlue">
									Help Center
								</Link>
							</li>
						</ul>
					</div>

					{/* Verification & Legal */}
					<div>
						<h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
							Verification & Legal
						</h3>
						<ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
							{isRouteValid("/verification") && (
								<li>
									<Link to="/verification" class="hover:text-gtBlue">
										Document Verification
									</Link>
								</li>
							)}
							{isRouteValid("/contracts") && (
								<li>
									<Link to="/contracts" class="hover:text-gtBlue">
										Digital Contract System
									</Link>
								</li>
							)}
							<li>
								<Link to="/privacy" class="hover:text-gtBlue">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link to="/terms" class="hover:text-gtBlue">
									Terms & Conditions
								</Link>
							</li>
							<li>
								<Link to="/privacy" class="hover:text-gtBlue">
									Cookie Policy
								</Link>
							</li>
						</ul>
					</div>

					{/* Support & Contact */}
					<div>
						<h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
							Support
						</h3>
						<ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
							<li>
								<span class="font-semibold">Email:</span>{" "}
								<a href="mailto:gartexhub@gmail.com" class="text-gtBlue hover:underline">
									gartexhub@gmail.com
								</a>
							</li>
							<li>
								<span class="font-semibold">Business:</span>{" "}
								<a href="mailto:gartexhub@gmail.com" class="text-gtBlue hover:underline">
									gartexhub@gmail.com
								</a>
							</li>
							<li class="pt-2 text-xs italic text-slate-500">
								The more verified documentation a company provides, the stronger its international
								credibility.
							</li>
						</ul>
					</div>
				</div>

				<div class="mt-12 shadow-dividerT dark:shadow-dividerTDark pt-8">
					<p class="text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
						© 2026 GarTexHub. All Rights Reserved. GarTexHub is an independent B2B networking
						platform.
						<br />
						The platform does not directly process financial transactions. All recorded
						communications are subject to consent and compliance regulations.
					</p>
				</div>
			</div>
		</ScrollReveal>
	);
}
