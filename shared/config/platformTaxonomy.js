import {
	BUYER_COUNTRY_OPTIONS as BUYER_COUNTRY_OPTIONS_SOURCE,
	EU_COUNTRIES as EU_COUNTRIES_SOURCE,
	isEuCountry as isEuCountrySource,
} from "./geo.js";

const BUYER_COUNTRY_OPTIONS = BUYER_COUNTRY_OPTIONS_SOURCE;
const EU_COUNTRIES = EU_COUNTRIES_SOURCE;
const isEuCountry = isEuCountrySource;
const COUNTRY_OPTIONS = BUYER_COUNTRY_OPTIONS_SOURCE;

const PUBLIC_ACCOUNT_TYPES = [
	{ label: "Factory", value: "factory" },
	{ label: "Buying house", value: "buying_house" },
	{ label: "Buyer", value: "buyer" },
];

const ELEVATED_ACCOUNT_TYPES = [
	{ label: "Administrator", value: "admin" },
	{ label: "System Owner", value: "owner" },
	{ label: "Operational Agent", value: "agent" },
	{ label: "Buying House (Root)", value: "buying_house" },
	{ label: "Factory (Root)", value: "factory" },
	{ label: "Buyer (Root)", value: "buyer" },
];

const FACTORY_SECTOR_OPTIONS = [
	{ label: "Garments", value: "garments" },
	{ label: "Textile", value: "textile" },
];

const FACTORY_SECTOR_SET = new Set(FACTORY_SECTOR_OPTIONS.map((option) => option.value));

const VERIFICATION_FIELD_LABELS = {
	company_registration: "Business Registration",
	trade_license: "Trade License",
	tin: "TIN (Tax Identification Number)",
	ein: "EIN (Employer Identification Number)",
	vat: "VAT Number",
	eori: "EORI (Economic Operators Registration and Identification)",
	ior: "IOR (Importer of Record)",
	authorized_person_nid: "Authorized Person NID",
	bank_proof: "Bank Proof",
	erc: "ERC (Export Registration Certificate)",
};

const LEGAL_ID_FIELDS = [
	"business_registration_number",
	"business_registration",
	"company_registration",
	"company_registration_id",
	"government_company_registration_id",
	"vat_number",
	"vat",
	"eori",
	"ein",
	"ior",
	"tax_id",
	"tax_registration",
];

const STRONG_EVIDENCE_FIELDS = [
	"company_name",
	"legal_name",
	"country",
	"registered_country",
	"registered_address",
	"website",
	"domain",
	"business_email",
	"phone",
	"logo_url",
	"banner_url",
];

export const VERIFICATION_REQUIREMENTS = {
	factory: [
		"company_registration",
		"trade_license",
		"tin",
		"authorized_person_nid",
		"bank_proof",
		"erc",
	],
	buying_house: [
		"company_registration",
		"trade_license",
		"tin",
		"authorized_person_nid",
		"bank_proof",
	],
	buyer: {
		EU: ["company_registration", "vat", "eori", "bank_proof"],
		USA: ["company_registration", "ein", "ior", "bank_proof"],
		OTHER: ["company_registration", "bank_proof"],
	},
};

export function getBuyerRegionFromCountry(country) {
	const value = String(country || "")
		.trim()
		.toLowerCase();
	if (!value) {
		return "OTHER";
	}
	if (isEuCountry(value)) {
		return "EU";
	}
	if (["usa", "us", "united states", "united states of america"].includes(value)) {
		return "USA";
	}
	return "OTHER";
}

export function getVerificationRequirements(role, buyerCountry = "") {
	if (role === "buyer") {
		const region = getBuyerRegionFromCountry(buyerCountry);
		return VERIFICATION_REQUIREMENTS.buyer[region] || VERIFICATION_REQUIREMENTS.buyer.OTHER;
	}
	return VERIFICATION_REQUIREMENTS[role] || [];
}

export function isValidFactorySector(value) {
	return FACTORY_SECTOR_SET.has(
		String(value || "")
			.trim()
			.toLowerCase(),
	);
}

export function getLegalIdFields() {
	return [...LEGAL_ID_FIELDS];
}

export function getStrongEvidenceFields() {
	return [...STRONG_EVIDENCE_FIELDS];
}

export {
	BUYER_COUNTRY_OPTIONS,
	COUNTRY_OPTIONS,
	ELEVATED_ACCOUNT_TYPES,
	EU_COUNTRIES,
	FACTORY_SECTOR_OPTIONS,
	LEGAL_ID_FIELDS,
	STRONG_EVIDENCE_FIELDS,
	isEuCountry,
	PUBLIC_ACCOUNT_TYPES,
	VERIFICATION_FIELD_LABELS,
};
