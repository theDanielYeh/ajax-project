/* eslint-disable no-undef */
/* eslint-disable no-inner-declarations */
var $combinedCoordinates;
var $latCoordinate;
var $lngCoordinate;
var $Lat;
var $Lng;
var $dataToSave = {};
let service;

window.addEventListener('load', getLocation);
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
  }
}

function success(position) {
  $Lat = position.coords.latitude;
  $Lng = position.coords.longitude;
  document.querySelector('#start > option').value = $Lat + ', ' + $Lng;

  initMap();
  function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: $Lat, lng: $Lng }
    });

    directionsRenderer.setMap(map);

    const request = {
      query: 'Tesla Supercharger',
      fields: ['name', 'geometry', 'place_id', 'formatted_address']
    };

    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          $latCoordinate = results[i].geometry.location.lat();
          $lngCoordinate = results[i].geometry.location.lng();
          $combinedCoordinates = $latCoordinate + ', ' + $lngCoordinate;
          document.querySelector('#end > option').value = $combinedCoordinates;
          onChangeHandler();
          document.querySelector('#chargerDisplay').textContent = results[i].name + ': ' + results[i].formatted_address;
          $dataToSave.name = results[i].name;
          $dataToSave.address = results[i].formatted_address;

          // Below is for weather API //
          function getWeatherData() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api.weather.gov/points/' + $latCoordinate + ',' + $lngCoordinate);
            xhr.responseType = 'json';
            xhr.addEventListener('load', function () {
              // learning: xhr.status available
              if (xhr.status === 200) {
                var xhrTwo = new XMLHttpRequest();
                xhrTwo.open('GET', 'https://api.weather.gov/gridpoints/' + xhr.response.properties.gridId + '/' + xhr.response.properties.gridX + ',' + xhr.response.properties.gridY + '/forecast');
                xhrTwo.responseType = 'json';
                xhrTwo.addEventListener('load', function () {
                  document.querySelector('.weatherIcon').setAttribute('src', xhrTwo.response.properties.periods[0].icon);
                  document.querySelector('.detailedForecast').textContent = xhrTwo.response.properties.periods[0].detailedForecast;
                });
                xhrTwo.send();
              }
            });
            xhr.send();
          }
          getWeatherData();
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
        lng: $Lng
      };

      geocoder
        .geocode({ location: latlng })
        .then(response => {
          if (response.results[0]) {
            map.setZoom(14);
            infowindow.setContent(response.results[0].formatted_address);
            document.querySelector('#locationDisplay').textContent = 'Current Location: ' + infowindow.content;
            document.querySelector('#loader').setAttribute('class', 'hidden');
          } else {
            window.alert('No results found');
          }
        })
        .catch(e => window.alert('Geocoder failed due to: ' + e));
    }
    geocodeLatLng(geocoder, map, infowindow);

    window.initMap = initMap;
    document.querySelector('#homeBolt').setAttribute('src', './images/emptybolt.png');
  }
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
    .route({
      origin: {
        query: document.getElementById('start').value
      },
      destination: {
        query: document.getElementById('end').value
      },
      travelMode: google.maps.TravelMode.DRIVING
    })
    .then(response => {
      directionsRenderer.setDirections(response);
    })
    .catch(e => window.alert('Directions request failed due to TEST' + status));
}

// Below section for click events and DOM manipulation //

document.querySelector('#banner-icon').addEventListener('click', $Home);
document.querySelector('#locate').addEventListener('click', $Home);
document.querySelector('#myfavorites').addEventListener('click', $Favorites);
var $favoritesDom = document.querySelector('#favorites-dom');

function $Home(event) {
  document.querySelector('#map').setAttribute('class', 'map');
  document.querySelector('#weatherDisplay').setAttribute('class', 'weatherDisplay');
  document.querySelector('#locationDisplay').setAttribute('class', 'locationDisplay');
  document.querySelector('#home-row').setAttribute('class', 'row');
  $favoritesDom.setAttribute('class', 'hidden');
}

function $Favorites(event) {
  document.querySelector('#map').setAttribute('class', 'hidden');
  document.querySelector('#weatherDisplay').setAttribute('class', 'hidden');
  document.querySelector('#locationDisplay').setAttribute('class', 'hidden');
  document.querySelector('#home-row').setAttribute('class', 'hidden');
  $favoritesDom.setAttribute('class', 'my-favorites-parent-container');
}

document.querySelector('#homeBolt').addEventListener('click', $Save);

function $Save(event) {
  // $dataToSave.name might need for future
  event.target.setAttribute('src', './images/bolt.png');
  $render();
}

function $render(event) {
  var $truefalse = 0;
  for (var i = 0; i < favCharger.length; i++) {
    if ($dataToSave.name === favCharger[i].name) {
      $truefalse++;
      return;
    }
  }
  if ($truefalse === 0) {
    var $A = document.createElement('div');
    $A.setAttribute('class', 'row');
    $favoritesDom.appendChild($A);

    var $B = document.createElement('img');
    $B.setAttribute('class', 'homeBolt');
    $B.setAttribute('src', './images/bolt.png');
    $A.appendChild($B);

    var $C = document.createElement('div');
    $C.setAttribute('class', 'chargerDisplay');
    $C.textContent = $dataToSave.name + ': ' + $dataToSave.address;
    $A.appendChild($C);
    favCharger.push($dataToSave);
  }
}

for (var i = 0; i < favCharger.length; i++) {
  $initialrender(favCharger[i]);
}

function $initialrender(object) {
  var $A = document.createElement('div');
  $A.setAttribute('class', 'row');
  $favoritesDom.appendChild($A);

  var $B = document.createElement('img');
  $B.setAttribute('class', 'homeBolt');
  $B.setAttribute('src', './images/bolt.png');
  $A.appendChild($B);

  var $C = document.createElement('div');
  $C.setAttribute('class', 'chargerDisplay');
  $C.textContent = object.name + ': ' + object.address;
  $A.appendChild($C);
}

// below is section for removing entries //
var eventTrigger;

document.querySelector('#favorites-dom').addEventListener('click', $toggleModal);

function $toggleModal(event) {
  if (event.target.tagName === 'IMG') {
    if (document.querySelector('#modal').getAttribute('class') === 'modal hidden') {
      document.querySelector('#modal').setAttribute('class', 'modal');
    } else {
      document.querySelector('#modal').setAttribute('class', 'modal hidden');
    }
    eventTrigger = event.target;
  }
}

document.querySelector('#no-button').addEventListener('click', $offModal);

function $offModal(event) {
  document.querySelector('#modal').setAttribute('class', 'modal hidden');
}

document.querySelector('#yes-button').addEventListener('click', $removeEntrycloseModal);

function $removeEntrycloseModal(event) {
  if (event.target.tagName === 'BUTTON') {
    for (var i = 0; i < favCharger.length; i++) {
      if (eventTrigger.nextSibling.textContent.match(favCharger[i].address) !== null) {
        favCharger.splice(i, 1);
      }
    }
    eventTrigger.closest('.row').remove();
    document.querySelector('#modal').setAttribute('class', 'modal hidden');
    document.querySelector('#homeBolt').setAttribute('src', './images/emptybolt.png');
  }
}
