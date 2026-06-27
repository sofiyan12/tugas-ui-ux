import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Users,
  BookOpen,
  FileText,
  Download,
  Share2,
  Edit,
  Trash2,
  CheckCircle,
  Image,
  Video,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

export function ReportDetailPage() {
  const navigate = useNavigate();

  const report = {
    id: 1,
    date: "2026-05-09",
    class: "Kelas 10A",
    subject: "Matematika",
    topic: "Persamaan Kuadrat - Bagian 2",
    attendance: "32/32",
    status: "Selesai",
    teacher: "Jane Doe",
    activitiesCompleted:
      "Siswa menyelesaikan soal latihan 1-15 dari buku teks. Kami menyelesaikan 5 soal aplikasi dunia nyata bersama-sama. Siswa berpartisipasi dalam kegiatan kelompok di mana mereka membuat soal cerita persamaan kuadrat mereka sendiri.",
    homework: "Selesaikan soal latihan 16-25 di halaman 145. Batas waktu: Senin, 12 Mei",
    observations:
      "Siswa menunjukkan pemahaman yang sangat baik tentang bentuk titik puncak. Sarah dan Michael menunjukkan keterampilan pemecahan masalah yang luar biasa selama kegiatan kelompok. Sebagian besar siswa merasa nyaman dengan pemfaktoran, tetapi beberapa perlu latihan tambahan dengan metode melengkapkan kuadrat sempurna.",
    challenges:
      "Beberapa siswa kesulitan mengubah antara bentuk standar dan bentuk titik puncak. Perlu meluangkan lebih banyak waktu untuk konsep ini di pelajaran berikutnya.",
    nextLesson: "Lanjutkan dengan rumus kuadrat dan diskriminan. Tinjau kembali melengkapkan kuadrat sempurna untuk siswa yang membutuhkan dukungan tambahan.",
    attachments: [
      { type: "PDF", name: "Lesson_Plan_Quadratics.pdf", size: "2.3 MB" },
      { type: "PPTX", name: "Quadratic_Equations_Slides.pptx", size: "5.1 MB" },
      { type: "Image", name: "Whiteboard_Notes.jpg", size: "1.8 MB" },
      { type: "Video", name: "https://youtube.com/watch?v=example", size: "Tautan" },
    ],
    submittedAt: "2026-05-09 16:30",
    reviewedBy: "Kepala Sekolah Smith",
    reviewedAt: "2026-05-09 17:15",
  };

  const handleEdit = () => {
    navigate("/create-report");
    toast.success("Membuka laporan dalam mode edit");
  };

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
      toast.success("Laporan berhasil dihapus");
      navigate("/history");
    }
  };

  const handleDownload = () => {
    toast.success("Mengunduh laporan sebagai PDF");
  };

  const handleShare = () => {
    toast.success("Membuka opsi berbagi");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/history")}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-foreground mb-1">Detail Laporan</h1>
            <p className="text-sm text-muted-foreground">
              Dikirim pada {new Date(report.submittedAt).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Unduh</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Hapus</span>
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-foreground">Status Laporan</p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm mt-1">
                {report.status}
              </span>
            </div>
          </div>
          {report.reviewedBy && (
            <div className="text-sm text-muted-foreground">
              <p>Ditinjau oleh: {report.reviewedBy}</p>
              <p>Pada: {new Date(report.reviewedAt).toLocaleString("id-ID")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-foreground mb-4">Informasi Dasar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Tanggal</p>
              <p className="text-sm text-foreground">{new Date(report.date).toLocaleDateString("id-ID")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Kelas</p>
              <p className="text-sm text-foreground">{report.class}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Mata Pelajaran</p>
              <p className="text-sm text-foreground">{report.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Materi</p>
              <p className="text-sm text-foreground">{report.topic}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Kehadiran</p>
              <p className="text-sm text-foreground">{report.attendance}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Guru</p>
              <p className="text-sm text-foreground">{report.teacher}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-card rounded-xl p-6 border border-border space-y-6">
        <div>
          <h4 className="text-foreground mb-2">Kegiatan yang Dilaksanakan</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{report.activitiesCompleted}</p>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="text-foreground mb-2">Tugas yang Diberikan</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{report.homework}</p>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="text-foreground mb-2">Catatan Perkembangan Siswa</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{report.observations}</p>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="text-foreground mb-2">Hambatan yang Dihadapi</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{report.challenges}</p>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="text-foreground mb-2">Rencana Pelajaran Berikutnya</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{report.nextLesson}</p>
        </div>
      </div>

      {/* Attachments */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-foreground mb-4">Lampiran ({report.attachments.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {report.attachments.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {attachment.type === "PDF" && <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />}
                {attachment.type === "PPTX" && <FileText className="w-5 h-5 text-orange-500 flex-shrink-0" />}
                {attachment.type === "Image" && <Image className="w-5 h-5 text-green-500 flex-shrink-0" />}
                {attachment.type === "Video" && <Video className="w-5 h-5 text-purple-500 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">{attachment.size}</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
