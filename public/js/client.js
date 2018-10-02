/* global TrelloPowerUp */
/* global agoraFetch */

var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

var GLITCH_ICON = 'https://cdn.glitch.com/2442c68d-7b6d-4b69-9d13-feab530aa88e%2Fglitch-icon.svg?1489773457908';
var GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';
var WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';

var boardButtonCallback = function(t, options){
  return t.popup({
    title: 'New Poll',
    url: './create-poll.html',
    args: {},
    height: 600 // initial height, can be changed later
  });
};

var submitListVotes = function(list, pollId) {
  return function(t, options) {
    return Promise.all([
      t.member('fullName'),
      t.loadSecret('agora_key'),
      Promise.all(list.cards.map(function(card, index) {
        return t.get(card.id, 'shared', 'agora_choice_' + pollId);
      })),
    ]).then(function ([member, apiKey, choiceIds]) {
      var choices = choiceIds.map(function(choiceId, index) {
        return {
          choice_id: choiceId,
          poll_id: pollId,
          rank: index + 1,
          user: {
            name: member.fullName,
          },
        };
      });

      return agoraFetch('votes/for-poll/' + pollId, apiKey, {
        method: 'POST',
        body: JSON.stringify(choices),
      }).then(function (response) {
        return response.json();
      }).then(function (votes) {
        console.log(votes);
        if (votes.length > 0) {
          t.set('member', 'shared', 'agora_user_' + votes[0].poll_id, votes[0].user.id); 
        }
      });
    });
  };
};

TrelloPowerUp.initialize({
  // Start adding handlers for your capabilities here!
  'board-buttons': function(t, options){
    return [{
      // we can either provide a button that has a callback function
      // that callback function should probably open a popup, overlay, or boardBar
      icon: {
        dark: WHITE_ICON,
        light: GRAY_ICON,
      },
      text: 'New Poll',
      condition: 'admin',
      callback: boardButtonCallback,
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
  'list-actions': function (t) {
    t.getAll().then(function(all) {
      console.log(all);
    });
    return Promise.all([
      t.list('all'),
      t.get('board', 'shared', 'agora_poll'),
    ])
    .then(function ([list, pollId]) {
      console.log('poll id', pollId);
      if (pollId) {
        return [{
          text: "Submit Current Ranking",
          callback: submitListVotes(list, pollId),
        }];
      } else {
        return [];
      }
    });
  },
});
