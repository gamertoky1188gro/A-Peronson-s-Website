import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	AlertTriangle,
	ArrowLeft,
	Briefcase,
	CheckCircle2,
	FileText,
	Handshake,
	MessageSquare,
	XCircle,
} from "lucide-react";
import NeonAtom from "../components/ui/NeonAtom.jsx";
import { apiRequest, getCurrentUser } from "../lib/auth.js";

const STEPS = ["request", "review", "documents", "confirmation"];
const STEP_LABELS = ["Request", "Review", "Documents", "Confirmation"];

const STATUS_COLORS = {
	pending: "text-amber-400 bg-amber-900/30 border-amber-700/50",
	accepted: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50",
	rejected: "text-red-400 bg-red-900/30 border-red-700/50",
	completed: "text-cyan-400 bg-cyan-900/30 border-cyan-700/50",
};

export default function BusinessRelationship() {
	const { id } = useParams();
	const navigate = useNavigate();
	const currentUser = getCurrentUser();

	const [relationship, setRelationship] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [step, setStep] = useState(0);
	const [message, setMessage] = useState("");
	const [rejectionReason, setRejectionReason] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [documents, setDocuments] = useState([]);
	const [docTitle, setDocTitle] = useState("");
	const [docVisibility, setDocVisibility] = useState("partners_only");

	const fetchRelationship = useCallback(async () => {
		if (!id) return;
		setLoading(true);
		try {
			const res = await apiRequest(`/api/relationships/${id}`);
			if (res?.ok !== false && res?.data) {
				setRelationship(res.data);
				const statusIdx = STEPS.indexOf(
					res.data.status === "completed" ? "confirmation" : res.data.status === "accepted" ? "documents" : res.data.status
				);
				setStep(Math.max(0, statusIdx));
			} else {
				setError("Relationship not found");
			}
		} catch (err) {
			setError(err?.message || "Failed to load relationship");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchRelationship();
	}, [fetchRelationship]);

	const handleRequest = async () => {
		if (!currentUser || submitting) return;
		setSubmitting(true);
		try {
			const res = await apiRequest("/api/relationships", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					counterparty_id: id,
					message: message || undefined,
				}),
			});
			if (res?.data) {
				setRelationship(res.data);
				setStep(1);
				setMessage("");
			}
		} catch (err) {
			setError(err?.message || "Failed to send request");
		} finally {
			setSubmitting(false);
		}
	};

	const handleAccept = async () => {
		if (!relationship || submitting) return;
		setSubmitting(true);
		try {
			const res = await apiRequest(`/api/relationships/${relationship.id}/accept`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			if (res?.data) {
				setRelationship(res.data);
				setStep(2);
			}
		} catch (err) {
			setError(err?.message || "Failed to accept");
		} finally {
			setSubmitting(false);
		}
	};

	const handleReject = async () => {
		if (!relationship || submitting) return;
		setSubmitting(true);
		try {
			const res = await apiRequest(`/api/relationships/${relationship.id}/reject`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ reason: rejectionReason || undefined }),
			});
			if (res?.data) {
				setRelationship(res.data);
				setError(null);
			}
		} catch (err) {
			setError(err?.message || "Failed to reject");
		} finally {
			setSubmitting(false);
		}
	};

	const handleAddDocument = async () => {
		if (!docTitle.trim() || !relationship) return;
		setSubmitting(true);
		try {
			const res = await apiRequest(`/api/relationships/${relationship.id}/documents`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: docTitle, visibility: docVisibility }),
			});
			if (res?.data) {
				setDocuments((prev) => [...prev, res.data]);
				setDocTitle("");
			}
		} catch (err) {
			setError(err?.message || "Failed to add document");
		} finally {
			setSubmitting(false);
		}
	};

	const handleConfirm = async () => {
		if (!relationship || submitting) return;
		setSubmitting(true);
		try {
			const res = await apiRequest(`/api/relationships/${relationship.id}/confirm`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			if (res?.data) {
				setRelationship(res.data);
				setStep(3);
			}
		} catch (err) {
			setError(err?.message || "Failed to confirm");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0b1220]">
				<NeonAtom size={48} />
			</div>
		);
	}

	if (error && !relationship) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#0b1220] p-8 text-center">
				<AlertTriangle className="mb-4 h-12 w-12 text-amber-400" />
				<h2 className="text-xl font-bold text-slate-900 dark:text-white">Error</h2>
				<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p>
				<button onClick={() => navigate(-1)} className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700">
					Go Back
				</button>
			</div>
		);
	}

	const isCounterparty = currentUser?.id === relationship?.counterparty_id;
	const isRequester = currentUser?.id === relationship?.buyer_id;
	const status = relationship?.status || "pending";

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-[#0b1220]">
			<div className="mx-auto max-w-3xl px-4 py-8">
				<button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
					<ArrowLeft className="h-4 w-4" /> Back
				</button>

				<div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/30">
							<Handshake className="h-6 w-6 text-sky-600 dark:text-sky-400" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-slate-900 dark:text-white">Business Relationship</h1>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Status: <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status] || STATUS_COLORS.pending}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
							</p>
						</div>
					</div>
				</div>

				{error && (
					<div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
						{error}
					</div>
				)}

				<div className="mb-8 flex items-center gap-1">
					{STEP_LABELS.map((label, i) => (
						<div key={label} className="flex items-center">
							<div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= step ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
								{i + 1}
							</div>
							<span className={`ml-1 text-xs font-medium ${i <= step ? "text-sky-600 dark:text-sky-400" : "text-slate-400 dark:text-slate-500"}`}>{label}</span>
							{i < STEP_LABELS.length - 1 && <div className={`mx-2 h-px w-6 ${i < step ? "bg-sky-600" : "bg-slate-300 dark:bg-slate-700"}`} />}
						</div>
					))}
				</div>

				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
					{step === 0 && (
						<div>
							<h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Request Business Relationship</h2>
							<p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Send a request to establish a business relationship. Optionally include a message.</p>
							<textarea
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Optional message to the counterparty..."
								className="mb-4 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
								rows={3}
							/>
							<button
								onClick={handleRequest}
								disabled={submitting}
								className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
							>
								<Handshake className="h-4 w-4" /> {submitting ? "Sending..." : "Send Request"}
							</button>
						</div>
					)}

					{step === 1 && (
						<div>
							<h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Review Request</h2>
							<p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
								{isCounterparty ? "You have a pending business relationship request." : "Waiting for the counterparty to respond..."}
							</p>
							{isCounterparty && status === "pending" && (
								<div className="flex gap-3">
									<button onClick={handleAccept} disabled={submitting} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
										<CheckCircle2 className="h-4 w-4" /> Accept
									</button>
									<button onClick={() => setStep(1.5)} className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30">
										<XCircle className="h-4 w-4" /> Reject
									</button>
								</div>
							)}
							{step === 1.5 && (
								<div className="mt-4">
									<textarea
										value={rejectionReason}
										onChange={(e) => setRejectionReason(e.target.value)}
										placeholder="Reason for rejection (optional)..."
										className="mb-3 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
										rows={2}
									/>
									<div className="flex gap-2">
										<button onClick={handleReject} disabled={submitting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
											Confirm Reject
										</button>
										<button onClick={() => setStep(1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400">
											Cancel
										</button>
									</div>
								</div>
							)}
							{status === "rejected" && (
								<div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
									Request was rejected{relationship?.rejection_reason ? `: ${relationship.rejection_reason}` : ""}.
								</div>
							)}
						</div>
					)}

					{step === 2 && (
						<div>
							<h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Document Sharing</h2>
							<p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Share documents with controlled visibility for this relationship.</p>
							<div className="mb-4 space-y-2">
								<input
									value={docTitle}
									onChange={(e) => setDocTitle(e.target.value)}
									placeholder="Document title..."
									className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
								/>
								<select
									value={docVisibility}
									onChange={(e) => setDocVisibility(e.target.value)}
									className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
								>
									<option value="partners_only">Partners Only</option>
									<option value="internal">Internal Only</option>
									<option value="public">Public</option>
								</select>
								<button onClick={handleAddDocument} disabled={submitting || !docTitle.trim()} className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50">
									<FileText className="h-4 w-4" /> Add Document
								</button>
							</div>
							{documents.length > 0 && (
								<div className="space-y-2">
									{documents.map((doc, i) => (
										<div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
											<div className="flex items-center gap-2">
												<FileText className="h-4 w-4 text-slate-400" />
												<span className="text-sm text-slate-700 dark:text-slate-300">{doc.title}</span>
											</div>
											<span className="text-xs text-slate-400">{doc.visibility}</span>
										</div>
									))}
								</div>
							)}
							<button onClick={handleConfirm} disabled={submitting} className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
								<CheckCircle2 className="h-4 w-4" /> Confirm & Complete
							</button>
						</div>
					)}

					{step === 3 && (
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
								<CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
							</div>
							<h2 className="text-lg font-bold text-slate-900 dark:text-white">Relationship Confirmed</h2>
							<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">The business relationship has been established. You can now share documents and collaborate.</p>
							<div className="mt-4 flex justify-center gap-3">
								<button onClick={() => navigate("/chat")} className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
									<MessageSquare className="h-4 w-4" /> Message
								</button>
								<button onClick={() => navigate(-1)} className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400">
									<ArrowLeft className="h-4 w-4" /> Go Back
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
