const db = require('./db');

async function getUser(id) {
  if (!id || isNaN(id)) {
    throw new Error('ID inválido');
  }

  const user = await db.findUserById(Number(id));
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
}

async function addUser(name, email) {
  if (!name || !email) {
    throw new Error('Nome e email são obrigatórios');
  }

  if (!email.includes('@')) {
    throw new Error('Email inválido');
  }

  return await db.createUser(name, email);
}

module.exports = { getUser, addUser };