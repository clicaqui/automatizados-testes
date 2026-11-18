const users = [
  { id: 1, name: 'Ana', email: 'ana@email.com' },
  { id: 2, name: 'Bruno', email: 'bruno@email.com' },
];

async function findUserById(id) {
  // Simula delay de banco
  await new Promise(resolve => setTimeout(resolve, 10));
  return users.find(u => u.id === id) || null;
}

async function createUser(name, email) {
  const newUser = {
    id: users.length + 1,
    name,
    email,
  };
  users.push(newUser);
  return newUser;
}

module.exports = { findUserById, createUser };