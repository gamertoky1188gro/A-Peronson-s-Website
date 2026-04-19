/*
  Route: /search
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Run marketplace search across Buyer Requests and Companies/Products.
    - Provide basic filters for free tier and advanced filters for premium tier.
    - Support quick view modals and recent views rail.

  Key API endpoints:
    - GET /api/requirements/search?... (buyer requests)
    - GET /api/products/search?... (companies/products)
    - GET /api/ratings/search?profile_keys=...
    - GET /api/products/views/me?cursor=...
    - POST /api/search/alerts (save alerts)

  Major UI/UX patterns:
    - Glass + glow search bar with shortcut hint (Ctrl/Cmd + K).
    - layoutId animated tabs for "All / Buyer Requests / Companies".
    - Skeleton shimmer while loading.
    - Optional premium-locked overlays for advanced filters.
*/
/* global process */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Briefcase, Building2, Filter, LayoutGrid, Bell, Share2, Search as SearchIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { apiRequest, getCurrentUser, getToken, hasEntitlement } from '../lib/auth'
import ProductQuickViewModal from '../components/products/ProductQuickViewModal'
import { trackClientEvent } from '../lib/events'
import { recordLeadSource } from '../lib/leadSource'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { ADVANCED_FILTER_KEYS, DEFAULT_CORE_FILTER_KEYS, validateCoreFilterRenderKeys } from './searchFiltersConfig'

const Motion = motion

// Leaflet CSS is intentionally inlined (per repo styling policy: no external CSS imports).
const LEAFLET_CSS = `/* required styles */

.leaflet-pane,
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow,
.leaflet-tile-container,
.leaflet-pane > svg,
.leaflet-pane > canvas,
.leaflet-zoom-box,
.leaflet-image-layer,
.leaflet-layer {
\tposition: absolute;
\tleft: 0;
\ttop: 0;
\t}
.leaflet-container {
\toverflow: hidden;
\t}
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow {
\t-webkit-user-select: none;
\t   -moz-user-select: none;
\t        user-select: none;
\t  -webkit-user-drag: none;
\t}
/* Prevents IE11 from highlighting tiles in blue */
.leaflet-tile::selection {
\tbackground: transparent;
}
/* Safari renders non-retina tile on retina better with this, but Chrome is worse */
.leaflet-safari .leaflet-tile {
\timage-rendering: -webkit-optimize-contrast;
\t}
/* hack that prevents hw layers "stretching" when loading new tiles */
.leaflet-safari .leaflet-tile-container {
\twidth: 1600px;
\theight: 1600px;
\t-webkit-transform-origin: 0 0;
\t}
.leaflet-marker-icon,
.leaflet-marker-shadow {
\tdisplay: block;
\t}
/* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */
/* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */
.leaflet-container .leaflet-overlay-pane svg {
\tmax-width: none !important;
\tmax-height: none !important;
\t}
.leaflet-container .leaflet-marker-pane img,
.leaflet-container .leaflet-shadow-pane img,
.leaflet-container .leaflet-tile-pane img,
.leaflet-container img.leaflet-image-layer,
.leaflet-container .leaflet-tile {
\tmax-width: none !important;
\tmax-height: none !important;
\twidth: auto;
\tpadding: 0;
\t}

.leaflet-container img.leaflet-tile {
\t/* See: https://bugs.chromium.org/p/chromium/issues/detail?id=600120 */
\tmix-blend-mode: plus-lighter;
}

.leaflet-container.leaflet-touch-zoom {
\t-ms-touch-action: pan-x pan-y;
\ttouch-action: pan-x pan-y;
\t}
.leaflet-container.leaflet-touch-drag {
\t-ms-touch-action: pinch-zoom;
\t/* Fallback for FF which doesn't support pinch-zoom */
\ttouch-action: none;
\ttouch-action: pinch-zoom;
}
.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {
\t-ms-touch-action: none;
\ttouch-action: none;
}
.leaflet-container {
\t-webkit-tap-highlight-color: transparent;
}
.leaflet-container a {
\t-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);
}
.leaflet-tile {
\tfilter: inherit;
\tvisibility: hidden;
\t}
.leaflet-tile-loaded {
\tvisibility: inherit;
\t}
.leaflet-zoom-box {
\twidth: 0;
\theight: 0;
\t-moz-box-sizing: border-box;
\t     box-sizing: border-box;
\tz-index: 800;
\t}
/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */
.leaflet-overlay-pane svg {
\t-moz-user-select: none;
\t}

.leaflet-pane         { z-index: 400; }

.leaflet-tile-pane    { z-index: 200; }
.leaflet-overlay-pane { z-index: 400; }
.leaflet-shadow-pane  { z-index: 500; }
.leaflet-marker-pane  { z-index: 600; }
.leaflet-tooltip-pane   { z-index: 650; }
.leaflet-popup-pane   { z-index: 700; }

.leaflet-map-pane canvas { z-index: 100; }
.leaflet-map-pane svg    { z-index: 200; }

.leaflet-vml-shape {
\twidth: 1px;
\theight: 1px;
\t}
.lvml {
\tbehavior: url(#default#VML);
\tdisplay: inline-block;
\tposition: absolute;
\t}


/* control positioning */

.leaflet-control {
\tposition: relative;
\tz-index: 800;
\tpointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
\tpointer-events: auto;
\t}
.leaflet-top,
.leaflet-bottom {
\tposition: absolute;
\tz-index: 1000;
\tpointer-events: none;
\t}
.leaflet-top {
\ttop: 0;
\t}
.leaflet-right {
\tright: 0;
\t}
.leaflet-bottom {
\tbottom: 0;
\t}
.leaflet-left {
\tleft: 0;
\t}
.leaflet-control {
\tfloat: left;
\tclear: both;
\t}
.leaflet-right .leaflet-control {
\tfloat: right;
\t}
.leaflet-top .leaflet-control {
\tmargin-top: 10px;
\t}
.leaflet-bottom .leaflet-control {
\tmargin-bottom: 10px;
\t}
.leaflet-left .leaflet-control {
\tmargin-left: 10px;
\t}
.leaflet-right .leaflet-control {
\tmargin-right: 10px;
\t}


/* zoom and fade animations */

.leaflet-fade-anim .leaflet-popup {
\topacity: 0;
\t-webkit-transition: opacity 0.2s linear;
\t   -moz-transition: opacity 0.2s linear;
\t        transition: opacity 0.2s linear;
\t}
.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {
\topacity: 1;
\t}
.leaflet-zoom-animated {
\t-webkit-transform-origin: 0 0;
\t    -ms-transform-origin: 0 0;
\t        transform-origin: 0 0;
\t}
svg.leaflet-zoom-animated {
\twill-change: transform;
}

.leaflet-zoom-anim .leaflet-zoom-animated {
\t-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);
\t   -moz-transition:    -moz-transform 0.25s cubic-bezier(0,0,0.25,1);
\t        transition:         transform 0.25s cubic-bezier(0,0,0.25,1);
\t}
.leaflet-zoom-anim .leaflet-tile,
.leaflet-pan-anim .leaflet-tile {
\t-webkit-transition: none;
\t   -moz-transition: none;
\t        transition: none;
\t}

.leaflet-zoom-anim .leaflet-zoom-hide {
\tvisibility: hidden;
\t}


/* cursors */

.leaflet-interactive {
\tcursor: pointer;
\t}
.leaflet-grab {
\tcursor: -webkit-grab;
\tcursor:    -moz-grab;
\tcursor:         grab;
\t}
.leaflet-crosshair,
.leaflet-crosshair .leaflet-interactive {
\tcursor: crosshair;
\t}
.leaflet-popup-pane,
.leaflet-control {
\tcursor: auto;
\t}
.leaflet-dragging .leaflet-grab,
.leaflet-dragging .leaflet-grab .leaflet-interactive,
.leaflet-dragging .leaflet-marker-draggable {
\tcursor: move;
\tcursor: -webkit-grabbing;
\tcursor:    -moz-grabbing;
\tcursor:         grabbing;
\t}


/* marker & overlays interactivity */

.leaflet-marker-icon,
.leaflet-marker-shadow,
.leaflet-image-layer,
.leaflet-pane > svg path,
.leaflet-tile-container {
\tpointer-events: none;
\t}

.leaflet-marker-icon.leaflet-interactive,
.leaflet-image-layer.leaflet-interactive,
.leaflet-pane > svg path.leaflet-interactive,
svg.leaflet-image-layer.leaflet-interactive path {
\tpointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
\tpointer-events: auto;
\t}


/* visual tweaks */

.leaflet-container {
\tbackground: #ddd;
\toutline-offset: 1px;
\t}
.leaflet-container a {
\tcolor: #0078A8;
\t}
.leaflet-zoom-box {
\tborder: 2px dotted #38f;
\tbackground: rgba(255,255,255,0.5);
\t}


/* general typography */

.leaflet-container {
\tfont-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
\tfont-size: 12px;
\tfont-size: 0.75rem;
\tline-height: 1.5;
\t}


/* general toolbar styles */

.leaflet-bar {
\tbox-shadow: 0 1px 5px rgba(0,0,0,0.65);
\tborder-radius: 4px;
\t}
.leaflet-bar a {
\tbackground-color: #fff;
\tborder-bottom: 1px solid #ccc;
\twidth: 26px;
\theight: 26px;
\tline-height: 26px;
\tdisplay: block;
\ttext-align: center;
\ttext-decoration: none;
\tcolor: black;
\t}
.leaflet-bar a,
.leaflet-control-layers-toggle {
\tbackground-position: 50% 50%;
\tbackground-repeat: no-repeat;
\tdisplay: block;
\t}
.leaflet-bar a:hover,
.leaflet-bar a:focus {
\tbackground-color: #f4f4f4;
\t}
.leaflet-bar a:first-child {
\tborder-top-left-radius: 4px;
\tborder-top-right-radius: 4px;
\t}
.leaflet-bar a:last-child {
\tborder-bottom-left-radius: 4px;
\tborder-bottom-right-radius: 4px;
\tborder-bottom: none;
\t}
.leaflet-bar a.leaflet-disabled {
\tcursor: default;
\tbackground-color: #f4f4f4;
\tcolor: #bbb;
\t}

.leaflet-touch .leaflet-bar a {
\twidth: 30px;
\theight: 30px;
\tline-height: 30px;
\t}
.leaflet-touch .leaflet-bar a:first-child {
\tborder-top-left-radius: 2px;
\tborder-top-right-radius: 2px;
\t}
.leaflet-touch .leaflet-bar a:last-child {
\tborder-bottom-left-radius: 2px;
\tborder-bottom-right-radius: 2px;
\t}


/* zoom control */

.leaflet-control-zoom-in,
.leaflet-control-zoom-out {
\tfont: bold 18px 'Lucida Console', Monaco, monospace;
\ttext-indent: 1px;
\t}
.leaflet-touch .leaflet-control-zoom-in,
.leaflet-touch .leaflet-control-zoom-out {
\tfont-size: 22px;
\t}


/* layers control */

.leaflet-control-layers {
\tbox-shadow: 0 1px 5px rgba(0,0,0,0.4);
\tbackground: #fff;
\tborder-radius: 5px;
\t}
.leaflet-control-layers-toggle {
\tbackground-image: url(images/layers.png);
\twidth: 36px;
\theight: 36px;
\t}
.leaflet-retina .leaflet-control-layers-toggle {
\tbackground-image: url(images/layers-2x.png);
\tbackground-size: 26px 26px;
\t}
.leaflet-touch .leaflet-control-layers-toggle {
\twidth: 44px;
\theight: 44px;
\t}
.leaflet-control-layers .leaflet-control-layers-list,
.leaflet-control-layers-expanded .leaflet-control-layers-toggle {
\tdisplay: none;
\t}
.leaflet-control-layers-expanded .leaflet-control-layers-list {
\tdisplay: block;
\tposition: relative;
\t}
.leaflet-control-layers-expanded {
\tpadding: 6px 10px 6px 6px;
\tcolor: #333;
\tbackground: #fff;
\t}
.leaflet-control-layers-scrollbar {
\toverflow-y: scroll;
\tpadding-right: 5px;
\t}
.leaflet-control-layers-selector {
\tmargin-top: 2px;
\tposition: relative;
\ttop: 1px;
\t}
.leaflet-control-layers label {
\tdisplay: block;
\t}
.leaflet-control-layers-separator {
\theight: 0;
\tborder-top: 1px solid #ddd;
\tmargin: 5px -10px 5px -6px;
\t}
.leaflet-default-icon-path { /* used only in path-guessing heuristic, see L.Icon.Default */
\tbackground-image: url(images/marker-icon.png);
\t}


/* attribution and scale controls */

.leaflet-container .leaflet-control-attribution {
\tbackground: #fff;
\tbackground: rgba(255, 255, 255, 0.8);
\tmargin: 0;
\t}
.leaflet-control-attribution,
.leaflet-control-scale-line {
\tpadding: 0 5px;
\tcolor: #333;
\t}
.leaflet-control-attribution a {
\ttext-decoration: none;
\t}
.leaflet-control-attribution a:hover,
.leaflet-control-attribution a:focus {
\ttext-decoration: underline;
\t}
.leaflet-attribution-flag {
\tdisplay: inline !important;
\tvertical-align: baseline !important;
\twidth: 1em !important;
\theight: 0.6669em !important;
\t}
.leaflet-left .leaflet-control-scale {
\tmargin-left: 5px;
\t}
.leaflet-bottom .leaflet-control-scale {
\tmargin-bottom: 5px;
\t}
.leaflet-control-scale-line {
\tborder: 2px solid #777;
\tborder-top: none;
\tline-height: 1.1;
\tpadding: 2px 5px 1px;
\twhite-space: nowrap;
\toverflow: hidden;
\t-moz-box-sizing: border-box;
\t     box-sizing: border-box;
\tbackground: #fff;
\tbackground: rgba(255, 255, 255, 0.5);
\t}
.leaflet-control-scale-line:not(:first-child) {
\tborder-top: 2px solid #777;
\tborder-bottom: none;
\tmargin-top: -2px;
\t}
.leaflet-control-scale-line:not(:first-child):not(:last-child) {
\tborder-bottom: 2px solid #777;
\t}

.leaflet-touch .leaflet-control-attribution,
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
\tbox-shadow: none;
\t}
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
\tborder: 2px solid rgba(0,0,0,0.2);
\tbackground-clip: padding-box;
\t}


/* popup */

.leaflet-popup {
\tposition: absolute;
\ttext-align: center;
\tmargin-bottom: 20px;
\t}
.leaflet-popup-content-wrapper {
\tpadding: 1px;
\ttext-align: left;
\tborder-radius: 12px;
\t}
.leaflet-popup-content {
\tmargin: 13px 24px 13px 20px;
\tline-height: 1.3;
\tfont-size: 13px;
\tfont-size: 1.08333em;
\tmin-height: 1px;
\t}
.leaflet-popup-content p {
\tmargin: 17px 0;
\tmargin: 1.3em 0;
\t}
.leaflet-popup-tip-container {
\twidth: 40px;
\theight: 20px;
\tposition: absolute;
\tleft: 50%;
\tmargin-top: -1px;
\tmargin-left: -20px;
\toverflow: hidden;
\tpointer-events: none;
\t}
.leaflet-popup-tip {
\twidth: 17px;
\theight: 17px;
\tpadding: 1px;

\tmargin: -10px auto 0;
\tpointer-events: auto;

\t-webkit-transform: rotate(45deg);
\t   -moz-transform: rotate(45deg);
\t    -ms-transform: rotate(45deg);
\t        transform: rotate(45deg);
\t}
.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
\tbackground: white;
\tcolor: #333;
\tbox-shadow: 0 3px 14px rgba(0,0,0,0.4);
\t}
.leaflet-container a.leaflet-popup-close-button {
\tposition: absolute;
\ttop: 0;
\tright: 0;
\tborder: none;
\ttext-align: center;
\twidth: 24px;
\theight: 24px;
\tfont: 16px/24px Tahoma, Verdana, sans-serif;
\tcolor: #757575;
\ttext-decoration: none;
\tbackground: transparent;
\t}
.leaflet-container a.leaflet-popup-close-button:hover,
.leaflet-container a.leaflet-popup-close-button:focus {
\tcolor: #585858;
\t}
.leaflet-popup-scrolled {
\toverflow: auto;
\t}

.leaflet-oldie .leaflet-popup-content-wrapper {
\t-ms-zoom: 1;
\t}
.leaflet-oldie .leaflet-popup-tip {
\twidth: 24px;
\tmargin: 0 auto;

\t-ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";
\tfilter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);
\t}

.leaflet-oldie .leaflet-control-zoom,
.leaflet-oldie .leaflet-control-layers,
.leaflet-oldie .leaflet-popup-content-wrapper,
.leaflet-oldie .leaflet-popup-tip {
\tborder: 1px solid #999;
\t}


/* div icon */

.leaflet-div-icon {
\tbackground: #fff;
\tborder: 1px solid #666;
\t}


/* Tooltip */
/* Base styles for the element that has a tooltip */
.leaflet-tooltip {
\tposition: absolute;
\tpadding: 6px;
\tbackground-color: #fff;
\tborder: 1px solid #fff;
\tborder-radius: 3px;
\tcolor: #222;
\twhite-space: nowrap;
\t-webkit-user-select: none;
\t-moz-user-select: none;
\t-ms-user-select: none;
\tuser-select: none;
\tpointer-events: none;
\tbox-shadow: 0 1px 3px rgba(0,0,0,0.4);
\t}
.leaflet-tooltip.leaflet-interactive {
\tcursor: pointer;
\tpointer-events: auto;
\t}
.leaflet-tooltip-top:before,
.leaflet-tooltip-bottom:before,
.leaflet-tooltip-left:before,
.leaflet-tooltip-right:before {
\tposition: absolute;
\tpointer-events: none;
\tborder: 6px solid transparent;
\tbackground: transparent;
\tcontent: "";
\t}

/* Directions */

.leaflet-tooltip-bottom {
\tmargin-top: 6px;
}
.leaflet-tooltip-top {
\tmargin-top: -6px;
}
.leaflet-tooltip-bottom:before,
.leaflet-tooltip-top:before {
\tleft: 50%;
\tmargin-left: -6px;
\t}
.leaflet-tooltip-top:before {
\tbottom: 0;
\tmargin-bottom: -12px;
\tborder-top-color: #fff;
\t}
.leaflet-tooltip-bottom:before {
\ttop: 0;
\tmargin-top: -12px;
\tmargin-left: -6px;
\tborder-bottom-color: #fff;
\t}
.leaflet-tooltip-left {
\tmargin-left: -6px;
}
.leaflet-tooltip-right {
\tmargin-left: 6px;
}
.leaflet-tooltip-left:before,
.leaflet-tooltip-right:before {
\ttop: 50%;
\tmargin-top: -6px;
\t}
.leaflet-tooltip-left:before {
\tright: 0;
\tmargin-right: -12px;
\tborder-left-color: #fff;
\t}
.leaflet-tooltip-right:before {
\tleft: 0;
\tmargin-left: -12px;
\tborder-right-color: #fff;
\t}

/* Printing */

@media print {
\t/* Prevent printers from removing background-images of controls. */
\t.leaflet-control {
\t\t-webkit-print-color-adjust: exact;
\t\tprint-color-adjust: exact;
\t\t}
\t}
`

function LeafletStyles() {
  return <style>{LEAFLET_CSS}</style>
}

// Ensure Leaflet's default marker icons resolve correctly in Vite builds.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const TAB_OPTIONS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'requests', label: 'Buyer Requests', icon: Briefcase },
  { id: 'companies', label: 'Companies', icon: Building2 },
]

const INDUSTRY_OPTIONS = [
  { value: 'garments', label: 'Garments' },
  { value: 'textile', label: 'Textile' },
]

const GARMENT_CATEGORIES = ['Shirts', 'Pants', 'Jackets', 'Knitwear', 'Denim', 'Women', 'Kids']
const TEXTILE_CATEGORIES = ['Woven', 'Knit', 'Denim', 'Non-woven', 'Yarn', 'Trim', 'Accessories']
const FABRIC_TYPE_OPTIONS = ['Cotton', 'Polyester', 'Blend', 'Denim', 'Linen', 'Wool']
const CERTIFICATION_OPTIONS = ['GOTS', 'OEKO-TEX', 'BSCI', 'WRAP', 'Sedex']
const PROCESS_OPTIONS = ['Knit', 'Woven', 'Dyeing', 'Finishing', 'Embroidery', 'Printing']
const LANGUAGE_OPTIONS = ['English', 'Bangla', 'Chinese', 'Spanish']
const INCOTERM_OPTIONS = ['FOB', 'CIF', 'EXW', 'DDP']
const PAYMENT_OPTIONS = ['LC', 'TT', 'Escrow', 'Bank Guarantee']
const DOCUMENT_READY_OPTIONS = ['Export Docs', 'Lab Reports', 'Techpacks']
const CUSTOMIZATION_OPTIONS = ['Techpack Accepted', 'Pattern Making', 'Embroidery']
const SIZE_RANGE_OPTIONS = ['XS-XL', 'S-XXL', 'Custom']
const EXPORT_PORT_OPTIONS = ['Chittagong', 'Dhaka', 'Shanghai', 'Shenzhen', 'Singapore']
const YEARS_IN_BUSINESS_MIN_BUCKETS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+ yr' },
  { value: '3', label: '3+ yr' },
  { value: '5', label: '5+ yr' },
  { value: '10', label: '10+ yr' },
]
const RESPONSE_TIME_MAX_BUCKETS = [
  { value: '', label: 'Any' },
  { value: '1', label: '≤ 1h' },
  { value: '4', label: '≤ 4h' },
  { value: '12', label: '≤ 12h' },
  { value: '24', label: '≤ 24h' },
  { value: '48', label: '≤ 48h' },
]
const TEAM_SEATS_MIN_BUCKETS = [
  { value: '', label: 'Any' },
  { value: '2', label: '2+' },
  { value: '5', label: '5+' },
  { value: '10', label: '10+' },
  { value: '25', label: '25+' },
]
const SAMPLE_LEAD_TIME_MAX_DAYS = 45
const MOQ_BUCKETS = [
  { value: '', label: 'Any' },
  { value: '1-100', label: '1–100' },
  { value: '101-1000', label: '101–1,000' },
  { value: '1001-', label: '1001+' },
]
const CURRENCY_OPTIONS = ['USD', 'EUR', 'CNY', 'BDT', 'GBP']
const PRESET_STORAGE_KEY = 'gt_search_selected_preset'
const PRESET_KEYS = ['buyer', 'buying_house', 'factory']

function normalizePresetKey(value) {
  const normalized = String(value || '').toLowerCase()
  return PRESET_KEYS.includes(normalized) ? normalized : ''
}

function createDefaultFilters(searchParams) {
  return {
    industry: searchParams.get('industry') || '',
    moqRange: searchParams.get('moqRange') || '',
    priceRange: searchParams.get('priceRange') || '',
    priceCurrency: searchParams.get('priceCurrency') || '',
    country: searchParams.get('country') || '',
    verifiedOnly: searchParams.get('verifiedOnly') === 'true',
    orgType: searchParams.get('orgType') || '',
    priorityOnly: searchParams.get('priorityOnly') === 'true',
    leadTimeMax: searchParams.get('leadTimeMax') || '',
    fabricType: parseCsvParam(searchParams.get('fabricType')),
    gsmMin: searchParams.get('gsmMin') || '',
    gsmMax: searchParams.get('gsmMax') || '',
    sizeRange: searchParams.get('sizeRange') || '',
    sizeRangeCustom: searchParams.get('sizeRangeCustom') || '',
    colorPantone: parseCsvParam(searchParams.get('colorPantone')),
    customization: parseCsvParam(searchParams.get('customization')),
    sampleAvailable: searchParams.get('sampleAvailable') === 'true',
    sampleLeadTime: searchParams.get('sampleLeadTime') || '',
    certifications: parseCsvParam(searchParams.get('certifications')),
    incoterms: parseCsvParam(searchParams.get('incoterms')),
    paymentTerms: parseCsvParam(searchParams.get('paymentTerms')),
    documentReady: parseCsvParam(searchParams.get('documentReady')),
    auditDate: searchParams.get('auditDate') || '',
      auditScoreMin: searchParams.get('auditScoreMin') || '',
      hasPermissionMatrix: searchParams.get('hasPermissionMatrix') === 'true',
      permissionSection: searchParams.get('permissionSection') || '',
        permissionSectionEdit: searchParams.get('permissionSectionEdit') === 'true',
        roleSeats: parseRoleSeatsParam(searchParams.get('roleSeats')),
    languageSupport: parseCsvParam(searchParams.get('languageSupport')),
    capacityMin: searchParams.get('capacityMin') || '',
    processes: parseCsvParam(searchParams.get('processes')),
    yearsInBusinessMin: searchParams.get('yearsInBusinessMin') || '',
    responseTimeMax: searchParams.get('responseTimeMax') || '',
    teamSeatsMin: searchParams.get('teamSeatsMin') || '',
    handlesMultipleFactories: searchParams.get('handlesMultipleFactories') === 'true',
    exportPort: parseCsvParam(searchParams.get('exportPort')),
    distanceKm: searchParams.get('distanceKm') || '',
    locationLat: searchParams.get('locationLat') || '',
    locationLng: searchParams.get('locationLng') || '',
  }
}

function parseCsvParam(value) {
  return String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function parseRoleSeatsParam(value) {
  const raw = String(value || '').trim()
  if (!raw) return []
  return raw
    .split(',')
    .map((part) => {
      const [roleRaw, seatsRaw] = String(part || '').split(':').map((s) => (s || '').trim())
      if (!roleRaw) return null
      return { role: roleRaw, seats: seatsRaw || '' }
    })
    .filter(Boolean)
}

function serializeRoleSeats(entries) {
  if (!Array.isArray(entries) || !entries.length) return ''
  return entries
    .filter((e) => e && e.role)
    .map((e) => `${e.role}:${String(e.seats || '')}`)
    .join(',')
}

function toCsv(value) {
  if (!value) return ''
  if (Array.isArray(value)) return value.filter(Boolean).join(',')
  return String(value || '')
}

function hasFilterValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'boolean') return value
  return String(value || '').trim().length > 0
}

function parseRangeValue(value) {
  const raw = String(value || '').trim()
  if (!raw || !raw.includes('-')) return { min: '', max: '' }
  const [min, max] = raw.split('-').map((part) => part.trim())
  return { min, max }
}

function rangeToString(min, max) {
  const minVal = String(min || '').trim()
  const maxVal = String(max || '').trim()
  if (!minVal && !maxVal) return ''
  if (!maxVal) return `${minVal}-`
  if (!minVal) return `0-${maxVal}`
  return `${minVal}-${maxVal}`
}

function mergeFacetCounts(a = {}, b = {}) {
  const out = { ...(a || {}) }
  Object.entries(b || {}).forEach(([key, counts]) => {
    const bucket = out[key] || {}
    Object.entries(counts || {}).forEach(([label, count]) => {
      bucket[label] = (bucket[label] || 0) + Number(count || 0)
    })
    out[key] = bucket
  })
  return out
}

function getFacetCount(counts = {}, label = '') {
  if (!counts || !label) return undefined
  if (counts[label] !== undefined) return counts[label]
  const lower = label.toLowerCase()
  if (counts[lower] !== undefined) return counts[lower]
  const matchKey = Object.keys(counts).find((key) => String(key).toLowerCase() === lower)
  return matchKey ? counts[matchKey] : undefined
}

function hashString(value) {
  let hash = 0
  const text = String(value || '')
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

function roleToProfileRoute(role, id) {
  // Convert a company role -> correct profile route.
  // Used when clicking a search result card to navigate to the right profile page.
  if (!id) return ''
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'buyer') return `/buyer/${encodeURIComponent(id)}`
  if (normalized === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
  return `/factory/${encodeURIComponent(id)}`
}


function buildQueryString({ q, category, filters, includeAdvanced, includePriority = false }) {
  // Build URLSearchParams from UI state.
  // Core filters are always free; advanced filters require premium.
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (Array.isArray(category) ? category.length : category) params.set('category', toCsv(category))
  if (filters.industry) params.set('industry', filters.industry)

  // Core filters (always included if set)
  if (filters.moqRange) params.set('moqRange', filters.moqRange)
  if (filters.priceRange) params.set('priceRange', filters.priceRange)
  if (filters.priceCurrency) params.set('priceCurrency', filters.priceCurrency)
  if (filters.country) params.set('country', filters.country)
  if (filters.verifiedOnly) params.set('verifiedOnly', 'true')
  if (filters.orgType) params.set('orgType', filters.orgType)
  if (filters.leadTimeMax) params.set('leadTimeMax', filters.leadTimeMax)
  if (includePriority && filters.priorityOnly) params.set('priorityOnly', 'true')

  // Advanced filters (premium only)
  if (includeAdvanced) {
    if (hasFilterValue(filters.fabricType)) params.set('fabricType', toCsv(filters.fabricType))
    if (filters.gsmMin) params.set('gsmMin', filters.gsmMin)
    if (filters.gsmMax) params.set('gsmMax', filters.gsmMax)
    if (filters.sizeRange) params.set('sizeRange', filters.sizeRange)
    if (filters.sizeRange === 'Custom' && filters.sizeRangeCustom) params.set('sizeRangeCustom', filters.sizeRangeCustom)
    if (hasFilterValue(filters.colorPantone)) params.set('colorPantone', toCsv(filters.colorPantone))
    if (hasFilterValue(filters.customization)) params.set('customization', toCsv(filters.customization))
    if (filters.sampleAvailable) params.set('sampleAvailable', 'true')
    if (filters.sampleLeadTime) params.set('sampleLeadTime', filters.sampleLeadTime)
    if (hasFilterValue(filters.certifications)) params.set('certifications', toCsv(filters.certifications))
    if (hasFilterValue(filters.incoterms)) params.set('incoterms', toCsv(filters.incoterms))
    if (hasFilterValue(filters.paymentTerms)) params.set('paymentTerms', toCsv(filters.paymentTerms))
    if (hasFilterValue(filters.documentReady)) params.set('documentReady', toCsv(filters.documentReady))
    if (filters.auditScoreMin) params.set('auditScoreMin', filters.auditScoreMin)
    if (filters.auditDate) params.set('auditDate', filters.auditDate)
    if (filters.hasPermissionMatrix) params.set('hasPermissionMatrix', 'true')
      if (filters.permissionSection) params.set('permissionSection', filters.permissionSection)
      if (filters.permissionSectionEdit) params.set('permissionSectionEdit', 'true')
    if (hasFilterValue(filters.languageSupport)) params.set('languageSupport', toCsv(filters.languageSupport))
    if (filters.capacityMin) params.set('capacityMin', filters.capacityMin)
    if (hasFilterValue(filters.processes)) params.set('processes', toCsv(filters.processes))
    if (filters.yearsInBusinessMin) params.set('yearsInBusinessMin', filters.yearsInBusinessMin)
    if (filters.responseTimeMax) params.set('responseTimeMax', filters.responseTimeMax)
    if (filters.teamSeatsMin) params.set('teamSeatsMin', filters.teamSeatsMin)
    if (filters.roleSeats && Array.isArray(filters.roleSeats) && filters.roleSeats.length) {
      const rs = serializeRoleSeats(filters.roleSeats)
      if (rs) params.set('roleSeats', rs)
    }
    if (filters.handlesMultipleFactories) params.set('handlesMultipleFactories', 'true')
    if (hasFilterValue(filters.exportPort)) params.set('exportPort', toCsv(filters.exportPort))
    if (filters.distanceKm) params.set('distanceKm', filters.distanceKm)
    if (filters.locationLat) params.set('locationLat', filters.locationLat)
    if (filters.locationLng) params.set('locationLng', filters.locationLng)
  }

  return params.toString()
}

function ResultSkeletonCard({ index }) {
  return (
    <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800" aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-3 w-1/3 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)] dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]" />
          <div className="mt-3 h-3 w-3/4 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)] dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]" />
          <div className="mt-2 h-3 w-2/3 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)] dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-3 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)] dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]" />
            <div className="h-3 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)] dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]" />
            <div className="h-3 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)] dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]" />
            <div className="h-3 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)] dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-9 w-28 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)] dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]" />
          <div className="h-9 w-28 rounded-full relative overflow-hidden bg-slate-200/80 dark:bg-white/5 after:content-[''] after:absolute after:inset-0 after:translate-x-[-140%] after:pointer-events-none after:opacity-70 dark:after:opacity-90 after:animate-skeleton after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.28)_45%,transparent_70%)] dark:after:bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_70%)]" />
        </div>
      </div>
      <span className="sr-only">Loading result {index + 1}</span>
    </div>
  )
}

function ChipGroup({ options = [], values = [], onChange, disabled, counts = {} }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = values.includes(option)
        const count = getFacetCount(counts, option)
        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (disabled) return
              if (selected) onChange(values.filter((entry) => entry !== option))
              else onChange([...values, option])
            }}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${
              selected
                ? ' bg-gtBlue text-white ring-transparent dark:bg-gtBlue dark:text-white'
                : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10'
            } ${disabled ? 'opacity-50' : ''}`}
          >
            {option}
            {Number.isFinite(Number(count)) ? (
              <span className={`ml-1 text-[10px] ${selected ? 'text-white/80' : 'text-slate-400'}`}>({count})</span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

function BucketChips({ options = [], value = '', onChange, disabled }) {
  const selectedValue = String(value || '')
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const optValue = String(option?.value ?? '')
        const selected = selectedValue === optValue || (!selectedValue && !optValue)
        return (
          <button
            key={`${optValue || 'any'}-${option.label}`}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (disabled) return
              const next = selected && optValue ? '' : optValue
              onChange(next)
            }}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${
              selected
                ? ' bg-gtBlue text-white ring-transparent dark:bg-gtBlue dark:text-white'
                : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10'
            } ${disabled ? 'opacity-50' : ''}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function RangeSlider({ min = 0, max = 100, step = 1, valueMin = '', valueMax = '', onChange, suffix = '', disabled = false, formatValue }) {
  const minValue = valueMin === '' ? min : Number(valueMin)
  const maxValue = valueMax === '' ? max : Number(valueMax)
  const format = typeof formatValue === 'function'
    ? formatValue
    : (v) => `${v}${suffix}`
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span>{Number.isFinite(minValue) ? format(minValue) : format(min)}</span>
        <div className="h-px flex-1 bg-slate-200" />
        <span>{Number.isFinite(maxValue) ? format(maxValue) : format(max)}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(minValue) ? minValue : min}
          onChange={(event) => onChange(String(event.target.value || ''), valueMax)}
          disabled={disabled}
          className="w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(maxValue) ? maxValue : max}
          onChange={(event) => onChange(valueMin, String(event.target.value || ''))}
          disabled={disabled}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default function SearchResults() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const token = useMemo(() => getToken(), [])
  const sessionUser = getCurrentUser()
  const isBuyer = String(sessionUser?.role || '').toLowerCase() === 'buyer'
  const canAdvancedFilters = hasEntitlement(sessionUser, 'advanced_search_filters')
  const canEarlyAccess = hasEntitlement(sessionUser, 'early_access_verified_factories')
  const canPriorityAccessRequests = hasEntitlement(sessionUser, 'buyer_request_priority_access')
  const canPriorityAccessCompanies = hasEntitlement(sessionUser, 'priority_search_ranking')
  const reduceMotion = useReducedMotion()
  const queryInputRef = useRef(null)
  const isMac = useMemo(() => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)), [])

  // URL-serializable search state (project.md): allows sharing/saving searches.
  const [query, setQuery] = useState(() => searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'all')
  const [category, setCategory] = useState(() => parseCsvParam(searchParams.get('category')))
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [productMoreOpen, setProductMoreOpen] = useState(false)
  const [supplierMoreOpen, setSupplierMoreOpen] = useState(false)
  const [productAdvancedOpen, setProductAdvancedOpen] = useState(false)
  const [supplierAdvancedOpen, setSupplierAdvancedOpen] = useState(false)
  const [filterMode, setFilterMode] = useState('product')
  const [activePreset, setActivePreset] = useState(() => normalizePresetKey(localStorage.getItem(PRESET_STORAGE_KEY)))
  const renderedDefaultCoreFilterKeys = useMemo(() => [...DEFAULT_CORE_FILTER_KEYS], [])
  const [upgradePrompt, setUpgradePrompt] = useState('')
  const [alertFeedback, setAlertFeedback] = useState('')
  const [autoSaveCandidate, setAutoSaveCandidate] = useState(null)
  const [managePresetsOpen, setManagePresetsOpen] = useState(false)
  const [serverPresets, setServerPresets] = useState([])
  const [serverPresetsLoading, setServerPresetsLoading] = useState(false)
  const [earlyVerifiedFactories, setEarlyVerifiedFactories] = useState([])
  const [earlyVerifiedError, setEarlyVerifiedError] = useState('')
  const [pantoneDraft, setPantoneDraft] = useState('')
  const [roleSeatDraftRole, setRoleSeatDraftRole] = useState('')
  const [roleSeatDraftSeats, setRoleSeatDraftSeats] = useState('')
  const [locationLabel, setLocationLabel] = useState('')
  const [geoQuery, setGeoQuery] = useState('')
  const [geoResults, setGeoResults] = useState([])
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [showMapPreview, setShowMapPreview] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [autoSaveAlertsEnabled] = useState(() => {
    const raw = sessionUser?.profile?.auto_save_search_alerts
    if (raw === undefined || raw === null || raw === '') return true
    return raw === true || String(raw).toLowerCase() === 'true'
  })

  const [filters, setFilters] = useState(() => createDefaultFilters(searchParams))
  const hasAdvancedFiltersFromUrl = useMemo(() => (
    ADVANCED_FILTER_KEYS.some((key) => key !== 'priorityOnly' && hasFilterValue(searchParams.get(key)))
  ), [searchParams])

  useEffect(() => {
    const inDev = !import.meta.env.PROD
    if (!inDev) return
    const validation = validateCoreFilterRenderKeys(renderedDefaultCoreFilterKeys)
    if (!validation.isValid) {
      console.warn('[SearchResults] Invalid default core filter configuration.', validation)
    }
  }, [renderedDefaultCoreFilterKeys])

  useEffect(() => {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') return
    let alive = true
    const loadEarlyVerified = async () => {
      if (!token) return
      if (!isBuyer || !canEarlyAccess) {
        setEarlyVerifiedFactories([])
        return
      }
      try {
        const data = await apiRequest('/users/verified/early', { token })
        if (!alive) return
        setEarlyVerifiedFactories(Array.isArray(data?.items) ? data.items : [])
        setEarlyVerifiedError('')
      } catch (err) {
        if (!alive) return
        setEarlyVerifiedFactories([])
        setEarlyVerifiedError(err.message || 'Unable to load early verified factories')
      }
    }
    loadEarlyVerified()
    return () => {
      alive = false
    }
  }, [canEarlyAccess, isBuyer, token])

  const [capabilities, setCapabilities] = useState(() => ({
    filters: { advanced: canAdvancedFilters },
  }))
  const hasAdvancedAccess = Boolean(capabilities?.filters?.advanced)
  const premiumLocked = !hasAdvancedAccess
  const priorityAllowedForTab = useMemo(() => {
    if (activeTab === 'requests') return canPriorityAccessRequests
    if (activeTab === 'companies') return canPriorityAccessCompanies
    return canPriorityAccessRequests && canPriorityAccessCompanies
  }, [activeTab, canPriorityAccessRequests, canPriorityAccessCompanies])

  useEffect(() => {
    const storedPreset = normalizePresetKey(localStorage.getItem(PRESET_STORAGE_KEY))
    if (storedPreset) {
      setActivePreset(storedPreset)
      return
    }
    const rolePreset = normalizePresetKey(String(sessionUser?.role || '').toLowerCase())
    if (rolePreset) {
      localStorage.setItem(PRESET_STORAGE_KEY, rolePreset)
      setActivePreset(rolePreset)
    }
  }, [sessionUser?.role])

  const categoryOptions = useMemo(() => {
    const industry = String(filters.industry || '').toLowerCase()
    if (industry === 'textile') return TEXTILE_CATEGORIES
    if (industry === 'garments') return GARMENT_CATEGORIES
    return [...new Set([...GARMENT_CATEGORIES, ...TEXTILE_CATEGORIES])]
  }, [filters.industry])

  const moqRangeValues = useMemo(() => parseRangeValue(filters.moqRange), [filters.moqRange])
  const priceRangeValues = useMemo(() => parseRangeValue(filters.priceRange), [filters.priceRange])

  const priceFormatter = useMemo(() => {
    const curr = String(filters.priceCurrency || 'USD')
    try {
      const nf = new Intl.NumberFormat(undefined, { style: 'currency', currency: curr, maximumFractionDigits: 2 })
      return (v) => nf.format(Number(v || 0))
    } catch {
      return (v) => `${curr} ${v}`
    }
  }, [filters.priceCurrency])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quotaMessage, setQuotaMessage] = useState('')

  const [requests, setRequests] = useState([])
  const [companies, setCompanies] = useState([])
  const [requestsTotal, setRequestsTotal] = useState(0)
  const [companiesTotal, setCompaniesTotal] = useState(0)
  const [facets, setFacets] = useState({})
  const [ratingsByProfileKey, setRatingsByProfileKey] = useState({})
  const [recentViews, setRecentViews] = useState([])
  const [quickViewItem, setQuickViewItem] = useState(null)

  const facetCounts = {
    category: facets?.category || {},
    fabricType: facets?.fabricType || facets?.fabric_type || {},
    certifications: facets?.certifications || {},
    processes: facets?.processes || {},
    languageSupport: facets?.languageSupport || facets?.language_support || {},
    incoterms: facets?.incoterms || {},
    paymentTerms: facets?.paymentTerms || facets?.payment_terms || {},
    documentReady: facets?.documentReady || facets?.document_ready || {},
    exportPort: facets?.exportPort || facets?.export_ports || {},
  }

  const [estimateTotals, setEstimateTotals] = useState({ requests: null, companies: null })
  const [estimateLoading, setEstimateLoading] = useState(false)
  const [estimateError, setEstimateError] = useState('')
  const estimateSeqRef = useRef(0)
  const skipEstimateRef = useRef(false)

  const totalResults = (Number(requestsTotal) || 0) + (Number(companiesTotal) || 0)

  const autoSearchRef = useRef(false)
  const filterTrackRef = useRef({ key: '', initialized: false })
  const autoSaveKeyRef = useRef('')
  const lastSearchMetadataRef = useRef({ searched: false, preset: '' })
  const dirtyFilterSinceSearchRef = useRef(false)

  const autoSaveAlert = useCallback(async (candidate) => {
    if (!autoSaveAlertsEnabled) return
    if (!candidate) return
    const key = JSON.stringify(candidate)
    if (autoSaveKeyRef.current === key) return
    autoSaveKeyRef.current = key
    try {
      await apiRequest('/search/alerts', {
        method: 'POST',
        token,
        body: { query: candidate.query || 'saved-search', filters: { category: toCsv(candidate.category), ...candidate.filters, auto: true } },
      })
    } catch (err) {
      if (err?.status === 429) {
        setAlertFeedback('Daily auto-alert quota reached. Search still ran normally.')
      } else if (err?.message) {
        setAlertFeedback(err.message)
      }
    }
  }, [autoSaveAlertsEnabled, token])

  const runSearch = useCallback(async () => {
    const q = query.trim()
    setLoading(true)
    setError('')
    setQuotaMessage('')
    setUpgradePrompt('')
    setAlertFeedback('')

    try {
      const qsUrl = buildQueryString({
        q,
        category,
        filters,
        includeAdvanced: hasAdvancedAccess,
        includePriority: Boolean(filters.priorityOnly),
      })
      const includePriorityRequests = Boolean(filters.priorityOnly) && activeTab !== 'companies' && canPriorityAccessRequests
      const includePriorityCompanies = Boolean(filters.priorityOnly) && activeTab !== 'requests' && canPriorityAccessCompanies
      const qsRequests = buildQueryString({
        q,
        category,
        filters,
        includeAdvanced: hasAdvancedAccess,
        includePriority: includePriorityRequests,
      })
      const qsProducts = buildQueryString({
        q,
        category,
        filters,
        includeAdvanced: hasAdvancedAccess,
        includePriority: includePriorityCompanies,
      })

      // Keep URL in sync so searches are shareable/bookmarkable (project.md).
      const nextParams = new URLSearchParams(qsUrl)
      if (activeTab) nextParams.set('tab', activeTab)
      setSearchParams(nextParams, { replace: true })

      const [reqRes, prodRes] = await Promise.all([
        apiRequest(`/requirements/search?${qsRequests}`, { token }),
        apiRequest(`/products/search?${qsProducts}`, { token }),
      ])

      const reqItems = Array.isArray(reqRes?.items) ? reqRes.items : []
      const prodItems = Array.isArray(prodRes?.items) ? prodRes.items : []
      const reqTotal = Number.isFinite(Number(reqRes?.total)) ? Number(reqRes.total) : reqItems.length
      const prodTotal = Number.isFinite(Number(prodRes?.total)) ? Number(prodRes.total) : prodItems.length
      lastSearchMetadataRef.current = { searched: true, preset: activePreset || '' }
      dirtyFilterSinceSearchRef.current = false

      flushSync(() => {
        setRequests(reqItems)
        setCompanies(prodItems)
        setRequestsTotal(reqTotal)
        setCompaniesTotal(prodTotal)
      })

      const reqFacets = reqRes?.facets || {}
      const prodFacets = prodRes?.facets || {}
      const mergedFacets = activeTab === 'requests'
        ? reqFacets
        : (activeTab === 'companies' ? prodFacets : mergeFacetCounts(reqFacets, prodFacets))
      flushSync(() => {
        setFacets(mergedFacets || {})
      })

      const mergedCapabilities = reqRes?.capabilities || prodRes?.capabilities || { filters: { advanced: false } }
      flushSync(() => {
        setCapabilities(mergedCapabilities)
      })

      const hasActiveFilters = Boolean(q) || category.length > 0 || Object.values(filters || {}).some((v) => hasFilterValue(v))
      const candidate = hasActiveFilters ? { query: q, category, filters } : null
      flushSync(() => {
        setAutoSaveCandidate(candidate)
      })
      await autoSaveAlert(candidate)

      if (reqRes?.quota) {
        if (reqRes.quota.unlimited) {
          setQuotaMessage('Core searches are unlimited on your plan.')
        } else if (reqRes.quota.remaining !== undefined) {
          setQuotaMessage(`Search quota remaining today: ${reqRes.quota.remaining}`)
        }
      }

      trackClientEvent('search_run', {
        entityType: 'search',
        entityId: activeTab,
        metadata: {
          query: q,
          categories: category,
          category_primary: category[0] || '',
          industry: filters.industry || '',
          tab: activeTab,
          advanced: hasAdvancedAccess,
          preset: activePreset || 'none',
          total_results: reqTotal + prodTotal,
        },
      })
      trackClientEvent('search_preset_conversion', {
        entityType: 'search',
        entityId: activeTab,
        metadata: {
          preset: activePreset || 'none',
          total_results: reqTotal + prodTotal,
        },
      })

      if (q || category.length > 0 || Object.values(filters || {}).some((v) => hasFilterValue(v))) {
        const fingerprint = hashString(JSON.stringify({ q, category, filters, tab: activeTab }))
        recordLeadSource({
          type: 'search',
          id: fingerprint,
          label: q || category.join(', ') || 'Search',
        })
      }
    } catch (err) {
      flushSync(() => {
        setError(err.message || 'Search failed')
        setRequests([])
        setCompanies([])
        setRequestsTotal(0)
        setCompaniesTotal(0)
      })
      if (err?.quota?.unlimited) {
        flushSync(() => { setQuotaMessage('Core searches are unlimited on your plan.') })
      } else if (err?.quota?.remaining !== undefined) {
        flushSync(() => { setQuotaMessage(`Remaining today: ${err.quota.remaining}`) })
      }
    } finally {
      flushSync(() => { setLoading(false) })
    }
  }, [activePreset, activeTab, autoSaveAlert, category, filters, hasAdvancedAccess, query, setSearchParams, token, canPriorityAccessCompanies, canPriorityAccessRequests])

  useEffect(() => {
    const handler = (e) => {
      const key = String(e.key || '').toLowerCase()
      if (key !== 'k') return
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      queryInputRef.current?.focus?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    // Auto-run when landing on /search with URL params (shared/bookmarked search).
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') return
    if (autoSearchRef.current) return
    autoSearchRef.current = true

    const hasUrlQuery = Boolean(
      (query && query.trim()) ||
      category.length > 0 ||
      Object.values(filters || {}).some((v) => hasFilterValue(v)),
    )

    if (hasUrlQuery) {
      skipEstimateRef.current = true
      runSearch()
    }
  }, [category, filters, query, runSearch])

  useEffect(() => {
    if (!activePreset) return
    if (autoSearchRef.current) return
    const hasUrlQuery = Boolean(
      (query && query.trim()) ||
      category.length > 0 ||
      Object.values(filters || {}).some((v) => hasFilterValue(v)),
    )
    if (hasUrlQuery) return
    applyPreset(activePreset)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePreset])

  useEffect(() => {
    if (!filters.priorityOnly) return
    if (priorityAllowedForTab) return
    setFilters((prev) => ({ ...prev, priorityOnly: false }))
    setUpgradePrompt('Priority-only filter requires a Premium plan.')
  }, [filters.priorityOnly, priorityAllowedForTab])

  useEffect(() => {
    if (!token) return
    if (skipEstimateRef.current) {
      skipEstimateRef.current = false
      return
    }

    const q = query.trim()
    const hasActiveFilters = Boolean(
      q ||
      category.length > 0 ||
      Object.values(filters || {}).some((v) => hasFilterValue(v)),
    )

    if (!hasActiveFilters) {
      setEstimateTotals({ requests: null, companies: null })
      setEstimateError('')
      setEstimateLoading(false)
      return
    }

    const seq = (estimateSeqRef.current += 1)
    const includePriorityRequests = Boolean(filters.priorityOnly) && activeTab !== 'companies' && canPriorityAccessRequests
    const includePriorityCompanies = Boolean(filters.priorityOnly) && activeTab !== 'requests' && canPriorityAccessCompanies

    const timer = window.setTimeout(async () => {
      setEstimateLoading(true)
      setEstimateError('')
      try {
        const qsRequestsBase = buildQueryString({
          q,
          category,
          filters,
          includeAdvanced: hasAdvancedAccess,
          includePriority: includePriorityRequests,
        })
        const qsProductsBase = buildQueryString({
          q,
          category,
          filters,
          includeAdvanced: hasAdvancedAccess,
          includePriority: includePriorityCompanies,
        })

        const qsRequests = `${qsRequestsBase}${qsRequestsBase ? '&' : ''}estimateOnly=true`
        const qsProducts = `${qsProductsBase}${qsProductsBase ? '&' : ''}estimateOnly=true`
        const [reqRes, prodRes] = await Promise.all([
          apiRequest(`/requirements/search?${qsRequests}`, { token }),
          apiRequest(`/products/search?${qsProducts}`, { token }),
        ])

        if (estimateSeqRef.current !== seq) return

        const reqTotal = Number.isFinite(Number(reqRes?.total)) ? Number(reqRes.total) : 0
        const prodTotal = Number.isFinite(Number(prodRes?.total)) ? Number(prodRes.total) : 0
        setEstimateTotals({ requests: reqTotal, companies: prodTotal })
        const reqFacets = reqRes?.facets || {}
        const prodFacets = prodRes?.facets || {}
        const mergedFacets = activeTab === 'requests'
          ? reqFacets
          : (activeTab === 'companies' ? prodFacets : mergeFacetCounts(reqFacets, prodFacets))
        if (Object.keys(mergedFacets || {}).length) setFacets(mergedFacets)

        const mergedCapabilities = reqRes?.capabilities || prodRes?.capabilities
        if (mergedCapabilities) setCapabilities(mergedCapabilities)
      } catch (err) {
        if (estimateSeqRef.current !== seq) return
        setEstimateTotals({ requests: null, companies: null })
        setEstimateError(err.message || 'Unable to estimate results.')
      } finally {
        if (estimateSeqRef.current === seq) {
          setEstimateLoading(false)
        }
      }
    }, 450)

    return () => window.clearTimeout(timer)
  }, [activeTab, canPriorityAccessCompanies, canPriorityAccessRequests, category, filters, hasAdvancedAccess, query, token])

  useEffect(() => {
    const activeAdvancedKeys = hasAdvancedAccess
      ? ADVANCED_FILTER_KEYS.filter((key) => hasFilterValue(filters[key]))
      : []
    const activeCoreKeys = DEFAULT_CORE_FILTER_KEYS.filter((key) => (key === 'category' ? category.length > 0 : hasFilterValue(filters[key])))
    const payload = {
      query: query.trim(),
      categories: category,
      category_primary: category[0] || '',
      industry: filters.industry || '',
      tab: activeTab,
      advanced: hasAdvancedAccess,
      active_filter_keys: [...activeCoreKeys, ...activeAdvancedKeys],
    }
    const key = JSON.stringify(payload)
    if (!filterTrackRef.current.initialized) {
      filterTrackRef.current = { key, initialized: true }
      return
    }
    if (filterTrackRef.current.key === key) return
    filterTrackRef.current.key = key
    const timer = window.setTimeout(() => {
      trackClientEvent('search_filters_changed', {
        entityType: 'search',
        entityId: activeTab,
        metadata: payload,
      })
    }, 600)
    return () => window.clearTimeout(timer)
  }, [activeTab, category, filters, hasAdvancedAccess, query])

  useEffect(() => {
    const depth = supplierAdvancedOpen || productAdvancedOpen
      ? 3
      : (productMoreOpen || supplierMoreOpen || advancedFiltersOpen ? 2 : (filtersOpen ? 1 : 0))
    trackClientEvent('search_filter_depth_opened', {
      entityType: 'search',
      entityId: activeTab,
      metadata: {
        depth,
        preset: activePreset || 'none',
      },
    })
  }, [activePreset, activeTab, advancedFiltersOpen, filtersOpen, productAdvancedOpen, productMoreOpen, supplierAdvancedOpen, supplierMoreOpen])

  useEffect(() => {
    const hasChanges = Boolean(query.trim() || category.length > 0 || Object.values(filters || {}).some((v) => hasFilterValue(v)))
    if (hasChanges) dirtyFilterSinceSearchRef.current = true
  }, [category, filters, query])

  useEffect(() => () => {
    if (dirtyFilterSinceSearchRef.current && !lastSearchMetadataRef.current.searched) {
      trackClientEvent('search_filter_abandonment', {
        entityType: 'search',
        entityId: activeTab,
        metadata: {
          preset: activePreset || 'none',
        },
      })
    }
  }, [activePreset, activeTab])

  useEffect(() => {
    if (!geoQuery) {
      setGeoResults([])
      return
    }
    const timer = window.setTimeout(() => {
      runGeoSearch(geoQuery)
    }, 450)
    return () => window.clearTimeout(timer)
  }, [geoQuery])

  useEffect(() => {
    const lat = Number(filters.locationLat)
    const lng = Number(filters.locationLng)
    if (!showMapPreview) return
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
    if (!mapRef.current) return

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)
    }

    mapInstanceRef.current.setView([lat, lng], 10)
    const marker = L.marker([lat, lng])
    marker.addTo(mapInstanceRef.current)
    return () => {
      if (mapInstanceRef.current && marker) {
        mapInstanceRef.current.removeLayer(marker)
      }
    }
  }, [filters.locationLat, filters.locationLng, showMapPreview])

  const loadRecentViews = useCallback(async () => {
    try {
      const data = await apiRequest('/products/views/me?cursor=0&limit=5', { token })
      setRecentViews(Array.isArray(data?.items) ? data.items : [])
    } catch {
      setRecentViews([])
    }
  }, [token])

  useEffect(() => {
    const keys = [...new Set(companies.map((c) => String(c.profile_key || '')).filter(Boolean))]
    if (!keys.length) {
      setRatingsByProfileKey({})
      return
    }

    apiRequest(`/ratings/search?profile_keys=${encodeURIComponent(keys.join(','))}`, { token })
      .then((data) => setRatingsByProfileKey(data || {}))
      .catch(() => setRatingsByProfileKey({}))
  }, [companies, token])

  useEffect(() => {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') return
    loadRecentViews()
  }, [loadRecentViews])

  function updateAdvancedFilter(key, value) {
    if (!hasAdvancedAccess) {
      setUpgradePrompt('Advanced filters require a Premium plan. Upgrade to unlock these filters.')
      return
    }
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function toggleCategory(option) {
    setCategory((prev) => {
      if (prev.includes(option)) return prev.filter((entry) => entry !== option)
      return [...prev, option]
    })
  }

  function clearCategories() {
    setCategory([])
  }

  function updateCoreFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function updateRangeFilter(key, min, max) {
    setFilters((prev) => ({ ...prev, [key]: rangeToString(min, max) }))
  }

  function addPantone(value) {
    const cleaned = String(value || '').trim()
    if (!cleaned) return
    updateAdvancedFilter('colorPantone', [...new Set([...(filters.colorPantone || []), cleaned])])
    setPantoneDraft('')
  }

  function addRoleSeat() {
    const role = String(roleSeatDraftRole || '').trim()
    if (!role) return
    const seats = String(roleSeatDraftSeats || '').trim()
    const existing = Array.isArray(filters.roleSeats) ? (filters.roleSeats || []) : []
    const next = existing.filter((e) => String(e?.role || '').toLowerCase() !== role.toLowerCase())
    next.push({ role, seats })
    updateAdvancedFilter('roleSeats', next)
    setRoleSeatDraftRole('')
    setRoleSeatDraftSeats('')
  }

  function removePantone(value) {
    updateAdvancedFilter('colorPantone', (filters.colorPantone || []).filter((entry) => entry !== value))
  }

  async function runGeoSearch(term) {
    const q = String(term || '').trim()
    if (!q) {
      setGeoResults([])
      return
    }
    setGeoLoading(true)
    setGeoError('')
    try {
      const data = await apiRequest(`/geo/search?q=${encodeURIComponent(q)}`)
      setGeoResults(Array.isArray(data?.items) ? data.items : [])
    } catch (err) {
      setGeoResults([])
      setGeoError(err.message || 'Unable to search location')
    } finally {
      setGeoLoading(false)
    }
  }

  function selectGeoResult(result) {
    if (!result) return
    updateAdvancedFilter('locationLat', String(result.lat))
    updateAdvancedFilter('locationLng', String(result.lng))
    setLocationLabel(result.label || '')
    setGeoQuery(result.label || '')
    setGeoResults([])
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setAlertFeedback('Geolocation is not available in this browser.')
      return
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude.toFixed(6)
      const lng = position.coords.longitude.toFixed(6)
      updateAdvancedFilter('locationLat', lat)
      updateAdvancedFilter('locationLng', lng)
      setLocationLabel('Current location')
      setGeoQuery('Current location')
    }, () => {
      setAlertFeedback('Unable to access your location.')
    })
  }

  function updatePriorityFilter(value) {
    if (!priorityAllowedForTab) {
      setUpgradePrompt('Priority-only filter requires a Premium plan.')
      return
    }
    setFilters((prev) => ({ ...prev, priorityOnly: value }))
  }

  function clearAllFilters() {
    setQuery('')
    setCategory([])
    setFilters(createDefaultFilters(new URLSearchParams()))
    setGeoQuery('')
    setGeoResults([])
    setLocationLabel('')
  }

  async function saveAlert(presetLabel = '') {
    setAlertFeedback('')
    const q = query.trim()
    const hasFilters = Object.values(filters || {}).some((v) => hasFilterValue(v))
    if (!q && category.length === 0 && !hasFilters) {
      setAlertFeedback('Enter a query or select filters before saving.')
      return
    }
    try {
      const result = await apiRequest('/search/alerts', {
        method: 'POST',
        token,
        body: { query: q || 'saved-search', filters: { category: toCsv(category), ...filters, preset: presetLabel } },
      })
      setAlertFeedback(`Search saved. Remaining alert quota today: ${result?.quota?.remaining ?? '-'}`)
    } catch (err) {
      setAlertFeedback(err.message || 'Failed to save alert.')
    }
  }

  function getShareUrl() {
    try {
      const qs = buildQueryString({
        q: query.trim(),
        category,
        filters,
        includeAdvanced: hasAdvancedAccess,
        includePriority: Boolean(filters.priorityOnly),
      })
      const params = new URLSearchParams(qs)
      if (activeTab) params.set('tab', activeTab)
      return `${window.location.origin}/search?${params.toString()}`
    } catch {
      return `${window.location.origin}/search`
    }
  }

  async function handleShareClick() {
    const url = getShareUrl()
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setAlertFeedback('Share link copied to clipboard.')
      } else {
        // fallback
        window.prompt('Copy this link', url)
      }
    } catch {
      setAlertFeedback(`Unable to copy link. ${url}`)
    }
  }

  function listLocalPresets() {
    try {
      return PRESET_KEYS.map((k) => {
        const raw = localStorage.getItem(`gt_search_preset_${k}`)
        if (!raw) return null
        try { return { key: k, data: JSON.parse(raw) } } catch { return null }
      }).filter(Boolean)
    } catch {
      return []
    }
  }

  function deleteLocalPreset(presetKey) {
    try {
      localStorage.removeItem(`gt_search_preset_${presetKey}`)
      if (localStorage.getItem(PRESET_STORAGE_KEY) === presetKey) localStorage.removeItem(PRESET_STORAGE_KEY)
      setAlertFeedback('Preset deleted.')
      setManagePresetsOpen(false)
    } catch {
      // ignore
    }
  }

  async function shareLocalPreset(preset) {
    try {
      const payload = preset?.data || {}
      const qs = buildQueryString({
        q: payload.query || '',
        category: payload.category || [],
        filters: payload.filters || {},
        includeAdvanced: hasAdvancedAccess,
        includePriority: Boolean(payload?.filters?.priorityOnly),
      })
      const params = new URLSearchParams(qs)
      if (activeTab) params.set('tab', activeTab)
      const url = `${window.location.origin}/search?${params.toString()}`
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setAlertFeedback('Preset link copied to clipboard.')
      } else {
        window.prompt('Copy this preset link', url)
      }
    } catch {
      setAlertFeedback('Unable to copy preset link.')
    }
  }

  function savePresetLocal(presetKey) {
    try {
      const payload = { query, category, filters }
      localStorage.setItem(`gt_search_preset_${presetKey}`, JSON.stringify(payload))
      localStorage.setItem(PRESET_STORAGE_KEY, presetKey)
      setActivePreset(presetKey)
    } catch {
      // ignore storage failures
    }
  }

  function presetFallback(presetKey) {
    if (presetKey === 'buyer') {
      return { query: '', category: [], filters: { industry: 'garments', orgType: 'factory', verifiedOnly: true } }
    }
    if (presetKey === 'buying_house') {
      return { query: '', category: [], filters: { orgType: 'factory', verifiedOnly: true, handlesMultipleFactories: true } }
    }
    return { query: '', category: [], filters: { orgType: 'buying_house', verifiedOnly: true } }
  }

  function applyPreset(presetKey) {
    const normalizedPresetKey = normalizePresetKey(presetKey)
    if (!normalizedPresetKey) return
    try {
      const raw = localStorage.getItem(`gt_search_preset_${normalizedPresetKey}`)
      const preset = raw ? JSON.parse(raw) : presetFallback(normalizedPresetKey)
      setQuery(preset?.query || '')
      const presetCategory = Array.isArray(preset?.category)
        ? preset.category
        : parseCsvParam(preset?.category)
      setCategory(presetCategory)
      if (preset?.filters) {
        setFilters((prev) => ({
          ...prev,
          ...preset.filters,
          fabricType: Array.isArray(preset.filters.fabricType) ? preset.filters.fabricType : parseCsvParam(preset.filters.fabricType),
          colorPantone: Array.isArray(preset.filters.colorPantone) ? preset.filters.colorPantone : parseCsvParam(preset.filters.colorPantone),
          customization: Array.isArray(preset.filters.customization) ? preset.filters.customization : parseCsvParam(preset.filters.customization),
          certifications: Array.isArray(preset.filters.certifications) ? preset.filters.certifications : parseCsvParam(preset.filters.certifications),
          incoterms: Array.isArray(preset.filters.incoterms) ? preset.filters.incoterms : parseCsvParam(preset.filters.incoterms),
          paymentTerms: Array.isArray(preset.filters.paymentTerms) ? preset.filters.paymentTerms : parseCsvParam(preset.filters.paymentTerms),
          documentReady: Array.isArray(preset.filters.documentReady) ? preset.filters.documentReady : parseCsvParam(preset.filters.documentReady),
          languageSupport: Array.isArray(preset.filters.languageSupport) ? preset.filters.languageSupport : parseCsvParam(preset.filters.languageSupport),
          processes: Array.isArray(preset.filters.processes) ? preset.filters.processes : parseCsvParam(preset.filters.processes),
          exportPort: Array.isArray(preset.filters.exportPort) ? preset.filters.exportPort : parseCsvParam(preset.filters.exportPort),
        }))
      }
      localStorage.setItem(PRESET_STORAGE_KEY, normalizedPresetKey)
      setActivePreset(normalizedPresetKey)
      setAlertFeedback(`Loaded ${normalizedPresetKey.replace('_', ' ')} preset.`)
    } catch {
      setAlertFeedback('Unable to load preset.')
    }
  }

  async function savePreset(presetKey) {
    await saveAlert(presetKey)
    savePresetLocal(presetKey)
    setAutoSaveCandidate(null)
  }

  const fetchServerPresets = useCallback(async () => {
    if (!token) {
      setServerPresets([])
      return
    }
    setServerPresetsLoading(true)
    try {
      const data = await apiRequest('/presets', { token })
      setServerPresets(Array.isArray(data?.items) ? data.items : [])
    } catch {
      setServerPresets([])
    } finally {
      setServerPresetsLoading(false)
    }
  }, [token])

  async function createServerPresetFromCurrent(name, shared = false) {
    if (!token) {
      setAlertFeedback('Login required to save presets.')
      return null
    }
    try {
      const payload = { name: String(name || 'Preset'), filters: { query, category, ...filters }, shared: Boolean(shared) }
      await apiRequest('/presets', { method: 'POST', token, body: payload })
      await fetchServerPresets()
      setAlertFeedback('Preset saved to server.')
      return true
    } catch (err) {
      setAlertFeedback(err.message || 'Unable to save preset to server.')
      return null
    }
  }

  async function createServerPresetFromLocal(presetKey) {
    try {
      const raw = localStorage.getItem(`gt_search_preset_${presetKey}`)
      if (!raw) {
        setAlertFeedback('Local preset not found')
        return null
      }
      const parsed = JSON.parse(raw)
      if (!token) {
        setAlertFeedback('Login required to save presets.')
        return null
      }
      const payload = { name: `${presetKey.replace('_', ' ')} preset`, filters: { query: parsed.query || '', category: parsed.category || [], ...parsed.filters }, shared: false }
      await apiRequest('/presets', { method: 'POST', token, body: payload })
      await fetchServerPresets()
      setAlertFeedback('Local preset copied to server.')
      return true
    } catch (err) {
      setAlertFeedback(err.message || 'Unable to copy preset to server.')
      return null
    }
  }

  function applyServerPreset(preset) {
    try {
      const data = preset?.filters || {}
      setQuery(data.query || '')
      const presetCategory = Array.isArray(data.category) ? data.category : parseCsvParam(data.category)
      setCategory(presetCategory)
      if (data) {
        setFilters((prev) => ({
          ...prev,
          ...data,
          fabricType: Array.isArray(data.fabricType) ? data.fabricType : parseCsvParam(data.fabricType),
          colorPantone: Array.isArray(data.colorPantone) ? data.colorPantone : parseCsvParam(data.colorPantone),
          customization: Array.isArray(data.customization) ? data.customization : parseCsvParam(data.customization),
          certifications: Array.isArray(data.certifications) ? data.certifications : parseCsvParam(data.certifications),
          incoterms: Array.isArray(data.incoterms) ? data.incoterms : parseCsvParam(data.incoterms),
          paymentTerms: Array.isArray(data.paymentTerms) ? data.paymentTerms : parseCsvParam(data.paymentTerms),
          documentReady: Array.isArray(data.documentReady) ? data.documentReady : parseCsvParam(data.documentReady),
          languageSupport: Array.isArray(data.languageSupport) ? data.languageSupport : parseCsvParam(data.languageSupport),
          processes: Array.isArray(data.processes) ? data.processes : parseCsvParam(data.processes),
          exportPort: Array.isArray(data.exportPort) ? data.exportPort : parseCsvParam(data.exportPort),
        }))
      }
      setActivePreset(preset?.name || '')
      setAlertFeedback(`Loaded preset "${preset?.name || ''}"`)
    } catch {
      setAlertFeedback('Unable to load preset.')
    }
  }

  async function updateServerPreset(presetId) {
    if (!token) {
      setAlertFeedback('Login required.')
      return null
    }
    try {
      const name = window.prompt('Rename preset (leave blank to keep current name)', '')
      if (name === null) return null
      const body = { name: name || undefined, filters: { query, category, ...filters } }
      await apiRequest(`/presets/${encodeURIComponent(presetId)}`, { method: 'PATCH', token, body })
      await fetchServerPresets()
      setAlertFeedback('Preset updated.')
      return true
    } catch (err) {
      setAlertFeedback(err.message || 'Unable to update preset.')
      return null
    }
  }

  async function deleteServerPreset(presetId) {
    if (!token) {
      setAlertFeedback('Login required.')
      return false
    }
    try {
      await apiRequest(`/presets/${encodeURIComponent(presetId)}`, { method: 'DELETE', token })
      await fetchServerPresets()
      setAlertFeedback('Preset deleted.')
      return true
    } catch (err) {
      setAlertFeedback(err.message || 'Unable to delete preset.')
      return false
    }
  }

  useEffect(() => {
    if (!managePresetsOpen) return
    fetchServerPresets().catch(() => null)
  }, [managePresetsOpen, fetchServerPresets])

  function openChatNotice(name, leadSource, journeyContext = {}) {
    if (leadSource?.type && leadSource?.id) {
      recordLeadSource({
        type: leadSource.type,
        id: leadSource.id,
        label: leadSource.label || '',
      })
    }
    const params = new URLSearchParams()
    params.set('journey_source', 'search')
    if (journeyContext?.matchId) params.set('match_id', journeyContext.matchId)
    if (journeyContext?.productId) params.set('product_id', journeyContext.productId)
    if (journeyContext?.requirementId) params.set('requirement_id', journeyContext.requirementId)
    const token = getToken()
    if (token) {
      apiRequest('/workflow/journeys', {
        method: 'POST',
        token,
        body: {
          match_id: journeyContext?.matchId || '',
          requirement_id: journeyContext?.requirementId || '',
          product_id: journeyContext?.productId || '',
          initial_state: 'discovered',
        },
      })
        .then((journey) => {
          if (!journey?.id) return null
          return apiRequest(`/workflow/journeys/${encodeURIComponent(journey.id)}/transition`, {
            method: 'POST',
            token,
            body: {
              to_state: 'matched',
              event_type: 'match_confirmed',
              metadata: { source: 'search_results_contact' },
            },
          })
        })
        .catch(() => null)
    }
    const query = params.toString()
    navigate(`/chat${query ? `?${query}` : ''}`, { state: { notice: `Contacting ${name}. If you are unverified, your first message may appear as a request.` } })
  }

  const activeFilterChips = useMemo(() => {
    const chips = []
    if (query.trim()) chips.push({ key: 'query', label: `Query: ${query.trim()}`, onRemove: () => setQuery('') })
    if (category.length) chips.push({ key: 'category', label: `Category: ${category.join(', ')}`, onRemove: clearCategories })
    if (filters.industry) chips.push({ key: 'industry', label: `Industry: ${filters.industry}`, onRemove: () => setFilters((prev) => ({ ...prev, industry: '' })) })
    if (filters.country) chips.push({ key: 'country', label: `Country: ${filters.country}`, onRemove: () => setFilters((prev) => ({ ...prev, country: '' })) })
    if (filters.incoterms && Array.isArray(filters.incoterms) && filters.incoterms.length) chips.push({ key: 'incoterms', label: `Incoterms: ${filters.incoterms.join(', ')}`, onRemove: () => setFilters((prev) => ({ ...prev, incoterms: [] })) })
    if (filters.auditDate) chips.push({ key: 'auditDate', label: `Last audit: ${filters.auditDate}`, onRemove: () => setFilters((prev) => ({ ...prev, auditDate: '' })) })
    if (filters.verifiedOnly) chips.push({ key: 'verifiedOnly', label: 'Verified only', onRemove: () => setFilters((prev) => ({ ...prev, verifiedOnly: false })) })
    if (filters.orgType) chips.push({ key: 'orgType', label: `Account: ${filters.orgType.replace('_', ' ')}`, onRemove: () => setFilters((prev) => ({ ...prev, orgType: '' })) })
    if (filters.priorityOnly) chips.push({ key: 'priorityOnly', label: 'Priority only', onRemove: () => setFilters((prev) => ({ ...prev, priorityOnly: false })) })
    if (filters.priceRange) {
      const pr = priceRangeValues || { min: '', max: '' }
      const minLabel = pr.min ? priceFormatter(pr.min) : ''
      const maxLabel = pr.max ? priceFormatter(pr.max) : ''
      const label = `Price: ${minLabel}${(minLabel && maxLabel) ? ` - ${maxLabel}` : ''}`
      chips.push({ key: 'priceRange', label, onRemove: () => setFilters((prev) => ({ ...prev, priceRange: '' })) })
    }
    if (filters.auditScoreMin) chips.push({ key: 'auditScoreMin', label: `Audit score ≥ ${filters.auditScoreMin}`, onRemove: () => setFilters((prev) => ({ ...prev, auditScoreMin: '' })) })
    if (filters.hasPermissionMatrix) chips.push({ key: 'hasPermissionMatrix', label: 'Role-based access', onRemove: () => setFilters((prev) => ({ ...prev, hasPermissionMatrix: false })) })
    if (filters.permissionSection) chips.push({ key: 'permissionSection', label: `Permission: ${filters.permissionSection}${filters.permissionSectionEdit ? ' (edit)' : ''}`, onRemove: () => setFilters((prev) => ({ ...prev, permissionSection: '', permissionSectionEdit: false })) })
    if (filters.roleSeats && Array.isArray(filters.roleSeats) && filters.roleSeats.length) {
      (filters.roleSeats || []).forEach((entry) => {
        if (!entry || !entry.role) return
        const label = `${entry.role}: ${entry.seats || '0'} seats`
        chips.push({ key: `roleSeats-${entry.role}`, label, onRemove: () => setFilters((prev) => ({ ...prev, roleSeats: (prev.roleSeats || []).filter((e) => e.role !== entry.role) })) })
      })
    }
    return chips
  }, [category, filters, priceFormatter, priceRangeValues, query])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <LeafletStyles />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md dark:bg-slate-950/40 dark:ring-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white flex items-center justify-center">
                <SearchIcon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Search</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Garments & Textile marketplace</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
              >
                <Filter size={16} />
                Filters
              </button>
              <button
                type="button"
                onClick={saveAlert}
                className="inline-flex items-center gap-2 rounded-full bg-gtBlue px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gtBlueHover active:scale-95"
              >
                <Bell size={16} />
                Save search
              </button>
              <button
                type="button"
                onClick={handleShareClick}
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
              >
                <Share2 size={16} />
                Share
              </button>
              <Link
                to="/notifications"
                className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8"
              >
                Alerts
              </Link>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <input
                ref={queryInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search requests, factories, products..."
                className="w-full rounded-full bg-slate-100/70 px-4 py-3 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
                {isMac ? 'Cmd K' : 'Ctrl K'}
              </span>
            </div>
            <button
              type="button"
              onClick={runSearch}
              className="rounded-full bg-gtBlue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gtBlueHover active:scale-95 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={clearCategories}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${category.length ? ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50' : ' bg-gtBlue text-white ring-transparent'}`}
            >
              All categories
            </button>
            {categoryOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleCategory(option)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${category.includes(option) ? ' bg-gtBlue text-white ring-transparent' : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50'}`}
              >
                {option}
                {Number.isFinite(Number(getFacetCount(facetCounts.category, option))) ? (
                  <span className={`ml-1 text-[10px] ${category.includes(option) ? 'text-white/80' : 'text-slate-400'}`}>
                    ({getFacetCount(facetCounts.category, option)})
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="sticky top-2 z-20 mt-3 rounded-xl bg-white/90 p-2 ring-1 ring-slate-200/70 backdrop-blur dark:bg-slate-950/70 dark:ring-white/10">
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.length ? activeFilterChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100"
                >
                  {chip.label} ×
                </button>
              )) : <span className="text-[11px] text-slate-500 dark:text-slate-400">No active filters</span>}
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-auto rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 hover:bg-slate-50 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
              >
                Clear all
              </button>
            </div>
          </div>

          {(estimateLoading || estimateError || estimateTotals.requests !== null || estimateTotals.companies !== null) ? (
            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              {estimateLoading ? 'Estimating results...' : estimateError ? (
                <span className="text-rose-600">{estimateError}</span>
              ) : (
                <>
                  {activeTab === 'requests'
                    ? `Estimated buyer requests: ${estimateTotals.requests ?? 0}`
                    : activeTab === 'companies'
                      ? `Estimated companies: ${estimateTotals.companies ?? 0}`
                      : `Estimated: ${(estimateTotals.requests ?? 0)} buyer requests · ${(estimateTotals.companies ?? 0)} companies (${(estimateTotals.requests ?? 0) + (estimateTotals.companies ?? 0)} total)`}
                </>
              )}
            </div>
          ) : null}

          {filtersOpen ? (
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Product</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core filters are visible first</p>
                <div className="mt-3 grid grid-cols-1 gap-2" data-testid="default-core-filter-bar" data-core-filter-count={renderedDefaultCoreFilterKeys.length}>
                  <select
                    value={filters.industry}
                    onChange={(e) => updateCoreFilter('industry', e.target.value)}
                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                  >
                    <option value="">Industry (Any)</option>
                    {INDUSTRY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                    <p className="text-[11px] font-semibold text-slate-500">MOQ range</p>
                    <div className="mt-2">
                      <BucketChips
                        options={MOQ_BUCKETS}
                        value={filters.moqRange}
                        onChange={(val) => {
                          // BucketChips returns a value like "min-max" or '' for Any
                          if (!val) updateRangeFilter('moqRange', '', '')
                          else {
                            const parts = String(val).split('-')
                            const min = parts[0] || ''
                            const max = parts[1] === undefined ? '' : parts[1]
                            updateRangeFilter('moqRange', min, max)
                          }
                        }}
                        disabled={false}
                      />
                    </div>
                    <div className="mt-3">
                      <RangeSlider
                        min={0}
                        max={5000}
                        step={50}
                        valueMin={moqRangeValues.min}
                        valueMax={moqRangeValues.max}
                        onChange={(min, max) => updateRangeFilter('moqRange', min, max)}
                      />
                    </div>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                    <p className="text-[11px] font-semibold text-slate-500">Price per unit</p>
                    <div className="mt-2 flex items-center gap-2">
                      <select
                        value={filters.priceCurrency || ''}
                        onChange={(e) => updateCoreFilter('priceCurrency', e.target.value)}
                        className="w-28 rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                      >
                        <option value="">Currency</option>
                        {CURRENCY_OPTIONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <div className="flex-1">
                        <RangeSlider
                          min={0}
                          max={200}
                          step={1}
                          valueMin={priceRangeValues.min}
                          valueMax={priceRangeValues.max}
                          onChange={(min, max) => updateRangeFilter('priceRange', min, max)}
                          suffix=""
                          formatValue={priceFormatter}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                    <p className="text-[11px] font-semibold text-slate-500">Incoterms</p>
                    <div className="mt-2">
                      <ChipGroup
                        options={INCOTERM_OPTIONS}
                        values={filters.incoterms || []}
                        onChange={(values) => updateCoreFilter('incoterms', values)}
                        disabled={false}
                        counts={facetCounts.incoterms}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProductMoreOpen((prev) => !prev)}
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
                  >
                    {productMoreOpen ? 'Hide more filters' : 'More filters'}
                  </button>
                  {productMoreOpen ? (
                    <>
                      <input
                        value={filters.country}
                        onChange={(e) => updateCoreFilter('country', e.target.value)}
                        placeholder="Country (e.g. Bangladesh)"
                        className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                      />
                      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <input
                          type="checkbox"
                          checked={filters.verifiedOnly}
                          onChange={(e) => updateCoreFilter('verifiedOnly', e.target.checked)}
                          className="h-4 w-4"
                        />
                        Verified only
                      </label>
                    </>
                  ) : null}
                </div>
              </div>

              <div className={`rounded-2xl p-4 ring-1 shadow-sm${premiumLocked ? ' bg-amber-50 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/30' : ' bg-[#ffffff] ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10'}`} data-has-advanced-url-filters={hasAdvancedFiltersFromUrl ? 'true' : 'false'}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Supplier / Account</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Core visible first, attributes under More filters</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSupplierMoreOpen((prev) => !prev)}
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
                  >
                    {supplierMoreOpen ? 'Hide more filters' : 'More filters'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdvancedFiltersOpen((prev) => !prev)}
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
                  >
                    {advancedFiltersOpen ? 'Hide advanced' : 'Advanced'}
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div className="rounded-xl bg-white px-3 py-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                    <p className="text-[11px] font-semibold text-slate-500">Account type</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['', 'buyer', 'factory', 'buying_house'].map((value) => {
                        const label = value === '' ? 'Any' : (value === 'buying_house' ? 'Buying House' : value.charAt(0).toUpperCase() + value.slice(1))
                        const active = filters.orgType === value
                        return (
                          <button
                            key={value || 'any'}
                            type="button"
                            onClick={() => updateCoreFilter('orgType', value)}
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition${active ? ' bg-gtBlue text-white ring-transparent' : ' bg-white text-slate-600 ring-slate-200/70 hover:bg-slate-50'}`}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {supplierMoreOpen ? (
                    <select
                      value={filters.leadTimeMax}
                      onChange={(e) => updateCoreFilter('leadTimeMax', e.target.value)}
                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                    >
                      <option value="">Lead time (Any)</option>
                      <option value="7">Lead time &lt;= 7 days</option>
                      <option value="14">Lead time &lt;= 14 days</option>
                      <option value="30">Lead time &lt;= 30 days</option>
                      <option value="60">Lead time &lt;= 60 days</option>
                      <option value="90">Lead time &lt;= 90 days</option>
                    </select>
                  ) : null}
                </div>

                {advancedFiltersOpen ? (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={filters.priorityOnly}
                        onChange={(e) => updatePriorityFilter(e.target.checked)}
                        className="h-4 w-4"
                      />
                      Priority only
                      {!priorityAllowedForTab ? (
                        <span className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          Premium
                        </span>
                      ) : null}
                    </label>
                    <div className="flex flex-wrap gap-2 rounded-full bg-slate-50 p-1 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                      <button
                        type="button"
                        onClick={() => setFilterMode('product')}
                        className={`rounded-full px-3 py-1 ${filterMode === 'product' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
                      >
                        Product Filters
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterMode('supplier')}
                        className={`rounded-full px-3 py-1 ${filterMode === 'supplier' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
                      >
                        Supplier Filters
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => (filterMode === 'product' ? setProductAdvancedOpen((prev) => !prev) : setSupplierAdvancedOpen((prev) => !prev))}
                      className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10"
                    >
                      {(filterMode === 'product' ? productAdvancedOpen : supplierAdvancedOpen) ? 'Hide advanced block' : 'Open advanced block'}
                    </button>

                    {filterMode === 'product' ? (
                      productAdvancedOpen ? (
                      <>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Fabric type</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={FABRIC_TYPE_OPTIONS}
                              values={filters.fabricType}
                              onChange={(values) => updateAdvancedFilter('fabricType', values)}
                              disabled={premiumLocked}
                              counts={facetCounts.fabricType}
                            />
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">GSM / Weight</p>
                          <div className="mt-2">
                            <RangeSlider
                              min={80}
                              max={600}
                              step={10}
                              valueMin={filters.gsmMin}
                              valueMax={filters.gsmMax}
                              onChange={(min, max) => {
                                updateAdvancedFilter('gsmMin', min)
                                updateAdvancedFilter('gsmMax', max)
                              }}
                              disabled={premiumLocked}
                            />
                          </div>
                        </div>
                        <select
                          value={filters.sizeRange}
                          onChange={(e) => updateAdvancedFilter('sizeRange', e.target.value)}
                          disabled={premiumLocked}
                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                        >
                          <option value="">Size range (Any)</option>
                          {SIZE_RANGE_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {filters.sizeRange === 'Custom' ? (
                          <div className="mt-2">
                            <input
                              value={filters.sizeRangeCustom || ''}
                              onChange={(e) => updateAdvancedFilter('sizeRangeCustom', e.target.value)}
                              placeholder="Custom sizes (e.g. Chest:32-40; Waist:28-36)"
                              disabled={premiumLocked}
                              className="w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
                          </div>
                        ) : null}
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Color / Pantone</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(filters.colorPantone || []).map((code) => (
                              <button
                                key={code}
                                type="button"
                                onClick={() => removePantone(code)}
                                className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700"
                              >
                                {code} ×
                              </button>
                            ))}
                          </div>
                          <div className="mt-2 flex gap-2">
                            <input
                              value={pantoneDraft}
                              onChange={(e) => setPantoneDraft(e.target.value)}
                              placeholder="Add Pantone (e.g. 19-4052)"
                              disabled={premiumLocked}
                              className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  event.preventDefault()
                                  addPantone(pantoneDraft)
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => addPantone(pantoneDraft)}
                              disabled={premiumLocked}
                              className="rounded-lg bg-gtBlue px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Customization</p>
                          <div className="mt-2 space-y-2">
                            {CUSTOMIZATION_OPTIONS.map((opt) => {
                              const checked = Array.isArray(filters.customization) && filters.customization.includes(opt)
                              return (
                                <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    disabled={premiumLocked}
                                    onChange={() => {
                                      const next = checked
                                        ? (filters.customization || []).filter((c) => c !== opt)
                                        : [...(filters.customization || []), opt]
                                      updateAdvancedFilter('customization', next)
                                    }}
                                    className="h-4 w-4"
                                  />
                                  {opt}
                                </label>
                              )
                            })}
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={filters.sampleAvailable}
                            onChange={(e) => updateAdvancedFilter('sampleAvailable', e.target.checked)}
                            disabled={premiumLocked}
                            className="h-4 w-4"
                          />
                          Sample available
                        </label>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold text-slate-500">Sample lead time (days)</p>
                            <button
                              type="button"
                              onClick={() => updateAdvancedFilter('sampleLeadTime', '')}
                              disabled={premiumLocked || !filters.sampleLeadTime}
                              className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-60 dark:text-slate-300 dark:hover:text-slate-200"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max={String(SAMPLE_LEAD_TIME_MAX_DAYS)}
                              step="1"
                              value={Number.isFinite(Number(filters.sampleLeadTime)) ? Number(filters.sampleLeadTime) : SAMPLE_LEAD_TIME_MAX_DAYS}
                              onChange={(e) => updateAdvancedFilter('sampleLeadTime', e.target.value)}
                              disabled={premiumLocked}
                              className="w-full"
                            />
                            <input
                              type="number"
                              min="0"
                              max={String(SAMPLE_LEAD_TIME_MAX_DAYS)}
                              value={filters.sampleLeadTime}
                              onChange={(e) => updateAdvancedFilter('sampleLeadTime', e.target.value)}
                              placeholder="Any"
                              disabled={premiumLocked}
                              className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
                          </div>
                          <div className="mt-1 text-[10px] text-slate-400">
                            {filters.sampleLeadTime ? `Up to ${filters.sampleLeadTime} days` : 'Any (move slider to set)'}
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Certifications</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={CERTIFICATION_OPTIONS}
                              values={filters.certifications}
                              onChange={(values) => updateAdvancedFilter('certifications', values)}
                              disabled={premiumLocked}
                              counts={facetCounts.certifications}
                            />
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Last audit date</p>
                          <input
                            type="date"
                            value={filters.auditDate}
                            onChange={(e) => updateAdvancedFilter('auditDate', e.target.value)}
                            disabled={premiumLocked}
                            className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                          />
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Incoterms</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={INCOTERM_OPTIONS}
                              values={filters.incoterms}
                              onChange={(values) => updateAdvancedFilter('incoterms', values)}
                              disabled={premiumLocked}
                              counts={facetCounts.incoterms}
                            />
                          </div>
                        </div>
                      </>
                      ) : <p className="text-[11px] text-slate-500">Open advanced block to configure product attributes.</p>
                    ) : (
                      supplierAdvancedOpen ? (
                      <>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Payment terms</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={PAYMENT_OPTIONS}
                              values={filters.paymentTerms}
                              onChange={(values) => updateAdvancedFilter('paymentTerms', values)}
                              disabled={premiumLocked}
                              counts={facetCounts.paymentTerms}
                            />
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Document readiness</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={DOCUMENT_READY_OPTIONS}
                              values={filters.documentReady}
                              onChange={(values) => updateAdvancedFilter('documentReady', values)}
                              disabled={premiumLocked}
                              counts={facetCounts.documentReady}
                            />
                          </div>
                        </div>
                        
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] font-semibold text-slate-500">Audit score (min)</p>
                            <button
                              type="button"
                              onClick={() => updateAdvancedFilter('auditScoreMin', '')}
                              disabled={premiumLocked || !filters.auditScoreMin}
                              className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-60"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={Number(filters.auditScoreMin || 0)}
                              onChange={(e) => updateAdvancedFilter('auditScoreMin', e.target.value)}
                              disabled={premiumLocked}
                              className="w-full"
                            />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={filters.auditScoreMin}
                              onChange={(e) => updateAdvancedFilter('auditScoreMin', e.target.value)}
                              placeholder="Any"
                              disabled={premiumLocked}
                              className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
                          </div>
                          <div className="mt-1 text-[10px] text-slate-400">
                            {filters.auditScoreMin ? `Min score: ${filters.auditScoreMin}` : 'Any (move slider to set)'}
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Language support</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={LANGUAGE_OPTIONS}
                              values={filters.languageSupport}
                              onChange={(values) => updateAdvancedFilter('languageSupport', values)}
                              disabled={premiumLocked}
                              counts={facetCounts.languageSupport}
                            />
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Production capacity (units/month)</p>
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100000"
                              step="500"
                              value={Number(filters.capacityMin || 0)}
                              onChange={(e) => updateAdvancedFilter('capacityMin', e.target.value)}
                              disabled={premiumLocked}
                              className="w-full"
                            />
                            <span className="text-[11px] font-semibold">{filters.capacityMin || 0}</span>
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Main processes</p>
                          <div className="mt-2">
                            <ChipGroup
                              options={PROCESS_OPTIONS}
                              values={filters.processes}
                              onChange={(values) => updateAdvancedFilter('processes', values)}
                              disabled={premiumLocked}
                              counts={facetCounts.processes}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Years in business (min)</p>
                            <div className="mt-2">
                              <BucketChips
                                options={YEARS_IN_BUSINESS_MIN_BUCKETS}
                                value={filters.yearsInBusinessMin}
                                onChange={(value) => updateAdvancedFilter('yearsInBusinessMin', value)}
                                disabled={premiumLocked}
                              />
                            </div>
                          </div>
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Avg response time (max)</p>
                            <div className="mt-2">
                              <BucketChips
                                options={RESPONSE_TIME_MAX_BUCKETS}
                                value={filters.responseTimeMax}
                                onChange={(value) => updateAdvancedFilter('responseTimeMax', value)}
                                disabled={premiumLocked}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Team seats (min)</p>
                            <div className="mt-2">
                              <BucketChips
                                options={TEAM_SEATS_MIN_BUCKETS}
                                value={filters.teamSeatsMin}
                                onChange={(value) => updateAdvancedFilter('teamSeatsMin', value)}
                                disabled={premiumLocked}
                              />
                            </div>
                          </div>
                          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                            <input
                              type="checkbox"
                              checked={Boolean(filters.hasPermissionMatrix)}
                              onChange={(e) => updateAdvancedFilter('hasPermissionMatrix', e.target.checked)}
                              disabled={premiumLocked}
                              className="h-4 w-4"
                            />
                            Has role-based access (permission matrix)
                          </label>
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Permission area</p>
                            <select
                              value={filters.permissionSection || ''}
                              onChange={(e) => updateAdvancedFilter('permissionSection', e.target.value)}
                              disabled={premiumLocked}
                              className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            >
                              <option value="">Any (permission)</option>
                              <option value="requests">Requests</option>
                              <option value="products">Products</option>
                              <option value="analytics">Analytics</option>
                              <option value="members">Members</option>
                              <option value="documents">Documents</option>
                            </select>
                            <label className="mt-2 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                              <input
                                type="checkbox"
                                checked={Boolean(filters.permissionSectionEdit)}
                                onChange={(e) => updateAdvancedFilter('permissionSectionEdit', e.target.checked)}
                                disabled={premiumLocked}
                                className="h-4 w-4"
                              />
                              Require edit access
                            </label>
                          </div>
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Role seats</p>
                            <div className="mt-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Role (e.g., manager)"
                                  value={roleSeatDraftRole}
                                  onChange={(e) => setRoleSeatDraftRole(e.target.value)}
                                  disabled={premiumLocked}
                                  className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                                />
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Seats"
                                  value={roleSeatDraftSeats}
                                  onChange={(e) => setRoleSeatDraftSeats(e.target.value)}
                                  disabled={premiumLocked}
                                  className="w-24 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                                />
                                <button
                                  type="button"
                                  onClick={addRoleSeat}
                                  disabled={premiumLocked || !roleSeatDraftRole}
                                  className="rounded-lg bg-gtBlue px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
                                >
                                  Add
                                </button>
                              </div>
                              <div className="mt-2 space-y-1">
                                {Array.isArray(filters.roleSeats) && filters.roleSeats.length ? (
                                  filters.roleSeats.map((entry) => (
                                    <div key={entry.role} className="flex items-center justify-between">
                                      <div className="text-[11px] text-slate-700">{entry.role}: {entry.seats || 0} seats</div>
                                      <div>
                                        <button
                                          type="button"
                                          onClick={() => updateAdvancedFilter('roleSeats', (filters.roleSeats || []).filter((e) => e.role !== entry.role))}
                                          disabled={premiumLocked}
                                          className="rounded-full px-2 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-[11px] text-slate-400">No role seat filters</div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                            <p className="text-[11px] font-semibold text-slate-500">Export ports</p>
                            <div className="mt-2">
                              <ChipGroup
                                options={EXPORT_PORT_OPTIONS}
                                values={filters.exportPort}
                                onChange={(values) => updateAdvancedFilter('exportPort', values)}
                                disabled={premiumLocked}
                                counts={facetCounts.exportPort}
                              />
                            </div>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={filters.handlesMultipleFactories}
                            onChange={(e) => updateAdvancedFilter('handlesMultipleFactories', e.target.checked)}
                            disabled={premiumLocked}
                            className="h-4 w-4"
                          />
                          Handles multiple factories
                        </label>
                        <div className="rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                          <p className="text-[11px] font-semibold text-slate-500">Location + radius</p>
                          <div className="mt-2 flex gap-2">
                            <input
                              value={geoQuery}
                              onChange={(e) => setGeoQuery(e.target.value)}
                              placeholder="Search city or country"
                              disabled={premiumLocked}
                              className="flex-1 rounded-lg bg-white px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                            />
                            <button
                              type="button"
                              onClick={useCurrentLocation}
                              disabled={premiumLocked}
                              className="rounded-lg bg-gtBlue px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60"
                            >
                              Use my location
                            </button>
                          </div>
                          {geoLoading ? <div className="mt-2 text-[10px] text-slate-500">Searching locations...</div> : null}
                          {geoError ? <div className="mt-2 text-[10px] text-rose-600">{geoError}</div> : null}
                          {geoResults.length ? (
                            <div className="mt-2 max-h-32 space-y-1 overflow-auto rounded-lg shadow-borderless dark:shadow-borderlessDark bg-white p-2">
                              {geoResults.map((result) => (
                                <button
                                  key={result.id}
                                  type="button"
                                  onClick={() => selectGeoResult(result)}
                                  className="w-full text-left text-[11px] text-slate-700 hover:text-gtBlue"
                                >
                                  {result.label}
                                </button>
                              ))}
                            </div>
                          ) : null}
                          {locationLabel ? (
                            <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                              Selected: {locationLabel}
                            </div>
                          ) : null}
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                            <span>Lat: {filters.locationLat || '--'} · Lng: {filters.locationLng || '--'}</span>
                            <button
                              type="button"
                              onClick={() => setShowMapPreview((prev) => !prev)}
                              className="text-[10px] font-semibold text-gtBlue"
                            >
                              {showMapPreview ? 'Hide map' : 'Show map'}
                            </button>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="2000"
                              step="50"
                              value={Number(filters.distanceKm || 0)}
                              onChange={(e) => updateAdvancedFilter('distanceKm', e.target.value)}
                              disabled={premiumLocked}
                              className="w-full"
                            />
                            <span className="text-[11px] font-semibold">{filters.distanceKm || 0}km</span>
                          </div>
                          {showMapPreview && filters.locationLat && filters.locationLng ? (
                            <div className="mt-2 h-36 overflow-hidden rounded-lg shadow-borderless dark:shadow-borderlessDark">
                              <div ref={mapRef} className="h-full w-full" />
                            </div>
                          ) : null}
                        </div>
                      </>
                      ) : <p className="text-[11px] text-slate-500">Open advanced block to configure supplier/account attributes.</p>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Advanced filters are hidden to keep search simple. Use "More filters" when needed.</p>
                )}
              </div>

              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Filter guidance</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <p>Supplier filters use profile data such as main processes, export ports, and years in business.</p>
                  <p>Distance radius uses coordinates. Use “Use my location” to fill lat/lng quickly. If a supplier has no coordinates, we fall back to country matching.</p>
                  <p>Premium filters are optional. Core filters always remain free and unlimited.</p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-white/10">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Status & presets</p>
                <div className="mt-2 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                  {quotaMessage ? <p>{quotaMessage}</p> : <p>Run a search to see quota status.</p>}
                  {upgradePrompt ? <p className="text-amber-800 bg-amber-50 shadow-borderless dark:shadow-borderlessDark rounded-xl p-2">{upgradePrompt}</p> : null}
                  {alertFeedback ? <p className="text-sky-800 bg-sky-50 shadow-borderless dark:shadow-borderlessDark rounded-xl p-2">{alertFeedback}</p> : null}
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Apply preset</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => applyPreset('buyer')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buyer</button>
                    <button type="button" onClick={() => applyPreset('buying_house')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Buying house</button>
                    <button type="button" onClick={() => applyPreset('factory')} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">Factory</button>
                  </div>
                </div>

                <div className="mt-3">
                  <button type="button" onClick={() => setManagePresetsOpen((p) => !p)} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Manage presets</button>
                  {managePresetsOpen ? (
                    <div className="mt-2 space-y-2">
                      {listLocalPresets().length ? listLocalPresets().map((p) => (
                        <div key={p.key} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70">
                          <div className="min-w-0 text-xs text-slate-700">{p.key.replace('_', ' ')} preset</div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => applyPreset(p.key)} className="rounded-full bg-gtBlue px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                            <button type="button" onClick={() => shareLocalPreset(p)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Share</button>
                            <button type="button" onClick={() => createServerPresetFromLocal(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Copy to server</button>
                            <button type="button" onClick={() => deleteLocalPreset(p.key)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                          </div>
                        </div>
                      )) : (
                        <div className="text-xs text-slate-500">No local presets saved. Use the preset buttons above to save one.</div>
                      )}

                      <div className="pt-2 border-t" />

                      <div>
                        <p className="text-xs font-semibold text-slate-500">Server presets</p>
                        <div className="mt-2 space-y-2">
                          {serverPresetsLoading ? (
                            <div className="text-xs text-slate-500">Loading server presets...</div>
                          ) : (serverPresets.length ? serverPresets.map((sp) => (
                            <div key={sp.id} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200/70">
                              <div className="min-w-0 text-xs text-slate-700">{sp.name}{String(sp.owner_id) === String(sessionUser?.id) ? ' (you)' : ''}</div>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => applyServerPreset(sp)} className="rounded-full bg-gtBlue px-3 py-1 text-[11px] font-semibold text-white">Load</button>
                                {String(sp.owner_id) === String(sessionUser?.id) ? (
                                  <>
                                    <button type="button" onClick={() => updateServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200/70">Save</button>
                                    <button type="button" onClick={() => deleteServerPreset(sp.id)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200/30">Delete</button>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          )) : (
                            <div className="text-xs text-slate-500">No server presets. Save your current search to create one.</div>
                          ))}

                          <div className="mt-2">
                            <button type="button" onClick={() => {
                              const name = window.prompt('Preset name')
                              if (name) createServerPresetFromCurrent(name)
                            }} className="rounded-full bg-gtBlue px-3 py-1 text-[11px] font-semibold text-white">Save current as server preset</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {autoSaveCandidate ? (
                  <div className="mt-4 rounded-xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-white/5 dark:text-slate-200">
                    <p className="font-semibold text-slate-700 dark:text-slate-100">Save this search as a preset</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" onClick={() => savePreset('buyer')} className="rounded-full bg-gtBlue px-3 py-1 text-[11px] font-semibold text-white">Buyer</button>
                      <button type="button" onClick={() => savePreset('buying_house')} className="rounded-full bg-gtBlue px-3 py-1 text-[11px] font-semibold text-white">Buying house</button>
                      <button type="button" onClick={() => savePreset('factory')} className="rounded-full bg-gtBlue px-3 py-1 text-[11px] font-semibold text-white">Factory</button>
                      <button type="button" onClick={() => setAutoSaveCandidate(null)} className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 dark:text-slate-200 dark:ring-white/10">Dismiss</button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-12 gap-4">
          <div className="col-span-12 xl:col-span-9 rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-md overflow-hidden dark:bg-slate-950/30 dark:ring-white/10">
            <div className="relative flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-950/20 shadow-dividerB dark:shadow-dividerBDark dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
              {TAB_OPTIONS.map((t) => {
                const Icon = t.icon
                const active = activeTab === t.id
                const count = t.id === 'requests' ? requestsTotal : t.id === 'companies' ? companiesTotal : totalResults
                return (
                  <motion.button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ring-1${
                      active
                        ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
                        : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="search-tab"
                        className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative inline-flex items-center gap-2">
                      <Icon size={16} />
                      <span>{t.label}</span>
                      <span className="text-[11px] opacity-70">({count})</span>
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <div className="p-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ResultSkeletonCard key={`result-skel-${i}`} index={i} />
                ))}
              </div>
            ) : null}

            {!loading && error ? (
              <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-800 text-center ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30">
                {error}
              </div>
            ) : null}

            {!loading && !error && totalResults === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-700 text-center ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
                No results found. Try a different query or category.
              </div>
            ) : null}

            {!loading && !error ? (
              <div className="space-y-4">
                {(activeTab === 'all' || activeTab === 'requests') ? (
                  <div className="space-y-3">
                    {requests.map((r, idx) => {
                      const author = r.author || {}
                      const profileRoute = roleToProfileRoute(author.role, author.id)
                      const requestType = String(r.request_type || 'garments').toLowerCase()
                      const specs = r.specs && typeof r.specs === 'object' ? r.specs : {}
                      const isCertified = String(author.order_certification_status || '').toLowerCase() === 'certified'
                      const quoteDeadline = r.quote_deadline ? new Date(r.quote_deadline) : null
                      const expiresAt = r.expires_at ? new Date(r.expires_at) : null
                      const isExpired = expiresAt && !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() < Date.now()
                      const maxSuppliers = Number.isFinite(Number(r.max_suppliers)) ? Number(r.max_suppliers) : null
                      const specLabel = requestType === 'textile'
                        ? [specs.material_type || r.category, specs.unit || ''].filter(Boolean).join(' - ')
                        : [specs.gender_target || '', specs.season || ''].filter(Boolean).join(' - ')
                      return (
                        <motion.div
                          key={r.id}
                          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                          className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || 'Buyer'}
                                </Link>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600 dark:bg-white/10 dark:text-slate-200">
                                  {requestType}
                                </span>
                                {r.verified_only ? (
                                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                                    Verified only
                                  </span>
                                ) : null}
                                {r.discussion_active ? (
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                                    Active discussion
                                  </span>
                                ) : null}
                                {author.verified ? (
                                  <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                                    Verified
                                  </span>
                                ) : null}
                                {isCertified ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                                    Certified
                                  </span>
                                ) : null}
                                {r.priority_active ? (
                                  <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
                                    Priority
                                  </span>
                                ) : null}
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">- {author.country}</span> : null}
                              </div>
                              {(specLabel || quoteDeadline || expiresAt) ? (
                                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                                  {specLabel ? <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">{specLabel}</span> : null}
                                  {quoteDeadline ? <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">Quote by {quoteDeadline.toLocaleDateString()}</span> : null}
                                  {expiresAt ? (
                                    <span className={`rounded-full px-2 py-1${isExpired ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'}`}>
                                      {isExpired ? 'Expired' : `Expires ${expiresAt.toLocaleDateString()}`}
                                    </span>
                                  ) : null}
                                  {maxSuppliers !== null ? (
                                    <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">Max suppliers: {maxSuppliers}</span>
                                  ) : null}
                                </div>
                              ) : null}
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{r.custom_description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.category || '-'}</span></div>
                                <div>Quantity/MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.quantity || '-'}</span></div>
                                <div>Timeline: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.timeline_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{r.material || '-'}</span></div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                Open profile
                              </Link>
                              <button
                                type="button"
                                onClick={() => openChatNotice(author.name || 'buyer', {
                                  type: 'buyer_request',
                                  id: r.id,
                                  label: r.title || r.category || 'Buyer request',
                                }, { requirementId: r.id })}
                                className="rounded-full bg-gtBlue px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gtBlueHover active:scale-95"
                              >
                                Contact
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : null}

                {(activeTab === 'all' || activeTab === 'companies') ? (
                  <div className="space-y-3">
                    {companies.map((p, idx) => {
                      const author = p.author || {}
                      const profileRoute = roleToProfileRoute(author.role, author.id)
                      const rating = ratingsByProfileKey?.[p.profile_key] || null
                      const isCertified = String(author.order_certification_status || '').toLowerCase() === 'certified'
                      return (
                        <motion.div
                          key={p.id}
                          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                          animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                          className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/50 dark:ring-slate-800"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={profileRoute} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline truncate">
                                  {author.name || p.title || 'Company'}
                                </Link>
                                {author.verified ? (
                                  <span className="verified-shimmer inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25">
                                    Verified
                                  </span>
                                ) : null}
                                {isCertified ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                                    Certified
                                  </span>
                                ) : null}
                                {author.premium ? (
                                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                                    Premium
                                  </span>
                                ) : null}
                                {p.boost_active ? (
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                                    Boosted {p.boost_multiplier && p.boost_multiplier !== 1 ? `x${p.boost_multiplier}` : ""}
                                  </span>
                                ) : null}
                                {author.country ? <span className="text-[11px] text-slate-500 dark:text-slate-400">- {author.country}</span> : null}
                                {author.role ? <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">- {String(author.role).replaceAll('_', ' ')}</span> : null}
                              </div>
                              <p className="mt-2 text-sm text-slate-800 dark:text-slate-100 font-semibold">{p.title || 'Product'}</p>
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{p.description || ''}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <div>Category: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.category || '-'}</span></div>
                                <div>MOQ: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.moq || '-'}</span></div>
                                <div>Lead time: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.lead_time_days || '-'}</span></div>
                                <div>Material: <span className="font-semibold text-slate-800 dark:text-slate-100">{p.material || '-'}</span></div>
                              </div>

                              <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                                Rating: <span className="font-semibold text-slate-800 dark:text-slate-100">{rating?.average_score ?? '0.0'}</span> ({rating?.total_count ?? 0}) - Confidence {Math.round((rating?.score_confidence ?? 0) * 100)}%
                              </div>
                              {p.hasVideo ? <div className="mt-2 text-xs font-semibold text-indigo-700 dark:text-indigo-200">Video available</div> : null}
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Link to={profileRoute} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 text-center dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5">
                                View profile
                              </Link>
                              <button
                                type="button"
                                onClick={() => setQuickViewItem({ ...p, author })}
                                className="rounded-full px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/5"
                              >
                                Quick view
                              </button>
                              <button
                                type="button"
                                onClick={() => openChatNotice(author.name || 'company', {
                                  type: 'product',
                                  id: p.id,
                                  label: p.title || 'Product',
                                }, { productId: p.id })}
                                className="rounded-full bg-gtBlue px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gtBlueHover active:scale-95"
                              >
                                Contact
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}
            </div>
          </div>

          <aside className="col-span-12 xl:col-span-3 space-y-4">
            {isBuyer ? (
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Early verified factories</p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Premium-only early access list</p>
                {!canEarlyAccess ? (
                  <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
                    Upgrade to Premium to unlock early access to newly verified factories.
                    <div className="mt-2">
                      <Link to="/pricing" className="text-[11px] font-semibold text-gtBlue hover:underline">View Premium options</Link>
                    </div>
                  </div>
                ) : earlyVerifiedError ? (
                  <div className="mt-2 text-xs text-rose-600 dark:text-rose-300">{earlyVerifiedError}</div>
                ) : (
                  <div className="mt-3 space-y-2">
                    {earlyVerifiedFactories.length ? earlyVerifiedFactories.slice(0, 6).map((row) => (
                      <Link
                        key={row.id}
                        to={roleToProfileRoute(row.role, row.id)}
                        className="block rounded-xl bg-white px-3 py-2 text-left ring-1 ring-slate-200/70 transition hover:bg-slate-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
                      >
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.name || 'Factory'}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.country || '-'} - verified</p>
                      </Link>
                    )) : (
                      <div className="text-xs text-slate-500 dark:text-slate-400">No new verified factories yet.</div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
            <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Recently viewed</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Private to you - Recorded on Quick View</p>
              <div className="mt-3 space-y-2">
                {recentViews.length ? recentViews.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setQuickViewItem({ ...row.product, author: row.author })}
                    className="w-full text-left rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-[0.99] dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/8"
                    title="Open Quick View"
                  >
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{row.product?.title || 'Product'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{row.author?.name || 'Company'} - {new Date(row.viewed_at).toLocaleString()}</p>
                  </button>
                )) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400">No views yet. Use "Quick view" on a product.</div>
                )}
              </div>
              <div className="mt-3">
                <Link to="/notifications" className="text-xs font-semibold text-gtBlue hover:underline">Open full history</Link>
              </div>
            </div>

            {premiumLocked ? (
              <div className="rounded-2xl p-4 ring-1 ring-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:ring-amber-500/30">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Advanced filters locked</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200/90">
                  Upgrade to Premium to unlock advanced filters. Core filters remain unlimited on the free plan.
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      <ProductQuickViewModal
        open={Boolean(quickViewItem)}
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onViewed={loadRecentViews}
      />
    </div>
  )
}
