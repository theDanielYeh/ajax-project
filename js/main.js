var $X;
var $Y;
var $Z;
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
      fields: ['name', 'geometry', 'place_id', 'formatted_address']
    };

    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          $X = results[i].geometry.location.lat() + ', ' + results[i].geometry.location.lng();
          $Y = results[i].geometry.location.lat();
          $Z = results[i].geometry.location.lng();
          document.querySelector("#end > option").value = $X;
          onChangeHandler();
          document.querySelector('#chargerDisplay').textContent = results[i].name + ': ' + results[i].formatted_address;
          // Below is for weather API //
          console.log($Y);
          function getPokemonData() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api.weather.gov/points/' + $Y + ',' + $Z);
            xhr.responseType = 'json';
            xhr.addEventListener('load', function () {
              console.log(xhr.status);
              console.log(xhr.response);
              console.log(xhr.response.properties.gridX);
              if (xhr.status === 200) {
                var xhrTwo = new XMLHttpRequest();
                xhrTwo.open('GET', 'https://api.weather.gov/gridpoints/' + xhr.response.properties.gridId + '/' + xhr.response.properties.gridX + ',' + xhr.response.properties.gridY + '/forecast');
                xhrTwo.responseType = 'json';
                xhrTwo.addEventListener('load', function () {
                  console.log(xhrTwo.status);
                  console.log(xhrTwo.response);
                  console.log(xhrTwo.response.properties);
                  document.querySelector('.weatherIcon').setAttribute('src', xhrTwo.response.properties.periods[0].icon);
                  document.querySelector('.detailedForecast').textContent = xhrTwo.response.properties.periods[0].detailedForecast;
                });
                xhrTwo.send();
              }
            });
            xhr.send();
          }
          getPokemonData();
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

            // const marker = new google.maps.Marker({
            //   position: latlng,
            //   map: map,
            // });

            infowindow.setContent(response.results[0].formatted_address);
            // infowindow.open(map, marker);
            document.querySelector('#locationDisplay').textContent = 'Current Location: ' + infowindow.content;
          } else {
            window.alert("No results found");
          }
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e));
    }
    geocodeLatLng(geocoder, map, infowindow);

    window.initMap = initMap;
    document.querySelector('#homeBolt').setAttribute('src', "/images/emptybolt.png");
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

document.querySelector('#banner-icon').addEventListener('click', $Home);
document.querySelector('#locate').addEventListener('click', $Home);
document.querySelector('#myfavorites').addEventListener('click', $Favorites);

function $Home(event) {
  document.querySelector('#map').setAttribute('class','');
  document.querySelector('#weatherDisplay').setAttribute('class', 'weatherDisplay');
  document.querySelector('#locationDisplay').setAttribute('class','locationDisplay');
  document.querySelector('#home-row').setAttribute('class', 'row');
}

function $Favorites(event) {
  document.querySelector('#map').setAttribute('class', 'hidden');
  document.querySelector('#weatherDisplay').setAttribute('class', 'hidden');
  document.querySelector('#locationDisplay').setAttribute('class', 'hidden');
  document.querySelector('#home-row').setAttribute('class', 'hidden');
}

document.querySelector('#homeBolt').addEventListener('click', $Save);

function $Save(event) {
  if (event.target.getAttribute('src') === '/images/emptybolt.png') {
    event.target.setAttribute('src', '/images/bolt.png');
  } else if (event.target.getAttribute('src') === '/images/bolt.png') {
    event.target.setAttribute('src', '/images/emptybolt.png');
  }
}
