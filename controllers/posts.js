require('dotenv').config();

const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'doxcdijnp',
	api_key: '937721645959596',
	api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {
	async postIndex(req, res, next) {
		let posts = await Post.paginate({}, {
			page: req.query.page || 1,
			limit: 10
		});
		posts.page = Number(posts.page);
		res.render('posts/index', {
			posts: posts,
			title: 'Post Index',
			mapboxToken: process.env.MAPBOX_TOKEN
		});
	},

	postNew(req, res, next) {
		res.render('posts/new', { title: 'New Post' });
	},

	async postCreate(req, res, next) {
		req.body.post.images = [];
		for(const file of req.files) {
			let image = await cloudinary.v2.uploader.upload(file.path);
			req.body.post.images.push({
				url: image.secure_url,
				public_id: image.public_id
			});
		}
		let response = await geocodingClient
			.forwardGeocode({
				query: req.body.post.location,
				limit: 1
			})
			.send();
		req.body.post.coordinates = response.body.features[0].geometry.coordinates;
		let post = await Post.create(req.body.post);
		req.session.success = 'Post created successfully!';
		res.redirect(`/posts/${post.id}`);
	},

	async postShow(req, res, next) {
		let post = await Post.findById(req.params.id).populate({
			path: 'reviews',
			options: { sort: { '_id': -1 } },
			populate: {
				path: 'author',
				model: 'User'
			}
		});
		const floorRating = post.calculateAvgRating();
		res.render('posts/show', { post, floorRating });
	},

	async postEdit(req, res, next) {
		let post = await Post.findById(req.params.id);
		res.render('posts/edit', { post });
	},

	async postUpdate(req, res, next) {
		// find the post by id
		let post = await Post.findById(req.params.id);
		// check if there is any image for deletion
		if (req.body.deleteImages && req.body.deleteImages.length) {
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for (const public_id of deleteImages) {
				// delete images from cloudinary
				await cloudinary.v2.uploader.destroy(public_id);
				// delete images from post.images
				for (const image of post.images) {
					if (image.public_id === public_id) {
						let index = post.images.indexOf(image);
						post.images.splice(index, 1);
					}
				}
			}
		}
		// check if there are new image for upload
		if (req.files) {
			// upload images
			for (const file of req.files) {
				let image = await cloudinary.v2.uploader.upload(file.path);
				// add images to post.images array
				post.images.push({
					url: image.secure_url,
					public_id: image.public_id
				});
			}
		}
		// check if the user has changed the location
		if (req.body.post.location !== post.location) {
			let response = await geocodingClient
				.forwardGeocode({
					query: req.body.post.location,
					limit: 1
				})
				.send();
			post.coordinates = response.body.features[0].geometry.coordinates;
			post.location = req.body.post.location;
		}
		// update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		post.price = req.body.post.price;
		// save the updated post into the db
		post.save();
		// redirect to show page
		res.redirect(`/posts/${post.id}`);
	},

	async postDestroy(req, res, next) {
		let post = await Post.findById(req.params.id);
		for (const image of post.images) {
			await cloudinary.v2.uploader.destroy(image.public_id);
		}
		await post.remove();
		req.session.success = 'Post deleted successfully!';
		res.redirect('/posts');
	}
}