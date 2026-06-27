import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Upload, FileText, X, Send, Save, Link as LinkIcon, Calendar, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { AutoSaveIndicator } from "../components/ui/AutoSaveIndicator";
import { API_BASE_URL } from "../../lib/api";

export function CreateReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lastSaved, setLastSaved] = useState<Date>();
  const [userId, setUserId] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    class: "",
    subject: "",
    topic: "",
    activitiesCompleted: "",
    homework: "",
    observations: "",
    challenges: "",
    nextLesson: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [addedLinks, setAddedLinks] = useState<Array<{ type: string; name: string; url: string }>>([]);
  const [linkInput, setLinkInput] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserId(JSON.parse(storedUser).id);
    } else {
      navigate("/login");
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const editId = queryParams.get("edit");

    if (editId) {
      setIsEditMode(true);
      setReportId(editId);

      fetch(`${API_BASE_URL}/api/reports/${editId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Laporan tidak ditemukan");
          return res.json();
        })
        .then((found) => {
          const kegiatanMatch =
            found.teachingMethod?.match(/\[KEGIATAN UTAMA\]:\s*([\s\S]*?)(?=\[TUGAS RUMAH\]|$)/)?.[1]?.trim() ||
            found.teachingMethod;
          const tugasMatch =
            found.teachingMethod?.match(/\[TUGAS RUMAH\]:\s*([\s\S]*?)(?=\[RENCANA BERIKUTNYA\]|$)/)?.[1]?.trim() || "";
          const rencanaMatch =
            found.teachingMethod?.match(/\[RENCANA BERIKUTNYA\]:\s*([\s\S]*?)$/)?.[1]?.trim() || "";
          const catatanMatch =
            found.studentFeedback?.match(/\[CATATAN SISWA\]:\s*([\s\S]*?)$/)?.[1]?.trim() || "";

          setFormData({
            date: found.date ? found.date.split("T")[0] : new Date().toISOString().split("T")[0],
            class: found.className || "",
            subject: found.subject || "",
            topic: found.learningTopic || "",
            activitiesCompleted: kegiatanMatch,
            homework: tugasMatch === "-" ? "" : tugasMatch,
            observations: catatanMatch === "-" ? "" : catatanMatch,
            challenges: found.challenges || "",
            nextLesson: rencanaMatch === "-" ? "" : rencanaMatch,
          });

          if (found.status === "Selesai") {
            toast.error("Laporan yang sudah disetujui tidak dapat diubah!");
            navigate("/history");
            return;
          }

          if (found.attachments) {
            try {
              setAddedLinks(JSON.parse(found.attachments));
            } catch { setAddedLinks([]); }
          }
        })
        .catch(() => {
          toast.error("Gagal memuat data laporan");
          navigate("/history");
        });
    }
  }, [location.search, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto-save indicator
  useEffect(() => {
    const timer = setTimeout(() => setLastSaved(new Date()), 2000);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles([...selectedFiles, ...Array.from(files)]);
      toast.success(`${files.length} berkas ditambahkan`);
    }
  };
  const removeFile = (index: number) =>
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));

  const handleAddLink = () => {
    if (linkInput.trim()) {
      const type = linkInput.includes("drive.google") ? "Google Drive" : "Tautan Web";
      let finalUrl = linkInput.trim();
      if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        finalUrl = "https://" + finalUrl;
      }
      setAddedLinks([...addedLinks, { type, name: linkInput, url: finalUrl }]);
      setLinkInput("");
      toast.success("Tautan ditambahkan");
    }
  };
  const removeLink = (index: number) =>
    setAddedLinks(addedLinks.filter((_, i) => i !== index));

  const prosesKirimLaporan = async (statusTarget: "Menunggu Tinjauan" | "Draf") => {
    if (!formData.class.trim() || !formData.topic.trim()) {
      toast.error("Isi Kelas dan Materi terlebih dahulu!");
      return;
    }
    if (statusTarget === "Menunggu Tinjauan" && !formData.activitiesCompleted.trim()) {
      toast.error("Kegiatan Pembelajaran Utama wajib diisi!");
      return;
    }

    setIsSubmitting(true);

    let currentLinks = [...addedLinks];
    if (linkInput.trim()) {
      const type = linkInput.includes("drive.google") ? "Google Drive" : "Tautan Web";
      let finalUrl = linkInput.trim();
      if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        finalUrl = "https://" + finalUrl;
      }
      currentLinks.push({ type, name: linkInput, url: finalUrl });
    }

    const gabunganAktivitas = `[KEGIATAN UTAMA]:\n${formData.activitiesCompleted}\n\n[TUGAS RUMAH]:\n${formData.homework || "-"}\n\n[RENCANA BERIKUTNYA]:\n${formData.nextLesson || "-"}`;
    const gabunganSiswa = `[CATATAN SISWA]:\n${formData.observations || "-"}`;

    const dataKirim = new FormData();
    if (isEditMode && reportId) dataKirim.append("id", reportId);

    dataKirim.append("subject", formData.subject);
    dataKirim.append("className", formData.class);
    dataKirim.append("date", formData.date);
    dataKirim.append("learningTopic", formData.topic);
    dataKirim.append("teachingMethod", gabunganAktivitas);
    dataKirim.append("studentFeedback", gabunganSiswa);
    dataKirim.append("challenges", formData.challenges || "");
    dataKirim.append("userId", userId);
    dataKirim.append("status", statusTarget);

    if (currentLinks.length > 0)
      dataKirim.append("links", JSON.stringify(currentLinks));
    selectedFiles.forEach((file) => dataKirim.append("files", file));

    try {
      const res = await fetch(`${API_BASE_URL}/api/reports`, {
        method: "POST",
        body: dataKirim,
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      toast.success(statusTarget === "Draf" ? "Draf disimpan!" : "Laporan berhasil dikirim!");
      setLinkInput("");
      setTimeout(() => navigate("/history"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghubungi server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {isEditMode ? "Edit Laporan Harian" : "Buat Laporan Harian"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Catat aktivitas mengajar Anda hari ini
          </p>
        </div>
        <div className="self-start sm:self-center">
          <AutoSaveIndicator lastSaved={lastSaved} />
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); prosesKirimLaporan("Menunggu Tinjauan"); }}
        className="space-y-5"
      >
        {/* SECTION 1: INFO DASAR */}
        <div className="bg-card rounded-xl p-4 sm:p-5 border shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
            Informasi Kelas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tanggal */}
            <div>
              <label className="block text-xs font-medium mb-1.5">Tanggal Mengajar</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </div>

            {/* Kelas — input bebas */}
            <div>
              <label className="block text-xs font-medium mb-1.5">Kelas</label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                placeholder="Contoh: X IPA 1, XI IPS 2"
                className="w-full px-3 py-2.5 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            {/* Mata Pelajaran */}
            <div>
              <label className="block text-xs font-medium mb-1.5">Mata Pelajaran</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Contoh: Matematika Wajib"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </div>

            {/* Topik */}
            <div>
              <label className="block text-xs font-medium mb-1.5">Materi / Topik Pembelajaran</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="Contoh: Persamaan Kuadrat"
                className="w-full px-3 py-2.5 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DETAIL AKTIVITAS */}
        <div className="bg-card rounded-xl p-4 sm:p-5 border shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Detail Aktivitas</h3>

          <div className="space-y-1">
            <label className="block text-xs font-medium">
              1. Kegiatan Pembelajaran Utama{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="activitiesCompleted"
              value={formData.activitiesCompleted}
              onChange={handleInputChange}
              rows={4}
              placeholder="Contoh: Guru menerangkan bab aljabar di papan tulis, sesi tanya jawab 15 menit, lalu kuis mandiri 5 soal."
              className="w-full p-3 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">
              2. Tugas / Pekerjaan Rumah{" "}
              <span className="text-muted-foreground text-[10px]">(Opsional)</span>
            </label>
            <textarea
              name="homework"
              value={formData.homework}
              onChange={handleInputChange}
              rows={2}
              placeholder="Contoh: LKS halaman 24 bagian A nomor 1–10."
              className="w-full p-3 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">
              3. Catatan Perkembangan Siswa{" "}
              <span className="text-muted-foreground text-[10px]">(Opsional)</span>
            </label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleInputChange}
              rows={2}
              placeholder="Contoh: Sebagian besar paham, namun 3 siswa masih kesulitan di bagian perkalian matriks."
              className="w-full p-3 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">
              4. Kendala / Hambatan{" "}
              <span className="text-muted-foreground text-[10px]">(Opsional)</span>
            </label>
            <textarea
              name="challenges"
              value={formData.challenges}
              onChange={handleInputChange}
              rows={2}
              placeholder="Contoh: Proyektor tidak bisa menyala, penyampaian materi dialihkan ke papan tulis."
              className="w-full p-3 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">
              5. Rencana Pertemuan Berikutnya{" "}
              <span className="text-muted-foreground text-[10px]">(Opsional)</span>
            </label>
            <textarea
              name="nextLesson"
              value={formData.nextLesson}
              onChange={handleInputChange}
              rows={2}
              placeholder="Contoh: Membahas jawaban kuis hari ini dan lanjut ke materi logaritma dasar."
              className="w-full p-3 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
        </div>

        {/* SECTION 3: LAMPIRAN */}
        <div className="bg-card rounded-xl p-4 sm:p-5 border shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
            Media & Lampiran
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-accent/50 transition-colors text-center min-h-[100px]">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <div>
                <span className="text-xs font-medium block">Unggah Berkas</span>
                <span className="text-[10px] text-muted-foreground">PDF, PNG, atau JPG</span>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="flex flex-col gap-2">
              <label className="block text-xs font-medium">Tambahkan Tautan Luar</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLink())}
                  placeholder="Contoh: drive.google.com/..."
                  className="flex-1 px-3 py-2.5 text-sm bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-3 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Tekan Enter atau klik tombol untuk menambahkan
              </p>
            </div>
          </div>

          {/* Daftar lampiran */}
          {(addedLinks.length > 0 || selectedFiles.length > 0) && (
            <div className="space-y-2 pt-2 border-t">
              {addedLinks.map((link, index) => (
                <div
                  key={`link-${index}`}
                  className="flex items-center justify-between p-2.5 bg-muted rounded-lg text-xs border"
                >
                  <div className="flex items-center gap-2 truncate">
                    <LinkIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate font-medium">{link.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="text-destructive p-1 hover:bg-red-50 rounded ml-2 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {selectedFiles.map((file, index) => (
                <div
                  key={`file-${index}`}
                  className="flex items-center justify-between p-2.5 bg-muted rounded-lg text-xs border"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="truncate font-medium">{file.name}</span>
                    <span className="text-muted-foreground shrink-0">
                      ({(file.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-destructive p-1 hover:bg-red-50 rounded ml-2 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TOMBOL AKSI */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto order-1 sm:order-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-60 hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
            {isSubmitting
              ? "Menyimpan..."
              : isEditMode
              ? "Simpan Perubahan"
              : "Kirim Laporan"}
          </button>
          {!isEditMode && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => prosesKirimLaporan("Draf")}
              className="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 bg-muted text-foreground rounded-xl font-medium flex items-center justify-center gap-2 text-sm hover:bg-accent transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> Simpan Draf
            </button>
          )}
        </div>
      </form>
    </div>
  );
}