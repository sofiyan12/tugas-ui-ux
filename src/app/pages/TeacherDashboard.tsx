import { Link } from "react-router";
import {
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  BookOpen,
  AlertCircle,
} from "lucide-react";

export function TeacherDashboard() {
  const kpiData = [
    {
      label: "Laporan Minggu Ini",
      value: "5",
      change: "+2 dari minggu lalu",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      label: "Menunggu Tinjauan",
      value: "2",
      change: "Butuh tindakan",
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      label: "Siswa",
      value: "32",
      change: "Aktif",
      icon: Users,
      color: "bg-green-500",
    },
    {
      label: "Tingkat Penyelesaian",
      value: "95%",
      change: "+5% bulan ini",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  const recentReports = [
    {
      id: 1,
      date: "2026-05-09",
      subject: "Matematika - Kelas 10A",
      status: "Selesai",
      students: 32,
    },
    {
      id: 2,
      date: "2026-05-08",
      subject: "Matematika - Kelas 10B",
      status: "Selesai",
      students: 28,
    },
    {
      id: 3,
      date: "2026-05-07",
      subject: "Matematika - Kelas 10A",
      status: "Menunggu Tinjauan",
      students: 32,
    },
  ];

  const upcomingTasks = [
    { task: "Kirim laporan kehadiran mingguan", deadline: "Hari ini, 17:00", priority: "high" },
    { task: "Rekap nilai untuk Bab 5", deadline: "Besok", priority: "medium" },
    { task: "Persiapan pertemuan wali murid", deadline: "15 Mei", priority: "low" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white">
        <h1 className="mb-2 text-xl md:text-3xl">Selamat datang kembali, Jane!</h1>
        <p className="text-blue-100 mb-4 md:mb-6 text-sm md:text-base">
          Anda memiliki 2 laporan yang menunggu ditinjau. Mari buat hari ini produktif!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/create-report"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <FileText className="w-5 h-5" />
            Buat Laporan Baru
          </Link>
          <Link
            to="/history"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 border border-white/20 text-sm md:text-base"
          >
            Lihat Riwayat
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className={`${kpi.color} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <h3 className="text-foreground mb-1 text-xl md:text-3xl">{kpi.value}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">{kpi.label}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">{kpi.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2 bg-card rounded-lg md:rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground">Laporan Terbaru</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground">{report.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.date).toLocaleDateString("id-ID")} • {report.students} siswa
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        report.status === "Selesai"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-card rounded-lg md:rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground">Tugas Mendatang</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex gap-3">
                  <div className="mt-1">
                    {task.priority === "high" ? (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    ) : task.priority === "medium" ? (
                      <Clock className="w-5 h-5 text-orange-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{task.task}</p>
                    <p className="text-xs text-muted-foreground mt-1">{task.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <h3 className="text-foreground mb-4">Aktivitas Minggu Ini</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Senin</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
                <span className="text-sm text-foreground">2</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Selasa</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                </div>
                <span className="text-sm text-foreground">1</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rabu</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
                <span className="text-sm text-foreground">2</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <h3 className="text-foreground mb-4">Statistik Laporan</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Laporan</span>
              <span className="text-foreground">47</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Bulan Ini</span>
              <span className="text-foreground">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rata-rata Waktu Respon</span>
              <span className="text-foreground">2.5 jam</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
