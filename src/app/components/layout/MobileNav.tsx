import { Link, useLocation } from "react-router";
import { Home, FileText, History, GraduationCap, UserCog } from "lucide-react";

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Beranda" },
    { path: "/create-report", icon: FileText, label: "Buat" },
    { path: "/history", icon: History, label: "Riwayat" },
    { path: "/grades", icon: GraduationCap, label: "Nilai" },
    { path: "/principal", icon: UserCog, label: "Kepsek" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 lg:hidden">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "fill-primary/10" : ""}`} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
