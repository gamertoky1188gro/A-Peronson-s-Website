import { motion, useReducedMotion } from "framer-motion";
import PropTypes from "prop-types";

const easePremium = [0.16, 1, 0.3, 1];

ScrollReveal.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	as: PropTypes.string,
};

export default function ScrollReveal({ children, className = "", as: Tag = "div", ...rest }) {
	const reduceMotion = useReducedMotion();

	if (reduceMotion) {
		const StaticTag = Tag;
		return (
			<StaticTag className={className} {...rest}>
				{children}
			</StaticTag>
		);
	}

	const MotionTag = motion[Tag];

	return (
		<MotionTag
			className={className}
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.6, ease: easePremium }}
			{...rest}
		>
			{children}
		</MotionTag>
	);
}
