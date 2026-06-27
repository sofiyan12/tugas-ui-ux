import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Filter, Eye, Edit, Calendar, FileText, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getReportsByUser, API_BASE_URL } from "../../lib/api";

interface ReportItem {
  id: string;
  date: string;
  class: string;
  subject: string;
  topic: string;
  status: string;
  attachments: number;
  createdAt: string;
  approvedAt?: string;
}

export function ReportHistoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReports = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const { id: userId } = JSON.parse(storedUser);

    try {
      const data = await getReportsByUser(userId);
      const mapped = data.map((r: any) => {
        let totalAttachments = 0;
        try {
          if (r.attachments) {
            const parsed = JSON.parse(r.attachments);
            totalAttachments = Array.isArray(parsed) ? parsed.length : 0;
          }
        } catch { totalAttachments = 0; }
        return {
          id: r.id,
          date: r.date,
          class: r.className,
          subject: r.subject,
          topic: r.learningTopic,
          status: r.status === "Menunggu Tinjauan" ? "Menunggu Review" : (r.status || "Menunggu Review"),
          attachments: totalAttachments,
          createdAt: r.createdAt,
          approvedAt: r.approvedAt,
        };
      });
      setReports(mapped);

      // Kelas dinamis dari data nyata
      const uniqueClasses = [...new Set(mapped.map((r: ReportItem) => r.class))].filter(Boolean) as string[];
      setAvailableClasses(uniqueClasses.sort());
    } catch {
      toast.error("Gagal menyinkronkan data server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus laporan ini?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Laporan berhasil dihapus");
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Gagal menghapus laporan");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === "all" || report.class === filterClass;
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const statusStyle = (status: string) => {
    if (status === "Selesai") return "bg-green-100 text-green-700";
    if (status === "Draf") return "bg-gray-100 text-gray-600 border";
    return "bg-orange-100 text-orange-700";
  };

  const activeFilterCount = (filterClass !== "all" ? 1 : 0) + (filterStatus !== "all" ? 1 : 0);

  return (
    <div className="space-y-4 p-4 md:p-6 max-w-7xl mx-auto">

      {/* ── HEADER ── */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Riwayat Laporan Saya</h1>
        <p className="text-muted-foreground text-sm">
          {isLoading ? "Memuat..." : `${reports.length} laporan ditemukan`}
        </p>
      </div>

      {/* ── SEARCH + FILTER ── */}
      <div className="bg-card rounded-xl p-3 md:p-4 border border-border shadow-sm space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi, kelas, atau mata pelajaran..."
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors
              ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border"}`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="pt-3 border-t border-border grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Kelas</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                <option value="all">Semua Kelas</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="Draf">Draf</option>
                <option value="Menunggu Review">Menunggu Review</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setFilterClass("all"); setFilterStatus("all"); }}
                className="col-span-2 flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium py-1"
              >
                <X className="w-3 h-3" /> Reset filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── LOADING ── */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-3" />
              <div className="h-3 bg-muted rounded w-2/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* ── EMPTY ── */}
      {!isLoading && filteredReports.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-foreground">Tidak ada laporan ditemukan</p>
          <p className="text-xs text-muted-foreground mt-1">
            {reports.length === 0 ? "Anda belum membuat laporan apapun" : "Coba ubah kata kunci atau filter"}
          </p>
        </div>
      )}

      {/* ── MOBILE: CARD LIST ── */}
      {!isLoading && filteredReports.length > 0 && (
        <div className="md:hidden space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-card rounded-xl border border-border p-4 shadow-sm"
            >
              {/* Baris atas: tanggal + status */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(report.date).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle(report.status)}`}>
                  {report.status}
                </span>
              </div>

              <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{report.topic}</p>

              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {report.class}
                </span>
                <span className="text-xs text-muted-foreground">{report.subject}</span>
              </div>

              {/* Jejak Waktu Audit */}
              <div className="mt-2.5 pt-2 border-t border-border/40 text-[10px] text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                <span>Dibuat: {new Date(report.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
                {report.approvedAt && report.status === "Selesai" && (
                  <span className="text-green-600 font-medium">Disetujui: {new Date(report.approvedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="w-3.5 h-3.5" />
                  {report.attachments} lampiran
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/report/${report.id}`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Lihat
                  </button>
                  {report.status !== "Selesai" && (
                    <>
                      <button
                        onClick={() => navigate(`/create-report?edit=${report.id}`)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        disabled={deletingId === report.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DESKTOP: TABLE ── */}
      {!isLoading && filteredReports.length > 0 && (
        <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-5 py-4 text-left">Tanggal</th>
                <th className="px-5 py-4 text-left">Kelas</th>
                <th className="px-5 py-4 text-left">Materi & Subjek</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-left">Lampiran</th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm text-foreground">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {new Date(report.date).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Dibuat: {new Date(report.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                    {report.approvedAt && report.status === "Selesai" && (
                      <div className="text-[10px] text-green-600 font-medium mt-0.5">
                        Approved: {new Date(report.approvedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-medium text-sm">{report.class}</td>
                  <td className="px-5 py-4 max-w-[260px]">
                    <p className="font-semibold text-sm truncate">{report.topic}</p>
                    <p className="text-xs text-muted-foreground">{report.subject}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <FileText className="w-3.5 h-3.5" /> {report.attachments}
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => navigate(`/report/${report.id}`)}
                        title="Lihat detail"
                        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {report.status !== "Selesai" && (
                        <>
                          <button
                            onClick={() => navigate(`/create-report?edit=${report.id}`)}
                            title="Edit laporan"
                            className="p-2 text-muted-foreground hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(report.id)}
                            disabled={deletingId === report.id}
                            title="Hapus laporan"
                            className="p-2 text-muted-foreground hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="h-4 md:h-0" />
    </div>
  );
}