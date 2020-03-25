const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

/* GET register. */
router.get('/register', (req, res, next) => {
  res.send('GET /register');
});

/* POST register. */
router.post('/register', (req, res, next) => {
  res.send('POST /register');
});

/* GET login. */
router.get('/login', (req, res, next) => {
  res.send('GET /login');
});

/* POST login. */
router.post('/login', (req, res, next) => {
  res.send('POST /login');
});

/* GET profile. */
router.get('/profile', (req, res, next) => {
  res.send('GET /profile');
});

/* PUT profile/:user_id. */
router.put('/profile/:user_id', (req, res, next) => {
  res.send('UPDATE /profile/:user_id');
});

/* GET /forgot-pw. */
router.get('/forgot-pw', (req, res, next) => {
  res.send('UPDATE /forgot-pw');
});

/* PUT /forgot-pw. */
router.put('/forgot-pw', (req, res, next) => {
  res.send('UPDATE /forgot-pw');
});

/* GET /reset-pw. */
router.get('/reset-pw/:token', (req, res, next) => {
  res.send('UPDATE /reset-pw');
});

/* PUT /reset-pw. */
router.put('/reset-pw/:token', (req, res, next) => {
  res.send('UPDATE /reset-pw');
});

module.exports = router;
