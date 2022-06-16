/* exported data */
var favCharger = [];

var previousSavedJSON = localStorage.getItem('javascript-local-storage');
if (previousSavedJSON !== null) {
  favCharger = JSON.parse(previousSavedJSON);
}

window.addEventListener('beforeunload', stringifier);

function stringifier(event) {
  var savedJSON = JSON.stringify(favCharger);
  localStorage.setItem('javascript-local-storage', savedJSON);
}
