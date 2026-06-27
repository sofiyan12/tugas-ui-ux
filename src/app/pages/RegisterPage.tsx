import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { GraduationCap, Mail, Lock, User, Building, Phone } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../../lib/api";

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    school: "",
    department: "",
    role: "teacher",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi kecocokan password di frontend
    if (formData.password !== formData.confirmPassword) {
      toast.error("Kata sandi tidak cocok");
      return;
    }

    setIsLoading(true);
    try {
      // Pisahkan confirmPassword dari object yang akan dikirim ke API backend
      const { confirmPassword, ...dataToSubmit } = formData;

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit), // Mengirimkan objek data bersih
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftar");
      }

      toast.success("Pendaftaran berhasil! Silakan masuk.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-foreground mb-2">Gabung Edu Report</h1>
          <p className="text-muted-foreground">Buat akun Anda</p>
        </div>

        {/* Registration Form */}
        <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-foreground mb-6 text-center">Buat Akun</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground mb-2">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="guru@sekolah.edu"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Nomor Telepon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="+62 812 3456 7890"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Nama Sekolah</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="SMA Negeri 1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Departemen / Mata Pelajaran</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Pilih Departemen</option>
                  <option value="mathematics">Matematika</option>
                  <option value="science">Sains</option>
                  <option value="english">Bahasa Inggris</option>
                  <option value="history">Sejarah</option>
                  <option value="arts">Seni</option>
                  <option value="physical-education">Pendidikan Jasmani</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Peran Akun</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="teacher">Guru</option>
                  <option value="principal">Kepala Sekolah</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" className="w-4 h-4 mt-1 text-primary rounded" required />
              <label className="text-sm text-muted-foreground">
                Saya setuju dengan{" "}
                <a href="#" className="text-primary hover:underline">
                  Syarat dan Ketentuan
                </a>{" "}
                serta{" "}
                <a href="#" className="text-primary hover:underline">
                  Kebijakan Privasi
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Memproses..." : "Buat Akun"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          © 2026 Sistem Edu Report.
        </p>
      </div>
    </div>
  );
}