/**
 * The only media types the support intake accepts.
 *
 * opencode's file attachments are restricted to PNG, JPEG, GIF and WebP
 * images plus PDF — anything else (video, audio, archives, arbitrary text
 * files) cannot be handed to the model, so the composer and the structured
 * upload card refuse it instead of accepting it and letting the
 * investigation read nothing.
 */
export const SUPPORTED_ATTACHMENT_MIME_TYPES = Object.freeze([
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/webp",
	"application/pdf",
]);

export const SUPPORTED_ATTACHMENT_ACCEPT = SUPPORTED_ATTACHMENT_MIME_TYPES.join(",");

/** MIME types the given accept string actually allows, lowercased. */
export function acceptToMimeTypes(accept) {
	if (typeof accept !== "string" || !accept.trim()) {
		return [];
	}
	return accept
		.split(",")
		.map((entry) => entry.trim().toLowerCase())
		.filter(Boolean);
}

/** Whether one File may be attached, given an accept string. */
export function isAcceptedAttachment(file, accept = SUPPORTED_ATTACHMENT_ACCEPT) {
	const mime = String(file?.type ?? "").toLowerCase();
	if (!mime) {
		return false;
	}
	return acceptToMimeTypes(accept).includes(mime);
}

/** Split a list into the accepted ones and the refused ones. */
export function partitionAttachments(files, accept = SUPPORTED_ATTACHMENT_ACCEPT) {
	const accepted = [];
	const refused = [];
	for (const file of files ?? []) {
		if (file instanceof File && isAcceptedAttachment(file, accept)) {
			accepted.push(file);
		} else if (file instanceof File) {
			// A File with an empty MIME type is usually a picker artefact of
			// an unknown extension — it cannot be handed to the model either.
			// Treat it as refused rather than silently allowed.
			refused.push(file);
		}
	}
	return { accepted, refused };
}
