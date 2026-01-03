
export function createDeck() {
  let cardIndex = 0;
  let deck = [];
  //for (let i = 1; i <= 4; i++) {
  for (let i = 1; i <= 12; i++) {
    for (let j = 1; j <= 3; j++) {
      deck.push({ id: cardIndex, rank: i, cardLocation: 'deck', revealedAtTurn: -1 });
      cardIndex++;
    }
  }
  return deck;
}

export function shuffleDeck(deck) {
  let shuffledDeck = [];
  const deckLength = deck.length;
  for (let i = 0; i < deckLength; i++) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    shuffledDeck.push(deck[randomIndex]);
    deck.splice(randomIndex, 1);
  }
  return shuffledDeck;
}

export function createPlayers(settings) {
  let players = [];
  for (let i = 0; i < settings.playerCount; i++) {
    players.push({ id: i, name: `Player ${i + 1}`, type: (settings.interactiveUserIndexes.includes(i) ? 'human' : 'bot'), hand: [], trios: [], forgetfullness: 0 });
  }
  return players;
}

export function dealCards(deck, players) {
  const cardCount = getCardCount(players.length);
  for (let i = 0; i < players.length; i++) {
    players[i].hand = deck.slice(i * cardCount, (i + 1) * cardCount);
    players[i].hand.sort((a, b) => a.rank - b.rank);
  }
  return players;
}

export function getRevealCards(deck, numPlayers) {
  const cardCount = getCardCount(numPlayers);
  let currentDeck = [...deck];
  return currentDeck.slice(numPlayers * cardCount);
}

function getCardCount(numPlayers) {
  let cardCount = 0;
  switch (numPlayers) {
    // 1 & 2 players are for testing
    case 1:
      cardCount = 6;
      break;
    case 2:
      cardCount = 5;
      break;
    case 3:
      cardCount = 9;
      break;
    case 4:
      cardCount = 7;
      break;
    case 5:
      cardCount = 6;
      break;
    case 6:
      cardCount = 5;
      break;
    default:
      throw new Error("Invalid number of players");
  }
  return cardCount;
}
