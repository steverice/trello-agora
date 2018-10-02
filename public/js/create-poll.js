/* global TrelloPowerUp */
/* global agoraFetch */
/* global Map */

var Promise = TrelloPowerUp.Promise;

var t = TrelloPowerUp.iframe();

// want to know when you are being closed?
window.addEventListener('unload', function(e) {
  // Our board bar is being closed, clean up if we need to
});

t.render(function(){
  // this function we be called once on initial load
  // and then called each time something changes that
  // you might want to react to, such as new data being
  // stored with t.set()
  return Promise.all([
    t.board('name'),
    t.cards('id', 'name', 'desc', 'closed', 'labels'),
  ])
  .then(function ([board, cards]) {
    console.log(JSON.stringify(cards, null, 2));
    var cardMap = new Map(cards.map(function (card) {
      return [card.label, card];
    }));
    var cardChoices = cards.map(function(card) {
      return {
        label: card.name,
        description: card.desc,
      };
    });
    var pollOptions = {
      title: board.name,
      choices: cardChoices,
    };
    return agoraFetch('polls/with-choices', {
      method: 'POST',
      body: JSON.stringify(pollOptions),
    }).then(function (response) {
      var poll = response.json();
      console.log(poll);
      
      // Associate choices with cards
      poll.choices.forEach(function (choice) {
        var card = cardMap.get(choice.label);
        t.set(card.id, 'shared', 'agora_choice_' + choice.poll_id, choice.id); 
      });
      
      t.set('board', 'shared', 'agora_poll', poll.id); 
    });
  });
});
