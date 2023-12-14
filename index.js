const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const userRoute = require('./routes/auth');
const weeklistRoute = require('./routes/weeklist');
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', userRoute);

app.use('/', weeklistRoute);
app.get('/', (req, res) => {
  res.json({ message: 'All good!' });
});

app.get('/health', (req, res) => {
  let time = new Date().toLocaleTimeString();
  res.json({ time: time, app: 'weeklist-server', state: 'active' });
});

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected Successfully'))
    .catch((err) => console.log('error'));
  console.log('server running successfully');
});
