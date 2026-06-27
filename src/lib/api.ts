/**
 * Konfigurasi terpusat untuk URL backend API.
 * Ubah hanya di sini jika URL server berubah.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/** Ambil semua laporan milik user tertentu */
export const getReportsByUser = (userId: string) =>
  fetch(`${API_BASE_URL}/api/reports?userId=${userId}`).then((r) => r.json());

/** Ambil semua laporan (untuk kepala sekolah) */
export const getAllReports = () =>
  fetch(`${API_BASE_URL}/api/reports`).then((r) => r.json());

/** Ambil satu laporan berdasarkan ID */
export const getReportById = (id: string) =>
  fetch(`${API_BASE_URL}/api/reports/${id}`).then((r) => r.json());

/** Ambil data user berdasarkan ID */
export const getUserById = (id: string) =>
  fetch(`${API_BASE_URL}/api/users/${id}`).then((r) => r.json());

/** Ambil semua user (untuk kepala sekolah) */
export const getAllUsers = () =>
  fetch(`${API_BASE_URL}/api/users`).then((r) => r.json());

/** Update profil user */
export const updateUser = (id: string, data: Record<string, unknown>) =>
  fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

/** Login */
export const loginUser = (email: string, password: string) =>
  fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

/** Register */
export const registerUser = (data: Record<string, unknown>) =>
  fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());
