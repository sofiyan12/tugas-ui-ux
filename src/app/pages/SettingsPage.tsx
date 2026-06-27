import { useState, useEffect } from "react";
import { User, Bell, Lock, Globe, Palette, Save, Mail, Phone, Building } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../../lib/api";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    school: "",
    department: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailReports: true,
    emailReminders: true,
    pushNotifications: false,
    weeklyDigest: false,
  });

  const [preferences, setPreferences] = useState({
    language: "id",
    timezone: "Asia/Jakarta",
    theme: "light",
  });

  // Load data dari sesi login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    // Isi dari localStorage dulu agar langsung tampil
    setProfileData({
      id: user.id || "",
      fullName: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      school: user.school || "",
      department: user.department || "",
    });
    setIsLoadingProfile(false);

    // Lalu sinkron dari server untuk data terbaru
    if (user.id) {
      fetch(`${API_BASE_URL}/api/users/${user.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.id) {
            setProfileData({
              id: data.id,
              fullName: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              school: data.school || "",
              department: data.department || "",
            });
          }
        })
        .catch(() => {}); // Jika gagal, tetap pakai data localStorage
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!profileData.id) return;
    if (!profileData.fullName.trim()) {
      toast.error("Nama tidak boleh kosong");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${profileData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.fullName,
          phone: profileData.phone,
          school: profileData.school,
          department: profileData.department,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");

      // Update localStorage agar sidebar & header ikut terupdate
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...storedUser, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profil berhasil diperbarui");
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Semua field kata sandi harus diisi");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Kata sandi baru minimal 6 karakter");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${profileData.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengganti kata sandi");
      toast.success("Kata sandi berhasil diperbarui");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Keamanan", icon: Lock },
  ];

  const departmentOptions = [
    { value: "mathematics", label: "Matematika" },
    { value: "science", label: "Sains / IPA" },
    { value: "english", label: "Bahasa Inggris" },
    { value: "indonesian", label: "Bahasa Indonesia" },
    { value: "history", label: "Sejarah" },
    { value: "geography", label: "Geografi" },
    { value: "economics", label: "Ekonomi" },
    { value: "arts", label: "Seni Budaya" },
    { value: "physical-education", label: "Pendidikan Jasmani" },
    { value: "religion", label: "Pendidikan Agama" },
    { value: "ict", label: "TIK / Informatika" },
    { value: "other", label: "Lainnya" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola pengaturan dan preferensi akun Anda</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-2 overflow-x-auto lg:overflow-x-visible">
            <div className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap text-sm font-medium w-full text-left ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">

          {/* ── TAB PROFIL ── */}
          {activeTab === "profile" && (
            <div className="bg-card rounded-xl p-5 md:p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-5 text-base">Informasi Profil</h3>
              {isLoadingProfile ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-muted rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-foreground mb-1.5 font-medium">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        placeholder="Nama Lengkap"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground mb-1.5 font-medium">Alamat Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full pl-9 pr-4 py-2.5 bg-muted/65 border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed"
                        placeholder="email@sekolah.edu"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground mb-1.5 font-medium">Nomor Telepon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        placeholder="+62 812-3456-7890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground mb-1.5 font-medium">Nama Sekolah</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="school"
                        value={profileData.school}
                        onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        placeholder="Nama Sekolah"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground mb-1.5 font-medium">Departemen / Mata Pelajaran</label>
                    <select
                      name="department"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    >
                      <option value="">Pilih Departemen</option>
                      {departmentOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Menyimpan..." : "Simpan Profil"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── TAB KEAMANAN ── */}
          {activeTab === "security" && (
            <div className="bg-card rounded-xl p-5 md:p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-5 text-base">Ganti Kata Sandi</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground mb-1.5 font-medium">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-1.5 font-medium">Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    placeholder="Min. 6 karakter"
                  />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-1.5 font-medium">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" />
                  {isSaving ? "Memperbarui..." : "Perbarui Kata Sandi"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
