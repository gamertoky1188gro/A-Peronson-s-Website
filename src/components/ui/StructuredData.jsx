import { useEffect } from "react";

export default function StructuredData({ data }) {
	useEffect(() => {
		const script = document.createElement("script");
		script.type = "application/ld+json";
		script.textContent = JSON.stringify(data);
		document.head.appendChild(script);
		return () => {
			if (script.parentNode) {
				script.parentNode.removeChild(script);
			}
		};
	}, [data]);

	return null;
}
