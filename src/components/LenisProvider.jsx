import { useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";

export default function LenisProvider({ children }) {
	const reduceMotion = useReducedMotion();

	return (
		<ReactLenis
			root={true}
			options={{
				duration: reduceMotion ? 0 : 1.2,
				lerp: reduceMotion ? 1 : 0.1,
				smoothWheel: !reduceMotion,
				syncTouch: true,
				touchMultiplier: 1.5,
				wheelMultiplier: 1,
				autoRaf: true,
				prevent: (node) => {
					if (node.hasAttribute?.("data-lenis-prevent")) {
						return true;
					}
					return false;
				},
			}}
		>
			{children}
		</ReactLenis>
	);
}
