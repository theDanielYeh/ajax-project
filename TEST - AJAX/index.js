// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;

function initMap() {

  const sydney = new google.maps.LatLng(34.0953, -118.1270);
  // const sydney = new google.maps.LatLng(33.6846, 117.8265);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById('map'), {
    center: sydney,
    zoom: 15
  });

  const request = {
    query: 'Costco',
    fields: ['name', 'geometry']
  };

  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location

  });

  google.maps.event.addListener(marker, 'click', () => {
    infowindow.setContent(place.name || '');
    infowindow.open(map);
  });
}

window.initMap = initMap;

// Below is for weather API //

function getPokemonData() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.weather.gov/points/39.7456,-97.0892');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
    console.log(xhr.response);
    console.log(xhr.response.properties.forecast);
  });
  xhr.send();
}

getPokemonData();
