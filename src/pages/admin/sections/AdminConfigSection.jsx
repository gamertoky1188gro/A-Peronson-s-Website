import { ThreeDot } from "react-loading-indicators";
import { apiRequest, getToken } from "../../../lib/auth.js";

export function AdminConfigSection({
	configEditorTab,
	setConfigEditorTab,
	configEditorLoading,
	configEditorError,
	configEditorData,
	configEditorSaving,
	setConfigEditorSaving,
	configEditorNotice,
	setConfigEditorNotice,
	setConfigEditorError,
}) {
	return (
		<div class="admin-card admin-sweep rounded-3xl p-6">
			<div class="mb-6">
				<h2 class="text-lg font-bold">Dynamic Configuration Editor</h2>
				<p class="text-sm text-slate-500">Edit admin panel configuration from the database.</p>
			</div>

			<div class="mb-4 flex gap-2">
				{["inventory", "actions", "ui"].map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setConfigEditorTab(tab)}
						class={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
							configEditorTab === tab
								? "bg-sky-500 text-white"
								: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
						}`}
					>
						{tab === "inventory" ? "Inventory" : tab === "actions" ? "Actions" : "UI Settings"}
					</button>
				))}
			</div>

			{configEditorLoading ? (
				<div class="py-8 text-center">
					<ThreeDot variant="bounce" color="#6100ff" size="small" text="" textColor="" />
				</div>
			) : configEditorError ? (
				<div class="py-8 text-center text-rose-500">{configEditorError}</div>
			) : configEditorTab === "inventory" ? (
				<div class="space-y-4">
					<div class="flex justify-end">
						<button
							type="button"
							onClick={async () => {
								setConfigEditorSaving(true);
								setConfigEditorNotice("");
								try {
									await apiRequest("/admin/config/inventory", {
										method: "PUT",
										token: getToken(),
										body: {
											data: {
												modules: configEditorData.inventory,
											},
										},
									});
									setConfigEditorNotice("Inventory saved!");
								} catch (err) {
									setConfigEditorError(err.message);
								} finally {
									setConfigEditorSaving(false);
								}
							}}
							disabled={configEditorSaving}
							class="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
						>
							{configEditorSaving ? (
								<ThreeDot variant="bounce" color="#6100ff" size="small" text="" textColor="" />
							) : (
								"Save Inventory"
							)}
						</button>
					</div>
					<div class="grid gap-3">
						{configEditorData.inventory.map((mod, idx) => (
							<div key={mod.id || idx} class="rounded-xl border p-4 dark:border-white/10">
								<div class="flex items-center gap-2">
									<span class="font-semibold">{mod.label}</span>
									<span class="text-xs text-slate-500">({mod.id})</span>
								</div>
								<div class="mt-2 text-xs text-slate-500">{mod.sections?.length || 0} sections</div>
							</div>
						))}
					</div>
				</div>
			) : configEditorTab === "actions" ? (
				<div class="space-y-4">
					<div class="flex justify-end">
						<button
							type="button"
							onClick={async () => {
								setConfigEditorSaving(true);
								setConfigEditorNotice("");
								try {
									const flatActions = configEditorData.actions.flatMap((g) => g.actions || []);
									await apiRequest("/admin/config/actions", {
										method: "PUT",
										token: getToken(),
										body: {
											data: { actions: flatActions },
										},
									});
									setConfigEditorNotice("Actions saved!");
								} catch (err) {
									setConfigEditorError(err.message);
								} finally {
									setConfigEditorSaving(false);
								}
							}}
							disabled={configEditorSaving}
							class="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
						>
							{configEditorSaving ? (
								<ThreeDot variant="bounce" color="#6100ff" size="small" text="" textColor="" />
							) : (
								"Save Actions"
							)}
						</button>
					</div>
					<div class="space-y-3">
						{configEditorData.actions.map((group, gIdx) => (
							<div key={gIdx} class="rounded-xl border p-4 dark:border-white/10">
								<div class="font-semibold">{group.label}</div>
								<div class="mt-2 grid gap-2 sm:grid-cols-2">
									{(group.actions || []).map((action, aIdx) => (
										<div key={aIdx} class="text-xs text-slate-600 dark:text-slate-300">
											{action.label} <span class="text-slate-400">({action.id})</span>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			) : (
				<div class="space-y-4">
					<div class="flex justify-end">
						<button
							type="button"
							onClick={async () => {
								setConfigEditorSaving(true);
								setConfigEditorNotice("");
								try {
									await apiRequest("/admin/config/ui", {
										method: "PUT",
										token: getToken(),
										body: { data: configEditorData.ui },
									});
									setConfigEditorNotice("UI settings saved!");
								} catch (err) {
									setConfigEditorError(err.message);
								} finally {
									setConfigEditorSaving(false);
								}
							}}
							disabled={configEditorSaving}
							class="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
						>
							{configEditorSaving ? (
								<ThreeDot variant="bounce" color="#6100ff" size="small" text="" textColor="" />
							) : (
								"Save UI Settings"
							)}
						</button>
					</div>
					<pre
						data-lenis-prevent={true}
						class="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-200"
					>
						{JSON.stringify(configEditorData.ui, null, 2)}
					</pre>
				</div>
			)}

			{configEditorNotice ? (
				<div class="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
					{configEditorNotice}
				</div>
			) : null}
			{configEditorError ? (
				<div class="mt-4 rounded-lg bg-rose-500/10 px-4 py-2 text-sm text-rose-400">
					{configEditorError}
				</div>
			) : null}
		</div>
	);
}

export default AdminConfigSection;
