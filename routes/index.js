const express = require('express');
const router = express.Router();
const { 
	landingPage,
  getRegister,
	postRegister,
  getLogin,
	postLogin,
	getLogout,
  getProfile
} = require('../controllers');
const { asyncErrorHandler, isLoggedIn } = require('../middleware')

/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET register. */
router.get('/register', getRegister);

/* POST register. */
router.post('/register', asyncErrorHandler(postRegister));

/* GET login. */
router.get('/login', getLogin);

/* POST login. */
router.post('/login', asyncErrorHandler(postLogin));

router.get('/logout', getLogout);

/* GET profile. */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

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
