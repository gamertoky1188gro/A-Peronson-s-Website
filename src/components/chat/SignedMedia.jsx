import { useSignedSrc } from "../../hooks/useSignedSrc.js";
import LazyImage from "../ui/LazyImage.jsx";

/**
 * <img> / <video> whose src is a signed url.
 *
 * These exist because the src has to be signed by an effect, and a hook cannot
 * be called from a render helper like ChatInterface's renderMessageBody() or
 * from a `.map()` in RightPanel. Rendering nothing until the signature arrives
 * is the point: an empty state keeps the unsigned path out of the DOM, and a
 * refusal simply shows nothing rather than a broken image pointing at bytes the
 * client is not allowed to read.
 *
 * Both default to refreshMs 0 — see useSignedSrc for why.
 */

export function SignedImage({ src, alt, width, height, className = "", eager = false }) {
	const signedSrc = useSignedSrc(src);
	if (!signedSrc) return null;
	return (
		<LazyImage
			src={signedSrc}
			alt={alt}
			width={width}
			height={height}
			className={className}
			eager={eager}
		/>
	);
}

export function SignedVideo({
	src,
	className = "",
	controls = false,
	autoPlay = false,
	muted = true,
	playsInline = true,
	preload = "metadata",
	onError = null,
}) {
	const signedSrc = useSignedSrc(src);
	if (!signedSrc) return null;
	return (
		<video
			src={signedSrc}
			controls={controls}
			autoPlay={autoPlay}
			muted={muted}
			playsInline={playsInline}
			preload={preload}
			className={className}
			onError={onError}
		/>
	);
}

export default SignedImage;
