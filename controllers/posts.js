require('dotenv').config();

const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const { cloudinary } = require('../cloudinary');

module.exports = {
	async postIndex(req, res, next) {
		const { dbQuery } = res.locals;
		delete res.locals.dbQuery;
		let posts = await Post.paginate(dbQuery, {
			page: req.query.page || 1,
			limit: 10,
			sort: {
				'_id': -1
			}
		});
		posts.page = Number(posts.page);
		if (!posts.docs.length && res.locals.query) {
			res.locals.error = 'No results match that query.';
		}
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
			req.body.post.images.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		let response = await geocodingClient
			.forwardGeocode({
				query: req.body.post.location,
				limit: 1
			})
			.send();
		req.body.post.geometry = response.body.features[0].geometry;
		req.body.post.author = req.user._id;
		let post = new Post(req.body.post);
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		await post.save();
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
		// const floorRating = post.calculateAvgRating();
		const floorRating = post.avgRating;
		res.render('posts/show', { post, floorRating });
	},

	postEdit(req, res, next) {
		res.render('posts/edit');
	},

	async postUpdate(req, res, next) {
		// find the post by id
		const { post } = res.locals;
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
				// add images to post.images array
				post.images.push({
					url: file.secure_url,
					public_id: file.public_id
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
			post.geometry = response.body.features[0].geometry;
			post.location = req.body.post.location;
		}
		// update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		post.price = req.body.post.price;
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		// save the updated post into the db
		await post.save();
		// redirect to show page
		res.redirect(`/posts/${post.id}`);
	},

	async postDestroy(req, res, next) {
		// let post = await Post.findById(req.params.id);
		const { post } = res.locals;
		for (const image of post.images) {
			await cloudinary.v2.uploader.destroy(image.public_id);
		}
		await post.remove();
		req.session.success = 'Post deleted successfully!';
		res.redirect('/posts');
	}
}