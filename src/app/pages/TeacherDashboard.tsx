import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  BookOpen,
  AlertCircle,
  Plus,
} from "lucide-react";
import { getReportsByUser, API_BASE_URL } from "../../lib/api";

interface Report {
  id: string;
  subject: string;
  className: string;
  date: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  school?: string;
}

export function TeacherDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);
    setUser(parsedUser);

    // Ambil laporan milik user yang login saja
    const fetchReports = async () => {
      try {
        const data = await getReportsByUser(parsedUser.id);
        setReports(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gagal sinkronisasi data laporan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [navigate]);

  // Kalkulasi KPI dari data milik user yang login
  const totalReports = reports.length;
  const pendingReports = reports.filter(
    (r) => r.status === "Menunggu Tinjauan" || r.status === "Menunggu Review"
  ).length;
  const draftReports = reports.filter((r) => r.status === "Draf").length;
  const completedReports = reports.filter((r) => r.status === "Selesai").length;
  const completionRate =
    totalReports > 0
      ? Math.round((completedReports / totalReports) * 100)
      : 0;

  const kpiData = [
    {
      label: "Total Laporan Saya",
      value: totalReports.toString(),
      change: "Semua laporan Anda",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      label: "Menunggu Review",
      value: pendingReports.toString(),
      change: pendingReports > 0 ? "Butuh tindakan" : "Semua sudah direview",
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      label: "Draf Tersimpan",
      value: draftReports.toString(),
      change: "Belum dikirim",
      icon: AlertCircle,
      color: "bg-yellow-500",
    },
    {
      label: "Tingkat Selesai",
      value: `${completionRate}%`,
      change: `${completedReports} dari ${totalReports} laporan`,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Memuat data Anda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1">
            <h1 className="mb-1 text-xl md:text-2xl font-bold">
              Selamat datang, {user.name}! 👋
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              {user.school ? `${user.school} • ` : ""}
              {pendingReports > 0
                ? `${pendingReports} laporan menunggu review`
                : "Semua laporan sudah direview 🎉"}
            </p>
          </div>
          <Link
            to="/create-report"
            className="bg-white text-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-semibold shrink-0"
          >
            <Plus className="w-4 h-4" />
            Buat Laporan
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="bg-card rounded-lg md:rounded-xl p-3 md:p-5 border border-border shadow-sm"
            >
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div
                  className={`${kpi.color} w-9 h-9 md:w-11 md:h-11 rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              </div>
              <h3 className="text-foreground mb-0.5 text-2xl md:text-3xl font-bold">
                {kpi.value}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground font-medium leading-tight">
                {kpi.label}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1 hidden sm:block">
                {kpi.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="bg-card rounded-lg md:rounded-xl border border-border shadow-sm">
        <div className="p-4 md:p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-foreground font-semibold text-sm md:text-base">
            Laporan Terbaru Saya
          </h3>
          <Link
            to="/history"
            className="text-xs text-primary hover:underline font-medium"
          >
            Lihat semua →
          </Link>
        </div>
        <div className="p-4 md:p-5">
          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground text-sm font-medium">
                  Belum ada laporan
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mulai dengan membuat laporan pertama Anda
                </p>
                <Link
                  to="/create-report"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Buat Laporan
                </Link>
              </div>
            ) : (
              reports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  onClick={() => navigate(`/report/${report.id}`)}
                  className="flex items-center justify-between p-3 md:p-4 bg-muted rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground font-medium truncate">
                        {report.subject}{" "}
                        <span className="text-muted-foreground font-normal">
                          ({report.className})
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.date).toLocaleDateString("id-ID", {
                          dateStyle: "long",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold shrink-0 ml-2 ${report.status === "Selesai"
                      ? "bg-green-100 text-green-700"
                      : report.status === "Draf"
                        ? "bg-gray-100 text-gray-600 border"
                        : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {report.status === "Menunggu Tinjauan" ? "Menunggu Review" : report.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}