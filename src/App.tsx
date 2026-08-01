import { useState, useEffect } from "react";
import { Leaf, Store, ShoppingBag, LayoutDashboard, LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { AuthProvider, useAuth } from "./lib/auth";
import { AuthModal } from "./components/AuthModal";
import { LandingPage } from "./components/LandingPage";
import { BrowsePage } from "./components/BrowsePage";
import { BusinessDashboard } from "./components/BusinessDashboard";
import { CustomerOrders } from "./components/CustomerOrders";

type Route = "home" | "browse" | "dashboard" | "orders";

function AppInner() {
  const { user, profile, loading, signOut } = useAuth();
  const [route, setRoute] = useState<Route>("home");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [menuOpen, setMenuOpen] = useState(false);

  // Sync route with hash for simple navigation
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Route;
    if (["home", "browse", "dashboard", "orders"].includes(hash)) setRoute(hash);
    const onHash = () => {
      const h = window.location.hash.replace("#", "") as Route;
      if (["home", "browse", "dashboard", "orders"].includes(h)) setRoute(h);
      else setRoute("home");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (r: Route) => {
    window.location.hash = r;
    setRoute(r);
    setMenuOpen(false);
  };

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const isBusiness = profile?.role === "business";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button onClick={() => navigate("home")} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Leaf size={20} />
            </span>
            <span className="text-lg font-bold text-slate-900">LastChance</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavBtn label="Browse" active={route === "browse"} onClick={() => navigate("browse")} icon={ShoppingBag} />
            {user && isBusiness && (
              <NavBtn label="Dashboard" active={route === "dashboard"} onClick={() => navigate("dashboard")} icon={LayoutDashboard} />
            )}
            {user && !isBusiness && (
              <NavBtn label="My reservations" active={route === "orders"} onClick={() => navigate("orders")} icon={ShoppingBag} />
            )}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {loading ? (
              <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">{profile?.full_name || user.email}</span>
                <button onClick={signOut} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => openAuth("signin")} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                  Sign in
                </button>
                <button onClick={() => openAuth("signup")} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen((o) => !o)} className="rounded-lg p-2 text-slate-600 md:hidden">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <MobileNav label="Browse" onClick={() => navigate("browse")} icon={ShoppingBag} />
            {user && isBusiness && <MobileNav label="Dashboard" onClick={() => navigate("dashboard")} icon={LayoutDashboard} />}
            {user && !isBusiness && <MobileNav label="My reservations" onClick={() => navigate("orders")} icon={ShoppingBag} />}
            <div className="mt-2 border-t border-slate-100 pt-2">
              {user ? (
                <button onClick={() => { signOut(); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { openAuth("signin"); setMenuOpen(false); }} className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600">Sign in</button>
                  <button onClick={() => { openAuth("signup"); setMenuOpen(false); }} className="flex-1 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white">Sign up</button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">
        {route === "home" && (
          <LandingPage
            onBrowse={() => navigate("browse")}
            onSell={() => (user ? navigate("dashboard") : openAuth("signup"))}
          />
        )}
        {route === "browse" && <BrowsePage onOpenAuth={() => openAuth("signin")} />}
        {route === "dashboard" && user && isBusiness && <BusinessDashboard />}
        {route === "orders" && user && !isBusiness && <CustomerOrders />}

        {/* Guard routes for wrong role */}
        {route === "dashboard" && (!user || !isBusiness) && (
          <div className="py-20 text-center">
            <p className="text-slate-500">You need a business account to access the dashboard.</p>
            <button onClick={() => openAuth("signup")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Sign up as business</button>
          </div>
        )}
        {route === "orders" && !user && (
          <div className="py-20 text-center">
            <p className="text-slate-500">Sign in to view your reservations.</p>
            <button onClick={() => openAuth("signin")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Sign in</button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Leaf size={16} className="text-indigo-600" /> LastChance — Saving meals from waste — one rescue at a time.
          </div>
          <p className="text-xs text-slate-400">Built for a more sustainable future.</p>
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultMode={authMode} />
    </div>
  );
}

function NavBtn({
  label, active, onClick, icon: Icon,
}: { label: string; active: boolean; onClick: () => void; icon: LucideIcon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

function MobileNav({
  label, onClick, icon: Icon,
}: { label: string; onClick: () => void; icon: LucideIcon }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
      <Icon size={16} /> {label}
    </button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
