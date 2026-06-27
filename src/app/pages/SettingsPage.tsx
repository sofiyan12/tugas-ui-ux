import { useState } from "react";
import { User, Bell, Lock, Globe, Palette, Save, Mail, Phone, Building } from "lucide-react";
import { toast } from "sonner";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    fullName: "Jane Doe",
    email: "jane.doe@school.edu",
    phone: "+1 (555) 123-4567",
    school: "SMA Lincoln",
    department: "Matematika",
  });

  const [notifications, setNotifications] = useState({
    emailReports: true,
    emailReminders: true,
    pushNotifications: true,
    weeklyDigest: false,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    theme: "light",
  });

  const handleSaveProfile = () => {
    toast.success("Profil berhasil diperbarui");
  };

  const handleSaveNotifications = () => {
    toast.success("Preferensi notifikasi disimpan");
  };

  const handleSavePreferences = () => {
    toast.success("Preferensi berhasil diperbarui");
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "security", label: "Keamanan", icon: Lock },
    { id: "preferences", label: "Preferensi", icon: Globe },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola pengaturan dan preferensi akun Anda</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs - Desktop Sidebar / Mobile Top */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-2 overflow-x-auto">
            <div className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-foreground mb-6">Informasi Profil</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Alamat Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Nomor Telepon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Nama Sekolah</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={profileData.school}
                      onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Departemen</label>
                  <select
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Mathematics">Matematika</option>
                    <option value="Science">Sains</option>
                    <option value="English">Bahasa Inggris</option>
                    <option value="History">Sejarah</option>
                    <option value="Arts">Seni</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-foreground mb-6">Preferensi Notifikasi</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-foreground">Email - Pengumpulan Laporan</p>
                    <p className="text-xs text-muted-foreground">Dapatkan notifikasi saat laporan dikumpulkan</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailReports}
                    onChange={(e) =>
                      setNotifications({ ...notifications, emailReports: e.target.checked })
                    }
                    className="w-5 h-5 text-primary rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-foreground">Email - Pengingat</p>
                    <p className="text-xs text-muted-foreground">Pengingat harian untuk laporan yang tertunda</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailReminders}
                    onChange={(e) =>
                      setNotifications({ ...notifications, emailReminders: e.target.checked })
                    }
                    className="w-5 h-5 text-primary rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-foreground">Notifikasi Push</p>
                    <p className="text-xs text-muted-foreground">Notifikasi peramban untuk pembaruan penting</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.pushNotifications}
                    onChange={(e) =>
                      setNotifications({ ...notifications, pushNotifications: e.target.checked })
                    }
                    className="w-5 h-5 text-primary rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-foreground">Ringkasan Mingguan</p>
                    <p className="text-xs text-muted-foreground">Ringkasan aktivitas mingguan Anda</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.weeklyDigest}
                    onChange={(e) =>
                      setNotifications({ ...notifications, weeklyDigest: e.target.checked })
                    }
                    className="w-5 h-5 text-primary rounded"
                  />
                </div>

                <button
                  onClick={handleSaveNotifications}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Simpan Preferensi
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-foreground mb-6">Pengaturan Keamanan</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Kata Sandi Baru</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <Save className="w-5 h-5" />
                  Perbarui Kata Sandi
                </button>

                <div className="pt-6 border-t border-border">
                  <h4 className="text-foreground mb-4">Autentikasi Dua Faktor</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tambahkan lapisan keamanan ekstra ke akun Anda
                  </p>
                  <button className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors">
                    Aktifkan 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-foreground mb-6">Preferensi</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">Bahasa</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="en">Inggris</option>
                    <option value="es">Spanyol</option>
                    <option value="fr">Prancis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Zona Waktu</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="America/New_York">Waktu Timur (ET)</option>
                    <option value="America/Chicago">Waktu Tengah (CT)</option>
                    <option value="America/Denver">Waktu Pegunungan (MT)</option>
                    <option value="America/Los_Angeles">Waktu Pasifik (PT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Format Tanggal</label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Tema</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPreferences({ ...preferences, theme: "light" })}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        preferences.theme === "light"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-muted"
                      }`}
                    >
                      <Palette className="w-6 h-6 mx-auto mb-2 text-foreground" />
                      <p className="text-sm text-foreground">Terang</p>
                    </button>
                    <button
                      onClick={() => setPreferences({ ...preferences, theme: "dark" })}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        preferences.theme === "dark"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-muted"
                      }`}
                    >
                      <Palette className="w-6 h-6 mx-auto mb-2 text-foreground" />
                      <p className="text-sm text-foreground">Gelap</p>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Simpan Preferensi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
