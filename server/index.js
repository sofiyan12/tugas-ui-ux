import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise.js';
import { randomUUID } from 'crypto';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan semua localhost (port berapa pun) dan request tanpa origin (curl/Postman)
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'edureport',
  waitForConnections: true,
});

async function initDB() {
  const conn = await pool.getConnection();
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'teacher',
        phone VARCHAR(20),
        school VARCHAR(255),
        department VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(36) PRIMARY KEY,
        subject VARCHAR(255) NOT NULL,
        className VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        learningTopic TEXT NOT NULL,
        teachingMethod TEXT NOT NULL,
        studentFeedback TEXT,
        challenges TEXT,
        attachments LONGTEXT,
        status VARCHAR(100) DEFAULT 'Menunggu Tinjauan',
        reviewNote TEXT,
        approvedAt DATETIME,
        userId VARCHAR(36) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Tambah kolom jika belum ada (untuk DB lama)
    try {
      await conn.execute(`ALTER TABLE reports ADD COLUMN reviewNote TEXT`);
    } catch (e) { /* abaikan */ }
    try {
      await conn.execute(`ALTER TABLE reports ADD COLUMN approvedAt DATETIME`);
    } catch (e) { /* abaikan */ }
    try {
      await conn.execute(`ALTER TABLE users ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP`);
    } catch (e) { /* abaikan */ }
    console.log('✅ Database siap!');
  } finally {
    conn.release();
  }
}

// ── AUTH ──
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user || user.password !== password)
      return res.status(401).json({ error: 'Email atau password salah' });
    const { password: _, ...safeUser } = user;
    res.json({ message: 'Login berhasil', user: safeUser });
  } catch {
    res.status(500).json({ error: 'Kesalahan server' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, password, role, phone, school, department } = req.body;
  try {
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    const id = randomUUID();
    await pool.execute(
      'INSERT INTO users (id, name, email, password, role, phone, school, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, fullName, email, password, role || 'teacher', phone || null, school || null, department || null]
    );
    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch {
    res.status(500).json({ error: 'Kesalahan server saat mendaftar' });
  }
});

// ── USERS ──
app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, phone, school, department FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil data user' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, phone, school, department, createdAt FROM users ORDER BY name ASC'
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil data user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { name, phone, school, department } = req.body;
  try {
    await pool.execute(
      'UPDATE users SET name = ?, phone = ?, school = ?, department = ? WHERE id = ?',
      [name, phone || null, school || null, department || null, req.params.id]
    );
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, phone, school, department FROM users WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Profil berhasil diperbarui', user: rows[0] });
  } catch {
    res.status(500).json({ error: 'Gagal memperbarui profil' });
  }
});

app.put('/api/users/:id/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const [rows] = await pool.execute('SELECT password FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
    if (rows[0].password !== currentPassword)
      return res.status(401).json({ error: 'Kata sandi saat ini salah' });
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [newPassword, req.params.id]);
    res.json({ message: 'Kata sandi berhasil diperbarui' });
  } catch {
    res.status(500).json({ error: 'Gagal memperbarui kata sandi' });
  }
});

// ── REPORTS ──
app.get('/api/reports', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = 'SELECT * FROM reports';
    const params = [];
    if (userId) {
      query += ' WHERE userId = ?';
      params.push(userId);
    }
    query += ' ORDER BY date DESC';
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
});

app.get('/api/reports/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM reports WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Laporan tidak ditemukan' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil laporan' });
  }
});

// Buat / Edit laporan
app.post('/api/reports', upload.array('files'), async (req, res) => {
  const { subject, className, date, learningTopic, teachingMethod, studentFeedback, challenges, userId, status, links } = req.body;
  try {
    let infoLampiran = [];
    if (req.files && req.files.length > 0) {
      const filesArr = req.files.map(file => ({
        name: file.originalname,
        type: file.mimetype.includes('pdf') ? 'PDF' : 'Gambar',
        url: `${process.env.SERVER_URL || 'http://localhost:8080'}/uploads/${file.filename}`
      }));
      infoLampiran = [...infoLampiran, ...filesArr];
    }
    if (links) {
      try { infoLampiran = [...infoLampiran, ...JSON.parse(links)]; } catch {}
    }

    const id = req.body.id || randomUUID();
    const attachmentsValue = infoLampiran.length > 0 ? JSON.stringify(infoLampiran) : null;

    if (req.body.id) {
      await pool.execute(
        'UPDATE reports SET subject=?, className=?, date=?, learningTopic=?, teachingMethod=?, studentFeedback=?, challenges=?, status=?, attachments=? WHERE id=?',
        [subject, className, date, learningTopic, teachingMethod, studentFeedback || null, challenges || null, status || 'Menunggu Tinjauan', attachmentsValue, id]
      );
    } else {
      await pool.execute(
        'INSERT INTO reports (id, subject, className, date, learningTopic, teachingMethod, studentFeedback, challenges, userId, status, attachments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, subject, className, date, learningTopic, teachingMethod, studentFeedback || null, challenges || null, userId, status || 'Menunggu Tinjauan', attachmentsValue]
      );
    }
    res.status(201).json({ message: 'Laporan berhasil diproses', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menyimpan laporan' });
  }
});

// ── APPROVE / REJECT laporan (untuk kepala sekolah) ──
app.put('/api/reports/:id/status', async (req, res) => {
  const { status, reviewNote } = req.body;
  const validStatuses = ['Selesai', 'Ditolak', 'Menunggu Tinjauan', 'Menunggu Review'];
  if (!validStatuses.includes(status))
    return res.status(400).json({ error: 'Status tidak valid' });
  try {
    const approvedAtVal = status === 'Selesai' ? new Date() : null;
    await pool.execute(
      'UPDATE reports SET status = ?, reviewNote = ?, approvedAt = ? WHERE id = ?',
      [status, reviewNote || null, approvedAtVal, req.params.id]
    );
    res.json({ message: 'Status laporan diperbarui', status });
  } catch {
    res.status(500).json({ error: 'Gagal memperbarui status laporan' });
  }
});

app.delete('/api/reports/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM reports WHERE id = ?', [req.params.id]);
    res.json({ message: 'Laporan berhasil dihapus' });
  } catch {
    res.status(500).json({ error: 'Gagal menghapus laporan' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));
});