/**
 * Admin Panel Section Router
 *
 * This file handles routing between different admin panel sections
 * based on the activeCategory state.
 *
 * Sections:
 * - home: Dashboard/Overview
 * - platform: Users, Verification, Subscriptions, Contracts, etc.
 * - infra: Infrastructure management
 * - network: Network monitoring
 * - server-admin: Server and app management
 * - cms: Content management
 * - ultra-security: Security features
 * - config: Configuration editor
 */

import { AdminAISection } from "./sections/AdminAISection.jsx";
import { AdminCMSSection } from "./sections/AdminCMSSection.jsx";
import { AdminConfigSection } from "./sections/AdminConfigSection.jsx";
// Section component imports - each handles its own rendering
import { AdminHomeSection } from "./sections/AdminHomeSection.jsx";
import { AdminInfraSection } from "./sections/AdminInfraSection.jsx";
import { AdminNetworkSection } from "./sections/AdminNetworkSection.jsx";
import { AdminPlatformSection } from "./sections/AdminPlatformSection.jsx";
import { AdminSecuritySection } from "./sections/AdminSecuritySection.jsx";
import { AdminServerSection } from "./sections/AdminServerSection.jsx";

const SECTIONS = {
	home: AdminHomeSection,
	platform: AdminPlatformSection,
	infra: AdminInfraSection,
	network: AdminNetworkSection,
	"server-admin": AdminServerSection,
	cms: AdminCMSSection,
	"ultra-security": AdminSecuritySection,
	config: AdminConfigSection,
	ai: AdminAISection,
};

export function AdminSectionRouter({ activeCategory, ...props }) {
	const SectionComponent = SECTIONS[activeCategory];

	if (!SectionComponent) {
		return <div class="p-8 text-center text-slate-500">Unknown category: {activeCategory}</div>;
	}

	return <SectionComponent {...props} />;
}

export default AdminSectionRouter;
