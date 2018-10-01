/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

var GLITCH_ICON = 'https://cdn.glitch.com/2442c68d-7b6d-4b69-9d13-feab530aa88e%2Fglitch-icon.svg?1489773457908';
var GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';
var WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';

var boardButtonCallback = function(t, options){
  console.log('calling back');
};

TrelloPowerUp.initialize({
  // Start adding handlers for your capabilities here!
  'board-buttons': function(t, options){
    console.log('board buttons!');
    return [{
      // we can either provide a button that has a callback function
      // that callback function should probably open a popup, overlay, or boardBar
      icon: {
        dark: WHITE_ICON,
        light: GRAY_ICON,
      },
      text: 'Vote!',
      condition: 'admin',
      callback: boardButtonCallback
    }];
  },
  'authorization-status': function(t, options){
    return t.loadSecret('agora_key')
    .then(function(authToken) {
      return { authorized: authToken != null }
    });
  },
  'show-authorization': function(t, options){
    return t.popup({
      title: 'Authorize Open Agora Account',
      url: './token.html',
      height: 140,
    });
  },
});
