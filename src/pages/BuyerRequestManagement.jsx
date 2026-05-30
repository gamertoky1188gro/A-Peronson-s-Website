import NeonAtom from "../components/ui/NeonAtom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  apiRequest,
  getCurrentUser,
  getToken,
  API_BASE,
  hasEntitlement,
} from "../lib/auth";
import { useSecureUser, useEntitlements } from "../hooks/useSecureUser";
import { mapExtractedToForm } from "../lib/aiPrefill";
import { useTheme } from "../lib/ThemeProvider";
import {
  getBuyerRequestErrorStep,
  getBuyerRequestStepErrors,
  getBuyerRequestSubmissionErrors,
} from "../../shared/requirementValidation.js";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CloudUpload,
  Edit3,
  FileText,
  Filter,
  Layers3,
  MoonStar,
  Plus,
  RefreshCw,
  Sparkles,
  SunMedium,
  Trash2,
  X,
  Zap,
} from "lucide-react";

const EMPTY_FORM = {
  requestType: "",
  title: "",
  industry: "",
  category: "",
  genderTarget: "",
  season: "",
  totalQuantity: "",
  numberOfStyles: "",
  fabricComposition: "",
  fabricWeightGsm: "",
  weaveOrKnit: "",
  sizeRange: "",
  colorRequirement: "",
  styleDescription: "",
  techPackRequired: "",
  targetFobPrice: "",
  incoterms: "",
  destinationPort: "",
  exFactoryDate: "",
  sampleRequired: "",
  sampleType: "",
  paymentTerms: "",
  complianceCerts: [],
  sustainabilityCerts: [],
  complianceNotes: "",
  materialType: "",
  subCategory: "",
  quantity: "",
  unit: "",
  fiberComposition: "",
  fabricWidth: "",
  yarnCount: "",
  threadCount: "",
  finishRequired: "",
  stretchRequired: "",
  color: "",
  pattern: "",
  targetPrice: "",
  priceUnit: "",
  deliveryPort: "",
  leadTimeRequired: "",
  labTestRequired: "",
  swatchFirst: "",
  labCertNotes: "",
  quoteDeadline: "",
  expiresAt: "",
  maxSuppliers: "",
  verifiedOnly: false,
  preferredFactoryLocation: "",
  factorySizePreference: "",
  exportExperiencePreference: "",
  confidentialityToggle: false,
  packagingRequirement: "",
  originLabelRequired: "",
  hangtagBarcode: "",
  partialShipmentAllowed: "",
  shipmentMode: "",
  customFields: [],
  customDescription: "",
};

function formToPayload(form) {
  const isTextile = form.requestType === "textile";
  const category = isTextile ? form.subCategory : form.category;
  const priceRange = isTextile ? form.targetPrice : form.targetFobPrice;
  const quantity = isTextile ? form.quantity : form.totalQuantity;

  return {
    request_type: form.requestType || "garments",
    title: form.title,
    industry: form.industry,
    category,
    product: isTextile ? form.materialType : form.category,
    quantity,
    price_range: priceRange,
    incoterms: form.incoterms,
    payment_terms: form.paymentTerms,
    material: isTextile ? form.fiberComposition : form.fabricComposition,
    fabric_gsm: form.fabricWeightGsm,
    size_range: form.sizeRange,
    color_pantone: form.colorRequirement,
    custom_description: form.customDescription,
    quote_deadline: form.quoteDeadline || null,
    expires_at: form.expiresAt || null,
    max_suppliers: form.maxSuppliers || null,
    verified_only: Boolean(form.verifiedOnly),
    custom_fields: Array.isArray(form.customFields) ? form.customFields : [],
    gender_target: form.genderTarget,
    season: form.season,
    number_of_styles: form.numberOfStyles,
    fabric_composition: form.fabricComposition,
    weave_or_knit: form.weaveOrKnit,
    color_requirement: form.colorRequirement,
    style_description: form.styleDescription,
    tech_pack_required: form.techPackRequired,
    destination_port: form.destinationPort,
    ex_factory_date: form.exFactoryDate,
    sample_required: form.sampleRequired,
    sample_type: form.sampleType,
    compliance_certs: Array.isArray(form.complianceCerts)
      ? form.complianceCerts
      : [],
    sustainability_certs: Array.isArray(form.sustainabilityCerts)
      ? form.sustainabilityCerts
      : [],
    compliance_notes: form.complianceNotes,
    material_type: form.materialType,
    sub_category: form.subCategory,
    unit: form.unit,
    fiber_composition: form.fiberComposition,
    fabric_width: form.fabricWidth,
    yarn_count: form.yarnCount,
    thread_count: form.threadCount,
    finish_required: form.finishRequired,
    stretch_required: form.stretchRequired,
    color: form.color,
    pattern: form.pattern,
    target_price: form.targetPrice,
    price_unit: form.priceUnit,
    delivery_port: form.deliveryPort,
    lead_time_required: form.leadTimeRequired,
    lab_test_required: form.labTestRequired,
    swatch_first: form.swatchFirst,
    lab_cert_notes: form.labCertNotes,
    preferred_factory_location: form.preferredFactoryLocation,
    factory_size_preference: form.factorySizePreference,
    export_experience_preference: form.exportExperiencePreference,
    confidentiality_toggle: Boolean(form.confidentialityToggle),
    packaging_requirement: form.packagingRequirement,
    origin_label_required: form.originLabelRequired,
    hangtag_barcode: form.hangtagBarcode,
    partial_shipment_allowed: form.partialShipmentAllowed,
    shipment_mode: form.shipmentMode,
  };
}

function requirementToForm(req) {
  const specs = req?.specs && typeof req.specs === "object" ? req.specs : {};
  return {
    ...EMPTY_FORM,
    requestType: req.request_type || "garments",
    title: req.title || "",
    industry: req.industry || "",
    category: req.category || "",
    genderTarget: specs.gender_target || "",
    season: specs.season || "",
    totalQuantity: req.quantity || "",
    numberOfStyles: specs.number_of_styles || "",
    fabricComposition: specs.fabric_composition || req.material || "",
    fabricWeightGsm: specs.fabric_weight_gsm || req.fabric_gsm || "",
    weaveOrKnit: specs.weave_or_knit || "",
    sizeRange: specs.size_range || req.size_range || "",
    colorRequirement: specs.color_requirement || req.color_pantone || "",
    styleDescription: specs.style_description || "",
    techPackRequired: specs.tech_pack_required || "",
    targetFobPrice: req.price_range || "",
    incoterms: req.incoterms || "",
    destinationPort: specs.destination_port || "",
    exFactoryDate: specs.ex_factory_date || "",
    sampleRequired: specs.sample_required || "",
    sampleType: specs.sample_type || "",
    paymentTerms: specs.payment_terms || req.payment_terms || "",
    complianceCerts: Array.isArray(specs.compliance_certs)
      ? specs.compliance_certs
      : [],
    sustainabilityCerts: Array.isArray(specs.sustainability_certs)
      ? specs.sustainability_certs
      : [],
    complianceNotes: specs.compliance_notes || req.compliance_notes || "",
    materialType: specs.material_type || "",
    subCategory: specs.sub_category || req.category || "",
    quantity: req.quantity || "",
    unit: specs.unit || "",
    fiberComposition: specs.fiber_composition || "",
    fabricWidth: specs.fabric_width || "",
    yarnCount: specs.yarn_count || "",
    threadCount: specs.thread_count || "",
    finishRequired: specs.finish_required || "",
    stretchRequired: specs.stretch_required || "",
    color: specs.color || "",
    pattern: specs.pattern || "",
    targetPrice: req.price_range || "",
    priceUnit: specs.price_unit || "",
    deliveryPort: specs.delivery_port || "",
    leadTimeRequired: specs.lead_time_required || "",
    labTestRequired: specs.lab_test_required || "",
    swatchFirst: specs.swatch_first || "",
    labCertNotes: specs.lab_cert_notes || "",
    quoteDeadline: req.quote_deadline
      ? new Date(req.quote_deadline).toISOString().slice(0, 10)
      : "",
    expiresAt: req.expires_at
      ? new Date(req.expires_at).toISOString().slice(0, 10)
      : "",
    maxSuppliers: req.max_suppliers ?? "",
    verifiedOnly: Boolean(req.verified_only),
    preferredFactoryLocation: specs.preferred_factory_location || "",
    factorySizePreference: specs.factory_size_preference || "",
    exportExperiencePreference: specs.export_experience_preference || "",
    confidentialityToggle: Boolean(specs.confidentiality_toggle),
    packagingRequirement: specs.packaging_requirement || "",
    originLabelRequired: specs.origin_label_required || "",
    hangtagBarcode: specs.hangtag_barcode || "",
    partialShipmentAllowed: specs.partial_shipment_allowed || "",
    shipmentMode: specs.shipment_mode || "",
    customFields: Array.isArray(req.custom_fields) ? req.custom_fields : [],
    customDescription: req.custom_description || "",
  };
}

function toPublicFileUrl(filePath = "") {
  if (!filePath) return "";
  const normalized = String(filePath).replace(/\\/g, "/");
  const marker = "server/uploads/";
  if (normalized.includes(marker)) {
    const suffix = normalized.split(marker)[1];
    return `/uploads/${suffix}`;
  }
  if (normalized.startsWith("/uploads/")) return normalized;
  if (normalized.startsWith("uploads/")) return `/${normalized}`;
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

const GARMENT_COMPLIANCE_CERTS = ["BSCI", "WRAP", "SA8000"];
const GARMENT_SUSTAIN_CERTS = ["GOTS", "OEKO-TEX", "GRS"];

const roles = ["buyer", "buying_house", "admin"];

const badge = "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide";

function Pill({ children, className = "" }) {
  return <span className={`${badge} ${className}`}>{children}</span>;
}

function Field({ label, children, hint, error, required }) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label} {required ? <span className="text-sky-500">*</span> : null}
        </span>
        {hint ? <span className="text-xs text-slate-400 dark:text-slate-500">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p className="text-xs font-semibold text-rose-500">{error}</p>
      ) : null}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 ${props.className || ""}`}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 ${props.className || ""}`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 ${props.className || ""}`}
    />
  );
}

function requestStatusBadge(status = "") {
  const s = String(status || "open").toLowerCase();
  if (s === "open" || s === "active") {
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 border-emerald-500/20";
  }
  if (s === "reviewing" || s === "reviewing_quotes") {
    return "bg-amber-500/15 text-amber-700 dark:text-amber-200 border-amber-500/20";
  }
  if (s === "closed" || s === "completed") {
    return "bg-zinc-500/15 text-zinc-700 dark:text-zinc-200 border-zinc-500/20";
  }
  return "bg-zinc-500/15 text-zinc-700 dark:text-zinc-200 border-zinc-500/20";
}

function formatRequestStatus(status = "") {
  const s = String(status || "open").toLowerCase();
  if (s === "open" || s === "active") return "Active";
  if (s === "reviewing" || s === "reviewing_quotes") return "Reviewing Quotes";
  if (s === "closed" || s === "completed") return "Closed";
  return String(status || "open").replaceAll("_", " ");
}

export default function BuyerRequestManagement() {
  const user = useMemo(() => getCurrentUser(), []);
  const { user: secureUser } = useSecureUser();
  const { hasEntitlement: secureHasEntitlement } = useEntitlements();
  const role = secureUser?.role || String(user?.role || "").toLowerCase();
  const canSmartMatch =
    secureHasEntitlement("smart_supplier_matching") ||
    hasEntitlement(user, "smart_supplier_matching");

  const { theme, toggleTheme } = useTheme();
  const [moreFieldsOpen, setMoreFieldsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [step, setStep] = useState(0);
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const [requests, setRequests] = useState([]);
  const [browse, setBrowse] = useState([]);
  const [agents, setAgents] = useState([]);
  const [attachmentsByRequest, setAttachmentsByRequest] = useState({});
  const [uploadingAttachmentId, setUploadingAttachmentId] = useState("");
  const [attachmentFeedback, setAttachmentFeedback] = useState("");
  const [attachmentTypeByRequest, setAttachmentTypeByRequest] = useState({});

  const [loading, setLoading] = useState(true);
  const [loadingBrowse, setLoadingBrowse] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [smartMatches, setSmartMatches] = useState({});
  const [smartMatchLoading, setSmartMatchLoading] = useState("");
  const [smartMatchError, setSmartMatchError] = useState({});
  const [aiParsing, setAiParsing] = useState(false);
  const [aiParseWarnings, setAiParseWarnings] = useState([]);
  const [aiParseFeedback, setAiParseFeedback] = useState("");

  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  const token = useMemo(() => getToken(), []);

  const isTextile = form.requestType === "textile";
  const steps = useMemo(
    () =>
      isTextile
        ? ["Type", "Basics", "Technical", "Commercial", "Compliance", "Preview"]
        : ["Type", "Basics", "Product", "Commercial", "Compliance", "Preview"],
    [isTextile],
  );
  const isFirstStep = step === 0;
  const isLastStep = step === steps.length - 1;

  useEffect(() => {
    if (step > steps.length - 1) setStep(steps.length - 1);
  }, [step, steps.length]);

  function clearValidationState() {
    setFieldErrors({});
    setError("");
  }

  function validateCurrentStep(targetStep = step) {
    const nextErrors = getBuyerRequestStepErrors(form, targetStep);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setError("Please fix the highlighted fields before continuing.");
      return false;
    }
    return true;
  }

  function handleNext() {
    if (!validateCurrentStep(step)) return;
    clearValidationState();
    setStep((prev) => Math.min(steps.length - 1, prev + 1));
  }

  function handleBack() {
    clearValidationState();
    setStep((prev) => Math.max(0, prev - 1));
  }

  function updateCustomField(index, key, value) {
    setForm((prev) => {
      const next = Array.isArray(prev.customFields)
        ? [...prev.customFields]
        : [];
      const row = next[index] || { label: "", value: "" };
      next[index] = { ...row, [key]: value };
      return { ...prev, customFields: next };
    });
  }

  function addCustomField() {
    setForm((prev) => ({
      ...prev,
      customFields: [
        ...(Array.isArray(prev.customFields) ? prev.customFields : []),
        { label: "", value: "" },
      ],
    }));
  }

  function removeCustomField(index) {
    setForm((prev) => ({
      ...prev,
      customFields: (Array.isArray(prev.customFields)
        ? prev.customFields
        : []
      ).filter((_, i) => i !== index),
    }));
  }

  const loadRequests = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/requirements", { token });
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load buyer requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadBrowse = useCallback(async () => {
    if (!token || role !== "buyer") return;
    setLoadingBrowse(true);
    try {
      const data = await apiRequest("/requirements/browse", { token });
      setBrowse(Array.isArray(data) ? data : []);
    } catch {
      setBrowse([]);
    } finally {
      setLoadingBrowse(false);
    }
  }, [role, token]);

  const loadAgents = useCallback(async () => {
    if (!token) return;
    if (!(role === "buying_house" || role === "admin")) return;
    try {
      const data = await apiRequest("/org/members", { token });
      setAgents(Array.isArray(data?.members) ? data.members : []);
    } catch {
      setAgents([]);
    }
  }, [role, token]);

  const loadAttachments = useCallback(
    async (requirementId) => {
      if (!token || !requirementId) return;
      try {
        const data = await apiRequest(
          `/documents?entity_type=buyer_request&entity_id=${encodeURIComponent(requirementId)}`,
          { token },
        );
        setAttachmentsByRequest((prev) => ({
          ...prev,
          [requirementId]: Array.isArray(data) ? data : [],
        }));
      } catch {
        setAttachmentsByRequest((prev) => ({ ...prev, [requirementId]: [] }));
      }
    },
    [token],
  );

  const uploadAttachment = useCallback(
    async (requirementId, file, type = "reference") => {
      if (!token || !requirementId || !file) return;
      setAttachmentFeedback("");
      setUploadingAttachmentId(requirementId);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("entity_type", "buyer_request");
        formData.append("entity_id", requirementId);
        formData.append("type", type || "reference");

        const res = await fetch(`${API_BASE}/documents`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Upload failed");
        }
        await res.json().catch(() => ({}));
        setAttachmentFeedback("Attachment uploaded.");
        await loadAttachments(requirementId);
      } catch (err) {
        setAttachmentFeedback(err.message || "Attachment upload failed");
      } finally {
        setUploadingAttachmentId("");
      }
    },
    [loadAttachments, token],
  );

  const removeAttachment = useCallback(
    async (documentId, requirementId) => {
      if (!token || !documentId) return;
      setAttachmentFeedback("");
      try {
        await apiRequest(`/documents/${encodeURIComponent(documentId)}`, {
          method: "DELETE",
          token,
        });
        if (requirementId) await loadAttachments(requirementId);
        setAttachmentFeedback("Attachment removed.");
      } catch (err) {
        setAttachmentFeedback(err.message || "Failed to remove attachment.");
      }
    },
    [loadAttachments, token],
  );

  useEffect(() => {
    loadRequests();
    loadBrowse();
    loadAgents();
  }, [loadAgents, loadBrowse, loadRequests]);

  async function createRequest(statusOverride = "open") {
    if (!token) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (statusOverride !== "draft") {
        const validationErrors = getBuyerRequestSubmissionErrors(form);
        if (Object.keys(validationErrors).length) {
          setFieldErrors(validationErrors);
          setError("Please fix the highlighted fields before posting.");
          setStep(getBuyerRequestErrorStep(validationErrors));
          return;
        }
      }
      const created = await apiRequest("/requirements", {
        method: "POST",
        token,
        body: { ...formToPayload(form), status: statusOverride },
      });
      if (created?.id && pendingAttachments.length) {
        for (const attachment of pendingAttachments) {
          if (!attachment?.file) continue;
          await uploadAttachment(
            created.id,
            attachment.file,
            attachment.type || "tech_pack",
          );
        }
      }
      setSuccess(
        statusOverride === "draft" ? "Draft saved." : "Buyer request posted.",
      );
      setForm(EMPTY_FORM);
      setPendingAttachments([]);
      setFieldErrors({});
      setStep(0);
      await loadRequests();
      await loadBrowse();
    } catch (err) {
      setError(err.message || "Failed to post buyer request.");
    } finally {
      setSaving(false);
    }
  }

  async function saveDraft() {
    await createRequest("draft");
  }

  async function parseDescriptionWithAi() {
    if (!token) return;
    if (!form.customDescription.trim()) {
      setAiParseFeedback(
        "Please enter request text in Custom description first.",
      );
      return;
    }
    setAiParsing(true);
    setAiParseWarnings([]);
    setAiParseFeedback("");
    try {
      const response = await apiRequest("/ai/requirements/extract", {
        method: "POST",
        token,
        body: { text: form.customDescription },
      });
      const extracted = response?.requirements || {};
      const missing = Array.isArray(extracted.missing_fields)
        ? extracted.missing_fields
        : [];
      setAiParseWarnings(missing);

      try {
        const mapped = mapExtractedToForm(extracted);
        const sanitized = Object.entries(mapped).reduce((acc, [k, v]) => {
          if (v === undefined || v === null) return acc;
          if (typeof v === "string" && v.trim() === "") return acc;
          if (Array.isArray(v) && v.length === 0) return acc;
          acc[k] = v;
          return acc;
        }, {});
        setForm((prev) => ({ ...prev, ...sanitized }));
      } catch {
        const timelineDays = extracted?.timeline?.normalized_days;
        const priceMin = extracted?.price?.min;
        const priceMax = extracted?.price?.max;
        const priceCurrency = extracted?.price?.currency || "USD";

        setForm((prev) => ({
          ...prev,
          targetFobPrice: Number.isFinite(priceMin)
            ? `${priceCurrency} ${priceMin}${Number.isFinite(priceMax) && priceMax !== priceMin ? `-${priceMax}` : ""}`
            : prev.targetFobPrice,
          targetPrice: Number.isFinite(priceMin)
            ? `${priceCurrency} ${priceMin}${Number.isFinite(priceMax) && priceMax !== priceMin ? `-${priceMax}` : ""}`
            : prev.targetPrice,
          fabricComposition:
            extracted?.fabric?.composition ||
            extracted?.fabric?.material ||
            prev.fabricComposition,
          fiberComposition:
            extracted?.fabric?.composition ||
            extracted?.fabric?.material ||
            prev.fiberComposition,
          fabricWeightGsm: Number.isFinite(extracted?.fabric?.gsm)
            ? String(extracted.fabric.gsm)
            : prev.fabricWeightGsm,
          complianceNotes: extracted?.compliance?.notes || prev.complianceNotes,
          leadTimeRequired: Number.isFinite(timelineDays)
            ? `${timelineDays} days`
            : prev.leadTimeRequired,
        }));
      }

      const confidence = Number(response?.confidence || 0);
      setAiParseFeedback(
        `AI parsed your text (confidence ${Math.round(confidence * 100)}%).`,
      );
    } catch (err) {
      setAiParseFeedback(err.message || "AI parsing failed.");
    } finally {
      setAiParsing(false);
    }
  }

  function startEditing(req) {
    setEditingId(req.id);
    setEditForm(requirementToForm(req));
    setSuccess("");
    setError("");
  }

  function duplicateRequest(req) {
    setForm(requirementToForm(req));
    setStep(1);
    setSuccess(
      "Loaded the request into the form. Update details and post when ready.",
    );
    setError("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function saveEdit() {
    if (!token || !editingId) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const validationErrors = getBuyerRequestSubmissionErrors(editForm);
      if (Object.keys(validationErrors).length) {
        setError("Please fix the highlighted fields before saving.");
        return;
      }
      await apiRequest(`/requirements/${encodeURIComponent(editingId)}`, {
        method: "PATCH",
        token,
        body: formToPayload(editForm),
      });
      setSuccess("Request updated.");
      setEditingId("");
      setEditForm(EMPTY_FORM);
      await loadRequests();
      await loadBrowse();
    } catch (err) {
      setError(err.message || "Failed to update request.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRequest(id) {
    if (!token || !id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await apiRequest(`/requirements/${encodeURIComponent(id)}`, {
        method: "DELETE",
        token,
      });
      setSuccess("Request deleted.");
      await loadRequests();
      await loadBrowse();
    } catch (err) {
      setError(err.message || "Failed to delete request.");
    } finally {
      setSaving(false);
    }
  }

  async function loadSmartMatches(requirementId) {
    if (!token || !requirementId) return;
    if (!canSmartMatch) return;
    setSmartMatchLoading(requirementId);
    setSmartMatchError((prev) => ({ ...prev, [requirementId]: "" }));
    try {
      const data = await apiRequest(
        `/requirements/${encodeURIComponent(requirementId)}/matches`,
        { token },
      );
      setSmartMatches((prev) => ({
        ...prev,
        [requirementId]: Array.isArray(data?.matches) ? data.matches : [],
      }));
    } catch (err) {
      setSmartMatchError((prev) => ({
        ...prev,
        [requirementId]: err.message || "Unable to load smart matches",
      }));
      setSmartMatches((prev) => ({ ...prev, [requirementId]: [] }));
    } finally {
      setSmartMatchLoading("");
    }
  }

  async function assignRequest(requirementId, agentId) {
    if (!token || !requirementId) return;
    setError("");
    setSuccess("");
    try {
      await apiRequest(`/requirements/${encodeURIComponent(requirementId)}`, {
        method: "PATCH",
        token,
        body: { assigned_agent_id: agentId || "" },
      });
      setSuccess("Assignment updated.");
      await loadRequests();
    } catch (err) {
      setError(err.message || "Failed to assign request.");
    }
  }

  const myRequests = useMemo(() => {
    if (role === "buyer") return requests;
    return requests.filter(
      (r) => String(r.status || "open").toLowerCase() === "open",
    );
  }, [requests, role]);

  const previewRows = useMemo(() => {
    const rows = [
      { label: "Request type", value: form.requestType || "garments" },
      { label: "Title", value: form.title },
      {
        label: "Category",
        value: isTextile ? form.subCategory : form.category,
      },
      { label: "Industry", value: form.industry },
      { label: "Gender target", value: form.genderTarget },
      { label: "Season", value: form.season },
      { label: "Total quantity", value: form.totalQuantity },
      { label: "Number of styles", value: form.numberOfStyles },
      { label: "Material type", value: form.materialType },
      { label: "Quantity", value: form.quantity },
      { label: "Unit", value: form.unit },
      {
        label: "Fabric composition",
        value: form.fabricComposition || form.fiberComposition,
      },
      { label: "Fabric weight (GSM)", value: form.fabricWeightGsm },
      { label: "Weave/Knit", value: form.weaveOrKnit },
      { label: "Size range", value: form.sizeRange },
      {
        label: "Color requirement",
        value: form.colorRequirement || form.color,
      },
      { label: "Style description", value: form.styleDescription },
      { label: "Tech pack required", value: form.techPackRequired },
      { label: "Target FOB price", value: form.targetFobPrice },
      { label: "Target price", value: form.targetPrice },
      { label: "Price unit", value: form.priceUnit },
      { label: "Incoterm", value: form.incoterms },
      {
        label: "Destination port",
        value: form.destinationPort || form.deliveryPort,
      },
      { label: "Ex-factory date", value: form.exFactoryDate },
      { label: "Lead time required", value: form.leadTimeRequired },
      { label: "Sample required", value: form.sampleRequired },
      { label: "Sample type", value: form.sampleType },
      { label: "Payment terms", value: form.paymentTerms },
      {
        label: "Compliance certs",
        value: Array.isArray(form.complianceCerts)
          ? form.complianceCerts.join(", ")
          : "",
      },
      {
        label: "Sustainability certs",
        value: Array.isArray(form.sustainabilityCerts)
          ? form.sustainabilityCerts.join(", ")
          : "",
      },
      { label: "Lab test required", value: form.labTestRequired },
      { label: "Swatch first", value: form.swatchFirst },
      {
        label: "Compliance notes",
        value: form.complianceNotes || form.labCertNotes,
      },
      { label: "Quote deadline", value: form.quoteDeadline },
      { label: "Request expiry", value: form.expiresAt },
      { label: "Max suppliers", value: form.maxSuppliers },
      { label: "Preferred location", value: form.preferredFactoryLocation },
      { label: "Factory size", value: form.factorySizePreference },
      { label: "Export experience", value: form.exportExperiencePreference },
      {
        label: "Confidentiality",
        value: form.confidentialityToggle ? "Hide brand name" : "",
      },
      { label: "Packaging", value: form.packagingRequirement },
      { label: "Origin label", value: form.originLabelRequired },
      { label: "Hang tag / barcode", value: form.hangtagBarcode },
      { label: "Partial shipment", value: form.partialShipmentAllowed },
      { label: "Shipment mode", value: form.shipmentMode },
      {
        label: "Messaging access",
        value: form.verifiedOnly ? "Verified request only" : "Normal",
      },
    ];
    return rows.filter((row) => row.value);
  }, [form, isTextile]);

  const dark = theme === "dark";

  const shell = dark
    ? "bg-[#07111f] text-slate-100"
    : "bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-900";

  const panel = dark
    ? "border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
    : "border-slate-200 bg-white/80 shadow-[0_20px_80px_rgba(14,116,144,0.08)] backdrop-blur";

  const soft = dark ? "text-slate-300" : "text-slate-600";

  const headerTitle = role === "buyer" ? "Post Buyer Request" : "Buyer Request Management";
  const roleSubtitle =
    role === "buyer"
      ? "Create structured requests so factories and buying houses can compare requirements quickly."
      : "Lead queue for buyer requests. Use Assign to route a request to a specific agent.";

  return (
    <div className={`min-h-screen ${shell}`}>
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        <div className={`overflow-hidden rounded-[32px] border ${panel}`}>
          <div className="border-b border-white/10 bg-gradient-to-r from-sky-500/15 via-cyan-500/10 to-blue-500/10 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 p-4 text-white shadow-lg shadow-sky-500/20">
                  <ClipboardList className="h-7 w-7" />
                </div>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Pill className="border-sky-400/30 bg-sky-500/15 text-sky-300">/buyer-requests</Pill>
                    <Pill className={`border-white/10 bg-white/5 ${dark ? "text-slate-300" : "text-slate-600"}`}>Role: {role}</Pill>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{headerTitle}</h1>
                  <p className={`mt-1 max-w-3xl text-sm sm:text-base ${soft}`}>{roleSubtitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className={`flex items-center gap-2 rounded-2xl border px-2 py-2 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                  {roles.map((r) => (
                    <span
                      key={r}
                      className={`rounded-xl px-3 py-2 text-sm font-medium ${role === r ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : dark ? "text-slate-500" : "text-slate-400"}`}
                    >
                      {r === "buying_house" ? "Buying House" : r.charAt(0).toUpperCase() + r.slice(1)}
                    </span>
                  ))}
                </div>
                {role !== "buyer" ? (
                  <Link
                    to="/owner"
                    className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${dark ? "border-white/10 bg-white/5 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}
                  >
                    Back to Dashboard
                  </Link>
                ) : null}
                <button
                  onClick={toggleTheme}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${dark ? "border-white/10 bg-white/5 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}
                >
                  {dark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  {dark ? "Light" : "Dark"}
                </button>
              </div>
            </div>

          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-12 lg:p-6">
            <div className={role === "buyer" ? "lg:col-span-8 xl:col-span-8" : "lg:col-span-12"}>
              <div className={`rounded-[28px] border p-5 ${panel}`}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-2xl p-3 ${dark ? "bg-sky-500/15 text-sky-300" : "bg-sky-100 text-sky-700"}`}>
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">
                        {role === "buyer" ? "Request Builder" : "Request Management Hub"}
                      </h2>
                      <p className={`text-sm ${soft}`}>
                        {role === "buyer" ? "Premium workflow UI with dense controls and polished spacing." : "Lead queue with agent assignment and tracking."}
                      </p>
                    </div>
                  </div>
                </div>

                {(error || success || attachmentFeedback || aiParseFeedback) && (
                  <div className="mb-5 space-y-2">
                    {success ? (
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
                        <CheckCircle2 className="mr-2 inline-block h-4 w-4" /> {success}
                      </div>
                    ) : null}
                    {error ? (
                      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                        <X className="mr-2 inline-block h-4 w-4" /> {error}
                      </div>
                    ) : null}
                    {attachmentFeedback ? (
                      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-700 dark:text-sky-200">
                        <CloudUpload className="mr-2 inline-block h-4 w-4" /> {attachmentFeedback}
                      </div>
                    ) : null}
                    {aiParseFeedback ? (
                      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-700 dark:text-cyan-200">
                        <Bot className="mr-2 inline-block h-4 w-4" /> {aiParseFeedback}
                      </div>
                    ) : null}
                  </div>
                )}

                {role === "buyer" ? (
                  <>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Step {step + 1} of {steps.length} — <span className="font-medium text-slate-700 dark:text-slate-200">{steps[step]}</span>
                        </div>
                        <div className={`mt-1 text-sm ${soft}`}>Complete each step so verified suppliers can quote faster.</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setMoreFieldsOpen((v) => !v)}
                          className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${dark ? "border-white/10 bg-white/5 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}
                        >
                          <Filter className="h-4 w-4" />
                          {moreFieldsOpen ? "Hide more fields" : "More fields"}
                        </button>
                        <button
                          onClick={parseDescriptionWithAi}
                          disabled={aiParsing || !form.customDescription.trim()}
                          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 disabled:opacity-50"
                        >
                          <Bot className="h-4 w-4" /> {aiParsing ? "Parsing..." : "AI parse my text"}
                        </button>
                      </div>
                    </div>

                    <div className="mb-5 grid gap-2 sm:grid-cols-6">
                      {steps.map((label, i) => (
                        <div
                          key={label}
                          className={`rounded-2xl border px-3 py-3 text-center text-xs font-semibold ${i === step ? "border-sky-400 bg-sky-500/15 text-sky-300" : dark ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-200 bg-white text-slate-500"}`}
                        >
                          {i + 1}. {label}
                        </div>
                      ))}
                    </div>

                    {aiParseWarnings.length ? (
                      <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-200">
                        Missing data confidence warning: {aiParseWarnings.join(", ")}
                      </div>
                    ) : null}

                    <div className="space-y-5">
                      {step === 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          <button
                            type="button"
                            className={`group rounded-[26px] border p-5 text-left transition hover:-translate-y-1 ${form.requestType === "garments" ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10" : dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}${fieldErrors.requestType ? " ring-2 ring-rose-400" : ""}`}
                            onClick={() => setForm({ ...form, requestType: "garments" })}
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-3 text-white shadow-lg shadow-sky-500/20">
                                <Layers3 className="h-5 w-5" />
                              </div>
                              {form.requestType === "garments" ? <CheckCircle2 className="h-5 w-5 text-sky-400" /> : <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-sky-400" />}
                            </div>
                            <div className="text-lg font-semibold">Garments Buyer</div>
                            <div className={`mt-1 text-sm ${soft}`}>Finished garments with design + construction focus.</div>
                          </button>
                          <button
                            type="button"
                            className={`group rounded-[26px] border p-5 text-left transition hover:-translate-y-1 ${form.requestType === "textile" ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10" : dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}${fieldErrors.requestType ? " ring-2 ring-rose-400" : ""}`}
                            onClick={() => setForm({ ...form, requestType: "textile" })}
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-3 text-white shadow-lg shadow-sky-500/20">
                                <FileText className="h-5 w-5" />
                              </div>
                              {form.requestType === "textile" ? <CheckCircle2 className="h-5 w-5 text-sky-400" /> : <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-sky-400" />}
                            </div>
                            <div className="text-lg font-semibold">Textile Buyer</div>
                            <div className={`mt-1 text-sm ${soft}`}>Fabric/yarn/trim requests with technical specs.</div>
                          </button>
                        </div>
                      ) : null}

                      {step === 1 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field
                            label="Request title"
                            required
                            hint="Example: Denim Jacket - 10k pcs"
                            error={fieldErrors.title || fieldErrors.request_title}
                          >
                            <Input
                              value={form.title}
                              onChange={(e) => setForm({ ...form, title: e.target.value })}
                              placeholder="Meaningful title"
                            />
                          </Field>
                          {isTextile ? (
                            <>
                              <Field
                                label="Material type"
                                required
                                error={fieldErrors.materialType || fieldErrors.material_type}
                              >
                                <Input
                                  value={form.materialType}
                                  onChange={(e) => setForm({ ...form, materialType: e.target.value })}
                                  placeholder="Cotton"
                                />
                              </Field>
                              <Field
                                label="Sub-category"
                                required
                                error={fieldErrors.subCategory || fieldErrors.sub_category}
                              >
                                <Input
                                  value={form.subCategory}
                                  onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                                  placeholder="Jersey"
                                />
                              </Field>
                              <Field
                                label="Quantity"
                                required
                                error={fieldErrors.quantity || fieldErrors.totalQuantity || fieldErrors.total_quantity}
                              >
                                <Input
                                  value={form.quantity}
                                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                  placeholder="5000"
                                />
                              </Field>
                              <Field label="Unit" required error={fieldErrors.unit}>
                                <Input
                                  value={form.unit}
                                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                  placeholder="kg"
                                />
                              </Field>
                            </>
                          ) : (
                            <>
                              <Field label="Product category" required error={fieldErrors.category}>
                                <Input
                                  value={form.category}
                                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                                  placeholder="Outerwear"
                                />
                              </Field>
                              <Field label="Gender target" required error={fieldErrors.genderTarget || fieldErrors.gender_target}>
                                <Select
                                  value={form.genderTarget}
                                  onChange={(e) => setForm({ ...form, genderTarget: e.target.value })}
                                >
                                  <option value="">Select gender</option>
                                  <option value="Women">Women</option>
                                  <option value="Men">Men</option>
                                  <option value="Kids">Kids</option>
                                  <option value="Unisex">Unisex</option>
                                </Select>
                              </Field>
                              <Field label="Season" required error={fieldErrors.season}>
                                <Select
                                  value={form.season}
                                  onChange={(e) => setForm({ ...form, season: e.target.value })}
                                >
                                  <option value="">Select season</option>
                                  <option value="Spring">Spring</option>
                                  <option value="Summer">Summer</option>
                                  <option value="Autumn">Autumn</option>
                                  <option value="Winter">Winter</option>
                                  <option value="All season">All season</option>
                                </Select>
                              </Field>
                              <Field
                                label="Total quantity (pcs)"
                                required
                                error={fieldErrors.totalQuantity || fieldErrors.quantity || fieldErrors.total_quantity}
                              >
                                <Input
                                  value={form.totalQuantity}
                                  onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })}
                                  placeholder="10000"
                                />
                              </Field>
                            </>
                          )}

                          {moreFieldsOpen ? (
                            <>
                              <Field label="Industry" hint="Optional">
                                <Input
                                  value={form.industry}
                                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                                  placeholder="Apparel / Textile"
                                />
                              </Field>
                              {!isTextile ? (
                                <Field label="Number of styles" hint="Optional">
                                  <Input
                                    value={form.numberOfStyles}
                                    onChange={(e) => setForm({ ...form, numberOfStyles: e.target.value })}
                                    placeholder="2"
                                  />
                                </Field>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                      ) : null}

                      {step === 2 && isTextile ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Fiber composition" required error={fieldErrors.fiberComposition || fieldErrors.fiber_composition}>
                            <Input value={form.fiberComposition} onChange={(e) => setForm({ ...form, fiberComposition: e.target.value })} placeholder="100% combed cotton" />
                          </Field>
                          <Field label="Fabric weight (GSM)" required error={fieldErrors.fabricWeightGsm || fieldErrors.fabric_weight_gsm || fieldErrors.fabric_weight}>
                            <Input value={form.fabricWeightGsm} onChange={(e) => setForm({ ...form, fabricWeightGsm: e.target.value })} placeholder="180" />
                          </Field>
                          <Field label="Fabric width">
                            <Input value={form.fabricWidth} onChange={(e) => setForm({ ...form, fabricWidth: e.target.value })} placeholder="58 inches" />
                          </Field>
                          <Field label="Yarn count">
                            <Input value={form.yarnCount} onChange={(e) => setForm({ ...form, yarnCount: e.target.value })} placeholder="30s" />
                          </Field>
                          <Field label="Thread count">
                            <Input value={form.threadCount} onChange={(e) => setForm({ ...form, threadCount: e.target.value })} placeholder="N/A" />
                          </Field>
                          <Field label="Finish required">
                            <Input value={form.finishRequired} onChange={(e) => setForm({ ...form, finishRequired: e.target.value })} placeholder="Bio wash" />
                          </Field>
                          <Field label="Stretch required">
                            <Input value={form.stretchRequired} onChange={(e) => setForm({ ...form, stretchRequired: e.target.value })} placeholder="Low stretch" />
                          </Field>
                          <Field label="Color">
                            <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="White" />
                          </Field>
                          <Field label="Pattern">
                            <Input value={form.pattern} onChange={(e) => setForm({ ...form, pattern: e.target.value })} placeholder="Solid" />
                          </Field>
                        </div>
                      ) : null}

                      {step === 2 && !isTextile ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Fabric composition">
                            <Input value={form.fabricComposition} onChange={(e) => setForm({ ...form, fabricComposition: e.target.value })} placeholder="98% cotton, 2% elastane" />
                          </Field>
                          <Field label="Fabric weight (GSM)">
                            <Input value={form.fabricWeightGsm} onChange={(e) => setForm({ ...form, fabricWeightGsm: e.target.value })} placeholder="320" />
                          </Field>
                          <Field label="Weave / Knit type">
                            <Input value={form.weaveOrKnit} onChange={(e) => setForm({ ...form, weaveOrKnit: e.target.value })} placeholder="Twill weave" />
                          </Field>
                          <Field label="Size range">
                            <Input value={form.sizeRange} onChange={(e) => setForm({ ...form, sizeRange: e.target.value })} placeholder="S-XL" />
                          </Field>
                          <Field label="Color requirement">
                            <Input value={form.colorRequirement} onChange={(e) => setForm({ ...form, colorRequirement: e.target.value })} placeholder="Indigo and black" />
                          </Field>
                          <Field label="Style description">
                            <TextArea rows={4} value={form.styleDescription} onChange={(e) => setForm({ ...form, styleDescription: e.target.value })} placeholder="Premium structured jacket..." />
                          </Field>
                          <Field label="Tech pack required">
                            <Input value={form.techPackRequired} onChange={(e) => setForm({ ...form, techPackRequired: e.target.value })} placeholder="Yes / No" />
                          </Field>
                          <Field label="Tech pack upload" hint="optional">
                            <div className={`rounded-2xl border border-dashed p-4 ${dark ? "border-white/15 bg-white/5" : "border-sky-200 bg-sky-50/70"}`}>
                              {pendingAttachments.length ? (
                                <div className="space-y-2">
                                  {pendingAttachments.map((fileRow, index) => (
                                    <div key={`${fileRow.file?.name}-${index}`} className={`flex items-center justify-between rounded-2xl border px-3 py-2 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                                      <span className="text-xs text-slate-600 dark:text-slate-400">{fileRow.file?.name || "File"}</span>
                                      <button
                                        type="button"
                                        className="text-xs font-semibold text-rose-500"
                                        onClick={() => setPendingAttachments((prev) => prev.filter((_, i) => i !== index))}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500">You can upload tech packs and sketches after posting too.</p>
                              )}
                              <div className="mt-3 flex items-center gap-2">
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20">
                                  <CloudUpload className="h-4 w-4" /> Add file
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0];
                                      if (file) {
                                        setPendingAttachments((prev) => [
                                          ...prev,
                                          { file, type: "tech_pack" },
                                        ]);
                                      }
                                      event.target.value = "";
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </Field>
                        </div>
                      ) : null}

                      {step === 3 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          {isTextile ? (
                            <>
                              <Field label="Target price" required error={fieldErrors.targetPrice || fieldErrors.price_range || fieldErrors.target_price}>
                                <Input value={form.targetPrice} onChange={(e) => setForm({ ...form, targetPrice: e.target.value })} placeholder="2.15" />
                              </Field>
                              <Field label="Price unit" required error={fieldErrors.priceUnit || fieldErrors.price_unit}>
                                <Input value={form.priceUnit} onChange={(e) => setForm({ ...form, priceUnit: e.target.value })} placeholder="/ kg" />
                              </Field>
                              <Field label="Incoterm" required error={fieldErrors.incoterms || fieldErrors.incoterm}>
                                <Select value={form.incoterms} onChange={(e) => setForm({ ...form, incoterms: e.target.value })}>
                                  <option value="">Select incoterm</option>
                                  <option value="FOB">FOB</option>
                                  <option value="CIF">CIF</option>
                                  <option value="EXW">EXW</option>
                                </Select>
                              </Field>
                              <Field label="Delivery port" required error={fieldErrors.deliveryPort || fieldErrors.delivery_port}>
                                <Input value={form.deliveryPort} onChange={(e) => setForm({ ...form, deliveryPort: e.target.value })} placeholder="Chittagong" />
                              </Field>
                              <Field label="Lead time required" required error={fieldErrors.leadTimeRequired || fieldErrors.lead_time_required}>
                                <Input value={form.leadTimeRequired} onChange={(e) => setForm({ ...form, leadTimeRequired: e.target.value })} placeholder="30 days" />
                              </Field>
                              <Field label="Lab test required">
                                <Input value={form.labTestRequired} onChange={(e) => setForm({ ...form, labTestRequired: e.target.value })} placeholder="Yes / No" />
                              </Field>
                              <Field label="Swatch/sample first?">
                                <Input value={form.swatchFirst} onChange={(e) => setForm({ ...form, swatchFirst: e.target.value })} placeholder="Yes / No" />
                              </Field>
                            </>
                          ) : (
                            <>
                              <Field label="Target FOB price" required error={fieldErrors.targetFobPrice || fieldErrors.price_range || fieldErrors.target_fob_price}>
                                <Input value={form.targetFobPrice} onChange={(e) => setForm({ ...form, targetFobPrice: e.target.value })} placeholder="8.40" />
                              </Field>
                              <Field label="Incoterm" required error={fieldErrors.incoterms || fieldErrors.incoterm}>
                                <Select value={form.incoterms} onChange={(e) => setForm({ ...form, incoterms: e.target.value })}>
                                  <option value="">Select incoterm</option>
                                  <option value="FOB">FOB</option>
                                  <option value="CIF">CIF</option>
                                  <option value="EXW">EXW</option>
                                </Select>
                              </Field>
                              <Field label="Destination port">
                                <Input value={form.destinationPort} onChange={(e) => setForm({ ...form, destinationPort: e.target.value })} placeholder="Chittagong" />
                              </Field>
                              <Field label="Ex-factory date" required error={fieldErrors.exFactoryDate || fieldErrors.ex_factory_date}>
                                <Input type="date" value={form.exFactoryDate} onChange={(e) => setForm({ ...form, exFactoryDate: e.target.value })} />
                              </Field>
                              <Field label="Sample required">
                                <Input value={form.sampleRequired} onChange={(e) => setForm({ ...form, sampleRequired: e.target.value })} placeholder="Yes / No" />
                              </Field>
                              <Field label="Sample type">
                                <Input value={form.sampleType} onChange={(e) => setForm({ ...form, sampleType: e.target.value })} placeholder="Proto sample" />
                              </Field>
                              <Field label="Payment terms" required error={fieldErrors.paymentTerms || fieldErrors.payment_terms}>
                                <Input value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} placeholder="30% advance, 70% against B/L" />
                              </Field>
                            </>
                          )}

                          {moreFieldsOpen ? (
                            <>
                              <Field label="Quote deadline" hint="Optional">
                                <Input type="date" value={form.quoteDeadline} onChange={(e) => setForm({ ...form, quoteDeadline: e.target.value })} />
                              </Field>
                              <Field label="Request expiry" hint="Optional">
                                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
                              </Field>
                              <Field label="Max suppliers to contact" hint="Optional">
                                <Input value={form.maxSuppliers} onChange={(e) => setForm({ ...form, maxSuppliers: e.target.value })} placeholder="8" />
                              </Field>
                              <Field
                                label="Messaging access"
                                hint="Normal: verified goes to inbox, unverified goes to requests. Verified request only: only verified suppliers can message."
                              >
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  <button
                                    type="button"
                                    onClick={() => setForm({ ...form, verifiedOnly: false })}
                                    className={`rounded-2xl border p-4 text-left text-sm transition ${!form.verifiedOnly ? "border-sky-400 bg-sky-500/10" : dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
                                  >
                                    <div className="font-semibold">Normal</div>
                                    <div className={`mt-1 text-xs ${soft}`}>verified goes to inbox, unverified goes to requests</div>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setForm({ ...form, verifiedOnly: true })}
                                    className={`rounded-2xl border p-4 text-left text-sm transition ${form.verifiedOnly ? "border-sky-400 bg-sky-500/10" : dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
                                  >
                                    <div className="font-semibold">Verified request only</div>
                                    <div className={`mt-1 text-xs ${soft}`}>only verified suppliers can message</div>
                                  </button>
                                </div>
                              </Field>
                            </>
                          ) : null}
                        </div>
                      ) : null}

                      {step === 4 ? (
                        <div className="grid gap-4 xl:grid-cols-2">
                          <div className={`rounded-[26px] border p-5 ${panel}`}>
                            <h3 className="mb-4 text-base font-semibold">Compliance / Lab</h3>
                            {!isTextile ? (
                              <>
                                <Field label="Compliance certifications">
                                  <div className="grid grid-cols-2 gap-3">
                                    {GARMENT_COMPLIANCE_CERTS.map((cert) => (
                                      <label key={cert} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                                        <input
                                          type="checkbox"
                                          checked={form.complianceCerts.includes(cert)}
                                          onChange={(e) => {
                                            const next = e.target.checked
                                              ? [...form.complianceCerts, cert]
                                              : form.complianceCerts.filter((c) => c !== cert);
                                            setForm({ ...form, complianceCerts: next });
                                          }}
                                          className="h-4 w-4 accent-sky-500"
                                        />
                                        <span>{cert}</span>
                                      </label>
                                    ))}
                                  </div>
                                </Field>
                                <Field label="Sustainability certifications">
                                  <div className="grid grid-cols-2 gap-3">
                                    {GARMENT_SUSTAIN_CERTS.map((cert) => (
                                      <label key={cert} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                                        <input
                                          type="checkbox"
                                          checked={form.sustainabilityCerts.includes(cert)}
                                          onChange={(e) => {
                                            const next = e.target.checked
                                              ? [...form.sustainabilityCerts, cert]
                                              : form.sustainabilityCerts.filter((c) => c !== cert);
                                            setForm({ ...form, sustainabilityCerts: next });
                                          }}
                                          className="h-4 w-4 accent-sky-500"
                                        />
                                        <span>{cert}</span>
                                      </label>
                                    ))}
                                  </div>
                                </Field>
                                <Field label="Compliance notes">
                                  <TextArea rows={4} value={form.complianceNotes} onChange={(e) => setForm({ ...form, complianceNotes: e.target.value })} placeholder="Traceability, audit readiness..." />
                                </Field>
                              </>
                            ) : (
                              <Field label="Lab/Certification notes">
                                <TextArea rows={4} value={form.labCertNotes} onChange={(e) => setForm({ ...form, labCertNotes: e.target.value })} placeholder="Testing requirements..." />
                              </Field>
                            )}

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              <Field label="Preferred factory location">
                                <Input value={form.preferredFactoryLocation} onChange={(e) => setForm({ ...form, preferredFactoryLocation: e.target.value })} placeholder="Gazipur / Chittagong / Any" />
                              </Field>
                              <Field label="Factory size preference">
                                <Input value={form.factorySizePreference} onChange={(e) => setForm({ ...form, factorySizePreference: e.target.value })} placeholder="Small / Medium / Large" />
                              </Field>
                              <Field label="Export experience preference">
                                <Input value={form.exportExperiencePreference} onChange={(e) => setForm({ ...form, exportExperiencePreference: e.target.value })} placeholder="EU required / US required / Any" />
                              </Field>
                              <Field label="Confidentiality">
                                <label className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                                  <input
                                    type="checkbox"
                                    checked={form.confidentialityToggle}
                                    onChange={(e) => setForm({ ...form, confidentialityToggle: e.target.checked })}
                                    className="h-4 w-4 accent-sky-500"
                                  />
                                  Hide brand name (only verified suppliers can see it)
                                </label>
                              </Field>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className={`rounded-[26px] border p-5 ${panel}`}>
                              <h3 className="mb-4 text-base font-semibold">Packaging & Shipment</h3>
                              <div className="grid gap-4">
                                <Field label="Packaging requirement">
                                  <Input value={form.packagingRequirement} onChange={(e) => setForm({ ...form, packagingRequirement: e.target.value })} placeholder="Poly bag / Hanger / Flat pack" />
                                </Field>
                                <Field label="Origin label requirement">
                                  <Input value={form.originLabelRequired} onChange={(e) => setForm({ ...form, originLabelRequired: e.target.value })} placeholder="Made in Bangladesh required?" />
                                </Field>
                                <Field label="Hang tag / Barcode">
                                  <Input value={form.hangtagBarcode} onChange={(e) => setForm({ ...form, hangtagBarcode: e.target.value })} placeholder="Buyer-supplied / Factory to arrange" />
                                </Field>
                                <Field label="Partial shipment allowed">
                                  <Input value={form.partialShipmentAllowed} onChange={(e) => setForm({ ...form, partialShipmentAllowed: e.target.value })} placeholder="Yes / No" />
                                </Field>
                                <Field label="Shipment mode">
                                  <Input value={form.shipmentMode} onChange={(e) => setForm({ ...form, shipmentMode: e.target.value })} placeholder="Sea / Air / Both" />
                                </Field>
                              </div>
                            </div>

                            <div className={`rounded-[26px] border p-5 ${panel}`}>
                              <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-base font-semibold">Custom fields</h3>
                                <button
                                  type="button"
                                  onClick={addCustomField}
                                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white"
                                >
                                  <Plus className="h-3.5 w-3.5" /> Add custom field
                                </button>
                              </div>
                              <div className="space-y-3">
                                {(Array.isArray(form.customFields) ? form.customFields : []).map((row, index) => (
                                  <div key={`custom-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                                    <Input
                                      placeholder="Label"
                                      value={row.label}
                                      onChange={(e) => updateCustomField(index, "label", e.target.value)}
                                    />
                                    <Input
                                      placeholder="Value"
                                      value={row.value}
                                      onChange={(e) => updateCustomField(index, "value", e.target.value)}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeCustomField(index)}
                                      className="rounded-2xl border px-3 py-2 text-sm text-rose-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4">
                                <Field
                                  label="Custom description"
                                  hint="Use this for extra notes, design details, or negotiation context."
                                >
                                  <TextArea
                                    rows={5}
                                    value={form.customDescription}
                                    onChange={(e) => setForm({ ...form, customDescription: e.target.value })}
                                    placeholder="Use this for extra notes..."
                                  />
                                </Field>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {step === 5 ? (
                        <div>
                          <div className="mb-4 flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">Preview summary</h3>
                              <p className={`text-sm ${soft}`}>Review all fields before posting.</p>
                            </div>
                            <Pill className="bg-sky-500/15 text-sky-300">{previewRows.length} visible fields</Pill>
                          </div>
                          {previewRows.length === 0 ? (
                            <div className={`rounded-[24px] border p-6 text-sm ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>No fields filled yet.</div>
                          ) : (
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                              {previewRows.map((row) => (
                                <div key={row.label} className={`rounded-[22px] border p-4 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                                  <div className="text-xs uppercase tracking-wider text-slate-400">{row.label}</div>
                                  <div className="mt-1 text-sm font-medium break-words">{row.value}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={isFirstStep}
                          className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${isFirstStep ? "cursor-not-allowed opacity-40" : dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
                        >
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={saveDraft}
                          className="inline-flex items-center gap-2 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-500/15 disabled:opacity-70 dark:text-sky-200"
                        >
                          <CloudUpload className="h-4 w-4" /> {saving ? <NeonAtom size={20} /> : "Save Draft"}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        {isLastStep ? (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => createRequest()}
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 disabled:opacity-70"
                          >
                            {saving ? <NeonAtom size={20} /> : "Post Request"} <Sparkles className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={handleNext}
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 disabled:opacity-50"
                          >
                            Next <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill className="bg-sky-500/15 text-sky-300">Open Buyer Requests</Pill>
                      <Pill className="bg-cyan-500/15 text-cyan-300">Assign to agents</Pill>
                      <Pill className={`bg-white/5 ${dark ? "text-slate-300" : "text-slate-600"}`}>Manual refresh only</Pill>
                    </div>

                    <div className={`rounded-[26px] border p-5 ${panel}`}>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold">Lead queue</h3>
                          <p className={`text-sm ${soft}`}>Use Assign to route a request to a specific agent.</p>
                        </div>
                        <button
                          type="button"
                          onClick={loadRequests}
                          className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition dark:border-white/10 dark:bg-white/5"
                        >
                          <RefreshCw className="h-4 w-4" /> Refresh
                        </button>
                      </div>

                      {loading ? (
                        <NeonAtom fill size={64} text="Loading..." />
                      ) : !myRequests.length ? (
                        <div className={`text-sm ${soft}`}>No open requests.</div>
                      ) : (
                        <div className="overflow-hidden rounded-[22px] border border-white/10">
                          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                            <thead className="bg-white/5 text-slate-300">
                              <tr>
                                <th className="px-4 py-3 font-medium">Title</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Qty</th>
                                <th className="px-4 py-3 font-medium">Target</th>
                                <th className="px-4 py-3 font-medium">Delivery</th>
                                <th className="px-4 py-3 font-medium">Assign</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                              {myRequests.map((r) => (
                                <tr key={r.id} className="hover:bg-white/5">
                                  <td className="px-4 py-4">
                                    <div className="font-medium">{r.title || r.category || "Buyer Request"}</div>
                                    <div className="mt-1 text-xs text-slate-400">
                                      Buyer: {String(r.buyer_id || "").slice(0, 8)}...
                                      {r.ai_summary ? ` - ${r.ai_summary}` : ""}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`${badge} ${requestStatusBadge(r.status)}`}>
                                      {formatRequestStatus(r.status)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">{r.quantity || "--"}</td>
                                  <td className="px-4 py-4">{r.target_market || "--"}</td>
                                  <td className="px-4 py-4">{r.delivery_timeline || r.timeline_days || "--"}</td>
                                  <td className="px-4 py-4">
                                    <Select
                                      value={r.assigned_agent_id || ""}
                                      onChange={(e) => assignRequest(r.id, e.target.value)}
                                    >
                                      <option value="">Unassigned</option>
                                      {agents.map((a) => (
                                        <option key={a.id} value={a.id}>
                                          {a.name} ({a.member_id})
                                        </option>
                                      ))}
                                    </Select>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {role === "buyer" ? (
            <div className="space-y-4 lg:col-span-4 xl:col-span-4">
                <div className={`rounded-[28px] border p-5 ${panel}`}>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Premium feature</h3>
                      <p className={`text-xs ${soft}`}>Smart supplier matching</p>
                    </div>
                    <Star className="h-5 w-5 text-sky-400" />
                  </div>
                  {!canSmartMatch ? (
                    <>
                      <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4 text-sm text-slate-700 dark:text-slate-200">
                        Smart supplier matching is a Premium feature.
                      </div>
                      <Link
                        to="/pricing"
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20"
                      >
                        <Zap className="h-4 w-4" /> Upgrade to unlock
                      </Link>
                    </>
                  ) : null}
                  {canSmartMatch ? (
                    <div className="mt-4 rounded-2xl border border-white/10 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium">Smart match</span>
                        <Pill className="bg-white/5 text-slate-300">GET /api/requirements/{'{id}'}/matches</Pill>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

          {role === "buyer" ? (
            <div className="grid gap-4 border-t border-white/10 p-4 lg:grid-cols-12 lg:p-6">
              <div className="lg:col-span-7">
                <div className={`rounded-[28px] border p-5 ${panel}`}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">My Requests</h3>
                      <p className={`text-sm ${soft}`}>Duplicate, smart match, edit, delete, and manage attachments.</p>
                    </div>
                    <button
                      type="button"
                      onClick={loadRequests}
                      className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-white/5"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                  </div>

                  {loading ? (
                    <NeonAtom fill size={64} text="Loading..." />
                  ) : !myRequests.length ? (
                    <div className={`text-sm ${soft}`}>No requests yet.</div>
                  ) : (
                    <div className="grid gap-4">
                      {myRequests.map((r) => {
                        const attachments = attachmentsByRequest[r.id] || [];
                        const selectedType = attachmentTypeByRequest[r.id] || "tech_pack";
                        return (
                          <div key={r.id} className={`rounded-[24px] border p-5 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                            {editingId === r.id ? (
                              <div className="space-y-3">
                                <Field label="Title">
                                  <Input
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                  />
                                </Field>
                                <Field label="Category">
                                  <Input
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                  />
                                </Field>
                                <Field label="Quantity">
                                  <Input
                                    value={editForm.quantity}
                                    onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                  />
                                </Field>
                                <Field label="Custom description">
                                  <TextArea
                                    rows={4}
                                    value={editForm.customDescription}
                                    onChange={(e) => setEditForm({ ...editForm, customDescription: e.target.value })}
                                  />
                                </Field>
                                <Field
                                  label="Messaging access"
                                  hint="Normal: verified goes to inbox, unverified goes to requests. Verified request only: only verified suppliers can message."
                                >
                                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <button
                                      type="button"
                                      onClick={() => setEditForm({ ...editForm, verifiedOnly: false })}
                                      className={`rounded-2xl border p-4 text-left text-sm transition ${!editForm.verifiedOnly ? "border-sky-400 bg-sky-500/10" : dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
                                    >
                                      <div className="font-semibold">Normal</div>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditForm({ ...editForm, verifiedOnly: true })}
                                      className={`rounded-2xl border p-4 text-left text-sm transition ${editForm.verifiedOnly ? "border-sky-400 bg-sky-500/10" : dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
                                    >
                                      <div className="font-semibold">Verified request only</div>
                                    </button>
                                  </div>
                                </Field>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    disabled={saving}
                                    onClick={saveEdit}
                                    className="rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingId("")}
                                    className="rounded-2xl border px-4 py-2.5 text-sm font-medium dark:border-white/10 dark:bg-white/5"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-base font-semibold">{r.title || r.category || "Buyer Request"}</h4>
                                    <span className={`${badge} ${requestStatusBadge(r.status)}`}>
                                      {formatRequestStatus(r.status)}
                                    </span>
                                  </div>
                                  <div className={`mt-2 text-sm ${soft}`}>
                                    Qty {r.quantity || "--"} - {r.material || "--"} - Target {r.target_market || "--"} - Delivery {r.delivery_timeline || r.timeline_days || "--"}
                                  </div>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => duplicateRequest(r)}
                                      className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium dark:border-white/10 dark:bg-white/5"
                                    >
                                      <ClipboardList className="h-3.5 w-3.5" /> Duplicate
                                    </button>
                                    <button
                                      type="button"
                                      disabled={!canSmartMatch}
                                      onClick={() => loadSmartMatches(r.id)}
                                      className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium dark:border-white/10 dark:bg-white/5 disabled:opacity-60"
                                    >
                                      <Sparkles className="h-3.5 w-3.5" /> {smartMatchLoading === r.id ? <NeonAtom size={20} /> : "Smart match"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => startEditing(r)}
                                      className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium dark:border-white/10 dark:bg-white/5"
                                    >
                                      <Edit3 className="h-3.5 w-3.5" /> Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteRequest(r.id)}
                                      className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium text-rose-500 dark:border-white/10 dark:bg-white/5"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </button>
                                  </div>
                                </div>

                                <div className={`rounded-2xl border border-white/10 bg-sky-500/10 px-4 py-3 text-sm ${dark ? "text-sky-300" : "text-sky-700"}`}>
                                  <div className="font-medium">Attachments</div>
                                  <div className={`mt-1 text-xs ${dark ? "text-sky-200/80" : "text-sky-600/80"}`}>Tech pack, sketch, reference image, compliance, other</div>
                                </div>
                              </div>
                            )}

                            {!canSmartMatch ? (
                              <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-200">
                                Smart supplier matching is a Premium feature.
                                <div className="mt-2">
                                  <Link to="/pricing" className="text-xs font-semibold text-sky-400 hover:underline">
                                    Upgrade to unlock
                                  </Link>
                                </div>
                              </div>
                            ) : null}

                            {smartMatchError[r.id] ? (
                              <p className="mt-2 text-xs text-rose-500">{smartMatchError[r.id]}</p>
                            ) : null}

                            {canSmartMatch && (smartMatches[r.id]?.length || smartMatchLoading === r.id) ? (
                              <div className={`mt-4 rounded-[22px] border p-4 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                                <p className="text-xs font-semibold">Smart matches</p>
                                <div className="mt-2 space-y-2">
                                  {(smartMatches[r.id] || []).slice(0, 3).map((match) => (
                                    <div key={match.id || match.supplier_id} className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-xs ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                                      <span className="truncate">{match.name || match.supplier_name || match.supplier_id}</span>
                                      <Pill className="bg-emerald-500/15 text-emerald-300">{match.score || match.match_score || "--"}</Pill>
                                    </div>
                                  ))}
                                  {!smartMatches[r.id]?.length && smartMatchLoading === r.id ? (
                                    <div className={`text-xs ${soft}`}>Finding matches...</div>
                                  ) : null}
                                </div>
                              </div>
                            ) : null}

                            {editingId !== r.id ? (
                              <div className="mt-4">
                                <div className={`rounded-[22px] border p-4 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold">Attachments</p>
                                    <button
                                      type="button"
                                      onClick={() => loadAttachments(r.id)}
                                      className="text-xs font-semibold text-sky-400"
                                    >
                                      Refresh
                                    </button>
                                  </div>
                                  <div className="mt-2 space-y-2">
                                    {attachments.length ? (
                                      attachments.map((doc) => (
                                        <div key={doc.id} className={`flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                                          <a
                                            className="text-xs font-semibold truncate"
                                            href={toPublicFileUrl(doc.file_path)}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            {doc.type || "Attachment"}: {doc.file_path ? String(doc.file_path).split(/[\\/]/).pop() : "File"}
                                          </a>
                                          <button
                                            type="button"
                                            onClick={() => removeAttachment(doc.id, r.id)}
                                            className="text-xs font-semibold text-rose-500"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-xs text-slate-500">No attachments uploaded yet.</div>
                                    )}
                                  </div>

                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <Select
                                      value={selectedType}
                                      onChange={(e) => setAttachmentTypeByRequest((prev) => ({ ...prev, [r.id]: e.target.value }))}
                                    >
                                      <option value="tech_pack">Tech pack</option>
                                      <option value="sketch">Sketch</option>
                                      <option value="reference_image">Reference image</option>
                                      <option value="compliance">Compliance</option>
                                      <option value="other">Other</option>
                                    </Select>
                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white">
                                      {uploadingAttachmentId === r.id ? <NeonAtom size={20} /> : "Upload file"}
                                      <input
                                        type="file"
                                        className="hidden"
                                        onChange={(event) => {
                                          const file = event.target.files?.[0];
                                          if (file) uploadAttachment(r.id, file, selectedType);
                                          event.target.value = "";
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 lg:col-span-5">
                <div className={`rounded-[28px] border p-5 ${panel}`}>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Browse Requests (Summary Only)</h3>
                      <p className={`text-sm ${soft}`}>You can research market demand, but full details remain private.</p>
                    </div>
                    <button
                      type="button"
                      onClick={loadBrowse}
                      className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-white/5"
                    >
                      <RefreshCw className="h-4 w-4" /> {loadingBrowse ? <NeonAtom size={20} /> : "Refresh"}
                    </button>
                  </div>

                  {!browse.length ? (
                    <div className={`text-sm ${soft}`}>No requests to browse yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {browse
                        .filter((r) => r.buyer_id !== user?.id)
                        .slice(0, 12)
                        .map((r) => (
                          <div key={r.id} className={`rounded-[22px] border p-4 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-medium">{r.title || r.category || "Buyer Request"}</div>
                              <Pill className={`bg-white/5 ${dark ? "text-slate-300" : "text-slate-600"}`}>{String(r.buyer_id || "").slice(0, 8)}</Pill>
                            </div>
                            <div className={`mt-2 text-sm ${soft}`}>
                              Qty {r.quantity || "--"} - {r.material || "--"} - Target {r.target_market || "--"} - Delivery {r.delivery_timeline || "--"}
                            </div>
                            <Link
                              to={`/buyer/${encodeURIComponent(r.buyer_id)}`}
                              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-400 hover:text-sky-300"
                            >
                              View Buyer Profile <ChevronRight className="h-4 w-4" />
                            </Link>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
