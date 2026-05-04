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

import React from "react";

// Section component imports - each handles its own rendering
import { AdminHomeSection } from "./sections/AdminHomeSection";
import { AdminPlatformSection } from "./sections/AdminPlatformSection";
import { AdminInfraSection } from "./sections/AdminInfraSection";
import { AdminNetworkSection } from "./sections/AdminNetworkSection";
import { AdminServerSection } from "./sections/AdminServerSection";
import { AdminCMSSection } from "./sections/AdminCMSSection";
import { AdminSecuritySection } from "./sections/AdminSecuritySection";
import { AdminConfigSection } from "./sections/AdminConfigSection";

const SECTIONS = {
  home: AdminHomeSection,
  platform: AdminPlatformSection,
  infra: AdminInfraSection,
  network: AdminNetworkSection,
  "server-admin": AdminServerSection,
  cms: AdminCMSSection,
  "ultra-security": AdminSecuritySection,
  config: AdminConfigSection,
};

export function AdminSectionRouter({ activeCategory, ...props }) {
  const SectionComponent = SECTIONS[activeCategory];
  
  if (!SectionComponent) {
    return (
      <div className="p-8 text-center text-slate-500">
        Unknown category: {activeCategory}
      </div>
    );
  }
  
  return <SectionComponent {...props} />;
}

export default AdminSectionRouter;