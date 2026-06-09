import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const databaseUrl = process.env.DATABASE_URL || '';
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false }
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export { pool };
export default app;