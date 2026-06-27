import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Home,
  FileText,
  History,
  GraduationCap,
  UserCog,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { MobileNav } from "./MobileNav";
import { FloatingActionButton } from "./FloatingActionButton";
import { NotificationBell } from "../ui/NotificationBell";

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "Beranda" },
    { path: "/create-report", icon: FileText, label: "Buat Laporan" },
    { path: "/history", icon: History, label: "Riwayat Laporan" },
    { path: "/grades", icon: GraduationCap, label: "Rekap Nilai" },
    { path: "/principal", icon: UserCog, label: "Tampilan Kepala Sekolah" },
    { path: "/settings", icon: Settings, label: "Pengaturan" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative w-64 bg-sidebar transition-transform duration-300 flex-shrink-0 z-50 h-full`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-sidebar-foreground">EduReport</h1>
                <p className="text-xs text-sidebar-foreground/70">Portal Guru</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sidebar-accent rounded-full flex items-center justify-center">
                <span className="text-sidebar-foreground">JD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-sidebar-foreground">Jane Doe</p>
                <p className="text-xs text-sidebar-foreground/70">Guru Matematika</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
            <div>
              <h2 className="text-foreground">
                {navItems.find((item) => item.path === location.pathname)?.label || "Beranda"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
