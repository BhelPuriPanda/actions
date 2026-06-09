import request from 'supertest';
import app, { pool } from './index.js';

describe('GET /', () => {
    it('should return 200', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    });

    it('should return Hello from Express!', async () => {
        const res = await request(app).get('/');
        expect(res.text).toBe('Hello from Express!');
    });
});

afterAll(async () => {
    await pool.end();
});