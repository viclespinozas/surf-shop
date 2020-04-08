mapboxgl.accessToken = 'pk.eyJ1IjoidmljdG9ybGVzcGlub3phcyIsImEiOiJjazhpbzFpdnEwM3hkM2VrMmg0bTUxeTVlIn0.iDffThlehPykR3aUx3nobg';
var coordinates = document.getElementById('coordinates');
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: post.coordinates,
	zoom: 10
});

// create the popup
var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
	'<p>' + post.title + '</p> ' + '<p>' + post.description + '</p>'
);

var marker = new mapboxgl.Marker({
	draggable: true
})
.setLngLat(post.coordinates)
.setPopup(popup)
.addTo(map);

function onDragEnd() {
	var lngLat = marker.getLngLat();
	coordinates.style.display = 'block';
	coordinates.innerHTML =
	'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
}

marker.on('dragend', onDragEnd);

// Toggle review edit form
$('.toggle-edit-form').on('click', function() {
	$(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
	$(this).siblings('.edit-review-form').toggle();
});