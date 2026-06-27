import { useState, useEffect } from "react";
import {
  FileText, Users, TrendingUp, CheckCircle, Clock,
  AlertTriangle, Eye, X, ThumbsUp, ThumbsDown, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { getAllReports, getAllUsers, API_BASE_URL } from "../../lib/api";

interface Report {
  id: string;
  subject: string;
  className: string;
  date: string;
  status: string;
  userId: string;
  createdAt: string;
  learningTopic: string;
  teachingMethod: string;
  studentFeedback: string;
  challenges: string;
  reviewNote?: string;
  attachments?: string;
}

interface UserData {
  id: string;
  name: string;
  department?: string;
}

export function PrincipalDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [r, u] = await Promise.all([getAllReports(), getAllUsers()]);
      setReports(Array.isArray(r) ? r : []);
      setUsers(Array.isArray(u) ? u : []);
    } catch { toast.error("Gagal memuat data"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const getTeacherName = (userId: string) =>
    users.find((u) => u.id === userId)?.name || "Guru";

  const handleOpenModal = (report: Report) => {
    setSelectedReport(report);
    setReviewNote(report.reviewNote || "");
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setReviewNote("");
  };

  const handleUpdateStatus = async (status: "Selesai" | "Ditolak") => {
    if (!selectedReport) return;
    setIsReviewing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/${selectedReport.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNote }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui status");

      toast.success(status === "Selesai" ? "Laporan disetujui! ✅" : "Laporan ditolak.");
      handleCloseModal();
      fetchData();
    } catch {
      toast.error("Gagal memperbarui status laporan");
    } finally {
      setIsReviewing(false);
    }
  };

  // Stats
  const total = reports.length;
  const pending = reports.filter((r) => r.status === "Menunggu Tinjauan" || r.status === "Menunggu Review").length;
  const selesai = reports.filter((r) => r.status === "Selesai").length;
  const ditolak = reports.filter((r) => r.status === "Ditolak").length;

  const pendingList = reports
    .filter((r) => r.status === "Menunggu Tinjauan" || r.status === "Menunggu Review")
    .sort((a, b) => new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime());

  const allRecentReports = [...reports]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 15);

  const statusColor = (s: string) => {
    if (s === "Selesai") return "bg-green-100 text-green-700";
    if (s === "Ditolak") return "bg-red-100 text-red-700";
    if (s === "Draf") return "bg-gray-100 text-gray-600";
    return "bg-orange-100 text-orange-700";
  };

  const getStatusText = (s: string) => {
    return s === "Menunggu Tinjauan" ? "Menunggu Review" : s;
  };

  // Parsing data laporan
  const parseReport = (r: Report) => {
    const kegiatan = r.teachingMethod?.match(/\[KEGIATAN UTAMA\]:\s*([\s\S]*?)(?=\[TUGAS RUMAH\]|$)/)?.[1]?.trim() || r.teachingMethod || "-";
    const catatan = r.studentFeedback?.match(/\[CATATAN SISWA\]:\s*([\s\S]*?)$/)?.[1]?.trim() || r.studentFeedback || "-";
    
    let attachmentsList: any[] = [];
    if (r.attachments) {
      try {
        attachmentsList = JSON.parse(r.attachments);
      } catch {
        attachmentsList = [];
      }
    }
    return { kegiatan, catatan, attachmentsList };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-muted-foreground animate-pulse">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 md:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Dasbor Kepala Sekolah</h1>
          <p className="text-sm text-muted-foreground">Pantau dan tinjau laporan guru</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-2 text-xs bg-muted rounded-lg hover:bg-accent transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Laporan", value: total, icon: FileText, color: "bg-blue-500" },
          { label: "Menunggu Review", value: pending, icon: Clock, color: "bg-orange-500" },
          { label: "Disetujui", value: selesai, icon: CheckCircle, color: "bg-green-500" },
          { label: "Ditolak", value: ditolak, icon: AlertTriangle, color: "bg-red-500" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-card rounded-xl p-4 border shadow-sm">
              <div className={`${s.color} w-9 h-9 rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Laporan Menunggu Tinjauan */}
      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sm">Laporan Menunggu Review</h3>
          {pending > 0 && (
            <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
              {pending} laporan
            </span>
          )}
        </div>
        <div className="p-4">
          {pendingList.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2 opacity-70" />
              <p className="text-sm font-medium text-foreground">Tidak ada laporan tertunda 🎉</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingList.map((r) => {
                const hariLalu = Math.floor((Date.now() - new Date(r.createdAt || r.date).getTime()) / 86400000);
                return (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {getTeacherName(r.userId)}
                        <span className="text-muted-foreground font-normal"> — {r.subject} ({r.className})</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Dibuat: {new Date(r.createdAt || r.date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })} •{" "}
                        {hariLalu === 0 ? "Hari ini" : hariLalu === 1 ? "Kemarin" : `${hariLalu} hari lalu`}
                        {hariLalu >= 2 && <span className="text-red-500 ml-1 font-medium">⚠ Terlambat</span>}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenModal(r)}
                      className="ml-3 flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" /> Tinjau
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Semua Laporan */}
      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Semua Laporan Terbaru</h3>
        </div>
        {/* Mobile */}
        <div className="md:hidden p-4 space-y-3">
          {allRecentReports.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{getTeacherName(r.userId)}</p>
                <p className="text-xs text-muted-foreground truncate">{r.subject} • {r.className}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dibuat: {new Date(r.createdAt || r.date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(r.status)}`}>{getStatusText(r.status)}</span>
                {(r.status === "Menunggu Tinjauan" || r.status === "Menunggu Review") && (
                  <button onClick={() => handleOpenModal(r)} className="p-1.5 bg-primary/10 text-primary rounded-lg">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Guru</th>
                <th className="px-5 py-3 text-left">Kelas & Mapel</th>
                <th className="px-5 py-3 text-left">Tanggal</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allRecentReports.map((r) => (
                <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-3 font-medium">{getTeacherName(r.userId)}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{r.className}</p>
                    <p className="text-xs text-muted-foreground">{r.subject}</p>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    <p className="font-medium text-foreground">{new Date(r.date).toLocaleDateString("id-ID", { dateStyle: "medium" })}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Dibuat: {new Date(r.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(r.status)}`}>
                      {getStatusText(r.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => handleOpenModal(r)}
                      className="p-2 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TINJAUAN */}
      {selectedReport && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-card w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto pb-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-card z-10">
              <div>
                <h3 className="font-semibold text-foreground">Tinjau Laporan</h3>
                <p className="text-xs text-muted-foreground">{getTeacherName(selectedReport.userId)}</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-muted p-3 rounded-lg">
                  <span className="text-muted-foreground block mb-0.5">Mata Pelajaran</span>
                  <span className="font-semibold">{selectedReport.subject}</span>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <span className="text-muted-foreground block mb-0.5">Kelas</span>
                  <span className="font-semibold">{selectedReport.className}</span>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <span className="text-muted-foreground block mb-0.5">Tanggal Mengajar</span>
                  <span className="font-semibold">{new Date(selectedReport.date).toLocaleDateString("id-ID", { dateStyle: "medium" })}</span>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <span className="text-muted-foreground block mb-0.5">Status</span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${statusColor(selectedReport.status)}`}>
                    {getStatusText(selectedReport.status)}
                  </span>
                </div>
                <div className="bg-muted p-3 rounded-lg col-span-2">
                  <span className="text-muted-foreground block mb-0.5">Dikirim Pada (Waktu Laporan)</span>
                  <span className="font-semibold">
                    {new Date(selectedReport.createdAt || selectedReport.date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
              </div>

              {/* Topik */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Materi / Topik</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedReport.learningTopic}</p>
              </div>

              {/* Kegiatan */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Kegiatan Pembelajaran</p>
                <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-line text-muted-foreground leading-relaxed">
                  {parseReport(selectedReport).kegiatan}
                </p>
              </div>

              {/* Catatan Siswa */}
              {parseReport(selectedReport).catatan !== "-" && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Catatan Siswa</p>
                  <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-line text-muted-foreground">
                    {parseReport(selectedReport).catatan}
                  </p>
                </div>
              )}

              {/* Kendala */}
              {selectedReport.challenges && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Kendala</p>
                  <p className="text-sm bg-muted p-3 rounded-lg text-muted-foreground">{selectedReport.challenges}</p>
                </div>
              )}

              {/* Lampiran & Media */}
              {parseReport(selectedReport).attachmentsList.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Lampiran & Media</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {parseReport(selectedReport).attachmentsList.map((att: any, idx: number) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 bg-muted hover:bg-accent rounded-lg border border-dashed text-xs font-medium transition-colors"
                      >
                        <span className="truncate flex-1 pr-2">{att.name}</span>
                        <span className="text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded border shrink-0 uppercase">
                          {att.type || "Link"}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Catatan tinjauan dari kepala sekolah */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Catatan Tinjauan <span className="font-normal">(opsional)</span>
                </label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  rows={3}
                  placeholder="Tulis catatan atau masukan untuk guru..."
                  className="w-full p-3 text-sm border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              {/* Tombol Approve / Reject */}
              {selectedReport.status === "Menunggu Tinjauan" || selectedReport.status === "Menunggu Review" || selectedReport.status === "Ditolak" ? (
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => handleUpdateStatus("Selesai")}
                    disabled={isReviewing}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-60"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {isReviewing ? "Menyimpan..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("Ditolak")}
                    disabled={isReviewing}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-60"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    {isReviewing ? "Menyimpan..." : "Reject"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <p className="text-sm text-green-700 font-medium">Laporan ini sudah di-approve</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
