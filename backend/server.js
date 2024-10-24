import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import validator from 'validator';

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
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
      res.status(err.status).end();
    }
  });
});

// Rute untuk mengambil data user berdasarkan ID
app.get('/api/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';  
  connection.all(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Rute untuk mengubah email user berdasarkan ID
app.post('/api/user/:id/change-email', (req, res) => {
  const newEmail = req.body.email;
  console.log(`Attempting to change email to: ${newEmail}`);  

  // Validasi dan sanitasi email
  if (!validator.isEmail(newEmail)) {
    console.log('Invalid email format');
    return res.status(400).send('Invalid email format');
  }

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
      console.error(err);
      res.status(404).send('File not found');
    }
  });
});

// Menjalankan server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
