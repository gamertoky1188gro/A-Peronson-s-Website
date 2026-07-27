import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChatSidebar({
	themeMode,
	setThemeMode,
	isLight,
	theme,
	location,
	navigate,
	ROUTES,
	CHAT_NAV_ITEMS,
}) {
	return (
		<aside
			className="hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1"
			style={{ background: "transparent", boxShadow: "none" }}
		>
			<div className="space-y-2">
				<button
					className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] shadow-none text-lg transition-colors${
						isLight ? "bg-white text-orange-400 shadow-sm" : "bg-[#171031] text-[#D4FF59]"
					}`}
					onClick={() => setThemeMode((value) => (value === "light" ? "dark" : "light"))}
					title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
				>
					{isLight ? "☀️" : "🌙"}
				</button>
				{CHAT_NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = location.pathname === item.to;
					return (
						<Link
							key={item.to}
							to={item.to}
							className={`relative flex h-10 w-10 items-center justify-center rounded-[12px] transition-all${
								isActive
									? isLight
										? "bg-gtBlue text-white"
										: "bg-[rgba(10,102,194,0.18)] text-[#D4FF59]"
									: isLight
										? "text-slate-400 hover:bg-white hover:text-gtBlue"
										: "bg-[#171031] text-[#8f95bb] hover:text-white"
							}`}
							title={item.label}
						>
							<Icon size={18} strokeWidth={1.5} />
						</Link>
					);
				})}
			</div>
			<button
				className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors"
				style={{
					background: isLight ? "#ffffff" : theme.tileBg,
					color: isLight ? "#ef4444" : "#8f95bb",
				}}
				onClick={() => navigate(ROUTES.LOGIN)}
				title="Logout"
			>
				<LogOut size={18} strokeWidth={1.5} />
			</button>
		</aside>
	);
}
