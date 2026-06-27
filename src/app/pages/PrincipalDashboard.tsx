import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export function PrincipalDashboard() {
  const schoolStats = [
    {
      label: "Total Laporan",
      value: "342",
      change: "+28 minggu ini",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      label: "Guru Aktif",
      value: "24",
      change: "100% melapor",
      icon: Users,
      color: "bg-green-500",
    },
    {
      label: "Total Siswa",
      value: "856",
      change: "Di 32 kelas",
      icon: GraduationCap,
      color: "bg-purple-500",
    },
    {
      label: "Tingkat Penyelesaian Rata-rata",
      value: "94%",
      change: "+3% dari bulan lalu",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  const weeklyReports = [
    { day: "Sen", reports: 18, onTime: 16, late: 2 },
    { day: "Sel", reports: 22, onTime: 20, late: 2 },
    { day: "Rab", reports: 20, onTime: 19, late: 1 },
    { day: "Kam", reports: 24, onTime: 22, late: 2 },
    { day: "Jum", reports: 21, onTime: 21, late: 0 },
  ];

  const departmentPerformance = [
    { department: "Matematika", reports: 85, completion: 98, avgScore: 87 },
    { department: "Sains", reports: 78, completion: 95, avgScore: 84 },
    { department: "Bahasa Inggris", reports: 92, completion: 100, avgScore: 89 },
    { department: "Sejarah", reports: 68, completion: 92, avgScore: 82 },
    { department: "Seni", reports: 45, completion: 97, avgScore: 90 },
  ];

  const teacherActivity = [
    {
      name: "Jane Doe",
      department: "Matematika",
      reports: 12,
      status: "Sesuai Target",
      lastReport: "Hari ini, 14:30",
    },
    {
      name: "John Smith",
      department: "Sains",
      reports: 11,
      status: "Sesuai Target",
      lastReport: "Hari ini, 13:45",
    },
    {
      name: "Sarah Johnson",
      department: "Bahasa Inggris",
      reports: 13,
      status: "Sesuai Target",
      lastReport: "Hari ini, 15:15",
    },
    {
      name: "Mike Wilson",
      department: "Sejarah",
      reports: 9,
      status: "Tertunda",
      lastReport: "Kemarin, 16:00",
    },
    {
      name: "Emily Brown",
      department: "Seni",
      reports: 10,
      status: "Sesuai Target",
      lastReport: "Hari ini, 11:30",
    },
  ];

  const pendingReviews = [
    {
      teacher: "Jane Doe",
      class: "Kelas 10A",
      subject: "Matematika",
      submitted: "2 jam yang lalu",
      priority: "Normal",
    },
    {
      teacher: "John Smith",
      class: "Kelas 9B",
      subject: "Sains",
      submitted: "4 jam yang lalu",
      priority: "Normal",
    },
    {
      teacher: "Mike Wilson",
      class: "Kelas 11A",
      subject: "Sejarah",
      submitted: "1 hari yang lalu",
      priority: "Tinggi",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Dasbor Kepala Sekolah</h1>
        <p className="text-muted-foreground">
          Pantau pelaporan dan performa guru di seluruh sekolah
        </p>
      </div>

      {/* School-wide Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {schoolStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className={`${stat.color} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <h3 className="text-foreground mb-1 text-xl md:text-3xl">{stat.value}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">{stat.label}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Weekly Report Submission */}
        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <h3 className="text-foreground mb-4">Pengumpulan Laporan Mingguan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="onTime" stackId="a" fill="#10b981" name="Tepat Waktu" radius={[8, 8, 0, 0]} />
              <Bar dataKey="late" stackId="a" fill="#ef4444" name="Terlambat" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <h3 className="text-foreground mb-4">Tingkat Penyelesaian Departemen</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="department" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="completion"
                stroke="#3b82f6"
                strokeWidth={3}
                name="% Penyelesaian"
                dot={{ fill: "#3b82f6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Teacher Activity */}
        <div className="bg-card rounded-lg md:rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground">Aktivitas Guru</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {teacherActivity.map((teacher, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {teacher.department} • {teacher.reports} laporan minggu ini
                      </p>
                      <p className="text-xs text-muted-foreground">{teacher.lastReport}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      teacher.status === "Sesuai Target"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-card rounded-lg md:rounded-xl border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-foreground">Tinjauan Tertunda</h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
              {pendingReviews.length} tertunda
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingReviews.map((review, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    review.priority === "Tinggi"
                      ? "bg-red-50 border-red-200"
                      : "bg-muted border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {review.priority === "Tinggi" ? (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-foreground">{review.teacher}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.class} • {review.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{review.submitted}</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    Tinjau Laporan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Department Overview Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-foreground">Gambaran Departemen</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-foreground">Departemen</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Laporan</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Penyelesaian</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Skor Rata-rata</th>
                <th className="px-6 py-4 text-left text-sm text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {departmentPerformance.map((dept, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="text-sm text-foreground">{dept.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{dept.reports}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${dept.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-foreground">{dept.completion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{dept.avgScore}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        dept.completion >= 95
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {dept.completion >= 95 ? "Sangat Baik" : "Baik"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
