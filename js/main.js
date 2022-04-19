// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var $X;
var $Lat = 'hello';
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
}


// window.addEventListener('onload', initMap());
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
      }
    }
  });

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  onChangeHandler();
  // document.getElementById("start").addEventListener("change", onChangeHandler);
  // document.getElementById("end").addEventListener("change", onChangeHandler);
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
  console.log(document.getElementById("start").value);
  console.log(document.getElementById("end").value);
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
