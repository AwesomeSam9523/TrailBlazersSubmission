let map, currentLocationMarker, directionsService, directionsRenderer;
let userLocation = {lat: 26.9124, lng: 75.7873}; // Default to Jaipur if location is unavailable

function initMap() {
  console.log('init called')
  map = new google.maps.Map(document.getElementById('map'), {
    center: userLocation,
    zoom: 13
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    panel: document.getElementById('directions')
  });

  const adventureSearchBox = new google.maps.places.SearchBox(document.getElementById('adventureSearchBox'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('adventureSearchBox'));

  // Get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(userLocation);

      currentLocationMarker = new google.maps.Marker({
        map: map,
        position: userLocation,
        title: "Your Location"
      });

      // Initialize search with user's current location
      searchNearby(userLocation);

    }, function () {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }

  adventureSearchBox.addListener('places_changed', function () {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p style="width: 100%; font-size: larger; font-weight: bold;">Loading...</p>';

    const places = adventureSearchBox.getPlaces();
    if (places.length == 0) return;

    searchNearby(userLocation, true); // Use user's location for search
  });
  console.log('init done');
}

function searchNearby(location, specificSearch = false) {
  const service = new google.maps.places.PlacesService(map);
  const request = {
    location: location,
    radius: '50000',
    type: ['tourist_attraction']
  };

  if (specificSearch) {
    request.query = document.getElementById('adventureSearchBox').value;
    service.textSearch(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        calculateDistances(location, results);
      } else {
        console.error('Error in textSearch:', status);
      }
    });
  } else {
    service.nearbySearch(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        calculateDistances(location, results);
      } else {
        console.error('Error in nearbySearch:', status);
      }
    });
  }
}

function calculateDistances(origin, results) {
  const service = new google.maps.DistanceMatrixService();
  const distanceRequests = results.map(place => ({
    origins: [origin],
    destinations: [place.geometry.location],
    travelMode: 'DRIVING'
  }));

  const distancePromises = distanceRequests.map((request, index) => {
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(request, (response, status) => {
        if (status === 'OK') {
          const result = response.rows[0].elements[0];
          resolve({
            place: results[index], // Correctly refer to the place from results
            distance: result.distance.text,
            duration: result.duration.text
          });
        } else {
          reject(status);
        }
      });
    });
  });

  Promise.all(distancePromises).then(distances => {
    // Sort results by distance and duration
    distances.sort((a, b) => {
      const distanceA = parseFloat(a.distance.replace(' km', ''));
      const distanceB = parseFloat(b.distance.replace(' km', ''));
      return distanceA - distanceB;
    });
    displayResults(origin, distances.map(d => ({
      ...d.place,
      distance: d.distance,
      duration: d.duration
    })));
  }).catch(error => {
    console.error('Error calculating distances:', error);
  });
}

function displayResults(origin, results) {
  console.log(origin)
  console.log(results)
  const type = 'adventure';
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  if (results.length > 0) {
    results.forEach(function (place, index) {
      if (index < 5) { // Display top 5 results
        const placeDiv = document.createElement('div');
        placeDiv.classList.add(type + '-info');
        placeDiv.innerHTML = `<h3>${place.name}</h3>
        <p>${place.vicinity || place.formatted_address}</p>
        <p class="distance-info">Distance: ${place.distance}, Duration: ${place.duration}</p>`;
        resultsDiv.appendChild(placeDiv);

        placeDiv.addEventListener('click', function () {
          const request = {
            origin: origin,
            destination: place.geometry.location,
            travelMode: 'DRIVING'
          };
          directionsService.route(request, function (result, status) {
            if (status === 'OK') {
              directionsRenderer.setDirections(result);
            }
          });
        });
      }
    });
  } else {
    resultsDiv.innerHTML = '<p>No ' + type + 's found.</p>';
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  alert(browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation.");
}
