const { describe, it, mock, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const { getUser, addUser } = require('../src/users');

describe('API de Usuários', () => {

  // ============================================
  // 1. Testes de unidade com mock
  // ============================================
  describe('getUser() - com mock do banco', () => {
    beforeEach(() => {
      // Restaura mocks entre testes
      mock.restoreAll();
    });

    it('deve retornar o usuário quando existir', async () => {
      // Mock da função do banco
      mock.method(db, 'findUserById', async () => ({
        id: 99,
        name: 'Mock User',
        email: 'mock@test.com',
      }));

      const user = await getUser(99);

      assert.strictEqual(user.name, 'Mock User');
      assert.strictEqual(user.email, 'mock@test.com');
    });

    it('deve lançar erro se usuário não existir', async () => {
      mock.method(db, 'findUserById', async () => null);

      await assert.rejects(
        () => getUser(999),
        { message: 'Usuário não encontrado' }
      );
    });

    it('deve lançar erro com ID inválido', async () => {
      await assert.rejects(
        () => getUser('abc'),
        { message: 'ID inválido' }
      );
    });
  });

  // ============================================
  // 2. Testes de integração da API (Supertest)
  // ============================================
  describe('GET /users/:id', () => {
    it('deve retornar 200 e o usuário', async () => {
      const res = await request(app)
        .get('/users/1')
        .expect(200);

      assert.strictEqual(res.body.id, 1);
      assert.strictEqual(res.body.name, 'Ana');
    });

    it('deve retornar 404 se usuário não existir', async () => {
      const res = await request(app)
        .get('/users/999')
        .expect(404);

      assert.strictEqual(res.body.error, 'Usuário não encontrado');
    });
  });

  describe('POST /users', () => {
    it('deve criar um usuário com sucesso', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Carlos', email: 'carlos@email.com' })
        .expect(201);

      assert.ok(res.body.id);
      assert.strictEqual(res.body.name, 'Carlos');
      assert.strictEqual(res.body.email, 'carlos@email.com');
    });

    it('deve retornar 400 se faltar nome ou email', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Sem Email' })
        .expect(400);

      assert.strictEqual(res.body.error, 'Nome e email são obrigatórios');
    });

    it('deve retornar 400 com email inválido', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Teste', email: 'email-invalido' })
        .expect(400);

      assert.strictEqual(res.body.error, 'Email inválido');
    });
  });
});