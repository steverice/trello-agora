/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var keyForm = document.getElementById('key_form');
keyForm.addEventListener('submit', function(event) {
  var FD = new FormData(keyForm);
  var token = FD.get('api_key');
  t.storeSecret('agora_key', token)
  .then(function() {
    return t.closePopup();
  });
});