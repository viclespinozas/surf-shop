const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {
	// Reviews create
	async reviewCreate(req, res, next) {
		// find the post by its id
		let post = await Post.findById(req.params.id);
		// create the review
		req.body.review.author = req.user._id;
		let review = await Review.create(req.body.review);
		// assign review to post
		post.reviews.push(review);
		// save the post
		post.save();
		req.session.success = 'Review created successfully';
		// redirect to the post
		res.redirect(`/posts/${post.id}`);
	},
	// Reviews update
	async reviewUpdate(req, res, next) {

	},
	// Reviews destroy
	async reviewDestroy(req, res, next) {

	}
}