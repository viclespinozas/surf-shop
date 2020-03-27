const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
	body: String,
	author: {
		type: Schema.Types.Objectid,
		ref: 'User'
	}
});

module.exports = mongoose.model('Review', UserSchema);