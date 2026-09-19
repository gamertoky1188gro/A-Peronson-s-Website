import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	Clock,
	Edit3,
	Eye,
	FolderOpen,
	Plus,
	Search,
	Send,
	ShoppingBag,
	XCircle,
} from "lucide-react";
import NeonAtom from "../components/ui/NeonAtom.jsx";
import { apiRequest, getCurrentUser } from "../lib/auth.js";

const ORDER_TYPES = { SAMPLE: "SAMPLE", MAIN: "MAIN" };

const STATUS_FLOW_SAMPLE = {
	requested: { label: "Requested", color: "text-amber-400 bg-amber-900/30 border-amber-700/50", icon: Clock },
	sent: { label: "Sent", color: "text-blue-400 bg-blue-900/30 border-blue-700/50", icon: Send },
	approved: { label: "Approved", color: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50", icon: CheckCircle2 },
	rejected: { label: "Rejected", color: "text-red-400 bg-red-900/30 border-red-700/50", icon: XCircle },
};

const STATUS_FLOW_MAIN = {
	draft: { label: "Draft", color: "text-slate-400 bg-slate-900/30 border-slate-700/50", icon: Edit3 },
	pending: { label: "Pending", color: "text-amber-400 bg-amber-900/30 border-amber-700/50", icon: Clock },
	confirmed: { label: "Confirmed", color: "text-blue-400 bg-blue-900/30 border-blue-700/50", icon: CheckCircle2 },
	processing: { label: "Processing", color: "text-purple-400 bg-purple-900/30 border-purple-700/50", icon: Clock },
	shipped: { label: "Shipped", color: "text-cyan-400 bg-cyan-900/30 border-cyan-700/50", icon: Send },
	delivered: { label: "Delivered", color: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50", icon: CheckCircle2 },
};

function StatusBadge({ status, type }) {
	const flow = type === "SAMPLE" ? STATUS_FLOW_SAMPLE : STATUS_FLOW_MAIN;
	const info = flow[status] || { label: status, color: "text-slate-400 bg-slate-900/30 border-slate-700/50" };
	const Icon = info.icon;
	return (
		<span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${info.color}`}>
			<Icon className="h-3 w-3" />
			{info.label}
		</span>
	);
}

function OrderCard({ order, onView, onConvert }) {
	const isSample = order.order_type === "SAMPLE";
	const canConvert = isSample && order.status === "approved";

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
			<div className="mb-3 flex items-start justify-between">
				<div>
					<div className="flex items-center gap-2">
						<span className={`rounded-md px-2 py-0.5 text-xs font-bold ${isSample ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"}`}>
							{order.order_type}
						</span>
						<h3 className="text-sm font-semibold text-slate-900 dark:text-white">{order.product_title || "Untitled Order"}</h3>
					</div>
					<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
						ID: {order.id?.slice(0, 8)}... | Qty: {order.quantity || "—"}
					</p>
				</div>
				<StatusBadge status={order.status} type={order.order_type} />
			</div>
			<div className="mb-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
				{order.unit_price != null && <span>Unit: ${order.unit_price}</span>}
				{order.total_amount != null && <span>Total: ${order.total_amount}</span>}
				{order.delivery_date && <span>Due: {new Date(order.delivery_date).toLocaleDateString()}</span>}
			</div>
			<div className="flex gap-2">
				<button onClick={() => onView(order)} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900">
					<Eye className="h-3 w-3" /> View
				</button>
				{canConvert && (
					<button onClick={() => onConvert(order)} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
						<ArrowRight className="h-3 w-3" /> Convert to Main Order
					</button>
				)}
			</div>
		</div>
	);
}

function CreateOrderModal({ onClose, onSubmit, convertingFrom }) {
	const [form, setForm] = useState({
		product_title: convertingFrom?.product_title || "",
		quantity: convertingFrom?.quantity || "",
		unit_price: convertingFrom?.unit_price || "",
		description: convertingFrom?.description || "",
		delivery_date: "",
		shipping_terms: "",
		payment_terms: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({
			...form,
			order_type: convertingFrom ? "MAIN" : "SAMPLE",
			sample_request_id: convertingFrom?.id || undefined,
			parent_order_id: convertingFrom?.id || undefined,
			total_amount: form.unit_price && form.quantity ? Number(form.unit_price) * Number(form.quantity) : undefined,
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
				<h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
					{convertingFrom ? "Convert Sample to Main Order" : "Create Sample Order"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-3">
					<input
						value={form.product_title}
						onChange={(e) => setForm({ ...form, product_title: e.target.value })}
						placeholder="Product title"
						required
						className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					/>
					<div className="grid grid-cols-2 gap-3">
						<input
							value={form.quantity}
							onChange={(e) => setForm({ ...form, quantity: e.target.value })}
							placeholder="Quantity"
							className="rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
						/>
						<input
							type="number"
							value={form.unit_price}
							onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
							placeholder="Unit price (USD)"
							className="rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
						/>
					</div>
					<textarea
						value={form.description}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
						placeholder="Description / specs..."
						rows={2}
						className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					/>
					<div className="grid grid-cols-2 gap-3">
						<input
							type="date"
							value={form.delivery_date}
							onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
							className="rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
						/>
						<input
							value={form.shipping_terms}
							onChange={(e) => setForm({ ...form, shipping_terms: e.target.value })}
							placeholder="Shipping terms"
							className="rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
						/>
					</div>
					<input
						value={form.payment_terms}
						onChange={(e) => setForm({ ...form, payment_terms: e.target.value })}
						placeholder="Payment terms"
						className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					/>
					<div className="flex justify-end gap-2 pt-2">
						<button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400">
							Cancel
						</button>
						<button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
							{convertingFrom ? "Create Main Order" : "Create Sample Order"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function OrderManagement() {
	const navigate = useNavigate();
	const currentUser = getCurrentUser();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filter, setFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [showCreate, setShowCreate] = useState(false);
	const [converting, setConverting] = useState(null);
	const [selectedOrder, setSelectedOrder] = useState(null);

	const fetchOrders = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams();
			if (typeFilter !== "all") params.set("order_type", typeFilter);
			if (filter !== "all") params.set("status", filter);
			const res = await apiRequest(`/api/orders?${params.toString()}`);
			setOrders(res?.data || []);
		} catch (err) {
			setError(err?.message || "Failed to load orders");
		} finally {
			setLoading(false);
		}
	}, [typeFilter, filter]);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const handleCreate = async (data) => {
		try {
			const res = await apiRequest("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (res?.data) {
				setOrders((prev) => [res.data, ...prev]);
				setShowCreate(false);
				setConverting(null);
			}
		} catch (err) {
			setError(err?.message || "Failed to create order");
		}
	};

	const handleConvert = (sampleOrder) => {
		setConverting(sampleOrder);
		setShowCreate(true);
	};

	const filteredOrders = orders.filter((o) => {
		if (search && !o.product_title?.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	});

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-[#0b1220]">
			<div className="mx-auto max-w-5xl px-4 py-8">
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/30">
							<ShoppingBag className="h-5 w-5 text-sky-600 dark:text-sky-400" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-slate-900 dark:text-white">Orders</h1>
							<p className="text-sm text-slate-500 dark:text-slate-400">Manage sample and main orders</p>
						</div>
					</div>
					<button
						onClick={() => { setConverting(null); setShowCreate(true); }}
						className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
					>
						<Plus className="h-4 w-4" /> New Order
					</button>
				</div>

				{error && (
					<div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
						{error}
					</div>
				)}

				<div className="mb-4 flex flex-wrap items-center gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search orders..."
							className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
						/>
					</div>
					<div className="flex gap-1">
						{["all", "SAMPLE", "MAIN"].map((t) => (
							<button
								key={t}
								onClick={() => setTypeFilter(t)}
								className={`rounded-lg px-3 py-1.5 text-xs font-medium ${typeFilter === t ? "bg-sky-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"}`}
							>
								{t === "all" ? "All" : t}
							</button>
						))}
					</div>
					<div className="flex gap-1">
						{["all", "requested", "sent", "approved", "rejected", "draft", "pending", "confirmed", "processing", "shipped", "delivered"].map((s) => (
							<button
								key={s}
								onClick={() => setFilter(s)}
								className={`rounded-lg px-2 py-1 text-[10px] font-medium ${filter === s ? "bg-slate-700 text-white dark:bg-slate-600" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"}`}
							>
								{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
							</button>
						))}
					</div>
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-20">
						<NeonAtom size={36} />
					</div>
				) : filteredOrders.length === 0 ? (
					<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-16 dark:border-slate-700">
						<FolderOpen className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
						<p className="text-sm text-slate-500 dark:text-slate-400">No orders found</p>
					</div>
				) : (
					<div className="grid gap-3 sm:grid-cols-2">
						{filteredOrders.map((order) => (
							<OrderCard
								key={order.id}
								order={order}
								onView={setSelectedOrder}
								onConvert={handleConvert}
							/>
						))}
					</div>
				)}

				{selectedOrder && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
						<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
							<div className="mb-4 flex items-center justify-between">
								<h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedOrder.product_title || "Order Details"}</h2>
								<button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
									<XCircle className="h-5 w-5" />
								</button>
							</div>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-medium text-slate-900 dark:text-white">{selectedOrder.order_type}</span></div>
								<div className="flex justify-between"><span className="text-slate-500">Status</span><StatusBadge status={selectedOrder.status} type={selectedOrder.order_type} /></div>
								{selectedOrder.quantity && <div className="flex justify-between"><span className="text-slate-500">Quantity</span><span className="font-medium text-slate-900 dark:text-white">{selectedOrder.quantity}</span></div>}
								{selectedOrder.unit_price != null && <div className="flex justify-between"><span className="text-slate-500">Unit Price</span><span className="font-medium text-slate-900 dark:text-white">${selectedOrder.unit_price}</span></div>}
								{selectedOrder.total_amount != null && <div className="flex justify-between"><span className="text-slate-500">Total</span><span className="font-medium text-slate-900 dark:text-white">${selectedOrder.total_amount}</span></div>}
								{selectedOrder.delivery_date && <div className="flex justify-between"><span className="text-slate-500">Delivery</span><span className="font-medium text-slate-900 dark:text-white">{new Date(selectedOrder.delivery_date).toLocaleDateString()}</span></div>}
								{selectedOrder.description && <div className="pt-2 text-slate-600 dark:text-slate-400">{selectedOrder.description}</div>}
							</div>
							<div className="mt-4 flex justify-end gap-2">
								{selectedOrder.order_type === "SAMPLE" && selectedOrder.status === "approved" && (
									<button onClick={() => { setSelectedOrder(null); handleConvert(selectedOrder); }} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
										<ArrowRight className="h-3 w-3" /> Convert to Main
									</button>
								)}
								<button onClick={() => setSelectedOrder(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400">
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				{showCreate && (
					<CreateOrderModal
						convertingFrom={converting}
						onClose={() => { setShowCreate(false); setConverting(null); }}
						onSubmit={handleCreate}
					/>
				)}
			</div>
		</div>
	);
}
