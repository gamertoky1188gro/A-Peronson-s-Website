// One-off bootstrap: create the production owner account (owner role).
// Password is supplied via env (OWNER_PASSWORD) so it never appears in logs.
import "../../server/utils/dotenv.js";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import prisma from "../../server/utils/prisma.js";

const email = process.env.OWNER_EMAIL || "admin@gmail.com";
const password = process.env.OWNER_PASSWORD;
const name = process.env.OWNER_NAME || "Admin";

if (!password) {
	console.error("OWNER_PASSWORD not set");
	process.exit(1);
}

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
	console.error("An account already exists for that email; aborting and making NO changes.");
	process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const user = await prisma.user.create({
	data: {
		id: crypto.randomUUID(),
		name,
		email,
		password_hash: hash,
		role: "owner",
		status: "active",
		verified: true,
		subscription_status: "premium",
		wallet_balance_usd: 0,
		wallet_restricted_usd: 0,
		policy_strikes: 0,
		profile: {
			organization_name: "GarTexHub",
			position: "Owner",
			country: "BD",
			mfa_setup_code: crypto.randomUUID().slice(0, 8),
			stepup_setup_code: crypto.randomUUID().slice(0, 8),
		},
		created_at: new Date(),
	},
});
console.log("created owner:", user.email, "role:", user.role);
process.exit(0);
