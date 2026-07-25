import { detectHallucination } from "../server/utils/hallucinationDetector.js";

function assert(cond, _msg) {
	if (!cond) {
		process.exit(2);
	}
}

// Test cases
const t1 = detectHallucination(null);
assert(t1.hallucination === true, "null should be hallucination");

const t2 = detectHallucination({});
assert(t2.hallucination === true, "empty object should be hallucination");

const t3 = detectHallucination({ product_type: "T-shirt", moq: "100" });
assert(t3.hallucination === false, "valid small object should not be hallucination");

const t4 = detectHallucination({ product_type: "", moq: "10000000000" });
assert(t4.hallucination === true || t4.score > 0, "large moq should increase score");
process.exit(0);
