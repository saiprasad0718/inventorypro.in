import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, Link } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, ArrowRightLeft, ChefHat, BookOpen,
  ListOrdered, Trash2, Scale, AlertTriangle, BarChart3, Settings as SettingsIcon,
  LogOut, Flame, Loader2, Inbox, PlayCircle, Store, Building2,
} from "lucide-react";
import api from "./api";
import { useAuth } from "./AuthContext";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Purchase from "./pages/Purchase";
import Issue from "./pages/Issue";
import Production from "./pages/Production";
import Recipes from "./pages/Recipes";
import Consumption from "./pages/Consumption";
import Wastage from "./pages/Wastage";
import Reconciliation from "./pages/Reconciliation";
import Variance from "./pages/Variance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Enquiries from "./pages/Enquiries";
import Compare from "./pages/Compare";
import DemoTour from "./DemoTour";

const MGR = ["owner", "manager"];
const ALL = ["owner", "manager", "chef"];

const NAV = [
  { to: "/app", end: true, label: "Dashboard", icon: LayoutDashboard, roles: ALL, el: <Dashboard /> },
  { to: "/app/inventory", label: "Inventory", icon: Package, roles: MGR, el: <Inventory /> },
  { to: "/app/purchase", label: "Purchase", icon: ShoppingCart, roles: MGR, el: <Purchase /> },
  { to: "/app/issue", label: "Store Issue", icon: ArrowRightLeft, roles: MGR, el: <Issue /> },
  { to: "/app/production", label: "Production", icon: ChefHat, roles: ALL, el: <Production /> },
  { to: "/app/recipes", label: "Recipes / BOM", icon: BookOpen, roles: MGR, el: <Recipes /> },
  { to: "/app/consumption", label: "Consumption", icon: ListOrdered, roles: ALL, el: <Consumption /> },
  { to: "/app/wastage", label: "Wastage", icon: Trash2, roles: ALL, el: <Wastage /> },
  { to: "/app/reconciliation", label: "Reconciliation", icon: Scale, roles: ALL, el: <Reconciliation /> },
  { to: "/app/variance", label: "Variance", icon: AlertTriangle, roles: MGR, el: <Variance /> },
  { to: "/app/reports", label: "Reports", icon: BarChart3, roles: MGR, el: <Reports /> },
  { to: "/app/compare", label: "Compare", icon: Building2, roles: ["owner"], el: <Compare /> },
  { to: "/app/enquiries", label: "Enquiries", icon: Inbox, roles: ["owner"], el: <Enquiries /> },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon, roles: ["owner"], el: <Settings /> },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const [outlets, setOutlets] = useState([]);
  const [outlet, setOutlet] = useState(() => localStorage.getItem("ip_outlet") || "Main Branch");
  useEffect(() => {
    api.get("/outlets").then((r) => {
      setOutlets(r.data);
      const saved = localStorage.getItem("ip_outlet") || "Main Branch";
      if (r.data.length && !r.data.some((o) => o.name === saved)) {
        localStorage.setItem("ip_outlet", "Main Branch");
        setOutlet("Main Branch");
      }
    }).catch(() => {});
  }, []);
  const switchOutlet = (e) => {
    localStorage.setItem("ip_outlet", e.target.value);
    window.location.reload();
  };
  if (user === null) {
    return (
      <div className="grid min-h-screen place-items-center bg-brand-obsidian" data-testid="app-loading">
        <Loader2 className="size-8 animate-spin text-brand-terra" />
      </div>
    );
  }
  if (user === false) return <Navigate to="/login" replace />;
  const allowed = NAV.filter((n) => n.roles.includes(user.role));
  const navKey = (n) => n.label.toLowerCase().replace(/[^a-z]+/g, "-");

  return (
    <div className="min-h-screen bg-brand-obsidian text-foreground" data-testid="app-shell">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/8 bg-[#0B0D13] p-4 md:flex">
        <Link to="/" className="flex items-center gap-2 px-2 py-3" data-testid="app-brand-link">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-terra/15 text-brand-terra">
            <Flame className="size-4" />
          </span>
          <span className="font-display text-base font-bold">InventoryPro<span className="text-brand-terra">.in</span></span>
        </Link>
        {["owner", "manager"].includes(user.role) && outlets.length > 0 && (
          <div className="mt-3 px-1">
            <p className="mb-1.5 px-2 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Outlet</p>
            <div className="relative">
              <Store className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-brand-gold" />
              <select
                value={outlet}
                onChange={switchOutlet}
                data-testid="outlet-switcher"
                className="w-full appearance-none rounded-xl border border-white/10 bg-black/30 py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-brand-gold/60"
              >
                {outlets.map((o) => (
                  <option key={o.id || o.name} value={o.name} className="bg-brand-slate">{o.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto">
          {allowed.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              data-testid={`app-nav-${navKey(n)}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200 ${
                  isActive ? "bg-brand-terra/15 text-brand-terra" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`
              }
            >
              <n.icon className="size-4" /> {n.label}
            </NavLink>
          ))}
        </nav>
        {["owner", "manager"].includes(user.role) && (
          <button
            onClick={() => window.dispatchEvent(new Event("ip:start-tour"))}
            data-testid="demo-tour-start-button"
            className="mb-3 flex w-full items-center gap-2 rounded-xl bg-brand-terra/15 px-3 py-2.5 text-sm font-semibold text-brand-terra transition-colors duration-300 hover:bg-brand-terra hover:text-white"
          >
            <PlayCircle className="size-4" /> Guided Client Demo
          </button>
        )}
        <div className="border-t border-white/8 pt-4">
          <p className="px-2 text-sm font-semibold" data-testid="app-user-name">{user.name}</p>
          <p className="px-2 font-mono text-[10px] uppercase tracking-widest text-brand-gold" data-testid="app-user-role">{user.role}</p>
          <button
            onClick={logout}
            data-testid="app-logout-button"
            className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="sticky top-0 z-40 flex items-center gap-2 overflow-x-auto border-b border-white/8 bg-brand-obsidian/90 px-4 py-3 backdrop-blur-xl md:hidden">
        {allowed.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            data-testid={`app-nav-mobile-${navKey(n)}`}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs ${isActive ? "bg-brand-terra text-white" : "border border-white/10 text-muted-foreground"}`
            }
          >
            {n.label}
          </NavLink>
        ))}
        <button onClick={logout} data-testid="app-logout-mobile" className="ml-auto whitespace-nowrap rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-muted-foreground">
          Logout
        </button>
      </div>

      <main className="px-5 py-8 md:ml-60 md:px-10">
        <Routes>
          {NAV.map((n) => (
            <Route
              key={n.to}
              path={n.to === "/app" ? "/" : n.to.replace("/app/", "")}
              element={n.roles.includes(user.role) ? n.el : <Navigate to="/app" replace />}
            />
          ))}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </main>
      <DemoTour />
    </div>
  );
}
