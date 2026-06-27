import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Users, Award, AlertCircle, Download } from "lucide-react";

export function GradeRecapPage() {
  const [selectedClass, setSelectedClass] = useState("10A");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const gradeDistribution = [
    { grade: "A", count: 8, percentage: 25 },
    { grade: "B", count: 12, percentage: 37.5 },
    { grade: "C", count: 7, percentage: 21.9 },
    { grade: "D", count: 3, percentage: 9.4 },
    { grade: "F", count: 2, percentage: 6.2 },
  ];

  const performanceTrend = [
    { month: "Jan", average: 75, attendance: 92 },
    { month: "Feb", average: 78, attendance: 90 },
    { month: "Mar", average: 82, attendance: 94 },
    { month: "Apr", average: 80, attendance: 91 },
    { month: "May", average: 85, attendance: 95 },
  ];

  const topPerformers = [
    { name: "Alice Johnson", grade: "A+", score: 98, trend: "up" },
    { name: "Bob Smith", grade: "A+", score: 96, trend: "up" },
    { name: "Carol Davis", grade: "A", score: 94, trend: "stable" },
    { name: "David Wilson", grade: "A", score: 92, trend: "up" },
    { name: "Emma Brown", grade: "A-", score: 90, trend: "down" },
  ];

  const needsAttention = [
    { name: "Frank Miller", grade: "D", score: 65, issue: "Kehadiran rendah" },
    { name: "Grace Lee", grade: "D", score: 68, issue: "Tugas belum dikumpul" },
    { name: "Henry Taylor", grade: "F", score: 58, issue: "Kesulitan memahami materi" },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground mb-2">Rekap Nilai & Analitik</h1>
          <p className="text-muted-foreground text-sm md:text-base">Lacak performa siswa dan identifikasi tren</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
          <Download className="w-5 h-5" />
          Ekspor Laporan
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-foreground mb-2">Pilih Kelas</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="10A">Kelas 10A</option>
              <option value="10B">Kelas 10B</option>
              <option value="11A">Kelas 11A</option>
              <option value="11B">Kelas 11B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-foreground mb-2">Periode Waktu</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="quarter">Kuartal Ini</option>
              <option value="semester">Semester Ini</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="bg-green-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs md:text-sm">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
              +5%
            </div>
          </div>
          <h3 className="text-foreground mb-1 text-xl md:text-3xl">85%</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Rata-rata Kelas</p>
        </div>

        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="bg-blue-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-xs md:text-sm">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
              +3%
            </div>
          </div>
          <h3 className="text-foreground mb-1 text-xl md:text-3xl">95%</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Rata-rata Kehadiran</p>
        </div>

        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="bg-orange-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-xs md:text-sm">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
              +12%
            </div>
          </div>
          <h3 className="text-foreground mb-1 text-xl md:text-3xl">25%</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Siswa Nilai A</p>
        </div>

        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="bg-red-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            </div>
            <div className="flex items-center gap-1 text-red-600 text-xs md:text-sm">
              <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
              -2%
            </div>
          </div>
          <h3 className="text-foreground mb-1 text-xl md:text-3xl">3</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Butuh Perhatian</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Performance Trend Chart */}
        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <h3 className="text-foreground mb-4">Tren Performa</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="average" fill="#3b82f6" name="Skor Rata-rata" radius={[8, 8, 0, 0]} />
              <Bar dataKey="attendance" fill="#10b981" name="% Kehadiran" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 border border-border">
          <h3 className="text-foreground mb-4">Distribusi Nilai</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ grade, percentage }) => `${grade}: ${percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Performers */}
        <div className="bg-card rounded-lg md:rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground">Siswa Berprestasi</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPerformers.map((student, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Skor: {student.score}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {student.grade}
                    </span>
                    {student.trend === "up" && (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Students Need Attention */}
        <div className="bg-card rounded-lg md:rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground">Siswa Butuh Perhatian</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {needsAttention.map((student, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground mb-1">Skor: {student.score}</p>
                      <p className="text-xs text-red-600">{student.issue}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                    {student.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
