import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise.js';
import { randomUUID } from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Buat connection pool ke MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'edureport',
  waitForConnections: true,
});

// Inisialisasi tabel jika belum ada
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
        department VARCHAR(255),
        school VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
        attachments TEXT,
        status VARCHAR(100) DEFAULT 'Selesai',
        userId VARCHAR(36) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database tabel siap!');
  } finally {
    conn.release();
  }
}

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Email atau password salah' });
    if (user.password !== password) return res.status(401).json({ error: 'Email atau password salah' });
    const { password: _, ...safeUser } = user;
    res.json({ message: 'Login berhasil', user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email sudah terdaftar' });

    const id = randomUUID();
    await pool.execute(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, fullName, email, password, role || 'teacher']
    );
    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// --- Report Routes ---
app.get('/api/reports', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM reports ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

app.post('/api/reports', async (req, res) => {
  const { subject, className, date, learningTopic, teachingMethod, studentFeedback, challenges, userId } = req.body;
  try {
    const id = randomUUID();
    await pool.execute(
      'INSERT INTO reports (id, subject, className, date, learningTopic, teachingMethod, studentFeedback, challenges, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, subject, className, date, learningTopic, teachingMethod, studentFeedback || null, challenges || null, userId]
    );
    res.status(201).json({ message: 'Laporan berhasil dibuat', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Gagal koneksi ke database:', err.message);
  process.exit(1);
});
