const express = require('express');
const router = express.Router();
const { asynErrorHandler } = require('../middleware');
const { 
	postIndex,
	postNew,
	postCreate,
	postShow,
	postEdit,
	postUpdate,
	postDestroy 
} = require('../controllers/posts');

/* GET posts index /posts */
router.get('/', asynErrorHandler(postIndex));

/* GET posts new /posts/new */
router.get('/new', postNew);

/* POST posts create /posts */
router.post('/', asynErrorHandler(postCreate));

/* GET posts show /posts/:id */
router.get('/:id', asynErrorHandler(postShow));

/* GET posts edit /posts/:id/edit */
router.get('/:id/edit', asynErrorHandler(postEdit));

/* PUT posts update /posts/:id/ */
router.put('/:id', asynErrorHandler(postUpdate));

/* DELETE posts destroy /posts/:id/ */
router.delete('/:id', asynErrorHandler(postDestroy));

module.exports = router;
