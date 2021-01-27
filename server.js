const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const config = require('./config');
const { connectDb } = require('./database');
const User = require('./models/User');
const { authCheck } = require('./middleware/authCheck');
require('./passport-setup');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
  // Check if username and password
  const { username, password } = req.body;
  
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    password: hash,
  });
  await newUser.save();

  const token = jwt.sign({ id: newUser.id }, config.jwt.secret, { expiresIn: '24h' });

  res.json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
    },
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'user does not exist' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'password incorrect' });

  const token = jwt.sign({ id: user.id }, config.jwt.secret, { expiresIn: '24h' });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  });
});

app.get('/profile', authCheck, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user: user.username });
});

(async () => {

  await connectDb();

  app.listen(config.port, () => {
    console.log(`Server listening on PORT:${config.port}`);
  });
})();

