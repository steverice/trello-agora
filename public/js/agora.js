/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var AGORA_API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://api.open-agora.com/';
var token = t.loadSecret('agora_key');

var agoraFetch = function(path, options = {}) {
  var fullOptions = Object.assign({
    headers: Object.assign({
      "Accept": "application/json",
      "Content-Type": "application/json; charset=utf-8",
    }, options.headers),
    mode: 'cors',
  }, options);
  console.log(fullOptions);
  return token.then(function(api_key) {
    return fetch(AGORA_API_BASE_URL + path + '?api_token=' + api_key, fullOptions);
  });
};