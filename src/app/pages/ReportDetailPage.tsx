import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, FileText, Download, Edit, CheckCircle,
  Link as LinkIcon, BookOpen, Clock, AlertTriangle,
  Lightbulb, UserCheck, Printer, Share2, MessageCircle, Mail,
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../../lib/api";

export function ReportDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/api/reports/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        data.attachmentsList = data.attachments ? (() => { try { return JSON.parse(data.attachments); } catch { return []; } })() : [];
        setReport(data);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Laporan tidak ditemukan");
        navigate("/history");
      });
  }, [id, navigate]);

  const openFileOrLink = (name: string, urlTarget: string) => {
    if (!urlTarget) return;
    window.open(urlTarget, "_blank");
  };

  const handlePrint = () => {
    // Parsing konten
    const kegiatan =
      report.teachingMethod?.match(/\[KEGIATAN UTAMA\]:\s*([\s\S]*?)(?=\[TUGAS RUMAH\]|$)/)?.[1]?.trim() ||
      report.teachingMethod || "";
    const tugas =
      report.teachingMethod?.match(/\[TUGAS RUMAH\]:\s*([\s\S]*?)(?=\[RENCANA BERIKUTNYA\]|$)/)?.[1]?.trim() || "";
    const rencana =
      report.teachingMethod?.match(/\[RENCANA BERIKUTNYA\]:\s*([\s\S]*?)$/)?.[1]?.trim() || "";
    const catatan =
      report.studentFeedback?.match(/\[CATATAN SISWA\]:\s*([\s\S]*?)$/)?.[1]?.trim() ||
      report.studentFeedback || "";

    const esc = (s: string) => s?.replace(/</g, "&lt;").replace(/>/g, "&gt;") || "";
    const nl2br = (s: string) => esc(s).replace(/\n/g, "<br/>");

    const section = (title: string, content: string) =>
      content && content !== "-"
        ? `<div class="section">
            <p class="section-title">${title}</p>
            <p class="section-content">${nl2br(content)}</p>
           </div>`
        : "";

    const tanggal = new Date(report.date).toLocaleDateString("id-ID", { dateStyle: "long" });
    const cetakPada = new Date().toLocaleDateString("id-ID", { dateStyle: "full" });

    // Menyusun HTML Lampiran
    let attachmentsHTML = "";
    if (report.attachmentsList && report.attachmentsList.length > 0) {
      attachmentsHTML = `
        <div class="section">
          <p class="section-title">Media & Lampiran Pendukung</p>
          <div style="background: #f8fafc; padding: 10px 14px; border-radius: 6px; border: 1px dashed #cbd5e1;">
            <ul style="list-style-type: none; padding-left: 0; margin: 0;">
              ${report.attachmentsList.map((att: any) => `
                <li style="margin-bottom: 6px; font-size: 11px; display: flex; align-items: center; gap: 8px;">
                  <span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase;">
                    ${esc(att.type || "Berkas")}
                  </span>
                  <a href="${esc(att.url)}" target="_blank" style="color: #1d4ed8; text-decoration: underline; word-break: break-all;">
                    ${esc(att.name)}
                  </a>
                </li>
              `).join("")}
            </ul>
          </div>
        </div>
      `;
    }

    const statusTextClean = report.status === "Menunggu Tinjauan" ? "Menunggu Review" : report.status;

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <title>Laporan Mengajar — ${esc(report.subject)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; padding: 32px; color: #111; font-size: 13px; line-height: 1.5; }
    .header { border-bottom: 2.5px solid #1d4ed8; padding-bottom: 14px; margin-bottom: 20px; }
    .header h1 { font-size: 20px; font-weight: bold; }
    .header p { font-size: 11px; color: #666; margin-top: 3px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 22px; }
    td { padding: 5px 0; vertical-align: top; }
    td:first-child { color: #555; width: 150px; font-size: 12px; }
    td:last-child { font-weight: 600; }
    .section { margin-bottom: 16px; }
    .section-title { font-weight: bold; font-size: 13px; border-left: 3px solid #1d4ed8; padding-left: 8px; margin-bottom: 7px; }
    .section-content { font-size: 12px; line-height: 1.7; background: #f8fafc; padding: 10px 14px; border-radius: 6px; color: #333; }
    .review-note { margin-top: 20px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; }
    .review-note p { font-size: 12px; }
    .footer { margin-top: 40px; font-size: 11px; color: #aaa; border-top: 1px solid #e5e7eb; padding-top: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Laporan Mengajar Harian</h1>
    <p>Edu Report — Portal Pelaporan Guru Digital</p>
  </div>
  <table>
    <tr><td>Mata Pelajaran</td><td>${esc(report.subject)}</td></tr>
    <tr><td>Kelas</td><td>${esc(report.className)}</td></tr>
    <tr><td>Tanggal</td><td>${tanggal}</td></tr>
    <tr><td>Materi / Topik</td><td>${esc(report.learningTopic)}</td></tr>
    <tr><td>Status</td><td>${esc(statusTextClean)}</td></tr>
    <tr><td>Dibuat Pada</td><td>${new Date(report.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</td></tr>
    ${report.approvedAt && report.status === "Selesai" ? `<tr><td>Disetujui Pada</td><td>${new Date(report.approvedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</td></tr>` : ""}
  </table>
  ${section("Kegiatan Pembelajaran Utama", kegiatan)}
  ${section("Tugas / PR", tugas)}
  ${section("Catatan & Observasi Siswa", catatan)}
  ${section("Hambatan / Kendala", report.challenges || "")}
  ${section("Rencana Pertemuan Berikutnya", rencana)}
  ${attachmentsHTML}
  ${report.reviewNote ? `<div class="review-note"><p style="font-weight:bold;margin-bottom:4px;">Catatan Kepala Sekolah:</p><p>${esc(report.reviewNote)}</p></div>` : ""}
  <div class="footer">
    <p>Dicetak dari Edu Report &bull; ${cetakPada}</p>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 300);
    };
  </script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) { toast.error("Pop-up diblokir browser. Izinkan pop-up untuk mencetak."); return; }
    win.document.write(html);
    win.document.close();
  };

  const handleShareWA = () => {
    const statusTextClean = report.status === "Menunggu Tinjauan" ? "Menunggu Review" : report.status;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `📋 *Laporan Mengajar*\n📚 Mapel: ${report.subject}\n🏫 Kelas: ${report.className}\n📅 Tanggal: ${new Date(report.date).toLocaleDateString("id-ID")}\n✅ Status: ${statusTextClean}\n\nLihat detail: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setShowShare(false);
  };

  const handleShareEmail = () => {
    const statusTextClean = report.status === "Menunggu Tinjauan" ? "Menunggu Review" : report.status;
    const subject = encodeURIComponent(`Laporan Mengajar - ${report.subject} (${report.className})`);
    const body = encodeURIComponent(
      `Laporan Mengajar\n\nMata Pelajaran: ${report.subject}\nKelas: ${report.className}\nTanggal: ${new Date(report.date).toLocaleDateString("id-ID")}\nMateri: ${report.learningTopic}\nStatus: ${statusTextClean}\n\nLink laporan: ${window.location.href}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    setShowShare(false);
  };

  if (isLoading || !report)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-muted-foreground animate-pulse">Memuat laporan...</p>
      </div>
    );

  const kegiatanUtama =
    report.teachingMethod?.match(/\[KEGIATAN UTAMA\]:\s*([\s\S]*?)(?=\[TUGAS RUMAH\]|$)/)?.[1]?.trim() ||
    report.teachingMethod;
  const tugasRumah =
    report.teachingMethod?.match(/\[TUGAS RUMAH\]:\s*([\s\S]*?)(?=\[RENCANA BERIKUTNYA\]|$)/)?.[1]?.trim() || "";
  const rencanaBerikutnya =
    report.teachingMethod?.match(/\[RENCANA BERIKUTNYA\]:\s*([\s\S]*?)$/)?.[1]?.trim() || "";
  const catatanSiswa =
    report.studentFeedback?.match(/\[CATATAN SISWA\]:\s*([\s\S]*?)$/)?.[1]?.trim() ||
    report.studentFeedback || "";

  const statusColor =
    report.status === "Selesai" ? "bg-green-100 text-green-700"
    : report.status === "Ditolak" ? "bg-red-100 text-red-700"
    : report.status === "Draf" ? "bg-gray-100 text-gray-600"
    : "bg-orange-100 text-orange-700";

  return (
    <>


      {/* Share overlay — fixed agar tidak kepotong di mobile */}
      {showShare && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowShare(false)}
        >
          <div
            className="absolute bg-card border rounded-xl shadow-xl overflow-hidden w-48"
            style={{ top: 64, right: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide border-b">Bagikan via</p>
            <button
              onClick={handleShareWA}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-muted transition-colors text-left"
            >
              <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp
            </button>
            <button
              onClick={handleShareEmail}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-muted transition-colors text-left"
            >
              <Mail className="w-4 h-4 text-blue-500" /> Email
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4 print:hidden">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-accent rounded-lg border flex-shrink-0 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground">Detail Laporan</h1>
              <p className="text-[10px] text-muted-foreground font-mono truncate">ID: {report.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShare(!showShare)}
                className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-xl text-xs font-semibold hover:bg-accent border transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Bagikan
              </button>
            </div>
            {/* Print */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-xl text-xs font-semibold hover:bg-accent border transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak PDF
            </button>
            {/* Edit */}
            {report.status !== "Selesai" && (
              <button
                onClick={() => navigate(`/create-report?edit=${report.id}`)}
                className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-xl text-xs font-semibold hover:bg-accent border transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-card rounded-xl p-4 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle className={`w-5 h-5 flex-shrink-0 ${report.status === "Selesai" ? "text-green-500" : "text-orange-400"}`} />
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wide">Status</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-0.5 ${statusColor}`}>
                {report.status === "Menunggu Tinjauan" ? "Menunggu Review" : report.status}
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-muted-foreground space-y-0.5">
            <div>
              <span>Dibuat: </span>
              <span className="font-semibold text-foreground">
                {new Date(report.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            {report.approvedAt && report.status === "Selesai" && (
              <div>
                <span>Disetujui: </span>
                <span className="font-semibold text-foreground">
                  {new Date(report.approvedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Catatan dari kepala sekolah jika ditolak atau sudah selesai */}
        {report.reviewNote && (
          <div className={`rounded-xl p-4 border ${report.status === "Ditolak" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
            <p className="text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide">
              Catatan Kepala Sekolah
            </p>
            <p className="text-sm text-foreground">{report.reviewNote}</p>
          </div>
        )}

        {/* INFO UMUM */}
        <div className="bg-card rounded-xl p-4 sm:p-5 border shadow-sm">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Informasi Umum</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-muted-foreground text-[10px] block mb-0.5">Mata Pelajaran</span>
              <span className="font-semibold text-foreground">{report.subject}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-[10px] block mb-0.5">Kelas</span>
              <span className="font-semibold text-foreground">{report.className}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-[10px] block mb-0.5">Tanggal</span>
              <span className="font-semibold text-foreground">
                {new Date(report.date).toLocaleDateString("id-ID", { dateStyle: "long" })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground text-[10px] block mb-0.5">Materi</span>
              <span className="font-semibold text-foreground">{report.learningTopic}</span>
            </div>
          </div>
        </div>

        {/* KONTEN */}
        <div className="space-y-3">
          {kegiatanUtama && (
            <div className="bg-card rounded-xl p-4 sm:p-5 border shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-foreground">
                <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Kegiatan Pembelajaran Utama</span>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground bg-muted/40 p-3 rounded-xl whitespace-pre-line leading-relaxed border break-words">
                {kegiatanUtama}
              </div>
            </div>
          )}
          {tugasRumah && tugasRumah !== "-" && (
            <div className="bg-card rounded-xl p-4 sm:p-5 border shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-foreground">
                <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>Tugas / PR</span>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground bg-muted/40 p-3 rounded-xl whitespace-pre-line leading-relaxed border break-words">
                {tugasRumah}
              </div>
            </div>
          )}
          {catatanSiswa && catatanSiswa !== "-" && (
            <div className="bg-card rounded-xl p-4 sm:p-5 border shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-foreground">
                <UserCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Catatan & Observasi Siswa</span>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground bg-muted/40 p-3 rounded-xl whitespace-pre-line leading-relaxed border break-words">
                {catatanSiswa}
              </div>
            </div>
          )}
          {report.challenges && (
            <div className="bg-card rounded-xl p-4 sm:p-5 border shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-foreground">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                <span>Hambatan / Kendala</span>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground bg-muted/40 p-3 rounded-xl whitespace-pre-line leading-relaxed border break-words">
                {report.challenges}
              </div>
            </div>
          )}
          {rencanaBerikutnya && rencanaBerikutnya !== "-" && (
            <div className="bg-card rounded-xl p-4 sm:p-5 border shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-foreground">
                <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span>Rencana Pertemuan Berikutnya</span>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground bg-muted/40 p-3 rounded-xl whitespace-pre-line leading-relaxed border break-words">
                {rencanaBerikutnya}
              </div>
            </div>
          )}
        </div>

        {/* LAMPIRAN */}
        <div className="bg-card rounded-xl p-4 sm:p-5 border shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Lampiran ({report.attachmentsList?.length || 0})
          </h4>
          {report.attachmentsList?.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Tidak ada berkas pendukung.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {report.attachmentsList?.map((att: any, i: number) => {
                const isLink = att.type?.includes("Tautan") || att.type?.includes("Drive");
                return (
                  <div key={i} onClick={() => openFileOrLink(att.name, att.url)}
                    className="flex items-center justify-between p-3 bg-muted hover:bg-accent rounded-lg cursor-pointer border border-dashed text-xs font-medium transition-colors gap-2">
                    <div className="flex items-center gap-2 truncate flex-1">
                      {isLink ? <LinkIcon className="w-4 h-4 text-blue-500 flex-shrink-0" /> : <FileText className="w-4 h-4 text-primary flex-shrink-0" />}
                      <span className="truncate">{att.name}</span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}