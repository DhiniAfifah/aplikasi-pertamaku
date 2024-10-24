import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import validator from 'validator';

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Mengizinkan semua asal
  optionsSuccessStatus: 200,
}));

const connection = new sqlite3.Database('./db/aplikasi.db');

// Rute untuk menampilkan gambar saat mengakses root
app.get('/', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const imagePath = path.join(__dirname, 'files', 'image.jpg');
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(err);
      res.status(err.status || 500).send('Internal Server Error'); // Menggunakan status 500 jika tidak ada status di err
    }
  });
});

// Rute untuk mengambil data user berdasarkan ID
app.get('/api/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.all(query, [req.params.id], (error, results) => {
    if (error) {
      console.error('Error fetching user data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Mengembalikan user jika ditemukan, jika tidak mengembalikan pesan
    res.json(results.length ? results : { message: 'User not found' });
  });
});

// Rute untuk mengubah email user berdasarkan ID
app.post('/api/user/:id/change-email', (req, res) => {
  const newEmail = req.body.email;
  console.log(`Attempting to change email to: ${newEmail}`);

  // Validasi format email
  if (!validator.isEmail(newEmail)) {
    console.log('Invalid email format');
    return res.status(400).send('Invalid email format');
  }

  // Update email pengguna di database
  const query = 'UPDATE users SET email = ? WHERE id = ?';
  connection.run(query, [newEmail, req.params.id], function (err) {
    if (err) {
      console.error('Error changing email:', err);
      return res.status(500).send('Failed to change email');
    }

    console.log(`Number of changes: ${this.changes}`);
    if (this.changes === 0) {
      console.log('User not found');
      return res.status(404).send('User not found');
    } else {
      console.log('Email updated successfully');
      return res.status(200).send('Email updated successfully');
    }
  });
});

// Rute untuk mengambil file berdasarkan query parameter
app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, 'files', req.query.name);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error fetching file:', err);
      res.status(err.status || 404).send('File not found'); // Menggunakan status 404 jika tidak ada status di err
    }
  });
});

// Rute untuk mengambil data berdasarkan nama
app.get('/api/user/name/:name', (req, res) => {
  const query = 'SELECT * FROM users WHERE name = ?';
  connection.all(query, [req.params.name], (error, results) => {
    if (error) {
      console.error('Error fetching user by name:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Mengembalikan user jika ditemukan, jika tidak mengembalikan pesan
    res.json(results.length ? results : { message: 'User not found' });
  });
});

// Menjalankan server
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
