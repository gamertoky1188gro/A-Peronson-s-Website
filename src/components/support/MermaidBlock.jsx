import { AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn.js";

/** Render a mermaid chart. `mermaid` is imported lazily so the investigation
 *  shell does not pay for it until a diagram is actually on screen. If the
 *  chart fails to parse (the model's own mistake), fall back to the raw chart
 *  in a code box with an explanatory note — never crash the transcript. */
export function MermaidBlock({ chart }) {
	const containerRef = useRef(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;
		const container = containerRef.current;
		if (!container) {
			return;
		}
		(async () => {
			try {
				const mod = await import("mermaid");
				const mermaid = mod.default ?? mod;
				mermaid.initialize({
					startOnLoad: false,
					theme: "dark",
					securityLevel: "strict",
					flowchart: { useMaxWidth: true },
				});
				const id = `mermaid-${Math.random().toString(36).slice(2)}`;
				const { svg } = await mermaid.render(id, String(chart));
				if (!cancelled && container) {
					container.innerHTML = svg;
				}
			} catch (err) {
				if (!cancelled) {
					setError(err?.message ?? String(err));
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [chart]);

	if (error) {
		return (
			<div class="rounded-xl border border-amber-400/25 bg-amber-500/5 p-3 text-[11px] text-amber-200">
				<p class="flex items-center gap-2 font-semibold">
					<AlertTriangle class="h-3.5 w-3.5" aria-hidden="true" /> Diagram could not be rendered
				</p>
				<pre class="mt-1.5 whitespace-pre-wrap font-mono text-[10px] leading-4 text-[#f4eeff]">
					{String(chart)}
				</pre>
			</div>
		);
	}

	return (
		<div
			class={cn(
				"overflow-x-auto rounded-2xl border border-purple-400/20 bg-[#0b0714] p-3",
				"[&_svg]:mx-auto [&_svg]:!h-auto [&_svg]:!max-w-full",
			)}
		>
			<div ref={containerRef} aria-label="Mermaid diagram" />
		</div>
	);
}
