// Lightweight language support for the buyer-facing support workspace.
//
// Only the STATIC interface chrome is translated. AI-generated conversation,
// findings and reports keep their original language: translating model output
// deterministically in the browser would fabricate meaning, so it is not done
// here. The language of the buyer's own messages is preserved verbatim.

const STORAGE_KEY = "gartexhub-support-language";

export const SUPPORT_LANGUAGES = [
	{ code: "en", label: "English" },
	{ code: "bn", label: "বাংলা" },
];

// The small set of interface strings the buyer sees around their conversation.
const STRINGS = {
	en: {
		aiInvestigation: "AI Investigation",
		caseReference: "Case reference",
		untitledCase: "Untitled case",
		notOpened: "not opened yet",
		caseProgress: "Case progress",
		recentCases: "Recent cases",
		noOtherCases: "No other cases yet.",
		evidence: "Evidence",
		noEvidence: "No evidence yet.",
		privateSession: "Private session. Evidence is visible only to you and the support team.",
		endSession: "End session",
		talkToHuman: "Talk to a human",
		myCaseControls: "My case controls",
		stopInvestigation: "Stop the investigation",
		downloadReport: "Download my report",
		findings: "Findings",
		noMessages: "Describe the problem below and the assistant will take it from there.",
		investigationActivity: "Investigation activity",
		language: "Language",
	},
	bn: {
		aiInvestigation: "এআই তদন্ত",
		caseReference: "কেস রেফারেন্স",
		untitledCase: "নামহীন কেস",
		notOpened: "এখনো খোলা হয়নি",
		caseProgress: "কেসের অগ্রগতি",
		recentCases: "সাম্প্রতিক কেস",
		noOtherCases: "এখনো অন্য কেস নেই।",
		evidence: "প্রমাণ",
		noEvidence: "এখনো কোনো প্রমাণ নেই।",
		privateSession: "ব্যক্তিগত সেশন। প্রমাণ শুধুমাত্র আপনি এবং সহায়তা দল দেখতে পারেন।",
		endSession: "সেশন শেষ করুন",
		talkToHuman: "মানুষের সাথে কথা বলুন",
		myCaseControls: "আমার কেস নিয়ন্ত্রণ",
		stopInvestigation: "তদন্ত বন্ধ করুন",
		downloadReport: "আমার রিপোর্ট ডাউনলোড করুন",
		findings: "ফলাফল",
		noMessages: "নিচে সমস্যাটি বর্ণনা করুন, সহকারী সেটি থেকে কাজ শুরু করবে।",
		investigationActivity: "তদন্ত কার্যকলাপ",
		language: "ভাষা",
	},
};

/** Detect a preferred language from a BCP-47 tag. Defaults to English. */
export function detectLanguage(tag) {
	const value = String(tag || "").toLowerCase();
	if (value.startsWith("bn")) {
		return "bn";
	}
	return "en";
}

/** Read the saved language, falling back to the browser locale. */
export function getSupportLanguage() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved === "en" || saved === "bn") {
			return saved;
		}
	} catch {
		// localStorage may be unavailable (private mode); use the browser locale.
	}
	return detectLanguage(typeof navigator === "undefined" ? "en" : navigator.language);
}

export function saveSupportLanguage(code) {
	try {
		localStorage.setItem(STORAGE_KEY, code === "bn" ? "bn" : "en");
	} catch {
		// best-effort
	}
}

/** Translate one chrome string. Unknown keys fall back to the key itself. */
export function t(code, key) {
	const dict = STRINGS[code] || STRINGS.en;
	return dict[key] ?? STRINGS.en[key] ?? key;
}
