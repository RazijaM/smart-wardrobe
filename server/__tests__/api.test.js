/**
 * API integration tests for Smart Wardrobe
 * Run: npm test (from server folder)
 * Requires: supertest (npm install supertest --save-dev)
 */

const request = require('supertest');
const assert = require('assert');
const app = require('../app');

async function runTests() {
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      passed++;
      console.log('  ✓', name);
    } catch (e) {
      failed++;
      console.log('  ✗', name, '-', e.message);
    }
  };

  console.log('\nSmart Wardrobe API Tests\n');

  await test('GET /api/news returns 200 for guests', async () => {
    const res = await request(app).get('/api/news');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  await test('GET /api/clothes without token returns 401', async () => {
    const res = await request(app).get('/api/clothes');
    assert.strictEqual(res.status, 401);
  });

  await test('GET /api/outfits without token returns 401', async () => {
    const res = await request(app).get('/api/outfits');
    assert.strictEqual(res.status, 401);
  });

  await test('GET /api/trips without token returns 401', async () => {
    const res = await request(app).get('/api/trips');
    assert.strictEqual(res.status, 401);
  });

  await test('GET /api/admin/news without token returns 401', async () => {
    const res = await request(app).get('/api/admin/news');
    assert.strictEqual(res.status, 401);
  });

  await test('POST /api/auth/login invalid creds returns 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'nonexistent', password: 'wrong' });
    assert.strictEqual(res.status, 401);
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
