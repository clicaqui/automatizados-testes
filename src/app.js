const express = require('express');
const { getUser, addUser } = require('./users');

const app = express();
app.use(express.json());

app.get('/users/:id', async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await addUser(name, email);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = app;