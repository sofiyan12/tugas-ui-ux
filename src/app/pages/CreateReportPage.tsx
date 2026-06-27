import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  FileText,
  Link as LinkIcon,
  Image,
  Video,
  X,
  Send,
  Save,
  Calendar,
  Users,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { AutoSaveIndicator } from "../components/ui/AutoSaveIndicator";

export function CreateReportPage() {
  const navigate = useNavigate();
  const [lastSaved, setLastSaved] = useState<Date>();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    class: "",
    subject: "",
    topic: "",
    attendance: "",
    activitiesCompleted: "",
    homework: "",
    observations: "",
    challenges: "",
    nextLesson: "",
  });

  const [attachments, setAttachments] = useState<
    Array<{ type: string; name: string; url?: string }>
  >([]);
  const [linkInput, setLinkInput] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLastSaved(new Date());
    }, 2000);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        type: file.type.includes("pdf")
          ? "PDF"
          : file.type.includes("presentation")
          ? "PPTX"
          : file.type.includes("document")
          ? "DOCX"
          : file.type.includes("image")
          ? "Gambar"
          : "Berkas",
        name: file.name,
      }));
      setAttachments([...attachments, ...newAttachments]);
      toast.success(`${newAttachments.length} berkas berhasil diunggah`);
    }
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      const type = linkInput.includes("drive.google")
        ? "Google Drive"
        : linkInput.includes("youtube") || linkInput.includes("vimeo")
        ? "Video"
        : "Tautan";
      setAttachments([...attachments, { type, name: linkInput, url: linkInput }]);
      setLinkInput("");
      toast.success("Tautan berhasil ditambahkan");
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    toast.success("Laporan berhasil disimpan sebagai draf");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Laporan berhasil dikirim!");
    setTimeout(() => navigate("/history"), 1500);
  };

  const handleShareWhatsApp = () => {
    toast.success("Membuka WhatsApp...");
  };

  const handleShareEmail = () => {
    toast.success("Membuka aplikasi email...");
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-foreground mb-2">Buat Laporan Harian</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Isi aktivitas mengajar hari ini dan perkembangan belajar siswa
          </p>
        </div>
        <AutoSaveIndicator lastSaved={lastSaved} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Informasi Dasar */}
        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <h3 className="text-foreground mb-4">Informasi Dasar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground mb-2">Tanggal</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Kelas</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  <option value="10A">Kelas 10A</option>
                  <option value="10B">Kelas 10B</option>
                  <option value="11A">Kelas 11A</option>
                  <option value="11B">Kelas 11B</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Mata Pelajaran</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="contoh: Matematika"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Materi yang Disampaikan</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="contoh: Persamaan Kuadrat"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Kehadiran Siswa</label>
              <input
                type="text"
                name="attendance"
                value={formData.attendance}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="contoh: 30/32"
                required
              />
            </div>
          </div>
        </div>

        {/* Detail Laporan */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-foreground mb-4">Detail Laporan</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-foreground mb-2">
                Kegiatan yang Dilaksanakan
              </label>
              <textarea
                name="activitiesCompleted"
                value={formData.activitiesCompleted}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Uraikan kegiatan utama dan latihan yang dilakukan di kelas..."
                required
              />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Tugas yang Diberikan</label>
              <textarea
                name="homework"
                value={formData.homework}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Tuliskan tugas yang diberikan beserta batas waktu pengumpulannya..."
              />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">
                Catatan Perkembangan Siswa
              </label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Catat partisipasi, pencapaian, atau hal-hal yang perlu diperhatikan dari siswa..."
              />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Hambatan yang Dihadapi</label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Uraikan kendala atau permasalahan yang ditemui selama proses pembelajaran..."
              />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">
                Rencana Pelajaran Berikutnya
              </label>
              <textarea
                name="nextLesson"
                value={formData.nextLesson}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Uraikan secara singkat materi yang akan disampaikan pada pertemuan berikutnya..."
              />
            </div>
          </div>
        </div>

        {/* Lampiran */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-foreground mb-4">Lampiran</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Unggah Berkas (PDF, PPTX, DOCX)
                </span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.pptx,.docx,.jpg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="Tempel tautan Google Drive atau video di sini"
                className="flex-1 px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                aria-label="Tambah Tautan"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {attachment.type === "PDF" && (
                      <FileText className="w-5 h-5 text-destructive" />
                    )}
                    {attachment.type === "PPTX" && (
                      <FileText className="w-5 h-5 text-orange-500" />
                    )}
                    {attachment.type === "DOCX" && (
                      <FileText className="w-5 h-5 text-primary" />
                    )}
                    {attachment.type === "Gambar" && (
                      <Image className="w-5 h-5 text-green-500" />
                    )}
                    {attachment.type === "Video" && (
                      <Video className="w-5 h-5 text-purple-500" />
                    )}
                    {attachment.type === "Google Drive" && (
                      <LinkIcon className="w-5 h-5 text-blue-500" />
                    )}
                    {attachment.type === "Tautan" && (
                      <LinkIcon className="w-5 h-5 text-gray-500" />
                    )}
                    <div>
                      <p className="text-sm text-foreground">{attachment.name}</p>
                      <p className="text-xs text-muted-foreground">{attachment.type}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    aria-label="Hapus lampiran"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
            Kirim Laporan
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            <Save className="w-5 h-5" />
            Simpan Draf
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <span className="sm:hidden">WhatsApp</span>
            <span className="hidden sm:inline">Bagikan ke WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleShareEmail}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span className="sm:hidden">Email</span>
            <span className="hidden sm:inline">Bagikan via Email</span>
          </button>
        </div>
      </form>
    </div>
  );
}
