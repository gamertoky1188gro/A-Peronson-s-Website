/*
  Route: /boosts/:id
  Access: Protected (login required)
  Boost Details — reached from the Boost button on a feed post.
  Creates a boost (POST /boosts) and lists existing boosts (GET /boosts).
*/

import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, getToken } from "../lib/auth.js";

export default function BoostDetailsPage() {
	const { id: postId } = useParams();
	const [boostScope, setBoostScope] = useState("feed");
	const [boostDuration, setBoostDuration] = useState("7");
	const [boostMultiplier, setBoostMultiplier] = useState("2");
	const [boostPrice, setBoostPrice] = useState("9.99");
	const [boosts, setBoosts] = useState([]);
	const [loadingBoosts, setLoadingBoosts] = useState(true);
	const [creatingBoost, setCreatingBoost] = useState(false);
	const [boostFeedback, setBoostFeedback] = useState("");

	const loadBoosts = useCallback(async () => {
		const token = getToken();
		if (!token) {
			setLoadingBoosts(false);
			return;
		}
		setLoadingBoosts(true);
		try {
			const data = await apiRequest("/boosts", { token });
			setBoosts(Array.isArray(data?.boosts) ? data.boosts : []);
		} catch {
			setBoosts([]);
		} finally {
			setLoadingBoosts(false);
		}
	}, []);

	useEffect(() => {
		loadBoosts();
	}, [loadBoosts]);

	const createBoost = async () => {
		const token = getToken();
		if (!token) return;
		setCreatingBoost(true);
		setBoostFeedback("");
		try {
			const data = await apiRequest("/boosts", {
				method: "POST",
				token,
				body: {
					scope: boostScope,
					duration_days: Number(boostDuration),
					multiplier: Number(boostMultiplier),
					price_usd: Number(boostPrice),
				},
			});
			setBoosts((prev) => [data?.boost, ...prev].filter(Boolean));
			setBoostFeedback("Boost created successfully.");
		} catch (err) {
			setBoostFeedback(err.message || "Failed to create boost");
		} finally {
			setCreatingBoost(false);
		}
	};

	return (
		<div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
			<div>
				<h1 className="text-2xl font-bold text-slate-900 dark:text-white">Boost Details</h1>
				<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
					Boosting post <span className="font-mono">{postId}</span>
				</p>
				<Link to="/feed" className="mt-2 inline-block text-sm text-sky-600 hover:underline">
					← Back to feed
				</Link>
			</div>

			<section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
				<h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create Boost</h2>
				<div className="mt-4 grid gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Scope</label>
						<select
							value={boostScope}
							onChange={(e) => setBoostScope(e.target.value)}
							className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
						>
							<option value="feed">Feed</option>
							<option value="search">Search</option>
							<option value="profile">Profile</option>
						</select>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Duration</label>
						<select
							value={boostDuration}
							onChange={(e) => setBoostDuration(e.target.value)}
							className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
						>
							<option value="7">7 days</option>
							<option value="14">14 days</option>
							<option value="30">30 days</option>
						</select>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Multiplier</label>
						<input
							type="number"
							step="0.1"
							value={boostMultiplier}
							onChange={(e) => setBoostMultiplier(e.target.value)}
							className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Price ($)</label>
						<input
							type="number"
							step="0.01"
							value={boostPrice}
							onChange={(e) => setBoostPrice(e.target.value)}
							className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
						/>
					</div>
				</div>
				<button
					type="button"
					onClick={createBoost}
					disabled={creatingBoost}
					className="mt-4 rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
				>
					{creatingBoost ? "Creating..." : "Create Boost"}
				</button>
				{boostFeedback && (
					<p className={`mt-2 text-sm ${boostFeedback.includes("success") ? "text-green-600" : "text-red-600"}`}>
						{boostFeedback}
					</p>
				)}
			</section>

			<section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
				<h2 className="text-lg font-semibold text-slate-900 dark:text-white">Existing Boosts</h2>
				{loadingBoosts ? (
					<p className="mt-2 text-sm text-slate-500">Loading...</p>
				) : boosts.length === 0 ? (
					<p className="mt-2 text-sm text-slate-500">No boosts yet.</p>
				) : (
					<div className="mt-4 space-y-2">
						{boosts.map((b) => (
							<div
								key={b.id}
								className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
							>
								<div>
									<p className="font-medium text-slate-900 dark:text-white">
										{b.scope} — {b.duration_days || b.duration}d
									</p>
									<p className="text-slate-500">×{b.multiplier} · ${b.price_usd || b.price}</p>
								</div>
								<span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
									{b.status || "pending"}
								</span>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
