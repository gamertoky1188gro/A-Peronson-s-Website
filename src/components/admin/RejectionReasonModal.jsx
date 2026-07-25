import { X } from "lucide-react";
import { useState } from "react";

const DEFAULT_REJECTION_REASONS = [
	"This listing appears to include indecent or revealing clothing. Please adjust images or description to match our content standards for modest apparel.",
	"This listing needs a manual review to confirm it follows our content standards.",
	"Update images, title, or description to describe modest apparel. Innerwear or under-layer items must be clearly labeled.",
	"Product images do not match the description.",
	"Inappropriate or prohibited content.",
	"Spam or misleading information.",
	"Other",
];

export default function RejectionReasonModal({
	open,
	onClose,
	onConfirm,
	itemTitle = "this item",
	customReasons = DEFAULT_REJECTION_REASONS,
}) {
	const [selectedReason, setSelectedReason] = useState(customReasons[0] || "");
	const [customReason, setCustomReason] = useState("");

	if (!open) {
		return null;
	}

	const chosenReason =
		selectedReason === "Other" ? customReason.trim() || customReasons[0] : selectedReason;

	function handleSubmit() {
		if (!chosenReason) {
			return;
		}
		onConfirm(chosenReason);
	}

	return (
		<div class="fixed inset-0 z-50">
			<button
				type="button"
				aria-label="Close modal"
				onClick={onClose}
				class="absolute inset-0 bg-black/40"
			/>
			<div class="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl shadow-borderless dark:shadow-borderlessDark">
				<header class="flex items-center justify-between px-5 py-4 shadow-dividerB dark:shadow-dividerBDark">
					<div>
						<p class="text-sm font-semibold text-slate-900">Reject {itemTitle}</p>
						<p class="text-[11px] text-slate-500">Select a reason for rejection</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						class="rounded-full p-2 hover:bg-slate-100"
						aria-label="Close"
					>
						<X size={18} />
					</button>
				</header>

				<div class="p-5 space-y-4">
					<div>
						<label class="block text-xs font-semibold text-slate-700 mb-1">
							Reason (neutral language)
						</label>
						<select
							value={selectedReason}
							onChange={(e) => setSelectedReason(e.target.value)}
							class="w-full rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white px-3 py-2 text-sm"
						>
							{customReasons.map((r) => (
								<option key={r} value={r}>
									{r}
								</option>
							))}
						</select>
					</div>

					{selectedReason === "Other" ? (
						<div>
							<label class="block text-xs font-semibold text-slate-700 mb-1">Custom reason</label>
							<textarea
								value={customReason}
								onChange={(e) => setCustomReason(e.target.value)}
								placeholder="Enter rejection reason..."
								class="w-full min-h-[96px] rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white px-3 py-2 text-sm"
							/>
						</div>
					) : null}

					<div class="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
						Rejection reason will be sent to the user as a notification.
					</div>

					<div class="flex gap-2 justify-end">
						<button
							type="button"
							onClick={onClose}
							class="rounded-full px-4 py-2 text-sm font-semibold shadow-borderless dark:shadow-borderlessDark hover:bg-slate-50"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!chosenReason}
							class="rounded-full px-4 py-2 text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
						>
							Confirm Rejection
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
