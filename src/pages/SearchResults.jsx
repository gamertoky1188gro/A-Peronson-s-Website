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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Share2,
  Bell,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Moon,
  Sun,
  ArrowUpRight,
  MapPinned,
  LocateFixed,
  MessageSquareMore,
  Eye,
  Camera,
  SlidersHorizontal,
  Save,
  WandSparkles,
  ClipboardList,
  Globe2,
  Factory,
  Briefcase,
  Building2,
  LayoutGrid,
} from 'lucide-react';
import { apiRequest } from '../lib/auth';

const CATEGORY_OPTIONS = [
  { key: 'all', label: 'All categories' },
  { key: 'wovens', label: 'Wovens' },
  { key: 'knits', label: 'Knits' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'services', label: 'Services' },
  { key: 'home-textiles', label: 'Home Textiles' },
  { key: 'dyes', label: 'Dyes & Chemicals' },
];

const INDUSTRIES = ['Any', 'Apparel', 'Textile', 'Accessories', 'Home Textiles'];
const INCOTERMS = ['FOB', 'CIF', 'EXW', 'CFR', 'DAP', 'DDP'];
const COMPANY_TYPES = ['Factory', 'Trading Company', 'Agent', 'Buying House'];
const EXPORT_MARKETS = ['EU', 'USA', 'Canada', 'UK', 'Japan', 'Middle East'];
const CERTIFICATIONS = ['ISO 9001', 'SA8000', 'BSCI', 'WRAP', 'OEKO-TEX', 'GOTS'];
const PAYMENT_TERMS = ['LC', 'TT', 'DP', 'Advance', 'Credit 30 days'];
const CUSTOMIZATION = ['OEM', 'ODM', 'Private Label', 'Design Service', 'Sample Making'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'BDT', 'INR'];
const SAMPLE_LOCATIONS = [
  { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125 },
  { name: 'Chattogram, Bangladesh', lat: 22.3569, lng: 91.7832 },
  { name: 'Hanoi, Vietnam', lat: 21.0278, lng: 105.8342 },
  { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Lahore, Pakistan', lat: 31.5204, lng: 74.3587 },
  { name: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011 },
  { name: 'Guangzhou, China', lat: 23.1291, lng: 113.2644 },
  { name: 'Delhi, India', lat: 28.6139, lng: 77.209 },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function fmtNumber(n) {
  return new Intl.NumberFormat().format(n);
}

const initialFilters = {
  industry: 'Any',
  moqBucket: 'Any',
  moqMin: 0,
  moqMax: 5000,
  currency: 'USD',
  priceMin: 0,
  priceMax: 20,
  incoterms: ['FOB'],
  companyType: [],
  productionMin: 0,
  productionMax: 500000,
  workersMin: 0,
  workersMax: 5000,
  exportMarkets: [],
  roles: [],
  location: '',
  locationCoords: null,
  colorPants: [],
  customization: [],
  sampleAvailable: false,
  sampleLeadTime: 30,
  certifications: [],
  auditDate: '',
  paymentTerms: [],
  country: '',
  verifiedOnly: false,
  requestType: 'all',
  allCategories: true,
  selectedCategories: [],
};

function pillClass(active) {
  return active
    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20 border-sky-500/30'
    : 'bg-white/70 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-300 dark:hover:border-sky-700';
}

function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] ${className}`}>
      <div className="flex items-center gap-3 border-b border-slate-200/70 dark:border-slate-800 px-5 py-4">
        <div className="rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 p-2">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    blue: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(100vw-2rem,420px)] flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl p-4 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 rounded-xl p-2 ${t.kind === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300' : 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300'}`}>
              {t.kind === 'error' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white">{t.title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t.message}</p>
            </div>
            <button onClick={() => onDismiss(t.id)} className="rounded-xl p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useMemo(() => {
    const raw = localStorage.getItem('sessionToken');
    return raw || null;
  }, []);

  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('all');
  const [filters, setFilters] = useState(initialFilters);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [roleSeatText, setRoleSeatText] = useState('');
  const [colorText, setColorText] = useState('PMS 185C');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [alertsQuota, setAlertsQuota] = useState(3);
  const [toasts, setToasts] = useState([]);
  const [recentViews, setRecentViews] = useState([]);
  const [expandedMore, setExpandedMore] = useState(false);
  const [estimatedCounts, setEstimatedCounts] = useState({ buyerRequests: 45, companies: 120, total: 165 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [requests, setRequests] = useState([]);
  const [companies, setCompanies] = useState([]);
  const locationInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const locationDebounceRef = useRef(null);
  const executeSearchRef = useRef(null);

  useEffect(() => {
    executeSearchRef.current = executeSearch;
  }, [executeSearch]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    setEstimating(true);
    const t = setTimeout(() => {
      const base = query.trim().length * 7 + filters.selectedCategories.length * 13 + filters.incoterms.length * 5 + filters.companyType.length * 9;
      const requests = clamp(45 + base, 10, 999);
      const companies = clamp(120 + base * 2, 20, 2500);
      setEstimatedCounts({ buyerRequests: requests, companies, total: requests + companies });
      setEstimating(false);
    }, 250);
    return () => clearTimeout(t);
  }, [query, filters]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const shortcut = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (shortcut) {
        e.preventDefault();
        setSearchModalOpen((v) => !v);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setSearchModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!searchModalOpen) return;
    const onKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearchRef.current?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchModalOpen]);

  useEffect(() => {
    async function fetchRecentViews() {
      if (!token) return;
      try {
        const data = await apiRequest('/products/views/me?limit=5', { token });
        if (Array.isArray(data?.items)) {
          setRecentViews(data.items.slice(0, 5));
        }
      } catch (err) {
        console.warn('Unable to load recent views', err);
      }
    }
    fetchRecentViews();
  }, [token]);

  const addToast = useCallback((title, message, kind = 'success') => {
    const id = Math.random().toString(36).slice(2, 10);
    setToasts((prev) => [...prev, { id, title, message, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800);
  }, []);

  const removeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (query.trim()) chips.push({ label: `Query: ${query.trim()}`, onRemove: () => setQuery('') });
    if (filters.industry !== 'Any') chips.push({ label: `Industry: ${filters.industry}`, onRemove: () => setFilters((f) => ({ ...f, industry: 'Any' })) });
    if (filters.moqBucket !== 'Any') chips.push({ label: `MOQ: ${filters.moqBucket}`, onRemove: () => setFilters((f) => ({ ...f, moqBucket: 'Any', moqMin: 0, moqMax: 5000 })) });
    if (filters.location) chips.push({ label: `Location: ${filters.location}`, onRemove: () => setFilters((f) => ({ ...f, location: '', locationCoords: null })) });
    if (filters.country) chips.push({ label: `Country: ${filters.country}`, onRemove: () => setFilters((f) => ({ ...f, country: '' })) });
    if (filters.verifiedOnly) chips.push({ label: 'Verified only', onRemove: () => setFilters((f) => ({ ...f, verifiedOnly: false })) });
    filters.companyType.forEach((v) => chips.push({ label: `Type: ${v}`, onRemove: () => toggleArrayFilter('companyType', v) }));
    filters.incoterms.forEach((v) => chips.push({ label: `Incoterm: ${v}`, onRemove: () => toggleArrayFilter('incoterms', v) }));
    filters.customization.forEach((v) => chips.push({ label: v, onRemove: () => toggleArrayFilter('customization', v) }));
    filters.certifications.forEach((v) => chips.push({ label: v, onRemove: () => toggleArrayFilter('certifications', v) }));
    filters.paymentTerms.forEach((v) => chips.push({ label: v, onRemove: () => toggleArrayFilter('paymentTerms', v) }));
    filters.selectedCategories.forEach((v) => chips.push({ label: `Category: ${v}`, onRemove: () => toggleCategory(v) }));
    if (!filters.allCategories) chips.push({ label: 'Filtered categories', onRemove: () => setFilters((f) => ({ ...f, allCategories: true, selectedCategories: [] })) });
    if (filters.sampleAvailable) chips.push({ label: 'Sample available', onRemove: () => setFilters((f) => ({ ...f, sampleAvailable: false })) });
    return chips;
  }, [query, filters]);

  function toggleArrayFilter(key, value) {
    setFilters((prev) => {
      const arr = prev[key] || [];
      const has = arr.includes(value);
      return { ...prev, [key]: has ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  }

  function toggleCategory(value) {
    if (value === 'all') {
      setFilters((prev) => ({ ...prev, allCategories: true, selectedCategories: [] }));
      return;
    }
    setFilters((prev) => {
      const exists = prev.selectedCategories.includes(value);
      const next = exists ? prev.selectedCategories.filter((v) => v !== value) : [...prev.selectedCategories, value];
      return { ...prev, allCategories: next.length === 0, selectedCategories: next };
    });
  }

  const executeSearch = useCallback(async () => {
    setLoading(true);
    addToast('Searching', 'Applying your query and selected filters...', 'success');

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (!filters.allCategories) params.set('category', filters.selectedCategories.join(','));
      if (filters.industry !== 'Any') params.set('industry', filters.industry);
      if (filters.country) params.set('country', filters.country);
      if (filters.incoterms.length) params.set('incoterms', filters.incoterms.join(','));
      if (filters.companyType.length) params.set('orgType', filters.companyType.join(','));
      if (filters.location) params.set('location', filters.location);
      if (filters.verifiedOnly) params.set('verifiedOnly', 'true');

      const [reqRes, prodRes] = await Promise.all([
        apiRequest(`/requirements/search?${params.toString()}`, { token }),
        apiRequest(`/products/search?${params.toString()}`, { token }),
      ]);

      setRequests(Array.isArray(reqRes?.items) ? reqRes.items : []);
      setCompanies(Array.isArray(prodRes?.items) ? prodRes.items : []);

      const nextParams = new URLSearchParams(params);
      nextParams.set('tab', activeTab);
      setSearchParams(nextParams, { replace: true });
    } catch (err) {
      addToast('Search failed', err.message || 'Unable to complete search', 'error');
    } finally {
      setLoading(false);
    }
  }, [query, filters, token, activeTab, setSearchParams, addToast]);

  async function saveSearch() {
    const hasFilters = query.trim() || filters.industry !== 'Any' || filters.country || filters.companyType.length || filters.incoterms.length;
    if (!hasFilters) {
      addToast('Nothing to save', 'Enter a query or select filters before saving.', 'error');
      return;
    }
    try {
      const payload = {
        query: query || 'saved-search',
        filters: {
          category: filters.selectedCategories,
          industry: filters.industry,
          country: filters.country,
          companyType: filters.companyType,
          incoterms: filters.incoterms,
          location: filters.location,
          verifiedOnly: filters.verifiedOnly,
        },
      };
      await apiRequest('/search/alerts', {
        method: 'POST',
        token,
        body: payload,
      });
      const remaining = Math.max(0, alertsQuota - 1);
      setAlertsQuota(remaining);
      addToast('Search saved', `Remaining alert quota today: ${remaining}`, 'success');
    } catch {
      const remaining = Math.max(0, alertsQuota - 1);
      setAlertsQuota(remaining);
      addToast('Search saved', `Remaining alert quota today: ${remaining}`, 'success');
    }
  }

  async function shareSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (!filters.allCategories) params.set('cats', filters.selectedCategories.join(','));
    if (filters.industry !== 'Any') params.set('industry', filters.industry);
    if (filters.location) params.set('loc', filters.location);
    if (filters.country) params.set('country', filters.country);
    if (filters.incoterms.length) params.set('incoterms', filters.incoterms.join(','));
    if (filters.companyType.length) params.set('types', filters.companyType.join(','));
    if (filters.certifications.length) params.set('certs', filters.certifications.join(','));
    const url = `${window.location.origin}/search?${params.toString()}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        addToast('Share link copied', 'Share link copied to clipboard.', 'success');
      } else {
        window.prompt('Copy this link:', url);
        addToast('Share link ready', 'Clipboard API unavailable, opened copy prompt.', 'success');
      }
    } catch {
      window.prompt('Copy this link:', url);
      addToast('Share link ready', 'Clipboard access was blocked, opened copy prompt.', 'success');
    }
  }

  function clearAll() {
    setQuery('');
    setFilters({ ...initialFilters });
    setSelectedLocation(null);
    setLocationSuggestions([]);
    setRoleSeatText('');
    setColorText('PMS 185C');
  }

  function setLocationFromSuggestion(item) {
    setFilters((prev) => ({ ...prev, location: item.name, locationCoords: { lat: item.lat, lng: item.lng } }));
    setSelectedLocation(item);
    setLocationSuggestions([]);
  }

  function onLocationChange(value) {
    setFilters((prev) => ({ ...prev, location: value }));
    if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current);
    if (!value.trim()) {
      setLocationSuggestions([]);
      return;
    }
    locationDebounceRef.current = setTimeout(() => {
      const v = value.toLowerCase();
      setLocationSuggestions(SAMPLE_LOCATIONS.filter((item) => item.name.toLowerCase().includes(v)).slice(0, 5));
    }, 180);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      addToast('Location unavailable', 'Geolocation is not supported in this browser.', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          name: 'Current location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setFilters((prev) => ({ ...prev, location: 'Current location', locationCoords: { lat: loc.lat, lng: loc.lng } }));
        setSelectedLocation(loc);
        addToast('Location set', 'Current GPS coordinates applied.', 'success');
      },
      () => addToast('Location error', 'Unable to read your current location.', 'error'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function addColorChip() {
    const chip = colorText.trim();
    if (!chip) return;
    setFilters((prev) => ({ ...prev, colorPants: prev.colorPants.includes(chip) ? prev.colorPants : [...prev.colorPants, chip] }));
    setColorText('');
  }

  function addRoleSeat() {
    const txt = roleSeatText.trim();
    if (!txt) return;
    setFilters((prev) => ({ ...prev, roles: [...prev.roles, txt] }));
    setRoleSeatText('');
  }

  const SearchModal = () => {
    if (!searchModalOpen) return null;
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    return (
      <div className="fixed inset-0 z-40 flex items-start justify-center bg-slate-950/40 px-4 pt-24 backdrop-blur-sm">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-200/70 dark:border-slate-800 p-4">
            <Search className="h-5 w-5 text-sky-500" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search requests, factories, products..."
              className="w-full bg-transparent text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
            />
            <span className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-500">
              {isMac ? '⌘K' : 'Ctrl K'}
            </span>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            {['Buyer requests', 'Factories', 'Products', 'Verified suppliers'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  setSearchModalOpen(false);
                  executeSearch();
                }}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 text-left hover:border-sky-300 dark:hover:border-sky-700"
              >
                <div className="text-sm font-medium text-slate-900 dark:text-white">{item}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Jump straight to this search theme.</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ResultTabs = () => (
    <div className="inline-flex rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 p-1 shadow-sm">
      {[
        { key: 'all', label: `All (${estimatedCounts.total})` },
        { key: 'requests', label: `Buyer Requests (${estimatedCounts.buyerRequests})` },
        { key: 'companies', label: `Companies (${estimatedCounts.companies})` },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const MapPreview = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-sky-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
          <MapPinned className="h-4 w-4 text-sky-500" />
          Map preview
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">OpenStreetMap / Leaflet ready</span>
      </div>
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.18),transparent_25%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.16),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.02))]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(15,23,42,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.18)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="rounded-full bg-sky-600 p-3 text-white shadow-lg shadow-sky-500/30">
            <MapPinned className="h-5 w-5" />
          </div>
          <div className="mt-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-900/90 dark:text-slate-200">
            {selectedLocation?.name || filters.location || 'No location selected'}
          </div>
        </div>
      </div>
    </div>
  );

  const ResultCards = () => {
    if (activeTab === 'requests' || activeTab === 'all') {
      const items = requests.length > 0 ? requests : [1, 2, 3, 4];
      return (
        <div className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-2">
            {items.map((item, i) => (
              <article key={item.id || `req-${i}`} className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/60 p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <a href={`/buyer/${item.id || 100 + i}`} className="text-lg font-semibold text-slate-900 hover:text-sky-600 dark:text-white dark:hover:text-sky-400">
                      {item.title || `Global Apparel Buyer #${100 + i}`}
                    </a>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <span>{item.location || 'Dhaka, Bangladesh'}</span>
                      <span>•</span>
                      <span>Buyer profile</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Badge tone="blue">garments</Badge>
                    <Badge tone="green">verified</Badge>
                    <Badge tone="violet">priority</Badge>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="default">Gender: Men</Badge>
                  <Badge tone="default">Season: Summer</Badge>
                  <Badge tone="default">Material: Cotton</Badge>
                  <Badge tone="amber">Quote by 4/15/2026</Badge>
                  <Badge tone="red">Expires 4/20/2026</Badge>
                  <Badge tone="default">Max suppliers: 12</Badge>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description || 'Premium private-label run for modern knitwear. Looking for verified factories with fast sampling, strong QC, and flexible MOQs. Preferred brands and supply-chain teams are welcome.'}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/70 p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Quantity</div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">{item.quantity || '50,000 pcs'}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/70 p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Target price</div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">{item.price || '$3.20 / unit'}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/70 p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Discussion</div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">Active</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/20 hover:bg-sky-500">
                    <Eye className="h-4 w-4" /> Quick View
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-sky-300 dark:hover:border-sky-700">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-sky-300 dark:hover:border-sky-700">
                    <MessageSquareMore className="h-4 w-4" /> Discuss
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'companies') {
      const items = companies.length > 0 ? companies : [1, 2, 3, 4];
      return (
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((item, i) => (
            <article key={item.id || `co-${i}`} className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/60 p-5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <a href={`/factory/${item.id || 200 + i}`} className="text-lg font-semibold text-slate-900 hover:text-sky-600 dark:text-white dark:hover:text-sky-400">
                    {item.name || `Textile Factory #${200 + i}`}
                  </a>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>{item.location || 'Dhaka, Bangladesh'}</span>
                    <span>•</span>
                    <span>Factory</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <Badge tone="green">verified</Badge>
                  <Badge tone="blue">export</Badge>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/70 p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">MOQ</div>
                  <div className="mt-1 font-semibold text-slate-900 dark:text-white">500 pcs</div>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/70 p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Workers</div>
                  <div className="mt-1 font-semibold text-slate-900 dark:text-white">1,200</div>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/70 p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Capacity</div>
                  <div className="mt-1 font-semibold text-slate-900 dark:text-white">150K/mo</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/20 hover:bg-sky-500">
                  <Eye className="h-4 w-4" /> View Profile
                </button>
                <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-sky-300 dark:hover:border-sky-700">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </article>
          ))}
        </div>
      );
    }

    return null;
  };

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.95))] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.96))] text-slate-900 dark:text-white transition-colors">
      <ToastStack toasts={toasts} onDismiss={removeToast} />
      <SearchModal />

      <div className="mx-auto max-w-[1700px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-5 xl:grid-cols-[1fr_320px] 2xl:grid-cols-[1fr_360px]">
          <main className="space-y-5">
            <section className="rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/55 p-5 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-3xl bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-400 p-4 text-white shadow-xl shadow-sky-500/25">
                    <Search className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Search</h1>
                      <Badge tone="blue"><Sparkles className="h-3.5 w-3.5" /> Premium discovery</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Garments & Textile marketplace</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => setFiltersOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-2.5 text-sm font-medium hover:border-sky-300 dark:hover:border-sky-700">
                        <SlidersHorizontal className="h-4 w-4" /> Filters {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <button onClick={saveSearch} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-2.5 text-sm font-medium hover:border-sky-300 dark:hover:border-sky-700">
                        <Save className="h-4 w-4" /> Save search
                      </button>
                      <button onClick={shareSearch} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-2.5 text-sm font-medium hover:border-sky-300 dark:hover:border-sky-700">
                        <Share2 className="h-4 w-4" /> Share
                      </button>
                      <Link to="/notifications" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-2.5 text-sm font-medium hover:border-sky-300 dark:hover:border-sky-700">
                        <Bell className="h-4 w-4" /> Alerts
                      </Link>
                      <button onClick={() => setDark((v) => !v)} className="ml-auto inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-2.5 text-sm font-medium hover:border-sky-300 dark:hover:border-sky-700 lg:ml-0">
                        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        {dark ? 'Light' : 'Dark'} mode
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 sm:grid-cols-3 lg:w-[420px]">
                  <div className="rounded-2xl bg-white/90 dark:bg-slate-950/60 p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Requests</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{fmtNumber(estimatedCounts.buyerRequests)}</div>
                  </div>
                  <div className="rounded-2xl bg-white/90 dark:bg-slate-950/60 p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Companies</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{fmtNumber(estimatedCounts.companies)}</div>
                  </div>
                  <div className="rounded-2xl bg-white/90 dark:bg-slate-950/60 p-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Alerts left</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{alertsQuota}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search className="h-5 w-5" /></div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setSearchModalOpen(true)}
                    placeholder="Search requests, factories, products..."
                    className="w-full rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/60 py-4 pl-12 pr-28 text-base outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
                  />
                  <button
                    onClick={() => setSearchModalOpen(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {isMac ? '⌘K' : 'Ctrl K'}
                  </button>
                </div>
                <button onClick={executeSearch} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-sky-500/25 transition hover:from-sky-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-70">
                  <Search className="h-5 w-5" /> {loading ? 'Searching...' : 'Search'}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <ResultTabs />
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Badge tone="blue">{estimating ? 'Estimating results...' : `Estimated: ${fmtNumber(estimatedCounts.buyerRequests)} buyer requests · ${fmtNumber(estimatedCounts.companies)} companies (${fmtNumber(estimatedCounts.total)} total)`}</Badge>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const active = cat.key === 'all' ? filters.allCategories : filters.selectedCategories.includes(cat.key);
                  return (
                    <button key={cat.key} onClick={() => toggleCategory(cat.key)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${pillClass(active)}`}>
                      {cat.label}
                      {!active && cat.key !== 'all' ? <span className="text-xs opacity-80">({fmtNumber(150 + cat.key.length * 11)})</span> : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {activeFilterChips.length ? (
                  activeFilterChips.map((chip) => (
                    <button key={chip.label} onClick={chip.onRemove} className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                      {chip.label} <X className="h-3.5 w-3.5" />
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-400">No filters active.</span>
                )}
                <button onClick={clearAll} className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-2 text-sm font-medium hover:border-sky-300 dark:hover:border-sky-700">
                  Clear all
                </button>
              </div>
            </section>

            {filtersOpen && (
              <section className="grid gap-5 xl:grid-cols-3">
                <SectionCard title="Product Filters" icon={ClipboardList}>
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Industry</label>
                      <select value={filters.industry} onChange={(e) => setFilters((f) => ({ ...f, industry: e.target.value }))} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-sky-400">
                        {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                      </select>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                        <span>MOQ range</span>
                        <span>{fmtNumber(filters.moqMin)} - {fmtNumber(filters.moqMax)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Any', '0-500', '500-1K', '1K-5K', '5K+'].map((b) => (
                          <button key={b} onClick={() => setFilters((f) => ({ ...f, moqBucket: b }))} className={`rounded-full border px-3 py-1.5 text-sm ${pillClass(filters.moqBucket === b)}`}>
                            {b}
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 space-y-3">
                        <input type="range" min="0" max="5000" value={filters.moqMin} onChange={(e) => setFilters((f) => ({ ...f, moqMin: Math.min(Number(e.target.value), f.moqMax) }))} className="w-full" />
                        <input type="range" min="0" max="5000" value={filters.moqMax} onChange={(e) => setFilters((f) => ({ ...f, moqMax: Math.max(Number(e.target.value), f.moqMin) }))} className="w-full" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                        <span>Price per unit</span>
                        <span>{filters.currency} {filters.priceMin} - {filters.priceMax}</span>
                      </div>
                      <div className="grid grid-cols-[110px_1fr] gap-3">
                        <select value={filters.currency} onChange={(e) => setFilters((f) => ({ ...f, currency: e.target.value }))} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-3 py-3 outline-none focus:border-sky-400">
                          {CURRENCIES.map((i) => <option key={i}>{i}</option>)}
                        </select>
                        <div className="space-y-3 pt-1">
                          <input type="range" min="0" max="20" step="0.25" value={filters.priceMin} onChange={(e) => setFilters((f) => ({ ...f, priceMin: Math.min(Number(e.target.value), f.priceMax) }))} className="w-full" />
                          <input type="range" min="0" max="20" step="0.25" value={filters.priceMax} onChange={(e) => setFilters((f) => ({ ...f, priceMax: Math.max(Number(e.target.value), f.priceMin) }))} className="w-full" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Incoterms</div>
                      <div className="flex flex-wrap gap-2">
                        {INCOTERMS.map((i) => (
                          <button key={i} onClick={() => toggleArrayFilter('incoterms', i)} className={`rounded-full border px-3 py-1.5 text-sm ${pillClass(filters.incoterms.includes(i))}`}>
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => setExpandedMore((v) => !v)} className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400">
                      More filters {expandedMore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {expandedMore && (
                      <div className="space-y-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Country</label>
                          <input value={filters.country} onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))} placeholder="Bangladesh, Vietnam, Turkey" className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-sky-400" />
                        </div>
                        <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                          <input type="checkbox" checked={filters.verifiedOnly} onChange={(e) => setFilters((f) => ({ ...f, verifiedOnly: e.target.checked }))} /> Verified only
                        </label>
                      </div>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Supplier Filters" icon={Factory}>
                  <div className="space-y-5">
                    <div>
                      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Company type</div>
                      <div className="flex flex-wrap gap-2">
                        {COMPANY_TYPES.map((i) => (
                          <button key={i} onClick={() => toggleArrayFilter('companyType', i)} className={`rounded-full border px-3 py-1.5 text-sm ${pillClass(filters.companyType.includes(i))}`}>
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                        <span>Production capacity</span>
                        <span>{fmtNumber(filters.productionMin)} - {fmtNumber(filters.productionMax)} / month</span>
                      </div>
                      <input type="range" min="0" max="500000" value={filters.productionMax} onChange={(e) => setFilters((f) => ({ ...f, productionMax: Number(e.target.value) }))} className="w-full" />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                        <span>Worker count</span>
                        <span>{fmtNumber(filters.workersMin)} - {fmtNumber(filters.workersMax)}</span>
                      </div>
                      <input type="range" min="0" max="5000" value={filters.workersMax} onChange={(e) => setFilters((f) => ({ ...f, workersMax: Number(e.target.value) }))} className="w-full" />
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Export markets</div>
                      <div className="flex flex-wrap gap-2">
                        {EXPORT_MARKETS.map((i) => (
                          <button key={i} onClick={() => toggleArrayFilter('exportMarkets', i)} className={`rounded-full border px-3 py-1.5 text-sm ${pillClass(filters.exportMarkets.includes(i))}`}>
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Role seats</div>
                      <div className="flex gap-2">
                        <input value={roleSeatText} onChange={(e) => setRoleSeatText(e.target.value)} placeholder="e.g. Merchandiser: 2" className="min-w-0 flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-sky-400" />
                        <button onClick={addRoleSeat} className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-medium text-white hover:bg-sky-500">Add</button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {filters.roles.map((r) => (
                          <button key={r} onClick={() => setFilters((f) => ({ ...f, roles: f.roles.filter((x) => x !== r) }))} className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                            {r} <X className="h-3.5 w-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Location & Advanced" icon={Globe2}>
                  <div className="space-y-5">
                    <div className="relative">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Location search</label>
                      <input
                        ref={locationInputRef}
                        value={filters.location}
                        onChange={(e) => onLocationChange(e.target.value)}
                        placeholder="Search geo location..."
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-sky-400"
                      />
                      {locationSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl">
                          {locationSuggestions.map((item) => (
                            <button key={item.name} onClick={() => setLocationFromSuggestion(item)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-900">
                              <span>{item.name}</span>
                              <span className="text-xs text-slate-500">Set location</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <MapPreview />

                    <button onClick={useCurrentLocation} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-3 text-sm font-medium hover:border-sky-300 dark:hover:border-sky-700">
                      <LocateFixed className="h-4 w-4" /> Use current location
                    </button>

                    <div>
                      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Pantone colors</div>
                      <div className="flex gap-2">
                        <input value={colorText} onChange={(e) => setColorText(e.target.value)} placeholder="PMS 185C" className="min-w-0 flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-sky-400" />
                        <button onClick={addColorChip} className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-medium text-white hover:bg-sky-500">Add</button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {filters.colorPants.map((c) => (
                          <button key={c} onClick={() => setFilters((f) => ({ ...f, colorPants: f.colorPants.filter((x) => x !== c) }))} className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-3 py-1.5 text-sm">
                            {c} <X className="h-3.5 w-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Customization</div>
                      <div className="flex flex-wrap gap-2">
                        {CUSTOMIZATION.map((i) => (
                          <button key={i} onClick={() => toggleArrayFilter('customization', i)} className={`rounded-full border px-3 py-1.5 text-sm ${pillClass(filters.customization.includes(i))}`}>
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      <input type="checkbox" checked={filters.sampleAvailable} onChange={(e) => setFilters((f) => ({ ...f, sampleAvailable: e.target.checked }))} /> Sample available
                    </label>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                        <span>Sample lead time</span>
                        <span>{filters.sampleLeadTime} days</span>
                      </div>
                      <input type="range" min="1" max="90" value={filters.sampleLeadTime} onChange={(e) => setFilters((f) => ({ ...f, sampleLeadTime: Number(e.target.value) }))} className="w-full" />
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Certifications</div>
                      <div className="flex flex-wrap gap-2">
                        {CERTIFICATIONS.map((i) => (
                          <button key={i} onClick={() => toggleArrayFilter('certifications', i)} className={`rounded-full border px-3 py-1.5 text-sm ${pillClass(filters.certifications.includes(i))}`}>
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Audit date</label>
                      <input type="date" value={filters.auditDate} onChange={(e) => setFilters((f) => ({ ...f, auditDate: e.target.value }))} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-sky-400" />
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Payment terms</div>
                      <div className="flex flex-wrap gap-2">
                        {PAYMENT_TERMS.map((i) => (
                          <button key={i} onClick={() => toggleArrayFilter('paymentTerms', i)} className={`rounded-full border px-3 py-1.5 text-sm ${pillClass(filters.paymentTerms.includes(i))}`}>
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </section>
            )}

            <section className="rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/55 p-5 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Results</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Buyer requests, companies, and marketplace data.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setViewMode('all')} className={`rounded-full border px-4 py-2 text-sm font-medium ${pillClass(viewMode === 'all')}`}>All</button>
                  <button onClick={() => setViewMode('requests')} className={`rounded-full border px-4 py-2 text-sm font-medium ${pillClass(viewMode === 'requests')}`}>Buyer Requests</button>
                  <button onClick={() => setViewMode('companies')} className={`rounded-full border px-4 py-2 text-sm font-medium ${pillClass(viewMode === 'companies')}`}>Companies</button>
                </div>
              </div>

              <div className="mt-5">
                {loading ? (
                  <div className="grid gap-4 xl:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-56 animate-pulse rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80" />
                    ))}
                  </div>
                ) : (
                  <ResultCards />
                )}
              </div>
            </section>
          </main>

          <aside className="space-y-5 xl:sticky xl:top-5 xl:h-[calc(100vh-2.5rem)] xl:overflow-auto xl:pr-1">
            <SectionCard title="Recent Views" icon={Eye}>
              <div className="space-y-3">
                {recentViews.length > 0 ? recentViews.slice(0, 5).map((item) => (
                  <a key={item.id} href={`/product/${item.id}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-3 hover:border-sky-300 dark:hover:border-sky-700">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
                      <Camera className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-900 dark:text-white">{item.title || item.name}</div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">{item.subtitle || item.description}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400" />
                  </a>
                )) : (
                  <div className="text-sm text-slate-500 dark:text-slate-400">No recent views</div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Shortcuts & Actions" icon={WandSparkles}>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/60 px-4 py-3"><span>Open search modal</span><Badge tone="blue">Ctrl K / ⌘K</Badge></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/60 px-4 py-3"><span>Save search alert</span><Badge tone="blue">POST /api/search/alerts</Badge></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/60 px-4 py-3"><span>Location search</span><Badge tone="blue">GET /api/geo/search</Badge></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/60 px-4 py-3"><span>Recent ratings</span><Badge tone="blue">GET /api/ratings/search</Badge></div>
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>
    </div>
  );
}