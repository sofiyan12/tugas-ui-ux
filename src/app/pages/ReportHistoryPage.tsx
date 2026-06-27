import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Calendar,
  FileText,
  ChevronDown,
} from "lucide-react";

export function ReportHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => {
        setReports(data.map((r: any) => ({
          id: r.id,
          date: r.date,
          class: r.className,
          subject: r.subject,
          topic: r.learningTopic,
          status: r.status,
          attendance: "N/A", // Will need attendance in DB if wanted
          attachments: r.attachments ? 1 : 0
        })));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch reports:", err);
        setIsLoading(false);
      });
  }, []);


  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === "all" || report.class === filterClass;
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Riwayat Laporan</h1>
          <p className="text-muted-foreground">Lihat dan kelola semua laporan yang Anda kirimkan</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Download className="w-5 h-5" />
          Ekspor Semua
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan materi atau kelas..."
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filter
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground mb-2">Filter berdasarkan Kelas</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Semua Kelas</option>
                <option value="Kelas 10A">Kelas 10A</option>
                <option value="Kelas 10B">Kelas 10B</option>
                <option value="Kelas 11A">Kelas 11A</option>
                <option value="Kelas 11B">Kelas 11B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-foreground mb-2">Filter berdasarkan Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Semua Status</option>
                <option value="Selesai">Selesai</option>
                <option value="Menunggu Tinjauan">Menunggu Tinjauan</option>
                <option value="Diarsipkan">Diarsipkan</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Reports Table - Desktop */}
      <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-foreground">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Kelas</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Materi</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Kehadiran</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Lampiran</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {new Date(report.date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{report.class}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-foreground">{report.topic}</p>
                      <p className="text-xs text-muted-foreground">{report.subject}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{report.attendance}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        report.status === "Selesai"
                          ? "bg-green-100 text-green-700"
                          : report.status === "Menunggu Tinjauan"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      {report.attachments}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">
            Memuat laporan...
          </div>
        ) : filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground mb-2">Tidak ada laporan ditemukan</p>
            <p className="text-sm text-muted-foreground">
              Coba sesuaikan kriteria pencarian atau filter Anda
            </p>
          </div>
        )}
      </div>

      {/* Reports Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {isLoading && (
          <div className="p-12 text-center text-muted-foreground bg-card rounded-lg border border-border">
            Memuat laporan...
          </div>
        )}
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">{report.topic}</h4>
                <p className="text-xs text-muted-foreground">{report.class} • {report.subject}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ml-2 ${
                  report.status === "Selesai"
                    ? "bg-green-100 text-green-700"
                    : report.status === "Menunggu Tinjauan"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {report.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(report.date).toLocaleDateString("id-ID")}
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {report.attachments} berkas
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/report/${report.id}`}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs"
              >
                <Eye className="w-3 h-3" />
                Lihat
              </Link>
              <button className="flex items-center justify-center gap-1 px-3 py-2 bg-muted text-foreground rounded-lg text-xs">
                <Edit className="w-3 h-3" />
                Edit
              </button>
              <button className="flex items-center justify-center gap-1 px-3 py-2 bg-muted text-foreground rounded-lg text-xs">
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!isLoading && filteredReports.length === 0) && (
        <div className="md:hidden p-12 text-center bg-card rounded-lg border border-border">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground mb-2">Tidak ada laporan ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Coba sesuaikan kriteria pencarian atau filter Anda
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredReports.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredReports.length} dari {reports.length} laporan
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Sebelumnya
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">1</button>
            <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors">
              2
            </button>
            <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors">
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
