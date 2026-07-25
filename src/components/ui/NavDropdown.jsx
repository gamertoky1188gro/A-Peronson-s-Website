import {
	Bell,
	ChevronDown,
	ChevronRight,
	FileText,
	LayoutDashboard,
	MessageSquare,
	Package,
	Search,
	Settings,
	ShieldCheck,
	Star,
	Users,
	Vote,
} from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ENTER_DELAY, useSmartHover } from "../../hooks/useSmartHover.js";
import { cn } from "../../lib/cn.js";

export function NavDropdown({
	group,
	isOpen,
	onToggle,
	onMouseEnter,
	onMouseLeave,
	userRole,
	badgeCount = 0,
	isTouchDevice,
}) {
	const location = useLocation();
	const IconComponent = group.icon;
	const containerRef = useRef(null);
	const dropdownRef = useRef(null);
	const hover = useSmartHover(containerRef);

	const visibleItems = group.items.filter((item) => !item.roles || item.roles.includes(userRole));

	if (visibleItems.length === 0) {
		return null;
	}

	const handleToggle = (e) => {
		e.stopPropagation();
		onToggle(isOpen ? null : group.label);
	};

	const handleTriggerEnter = () => {
		const rect = dropdownRef.current?.getBoundingClientRect();
		if (isOpen) {
			hover.onImmediateEnter();
			onMouseEnter?.();
		} else {
			hover.onEnter(rect);
			onMouseEnter?.();
			if (!isTouchDevice) {
				const timer = setTimeout(() => {
					if (hover.intent) {
						onToggle(group.label);
					}
				}, ENTER_DELAY);
				return () => clearTimeout(timer);
			}
		}
	};

	const handleTriggerLeave = () => {
		hover.onExit();
		onMouseLeave?.();
	};

	const handleDropdownEnter = () => {
		hover.onImmediateEnter();
		onMouseEnter?.();
	};

	const handleDropdownLeave = () => {
		hover.onExit();
		onMouseLeave?.();
	};

	const show = isTouchDevice ? isOpen : isOpen || hover.intent;

	return (
		<div ref={containerRef} class="relative" onPointerMove={hover.handlePointerMove}>
			<button
				onClick={isTouchDevice ? handleToggle : handleTriggerEnter}
				onMouseEnter={isTouchDevice ? undefined : handleTriggerEnter}
				onMouseLeave={isTouchDevice ? undefined : handleTriggerLeave}
				class={cn(
					"group inline-flex items-center gap-2 rounded-full px-1.5 xl:px-3 py-2 text-[0.65rem] xl:text-sm font-medium whitespace-nowrap transition",
					show
						? "text-sky-700 bg-sky-500/10 ring-1 ring-sky-400/25 dark:text-sky-300"
						: "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
				)}
			>
				<span class="inline-flex items-center gap-2">
					{IconComponent && <IconComponent class="h-4 w-4" />}
					<span class="hidden lg:inline">{group.label}</span>
				</span>
				<ChevronDown class={cn("h-4 w-4 transition-transform", show ? "rotate-180" : "")} />
			</button>

			{show && !isTouchDevice && <div class="absolute left-0 right-0 top-full h-4 z-40" />}

			<div
				ref={dropdownRef}
				onMouseEnter={isTouchDevice ? undefined : handleDropdownEnter}
				onMouseLeave={isTouchDevice ? undefined : handleDropdownLeave}
				class={cn(
					"absolute left-0 top-full z-50 mt-2 min-w-72 overflow-hidden rounded-3xl border border-white/10 bg-white/80 p-2 shadow-[0_25px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:bg-slate-950/85",
					"transition-opacity duration-150",
					isTouchDevice
						? isOpen
							? "block"
							: "hidden"
						: show
							? "block animate-in fade-in"
							: "hidden",
				)}
			>
				<div class="px-3 pb-2 pt-1">
					<div class="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
						<span>{group.label}</span>
						<span class="rounded-full bg-sky-500/10 px-2 py-1 text-sky-700 dark:text-sky-300">
							{visibleItems.length} links
						</span>
					</div>
				</div>
				{group.label === "Communication" && badgeCount > 0 && (
					<div class="mt-2 mx-3 mb-2 rounded-2xl bg-sky-500/10 px-3 py-2 text-xs text-sky-700 dark:text-sky-300">
						{badgeCount} unread notifications
					</div>
				)}
				<div class="space-y-1">
					{visibleItems.map((item) => {
						const isActive =
							location.pathname === item.to ||
							`${location.pathname}?${location.search}` === item.to;
						return (
							<Link
								key={item.to}
								to={item.to}
								onClick={() => onToggle(null)}
								class={cn(
									"group/item flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition",
									isActive
										? "bg-sky-500/10 text-sky-700 ring-1 ring-sky-400/25 dark:text-sky-300"
										: "text-slate-600 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
								)}
							>
								<span class="flex items-center gap-3">
									<span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700 dark:bg-white/5 dark:text-slate-200">
										{item.label === "My Profile" && <Vote class="h-4 w-4" />}
										{item.label === "Feed" && <LayoutDashboard class="h-4 w-4" />}
										{item.label === "Manage Listings" && <Package class="h-4 w-4" />}
										{item.label === "Search" && <Search class="h-4 w-4" />}
										{item.label === "Contracts" && <FileText class="h-4 w-4" />}
										{item.label === "Verification" && <ShieldCheck class="h-4 w-4" />}
										{item.label === "Notifications" && <Bell class="h-4 w-4" />}
										{item.label === "Chat" && <MessageSquare class="h-4 w-4" />}
										{item.label === "Requests" && <FileText class="h-4 w-4" />}
										{item.label === "Products" && <Package class="h-4 w-4" />}
										{item.label === "Partners" && <Users class="h-4 w-4" />}
										{item.label === "Ratings" && <Star class="h-4 w-4" />}
										{item.label === "Members" && <Users class="h-4 w-4" />}
										{item.label === "Settings" && <Settings class="h-4 w-4" />}
										{item.label === "Insights" && <FileText class="h-4 w-4" />}
										{item.label === "Owner Dashboard" && <Star class="h-4 w-4" />}
										{item.label === "Agent Dashboard" && <Star class="h-4 w-4" />}
										{item.label === "Admin Panel" && <ShieldCheck class="h-4 w-4" />}
										{item.label === "Governance" && <Settings class="h-4 w-4" />}
										{item.label === "Support" && <Settings class="h-4 w-4" />}
										{item.label === "Onboarding" && <Star class="h-4 w-4" />}
									</span>
									<span>{item.label}</span>
								</span>
								<ChevronRight class="h-4 w-4 opacity-40 transition group-hover/item:translate-x-0.5 group-hover/item:opacity-80" />
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
