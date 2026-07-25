const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requiredEnvs = [
	"DATABASE_URL",
	"ADMIN_MFA_CODE",
	"ADMIN_IP_ALLOWLIST",
	"ADMIN_DEVICE_ALLOWLIST",
	"ADMIN_STEPUP_CODE",
	"ADMIN_EXPORT_CODE_PRIMARY",
	"ADMIN_EXPORT_CODE_SECONDARY",
	"ADMIN_EXEC_ENABLED",
	"ADMIN_EXEC_ALLOW_ANY",
	"ADMIN_EXEC_ALLOWLIST",
	"ADMIN_EXEC_TIMEOUT_MS",
];
for (const key of requiredEnvs) {
	if (!process.env[key]) {
	}
}

process.env.DATABASE_URL = process.env.DATABASE_URL || "";
process.env.ADMIN_MFA_CODE = process.env.ADMIN_MFA_CODE || "";
process.env.ADMIN_IP_ALLOWLIST = process.env.ADMIN_IP_ALLOWLIST || "127.0.0.1,::1";
process.env.ADMIN_DEVICE_ALLOWLIST = process.env.ADMIN_DEVICE_ALLOWLIST || "local-dev-device";
process.env.ADMIN_STEPUP_CODE = process.env.ADMIN_STEPUP_CODE || "";
process.env.ADMIN_EXPORT_CODE_PRIMARY = process.env.ADMIN_EXPORT_CODE_PRIMARY || "";
process.env.ADMIN_EXPORT_CODE_SECONDARY = process.env.ADMIN_EXPORT_CODE_SECONDARY || "";
process.env.ADMIN_EXEC_ENABLED = process.env.ADMIN_EXEC_ENABLED || "false";
process.env.ADMIN_EXEC_ALLOW_ANY = process.env.ADMIN_EXEC_ALLOW_ANY || "false";
process.env.ADMIN_EXEC_ALLOWLIST = process.env.ADMIN_EXEC_ALLOWLIST || "";
process.env.ADMIN_EXEC_TIMEOUT_MS = process.env.ADMIN_EXEC_TIMEOUT_MS || "12000";

await import("../server/server.js");
await sleep(1500);

const base = "http://localhost:4000/api";
const adminEmail = "admin@gartexhub.local";
const adminPass = "Admin123!";

async function jsonFetch(path, options = {}) {
	const res = await fetch(`${base}${path}`, {
		...options,
		headers: { "content-type": "application/json", ...(options.headers || {}) },
		body: options.body ? JSON.stringify(options.body) : undefined,
	});
	const text = await res.text();
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = text;
	}
	if (!res.ok) {
		const error = new Error(data?.error || `HTTP ${res.status}`);
		error.status = res.status;
		error.payload = data;
		throw error;
	}
	return data;
}

try {
	await jsonFetch("/auth/register", {
		method: "POST",
		body: {
			name: "Admin",
			email: adminEmail,
			password: adminPass,
			role: "admin",
		},
	});
} catch (error) {
	if (error.status !== 409) {
		throw error;
	}
}

const login = await jsonFetch("/auth/login", {
	method: "POST",
	body: { identifier: adminEmail, password: adminPass },
});

const token = login.token;
const headers = {
	Authorization: `Bearer ${token}`,
	"x-admin-mfa": "123456",
	"x-admin-device": "local-dev-device",
};
const stepHeaders = {
	...headers,
	"x-admin-stepup": "stepup-7890",
	"x-admin-stepup-at": new Date().toISOString(),
};

const master = await jsonFetch("/admin/master", { headers });
const actionRes = await jsonFetch("/admin/actions", {
	method: "POST",
	headers: stepHeaders,
	body: { action: "users.export_emails", payload: {} },
});
const infra = await jsonFetch("/infra/overview", { headers });
const infraState = await jsonFetch("/infra/state", { headers });
const infraAction = await jsonFetch("/infra/actions", {
	method: "POST",
	headers: stepHeaders,
	body: { action: "backup.run", payload: {} },
});
const network = await jsonFetch("/network/overview", { headers });
const networkInventory = await jsonFetch("/network/inventory", { headers });
const verificationQueue = await jsonFetch("/verification/admin/queue", {
	headers,
});
const contracts = await jsonFetch("/admin/contracts", { headers });
const disputes = await jsonFetch("/admin/disputes", { headers });
const partners = await jsonFetch("/admin/partner-requests", { headers });
const catalog = await jsonFetch("/admin/catalog", { headers });
const serverAdminState = await jsonFetch("/admin/server-admin/state", {
	headers,
});
const cmsState = await jsonFetch("/admin/cms/state", { headers });
const securityState = await jsonFetch("/admin/security/state", { headers });

process.exit(0);
