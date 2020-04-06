// find post edit form
let postEditForm = document.getElementById('postEditForm');
// add submit listener to post edit form
postEditForm.addEventListener('submit', function(event){
	// find length of uploaded images
	let imageUploads = document.getElementById('imageUpload').files.length;
	// find total number of existing images
	let existingimgs = document.querySelectorAll('.imageDeleteCheckbox').length;
	// find total number of potential deletions
	let imageDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
	// figure it out if the form can be submitted or not
	let newTotal = existingimgs - imageDeletions + imageUploads;
	if (existingimgs - imageDeletions + imageUploads > 4) {
		event.preventDefault();
		let newTotalAmt = newTotal - 4;
		alert(`You need to remove at least ${newTotalAmt} image${newTotalAmt === 1 ? '' : 's'}!`);
	}
});