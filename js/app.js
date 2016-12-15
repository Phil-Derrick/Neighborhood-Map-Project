'use strict';

// Global variables declared here.
var map,
	infowindow,
	breweries = [];

// Callback function for google maps API call. Initializes the app if API call
// is successful.
function cb() {
	map = new google.maps.Map(document.getElementById('map'), {
		scrollwheel: false,
		mapTypeControl: false,
		streetViewControl: false,
		styles: [
			  {
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#212121"
			      }
			    ]
			  },
			  {
			    "elementType": "labels.icon",
			    "stylers": [
			      {
			        "visibility": "off"
			      }
			    ]
			  },
			  {
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#757575"
			      }
			    ]
			  },
			  {
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      {
			        "color": "#212121"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#757575"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative.country",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#9e9e9e"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative.land_parcel",
			    "stylers": [
			      {
			        "visibility": "off"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative.locality",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#bdbdbd"
			      }
			    ]
			  },
			  {
			    "featureType": "administrative.neighborhood",
			    "stylers": [
			      {
			        "visibility": "off"
			      }
			    ]
			  },
			  {
			    "featureType": "poi",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#757575"
			      }
			    ]
			  },
			  {
			    "featureType": "poi.park",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#181818"
			      }
			    ]
			  },
			  {
			    "featureType": "poi.park",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#616161"
			      }
			    ]
			  },
			  {
			    "featureType": "poi.park",
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      {
			        "color": "#1b1b1b"
			      }
			    ]
			  },
			  {
			    "featureType": "road",
			    "elementType": "geometry.fill",
			    "stylers": [
			      {
			        "color": "#2c2c2c"
			      }
			    ]
			  },
			  {
			    "featureType": "road",
			    "elementType": "labels",
			    "stylers": [
			      {
			        "visibility": "off"
			      }
			    ]
			  },
			  {
			    "featureType": "road",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#8a8a8a"
			      }
			    ]
			  },
			  {
			    "featureType": "road.arterial",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#373737"
			      }
			    ]
			  },
			  {
			    "featureType": "road.highway",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#3c3c3c"
			      }
			    ]
			  },
			  {
			    "featureType": "road.highway.controlled_access",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#4e4e4e"
			      }
			    ]
			  },
			  {
			    "featureType": "road.local",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#616161"
			      }
			    ]
			  },
			  {
			    "featureType": "transit",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#757575"
			      }
			    ]
			  },
			  {
			    "featureType": "water",
			    "elementType": "geometry",
			    "stylers": [
			      {
			        "color": "#000000"
			      }
			    ]
			  },
			  {
			    "featureType": "water",
			    "elementType": "labels.text",
			    "stylers": [
			      {
			        "visibility": "off"
			      }
			    ]
			  },
			  {
			    "featureType": "water",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      {
			        "color": "#3d3d3d"
			      }
			    ]
			  }
			]
	});

	infowindow = new google.maps.InfoWindow();

	getBreweries(viewModel.city());
	ko.applyBindings( viewModel );
	viewModel.query.subscribe(viewModel.search);
};

// Error function to handle a failed call to the google maps API.
function googleError() {
	var mapError = document.getElementById("page-content-container");
	mapError.innerHTML = "Unable to load Google Maps, check your connection and refresh the page."
};

// Function to ensure that all of the markers are displayed within the map
// bounds.
function fitMap(breweries) {
	var bounds = new google.maps.LatLngBounds();
	var markers = [];

	breweries.forEach(function(obj) {
		markers.push(obj.marker);
	});

	for (var i = 0; i < markers.length; i++) {
			bounds.extend(markers[i].getPosition());
	};

	map.fitBounds(bounds);
};

// ******************* YELP API SETTINGS *******************

// Contains credentials to make a successful call to Yelp's Search API.
function yelpSettings(city) {
	var auth = {
	consumerKey : "RAwwAMjyAL4BddRfxD1rHg",
	consumerSecret : "OyW0KblyohG61lRx_aBiMp2TnKw",
	accessToken : "mToXRxDzkT-5rjERjPJVI4JPuEYazS6b",
	accessTokenSecret : "GFy-rcUxSgi3P9quYiYvwvQ_KmY",
	};

	function nonce_generate() {
		return (Math.floor(Math.random() * 1e12).toString());
	};

	var term = 'brewery';

	var city = city;

	var yelp_url = 'https://api.yelp.com/v2/search';

	var parameters = {
		oauth_consumer_key: auth.consumerKey,
		oauth_token: auth.accessToken,
		oauth_nonce: nonce_generate(),
		oauth_timestamp: Math.floor(Date.now()/1000),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version: '1.0',
		callback: 'cb',
		term: term,
		location: city,
		limit: 15
	};

	var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters,
			auth.consumerSecret, auth.accessTokenSecret);

	parameters.oauth_signature = encodedSignature;

	var settings = {
		url: yelp_url,
		data: parameters,
		cache: true,
		dataType: 'jsonp',
		callback: "cb"
	};

	return settings;
};

// ******************* MODEL *******************

// Function to create each brewery object.
var Brewery = function(data) {
	var self = this;
	self.name === 'undefined' ? self.name = 'No name available' : self.name = data.name;
	self.address === 'undefined' ? self.address = 'No address available' : self.address = data.location.address[0];
	self.image_url = data.image_url;
	self.lat = data.location.coordinate.latitude;
	self.lng = data.location.coordinate.longitude;
	self.snippet === 'undefined' ? self.snippet = 'No snippet text available' : self.snippet = data.snippet_text;
	self.rating === 'undefined' ? self.rating = 'No rating available' : self.rating = data.rating;
	self.rating_img_url = data.rating_img_url;
	self.marker = new google.maps.Marker({
		map: map,
		position: {
			lat: self.lat,
			lng: self.lng
		},
		title: self.name
	});

	// Function to build the infowindow content and activate it when the user
	// clicks on a marker. Also takes care of the marker animation.
	google.maps.event.addListener(self.marker, 'click', function() {
		var iwContent = '<div id="iw-container">'+
							'<div class="iw-title">' + self.name +
							'</div>' +
							'<div class="iw-content">' +
								'<div class="iw-brewery-img">' +
									'<img src="' + self.image_url + '">' +
								'</div>' +
								'<div class="iw-rating-head">' +
									'<b>Star Rating:</b>' +
								'</div>' +
								'<div class="iw-rating-img">' +
									'<img src="' + self.rating_img_url + '">' +
								'</div>' +
								'</div class="iw-address-head">' +
									'<b>Address:</b>' +
								'</div>' +
								'<div class="iw-address-content">' +
									self.address +
								'</div>' +
								'<div class="iw-snippet-head">' +
									'<b>Snippet:</b>' +
								'</div>' +
								'<div class="iw-snippet-content">' +
									self.snippet +
								'</div>' +
							'</div>' +
						'</div>'
		infowindow.setContent(iwContent);
		infowindow.setOptions({
			maxWidth: 350
		});
		infowindow.open(map, this);
		self.marker.setAnimation(google.maps.Animation.BOUNCE);

		setTimeout(function() {
			self.marker.setAnimation(null);
		}, 1400);
	});
};

// Makes the AJAX call to the yelp API to retrieve the business data for our
// breweries array.
function getBreweries (city) {
	$.jsonp( yelpSettings( city ) )

		.done( function (data) {
			var breweryResults = data.businesses;

			breweryResults.forEach(function(obj) {
				breweries.push(obj);
			});

			viewModel.createBreweryList();
			})

		.fail( function () {
			viewModel.toggleMenu();
			var yelpError = document.getElementById("page-content-container");
			yelpError.innerHTML = "Unable to load brewery information from Yelp. Check your connection and refresh the page."
		});
};

// ******************* VIEW MODEL *******************

var viewModel = {

	city: ko.observable('Atlanta'),

	breweries: ko.observableArray([]),

	query: ko.observable(''),

	// Creates a new brewery object for each of our default Atlanta breweries
	// and pushes into the viewModel breweries array. Also, fits the bounds
	// of the map around the markers.
	createBreweryList: function() {
		breweries.forEach(function(obj) {
				viewModel.breweries.push(new Brewery(obj));
			});

		fitMap(viewModel.breweries());
	},

	// Clears the existing breweries and calls for the new ones based on
	// user's city entry.
	updateBreweryList: function(value) {
		viewModel.removeMarkers();
		viewModel.breweries.removeAll();
		breweries = [];

		getBreweries(viewModel.city());

		viewModel.createBreweryList();
	},

	// Filter function to display only the brewery objects that match user
	// input.
	search: function(value) {
		viewModel.breweries().forEach(function(obj) {

			if (obj.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				obj.marker.setVisible(true);
			} else {
				obj.marker.setVisible(false);
			};
		});
	},

	// Function for KO click binding to activate the marker infowindow from
	// menu item click.
	activateMarker: function() {
			google.maps.event.trigger(this.marker, 'click');
		},

	// Function to remove all the markers from the map.
	removeMarkers: function() {
		viewModel.breweries().forEach(function(obj) {
			obj.marker.setMap(null);
		});
	},

	// Function bound to the toggle menu button to show/hide the sidebar/menu.
	toggleMenu: function() {
		$("#wrapper").toggleClass("toggled");
	},
};

// Computed function to handle filtering the list of breweries. Had to declare
// outside the viewModel object literal for it to work - see stack overflow post:
// http://stackoverflow.com/questions/9589419/difference-between-knockout-view-models-declared-as-object-literals-vs-functions
viewModel.filteredBreweryList = ko.computed(function() {
	var filter = viewModel.query();

	if (!filter) {
		return viewModel.breweries();
	} else {
		return ko.utils.arrayFilter(viewModel.breweries(), function (obj) {
			return obj.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
		});
	};
});