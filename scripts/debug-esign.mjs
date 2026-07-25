process.env.ESIGN_PROVIDER_TYPE = "dropbox_sign";
process.env.ESIGN_PROVIDER_URL = "https://api.dropbox.sign.test";
process.env.ESIGN_DROPBOX_SIGN_API_KEY = "testkey";

import axios from "axios";

axios.post = async () => ({
	data: { signing_url: "https://provider/sign/abc", session_id: "sess-abc" },
});

import { createDraftContract } from "../server/services/documentService.js";
import { createSignSession } from "../server/services/eSignService.js";
import prisma from "../server/utils/prisma.js";

(async () => {
	const actor = { id: "owner-debug", role: "owner" };
	const draft = await createDraftContract(actor, {
		buyer_id: "buyer-debug",
		factory_id: "factory-debug",
		buyer_name: "Buyer D",
		factory_name: "Factory D",
	});
	const session = await createSignSession(draft.id, actor);
	const stored = await prisma.document.findUnique({ where: { id: draft.id } });
})().catch((_err) => {
	process.exit(1);
});
