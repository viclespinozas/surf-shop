const express = require('express');
const router = express.Router();
const { postRegister, postLogin, getLogout } = require('../controllers');
const { asyncErrorHandler } = require('../middleware')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

/* GET register. */
router.get('/register', (req, res, next) => {
  res.send('GET /register');
});

/* POST register. */
router.post('/register', asyncErrorHandler(postRegister));

/* GET login. */
router.get('/login', (req, res, next) => {
  res.send('GET /login');
});

/* POST login. */
router.post('/login', postLogin);

router.get('/logout', getLogout);

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

/* GET /reset-pw/:token */
router.get('/reset-pw/:token', (req, res, next) => {
  res.send('UPDATE /reset-pw');
});

/* PUT /reset-pw/:token */
router.put('/reset-pw/:token', (req, res, next) => {
  res.send('UPDATE /reset-pw');
});

module.exports = router;
