import { useState, useEffect } from 'react';
import { createDeck, shuffleDeck, createPlayers, dealCards, getRevealCards } from './components/startupUtils'; 
import Table from './components/Table';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createContext } from 'react';
import ReactDOM from 'react-dom';
import GameSettings, { getSettings } from './components/GameSettings';
import RulesSummary from './components/RulesSummary';
import GameOverPopup from './components/GameOverPopup';

export const UserContext = createContext();

let numberOfPlayers = 4;
const interactivePlayers = [0]; // Only the first player is human
const turnDelay = 750;

function App() {
 
  const [players, setPlayers] = useState([]);
  const [revealCards, setRevealCards] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  const [selectedCards, setSelectedCards] = useState([]);
  const [returnMode, setReturnMode] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  
  const handleToggleShowErrors = () => {
    setShowErrors(!showErrors);
  }
  
  
  const handleClosePopup = () => {
    setGameOver(false);
  }

  // ----------------- initialize deck and players -runs once -----------------
  useEffect(() => {

    const initSettings = getSettings();
    if (initSettings) {
      numberOfPlayers = initSettings.playerCount;
      if (initSettings.newUser) {
        setShowRules(true);
        initSettings.newUser = false;
        localStorage.setItem('settings', JSON.stringify(initSettings));
      }
    }
    
    //const initSettings = getSettings();
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);
    const initplayers = createPlayers(initSettings);
    const playersWithCards = dealCards(shuffledDeck, initplayers);
    const initRevealCards = getRevealCards(shuffledDeck, initSettings.playerCount);
    
    const playerIndex = Math.floor(Math.random() * initplayers.length); 
    
    setPlayers(playersWithCards); 
    setRevealCards(initRevealCards);
    setTurnIndex(playerIndex);
    setTurnCount(playerIndex);
    
  }, []);

  useEffect(() => {

    if (players.length === 0) return;
    if (selectedCards.length === 0) {
      nextPlayer();
    } else {
      samePlayer();
    }
  }, [selectedCards]);

  useEffect(() => {

    if (players.length === 0) return;
      
    if (players[turnIndex].type === 'bot') {
    
      console.log ("Bot Turn ", turnIndex); 

      let selected = [...selectedCards];
      const currSettings = getSettings();
        
      if (selected.filter(c => c.rank !== selected[0].rank).length > 0) {
        setTimeout(() => {
          setSelectedCards([]);
          return;
        }, currSettings.cardDisplayTime * 1000);
      } else {
        if (selected.length  > 2) {
          moveCardsToPlayerTrio(turnIndex, selected);
          setTimeout(() => {
            setSelectedCards([]);
            return;
          }, currSettings.cardDisplayTime * 1000); 
        } else {
          // select another
          let cardOpts = getCardOptions();
          const countByRank = getCountByRank();
          const scoredCards = scoreCards(cardOpts, countByRank);
          scoredCards[0].card.revealedAtTurn = Date.now();
          selected.push(scoredCards[0].card);

          setTimeout(() => {
            setSelectedCards(selected);
            return;
           }, currSettings.cardDisplayTime * 1000); 
        }
      }
    } else {

    }
  }, [turnCount]
);

  function getCountByRank() {
    // take a look at the reveal history to figure out what to pick
    let cardsByRank = [];
    for (let i=1; i <= 12; i++) {
      cardsByRank[i] = [];
    }
    for (let i=0; i < players.length; i++) {
      const handLen = players[i].hand.length;
      if (handLen === 0) continue;
      for (let j=0; j < handLen; j++) {
        // only work with revealed cards
        if (players[i].hand[j].revealedAtTurn > -1) {
          cardsByRank[players[i].hand[j].rank].push(players[i].hand[j]);
        } else if (i === turnIndex) {
          if (j === 0 || j === handLen - 1) {
            cardsByRank[players[i].hand[j].rank].push(players[i].hand[j]);
          } else if (handLen > 2) {
            if ((j === 1 && players[i].hand[1].rank === players[i].hand[0].rank) || (j === handLen - 2 && players[i].hand[handLen-1].rank === players[i].hand[handLen-2].rank)) {
              cardsByRank[players[i].hand[j].rank].push(players[i].hand[j]);
            }
          } else if (handLen > 3) {
            if ((j === 2 && players[i].hand[2].rank === players[i].hand[0].rank) || (j === handLen - 3 && players[i].hand[handLen-1].rank === players[i].hand[handLen-3].rank)) {
              cardsByRank[players[i].hand[j].rank].push(players[i].hand[j]);
            }
          }
        }
      }
    }
    // add the reveal cards
    for (let i=0; i < revealCards.length; i++) {
      if (revealCards[i].id < 36 && revealCards[i].revealedAtTurn > -1) {
        cardsByRank[revealCards[i].rank].push(revealCards[i]);
      }
    }
    return cardsByRank;
  }

  function getTriosByRank() {
    // take a look at the reveal history to figure out what to pick
      let triosByRank = [];
      for (let i=1; i <= 12; i++) {
        triosByRank[i] = false
      }
      for (let i=0; i < players.length; i++) {
        for (let j=0; j < players[i].trios.length; j++) {
          triosByRank[players[i].trios[j][0]] === true;
        }
      }
      return triosByRank;
  }

  function highOrLow(highestRankIndex, lowestRankIndex,triosByRank) { 
      // should we go high or low - count the non-trios
      const above = triosByRank.filter((c, indx) => indx > highestRankIndex && c === false).length;
      const below = triosByRank.filter((c, indx) => indx < lowestRankIndex && c === false).length;
      if (above > below) return 'low';
      else return 'high';
  }

  function getCardOptions() {
    let cardOptions = [];
    
    // reveal cards
    let reveals = [...revealCards];
    for (let i=0; i<reveals.length; i++) {
      reveals[i].cardLocation = 'reveal-' + i.toString();
      // add it to the list if it's not a filler card or if it's already selected
      if (reveals[i].id < 36 && selectedCards.filter(c => c.id === reveals[i].id).length === 0) {
        cardOptions.push(reveals[i]);
      }
    }

    // player hands
    let currPlayers = [...players];
    for (let i=0; i < currPlayers.length; i++) {
      // check the first 3 entries from both ends
      for (let j=0; j < (currPlayers[i].hand.length > 3 ? 3 : currPlayers[i].hand.length); j++) {
        if (j === 0 && (selectedCards.filter(c => c.id === currPlayers[i].hand[j].id).length === 0)) {
          if (i === turnIndex) currPlayers[i].hand[j].cardLocation = 'owner-' + i.toString() + '-low-' + j.toString();
          else  currPlayers[i].hand[j].cardLocation = 'bot-' + i.toString() + '-low-' + j.toString();
          cardOptions.push(currPlayers[i].hand[j]);
        }
        // see if previous card was selected
        if (j > 0 && (selectedCards.filter(c => c.id === currPlayers[i].hand[j-1].id).length > 0) && (selectedCards.filter(c => c.id === currPlayers[i].hand[j].id).length === 0)) {
          if (i === turnIndex) currPlayers[i].hand[j].cardLocation = 'owner-' + i.toString() + '-low-' + j.toString();
          else  currPlayers[i].hand[j].cardLocation = 'bot-' + i.toString() + '-low-' + j.toString();
          cardOptions.push(currPlayers[i].hand[j]);
        }
      }
      for (let j=currPlayers[i].hand.length-1; j >= (currPlayers[i].hand.length > 3 ? currPlayers[i].hand.length-3 : 0); j--) {
        if (j === currPlayers[i].hand.length-1 && (selectedCards.filter(c => c.id === currPlayers[i].hand[j].id).length === 0)) {
          if (i === turnIndex) currPlayers[i].hand[j].cardLocation = 'owner-' + i.toString() + '-high-' + j.toString();
          else  currPlayers[i].hand[j].cardLocation = 'bot-' + i.toString() + '-high-' + j.toString();
           cardOptions.push(currPlayers[i].hand[j]);
        }
        // see if previous card was selected
        if (j < currPlayers[i].hand.length-1 && (selectedCards.filter(c => c.id === currPlayers[i].hand[j+1].id).length > 0) && (selectedCards.filter(c => c.id === currPlayers[i].hand[j].id).length === 0)) {
          if (i === turnIndex) currPlayers[i].hand[j].cardLocation = 'owner-' + i.toString() + '-high-' + j.toString();
          else  currPlayers[i].hand[j].cardLocation = 'bot-' + i.toString() + '-high-' + j.toString();
          cardOptions.push(currPlayers[i].hand[j]);
        }
      }
    }
    return cardOptions;
  }

  /*
  function potentialBlockedRank(card) {
    const triosByRank = getTriosByRank();
    // get the highest low trio and the lowest high trio
    let highestLowTrio = 0;
    let lowestHighTrio = 13;
    for (let i=0; i < triosByRank.length; i++) {
      if (triosByRank[i] === false) {
        if (i > highestLowTrio) highestLowTrio = i;
        if (i < lowestHighTrio) lowestHighTrio = i;
      }
    }
    if (card.rank > highestLowTrio + 1 && card.rank < lowestHighTrio - 1) {
      return true;
    }
    return false;
  }
  */

  function scoreCards (cardOptions, countByRank) {
    let scoredCards = [];
    for (let i=0; i < cardOptions.length; i++) {
      let conditions = '';
      let cardScore = 0;
      let locationParts = cardOptions[i].cardLocation.split('-');
      // if the card is one that we know about, we can use the rank in our scoring
      if (cardOptions[i].revealedAtTurn > -1 || locationParts[0] === 'owner') {
        conditions += ' known card';
        // if this is the first card being selected - check if it is member of a known trio
        if (selectedCards.length === 0) {
          conditions += ' first card';
          if (countByRank[cardOptions[i].rank].length > 2) {
            conditions += ' trio known (4000)';
            cardScore += 4000;
          } else if (countByRank[cardOptions[i].rank].length > 1) {
            conditions += ' pair known (2000)';
            cardScore += 2000;
          }

          // prefer ranks just above the lowest trio or just below the highest trio
          const triosByRank = getTriosByRank();
          let highestLowTrio = 0;
          let lowestHighTrio = 13;
          for (let j=0; j < triosByRank.length; j++) {
            if (triosByRank[j] === false) {
              if (j > highestLowTrio) highestLowTrio = j;
              if (j < lowestHighTrio) lowestHighTrio = j;
            }
          }
          if (cardOptions[i].rank === highestLowTrio + 1 || cardOptions[i].rank === lowestHighTrio - 1) {
            conditions += ' high-low match (2000)';
            cardScore += 2000;
          }
          // prefer rank 7
          if (cardOptions[i].rank === 7) {
            conditions += ' rank 7 (1000)';
            cardScore += 1000;
          }
        } else if (cardOptions[i].rank === selectedCards[0].rank) {
          conditions += ' match selected';
          // prefer cards that help make a trio
          if (countByRank[cardOptions[i].rank].length > 2) {
            conditions += ' trio known (5000)';
            cardScore += 5000;
          } else if (countByRank[cardOptions[i].rank].length > 1) {
            conditions += ' pair known (3000)';
            cardScore += 3000;
          } else {
            conditions += ' single known (1000)';
            cardScore += 1000;
          }
        } else {
          // don't pick known cards that don't match
          conditions += ' known, no match (-500)';
          cardScore += -500;
        }
      } else {
        // unknown card
        conditions += ' unknown card';
        // prefer cards from players hands over reveal pile since they are sorted
        if (locationParts && locationParts.length > 3) {
          // if high-low matches, pick that, otherwise pick the reveal pile over the opposite end of a player's hand
          const triosByRank = getTriosByRank();
          let highestLowTrio = 0;
          let lowestHighTrio = 13;
          for (let j=0; j < triosByRank.length; j++) {
            if (triosByRank[j] === false) {
              if (j > highestLowTrio) highestLowTrio = j;
              if (j < lowestHighTrio) lowestHighTrio = j;
            }
          }
          const highOrLowPref = highOrLow(highestLowTrio, lowestHighTrio,triosByRank);
          if (locationParts[2] === highOrLowPref) {
            conditions += ' high-low match (2000)';
            cardScore += 2000;
          } else {
            conditions += ' no high-low match (1000)';
            cardScore += 1000;
          }
        } else {  
          conditions += ' from reveal pile (1500)';
          cardScore += 1500;
        }
      }  
      console.log(` => score ${cardScore} Location: ${cardOptions[i].cardLocation} Card ${cardOptions[i].id} (rank ${cardOptions[i].rank}): ${conditions}`); 
      scoredCards.push( {card: cardOptions[i], score: cardScore} )
    }
    return scoredCards.sort((a, b) => b.score - a.score);
  }

  /*
  function scoreCardsOld (cardOptions, countByRank) {

    const triosByRank = getTriosByRank();
    let scoredCards = [];

    for (let i=0; i < cardOptions.length; i++) {
      let cardScore = 0;

      // use card details if this card has been revealed or if it's from your hand
      if (cardOptions[i].revealedAtTurn > -1 || players[turnIndex].hand.filter(c => c.id === cardOptions[i].id).length > 0) {

        console.log('scoring known card: ', cardOptions[i]);

        // if there are cards selected, just check to see if rank is the same
        if (selectedCards.length > 0) {
          if (cardOptions[i].rank === selectedCards[0].rank) {
            //  if there are already 2 of this rank selected, or if you know where the three of that rank are, we are good
            if (selectedCards.length === 2 || countByRank[cardOptions[i].rank].length > 2) {
              
              cardScore += 5000;
              if (cardOptions[i].rank === 7) {
                cardScore += 10000;
              }
              
              console.log('scoring for trio: ', cardScore);

              // check to see if this is the lowest or highest rank not yet in a trio
              let isHighLow = true;
              for (let j=1; j < triosByRank.length; j++) {
                if (triosByRank[j] === false) {
                  if (j < cardOptions[i].rank) {
                    // not lowest
                    isHighLow = false;
                  }
                  break;
                }
              }
              for (let j=triosByRank.length-1; j > 0; j--) {
                if (triosByRank[j] === false) {
                  if (j > cardOptions[i].rank) {
                    // not highest
                    isHighLow = false;
                  }
                  break;
                }
              }
              if (isHighLow) {
                cardScore += 2000;
                
              console.log('scoring for high/low: ', cardScore);

              }  
            } else {
              // if it's not a selection to make a trio and you already know it's rank, there is no reason to select it - you should select an unknown
              cardScore += -100;
            }
          } else {
            // if it isn;t same as the selected and you already know its rank, no reason to select it
            cardScore += -500;
          }
        } else {

          // no cards selected yet - why would you pick one you know = unlesss your going for a trio
          if (countByRank[cardOptions[i].rank].length > 2) {
            cardScore += 4000;
            if (potentialBlockedRank(cardOptions[i])) {
              cardScore += -2000;
            }
          } else {
            cardScore += -200;
          }
          if (cardOptions[i].rank === 7) {
            cardScore += 1000;
          }
        }

      } else {

        // card has not been revealed - get the highest ranking index - there may be more than 1 with the same value
        let highRank = 0;
        let highCount = 0;
        for (let j=1; j < countByRank.length-1; j++) {
          if (countByRank[j].length >= highCount) {
            highRank = j;
            highCount = countByRank[j].length;
          }
        }
      
        let locationParts = cardOptions[i].cardLocation.split('-');
        if (locationParts && locationParts.length > 3) {
          // if high-low matches, pick that, otherwise pick the reveal pile over the opposite end of a player's hand
          if (locationParts[2] === highOrLow(highRank, triosByRank)) {
            cardScore += 2000;
          } else {
            cardScore += 1000;
          }
        } else {
          cardScore += 1500;
        }
      }
      scoredCards.push( {card: cardOptions[i], score: cardScore} )
    }
    console.log('scoredCards: ', scoredCards);
    return scoredCards.sort((a, b) => b.score - a.score);
  }
    */

  function nextPlayer() {
    //console.log('prior turnIndex: ', turnIndex);
    const newTurnIndex = (turnIndex + 1) % players.length;
    setTurnIndex(newTurnIndex);
    setTurnCount(newTurnIndex);
    console.log('newTurnIndex & newTurnCount: ', newTurnIndex);
  }

  function samePlayer() {
    setTurnCount(turnCount + .1);
    //console.log('turnIndex: ', turnIndex);
    console.log('turnCount: ', turnCount + .1);
  }

  ///////////////////  /////////////////////
  function handleCardClick(card, isSelected) {

   // ignore if it's not a human's turn
    if (players[turnIndex].type !== 'human') return;

    let selected = [...selectedCards];
    if (!isSelected && isSelectable(card)) {
      selected.push(card);
      
      // save card revealed history
      let currPlayers = [...players];
      for (let i = 0; i < currPlayers.length; i++) {
        const idx = currPlayers[i].hand.findIndex(c => c.id === card.id);
        if (idx !== -1) {
          currPlayers[i].hand[idx].revealedAtTurn = Date.now();
          setPlayers(currPlayers);
          break;
        }
      }

      // may be in reveal pile
      const idx = revealCards.findIndex(c => c.id === card.id);
      if (idx !== -1) {
        let currRevealCards = [...revealCards];
        currRevealCards[idx].revealedAtTurn = Date.now();
        setRevealCards(currRevealCards);
      } 

      if (selected.length === 3) {
        if (selected.filter(c => c.rank === selected[0].rank).length === 3) {
          // trio
          moveCardsToPlayerTrio(turnIndex, selected);
          setSelectedCards([]);
          //nextPlayer();
          return;
        } else {
          setReturnMode(true);
        }
      } else {
        if (selected.filter(c => c.rank !== selected[0].rank).length > 0) {
          setReturnMode(true);
        }
      }

    } else if (isSelected && returnMode) {
      selected = selected.filter(c => c.id !== card.id);
      if (selected.length === 0) {
        setReturnMode(false);
        setSelectedCards([]);
        //nextPlayer();
        return;
      }
    }
    setSelectedCards(selected);  
  }

  function moveCardsToPlayerTrio(playerIndx, trio) {
    let currPlayers = [...players];
    let currReveals = [...revealCards];
    currPlayers[turnIndex].trios.push(trio);
    const currSettings = getSettings();

    if (trio[0].rank === 7 || currPlayers[turnIndex].trios.length === 3) {
      setTimeout(() => {
        announceWinner(turnIndex); 
        return;
      }, currSettings.cardDisplayTime * 1000);  
    }

    for (let h=0; h < trio.length; h++) {
      let idx = -1;
      for (let i = 0; i < currPlayers.length; i++) {
        idx = currPlayers[i].hand.findIndex(c => c.id === trio[h].id);
        if (idx !== -1) {
          currPlayers[i].hand = currPlayers[i].hand.filter(c => c.id !== trio[h].id);
          break;
        }
      }
      if (idx === -1) {
        idx = currReveals.findIndex(c => c.id === trio[h].id);
        if (idx !== -1) {
          // to keep the format, replace the card with a blank one
          //currReveals = currReveals.filter(c => c.id !== trio[h].id);
          const blankCard = { id: 99-trio[h].id, rank: -1, color: -1, revealedAtTurnIndex: -1 };
          currReveals = currReveals.toSpliced(idx, 1, blankCard);
        }
      }
    }
    setPlayers(currPlayers);
    setRevealCards(currReveals);
  }

  function newGame() {

    handleClosePopup();
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);
    const playersWithCards = dealCards(shuffledDeck, players);
    const initRevealCards = getRevealCards(shuffledDeck, settings.playerCount);
    
    const playerIndex = Math.floor(Math.random() * players.length);
    setPlayers(playersWithCards);
    setRevealCards(initRevealCards);
    setTurnIndex(playerIndex);
    setTurnCount(playerIndex);
    setReturnMode(false);
    setSelectedCards([]);
  }

  function announceWinner(playerIndx) {
    setGameOver(true);   
  }   
     
  function gameLog(msg) {
      console.log(msg);
  }

  function isSelectable(card) {
    
   // see if it's already selected
   if (selectedCards.filter(c => c.id == card.id).length > 0) return false;
   if (returnMode) return false;

   // all the unmatched reveals
   if (revealCards.filter(c => c.id < 36 && card.id === c.id).length > 0) return true;

   // player hands
   for (let i=0; i < players.length; i++) {
      if (players[i].hand.length > 0) {
        if (players[i].hand[0].id === card.id) return true;
        if (players[i].hand.length > 1) {
          // don't forget the adjacent card if the first is selected
          if (players[i].hand[1].id === card.id && selectedCards.filter(c => c.id === players[i].hand[0].id).length > 0) return true;
          if (players[i].hand[(players[i].hand.length)-1].id === card.id) return true;
          if (players[i].hand.length > 2) {
            if (players[i].hand[(players[i].hand.length)-2].id === card.id && 
                    selectedCards.filter(c => c.id === players[i].hand[(players[i].hand.length)-1].id).length > 0) return true;
            if (players[i].hand[2].id === card.id && 
                    selectedCards.filter(c => c.id === players[i].hand[0].id).length > 0 &&
                    selectedCards.filter(c => c.id === players[i].hand[1].id).length > 0) return true;
            if (players[i].hand[(players[i].hand.length)-3].id === card.id && 
                    selectedCards.filter(c => c.id === players[i].hand[(players[i].hand.length)-2].id).length > 0 &&
                    selectedCards.filter(c => c.id === players[i].hand[(players[i].hand.length)-1].id).length > 0) return true;
          }
        }
      }
    }
    return false;
  }
  
if (players.length === 0) {
  return (
  <div>Loading...</div>
  );
} else {
  return (
    <UserContext.Provider value={{players, 
                              setPlayers,
                              revealCards, 
                              setRevealCards,
                              selectedCards,
                              turnIndex,
                              handleCardClick,
                              settings                               
                            }} >
        <div className="game-container">
          <Table 
          />
        </div>

        <GameSettings showRules={showRules}
                          setShowRules={setShowRules}
                    />

        <RulesSummary setShowRules={setShowRules} showRules={showRules} />
        
        
        <div className={'game-over' + (gameOver ? ' popup-visible' : '')}>
          <GameOverPopup gameOver={gameOver} newGame={newGame} onClose={handleClosePopup} players={players} turnIndex={turnIndex} ></GameOverPopup>
        </div>

      </UserContext.Provider>

    );
}
}

export default App;