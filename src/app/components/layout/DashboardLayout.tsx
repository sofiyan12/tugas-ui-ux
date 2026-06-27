import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  FilePlus,
  History,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { MobileNav } from "./MobileNav";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; department: string; role: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // Tutup sidebar otomatis kalau pindah halaman
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Tutup sidebar kalau tekan Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Cegah scroll body saat sidebar mobile terbuka
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  const getDepartmentName = (dept: string, role?: string) => {
    if (role === "principal") return "Kepala Sekolah";
    const maps: Record<string, string> = {
      mathematics: "Guru Matematika",
      science: "Guru Sains",
      english: "Guru Bahasa Inggris",
      history: "Guru Sejarah",
      arts: "Guru Seni",
      "physical-education": "Guru Penjas",
      other: "Guru",
    };
    return maps[dept] || "Guru Pengajar";
  };

  const navLinks = [
    ...(user?.role === "principal"
      ? [{ to: "/principal", icon: LayoutDashboard, label: "Dasbor Kepala Sekolah" }]
      : [
          { to: "/", icon: LayoutDashboard, label: "Beranda" },
          { to: "/create-report", icon: FilePlus, label: "Buat Laporan" },
          { to: "/history", icon: History, label: "Riwayat Laporan" },
        ]),
    { to: "/settings", icon: Settings, label: "Pengaturan" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-4 border-b border-blue-800 mb-6">
        <GraduationCap className="w-8 h-8 text-blue-300 shrink-0" />
        <div>
          <h2 className="text-lg font-bold leading-none">Edu Report</h2>
          <span className="text-xs text-blue-300">Portal Guru</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="space-y-1 flex-1">
        {navLinks.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-800 text-white"
                  : "text-blue-200 hover:bg-blue-800/50 active:bg-blue-800/70"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile + Logout */}
      <div className="border-t border-blue-800 pt-4 space-y-3 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center font-bold text-blue-100 uppercase shrink-0">
            {user.name.substring(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-blue-300 truncate">
              {getDepartmentName(user.department, user.role)}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">

      {/* ── DESKTOP SIDEBAR (hidden on mobile) ── */}
      <aside className="hidden md:flex w-64 bg-blue-900 text-white flex-col p-4 shrink-0">
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 max-w-[85vw] bg-blue-900 text-white flex flex-col p-4
          transform transition-transform duration-300 ease-in-out md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
        aria-label="Menu navigasi"
      >
        {/* Tombol tutup di sudut kanan atas drawer */}
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup menu"
          className="absolute top-4 right-4 p-2 rounded-lg text-blue-300 hover:bg-blue-800 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-border h-16 flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — hanya muncul di mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
              className="md:hidden p-2 -ml-2 rounded-lg text-foreground hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <h1 className="text-base md:text-lg font-semibold text-foreground">
              {navLinks.find((n) => n.to === location.pathname)?.label ?? "Beranda"}
            </h1>
          </div>

          <div className="text-xs md:text-sm text-muted-foreground font-medium">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </header>

        {/* Page Content */}
        {/* pb-20 beri ruang untuk MobileNav di bawah */}
        <main className="flex-1 overflow-y-auto bg-slate-50 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <MobileNav />
    </div>
  );
}