import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../../lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk");
      }

      // Menyimpan data session user asli ke localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login berhasil! Selamat datang kembali.");

      // Redirect berdasarkan role
      const destination = data.user.role === "principal" ? "/principal" : "/";
      setTimeout(() => navigate(destination), 1000);
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan koneksi ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-foreground mb-2">Edu Report</h1>
          <p className="text-muted-foreground">Masuk ke Akun Anda</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-foreground mb-2">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="guru@sekolah.edu"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2">
                <label className="text-sm text-foreground">Kata Sandi</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex justify-end mt-1.5">
                <a href="#" className="text-xs text-primary hover:underline">Lupa sandi?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}