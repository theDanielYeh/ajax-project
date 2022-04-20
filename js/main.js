var $X;
var $Lat = 'Hello World';
var $Lng;
let service;


window.addEventListener('load', getLocation);
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
  }
}

function success(position) {
  document.querySelector('#start > option').value = position.coords.latitude + ", " + position.coords.longitude;
  $Lat = position.coords.latitude;
  $Lng = position.coords.longitude;
  console.log(document.querySelector('#start > option').value);

initMap();
function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: $Lat, lng: $Lng },
  });

  directionsRenderer.setMap(map);

  const request = {
    query: 'Tesla Supercharger',
    fields: ['name', 'geometry']
  };

  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        var $X = results[i].geometry.location.lat() + ', ' + results[i].geometry.location.lng();
        document.querySelector("#end > option").value = $X;
        onChangeHandler();
      }
    }
  });

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  // below is reverse geocode
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  function geocodeLatLng(geocoder, map, infowindow) {
    const latlng = {
      lat: $Lat,
      lng: $Lng,
    };

    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {
          map.setZoom(14);

          const marker = new google.maps.Marker({
            position: latlng,
            map: map,
          });

          infowindow.setContent(response.results[0].formatted_address);
          infowindow.open(map, marker);
          document.querySelector('#locationDisplay').textContent = 'Current Location: ' + infowindow.content;
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }
  geocodeLatLng(geocoder, map, infowindow);
  window.initMap = initMap;

}
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
    .route({
      origin: {
        query: document.getElementById("start").value,
      },
      destination: {
        // query: $X,
        query: document.getElementById("end").value,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to TEST" + status));
}





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
