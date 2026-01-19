import { useState, useEffect, useRef} from 'react';
import { createDeck, shuffleDeck, createPlayers, dealCards, getRevealCards } from './components/startupUtils'; 
import Table from './components/Table';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createContext } from 'react';
import ReactDOM from 'react-dom';
import GameSettings, { getSettings, saveSettings } from './components/GameSettings';
import RulesSummary from './components/RulesSummary';
import GameOverPopup from './components/GameOverPopup';
import cardBackImage from '/trio-card-back.png'
import { LuRabbit } from 'react-icons/lu';

export const UserContext = createContext();

let numberOfPlayers = 4;
const interactivePlayers = [0]; // Only the first player is human
const turnDelay = 750;
let noMatchTimer = null;
let matchTimer = null;
let trioTimer = null;
let moveTrioTime = null;
let moveTrioCardsTimer = null;

function App() {
 
  const [players, setPlayers] = useState([]);
  const [revealCards, setRevealCards] = useState([]);
  const [startGame, setStartGame] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  const [selectedCards, setSelectedCards] = useState([]);
  const [returnMode, setReturnMode] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [holdUseEffects, setHoldUseEffects] = useState(false);
  /*
  const triosIndex = -1;
*/
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
        localStorage.setItem('trioSettings', JSON.stringify(initSettings));
      }
    }
    
    //const initSettings = getSettings();
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);
    const initplayers = createPlayers(initSettings);
    const playersWithCards = dealCards(shuffledDeck, initplayers);
    const initRevealCards = getRevealCards(shuffledDeck, initSettings.playerCount);
    
    const playerIndex = Math.floor(Math.random() * initplayers.length); 
    
    setHoldUseEffects(false);
    setStartGame(false);
    setPlayers(playersWithCards); 
    setRevealCards(initRevealCards);
    setTurnIndex(playerIndex);
    setTurnCount(playerIndex);
    
  }, []);

  useEffect(() => {
    if (holdUseEffects) return;
    if (gameOver) return;
    if (players.length === 0) return;
    if (selectedCards.length === 0) {
      if (startGame) {
        setStartGame(false);
        samePlayer();
      } else {
        nextPlayer();
      }
    } else {
      console.log("useEffect selectedCards. holdUseEffectss" + holdUseEffects.toString() + ' ' + players[turnIndex].type);
      samePlayer();
    }
  }, [selectedCards]);

  useEffect(() => {

    console.log('holdUseEffects: ', holdUseEffects);
    if (holdUseEffects) return;
    if (gameOver) return;
    if (players.length === 0) return;
      
    if (players[turnIndex].type === 'bot') {
    
     console.log ("Bot Turn ", turnIndex); 

      let selected = [...selectedCards];
      const currSettings = getSettings();
        
      if (selected.filter(c => c.rank !== selected[0].rank).length > 0) {
        setHoldUseEffects(true);
        noMatchTimer = setTimeout(() => {
          setSelectedCards([]);
          setHoldUseEffects(false);
          return;
        }, currSettings.cardDisplayTime * 1000);
      } else {
        if (selected.length  > 2) {
          animateMoveTrio(selected, turnIndex)
          setHoldUseEffects(true);
          trioTimer = setTimeout(() => {
            setHoldUseEffects(false);
            moveCardsToPlayerTrio(turnIndex, selected);
            return;
          }, currSettings.cardDisplayTime * 1000); 
        } else {
          // select another
          let cardInfo = getCardOptions();
          //const countByRank = getCountByRank();
          const scoredCards = scoreCards(cardInfo);
          scoredCards[0].card.revealedTime = Date.now();
          selected.push(scoredCards[0].card);

          // flip the card visually - check if it's facedown
          /*
          const cardElement = document.getElementById('card-' + scoredCards[0].card.id);
          if (cardElement) {
            if (cardElement.classList.contains('selected')) {
              flipCard(cardElement, '<img src="/trio/trio-card-back.png">');          
            } else {
              flipCard(cardElement, '<span className="rank">' + scoredCards[0].card.rank.toString() + '</span>');
            }
          }
          */
          setHoldUseEffects(true);
          matchTimer = setTimeout(() => {
            setSelectedCards(selected);
            setHoldUseEffects(false);
            return;
           }, currSettings.cardDisplayTime * 1000); 
        }
      }
    } 
  }, [turnCount]);

/*
  function getCountByRank() {
    // take a look at the reveal history to figure out what to pick
    let
     cardsByRank = [];
    for (let i=1; i <= 12; i++) {
      cardsByRank[i] = [];
    }
    for (let i=0; i < players.length; i++) {
      const handLen = players[i].hand.length;
      if (handLen === 0) continue;
      for (let j=0; j < handLen; j++) {
        // only work with revealed cards
        if (players[i].hand[j].revealedTime > -1 && Date.now() -players[i].hand[j].revealedTime < (100 - players[turnIndex].forgetfullness)/100 * 60000) {
          // don't add blocked cards
          if (j===0 || j=== handLen -1 || 
                  (j===1 && players[i].hand[1].rank === players[i].hand[0].rank) || (j=== handLen -2 && players[i].hand[handLen-1].rank === players[i].hand[handLen-2].rank) ||
                  (j===2 && players[i].hand[2].rank === players[i].hand[0].rank) || (j=== handLen -3 && players[i].hand[handLen-1].rank === players[i].hand[handLen-3].rank) ) {
            cardsByRank[players[i].hand[j].rank].push(players[i].hand[j]);
          } 
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
      if (revealCards[i].id < 36 && revealCards[i].revealedTime > -1 && Date.now() - revealCards[i].revealedTime < (100 - players[turnIndex].forgetfullness)/100 * 60000) {
        cardsByRank[revealCards[i].rank].push(revealCards[i]);
      }
    }
    //console.log('Cards by rank: ', cardsByRank);
    return cardsByRank;
  }
*/
/*
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
*/
/*
  function highOrLow(highestRankIndex, lowestRankIndex,triosByRank) { 
      // should we go high or low - count the non-trios
      const above = triosByRank.filter((c, indx) => indx > highestRankIndex && c === false).length;
      const below = triosByRank.filter((c, indx) => indx < lowestRankIndex && c === false).length;
      if (above > below) return 'low';
      else return 'high';
  }
*/

  function selectAll() {
  
    let selected = [...selectedCards];
    for (let i=0; i < players.length; i++) {
      const handLen = players[i].hand.length;
      if (handLen === 0) continue;
      for (let j=0; j < handLen; j++) {
        // filter out the cards that are already selected
        if (selected.filter(c => c.id === players[i].hand[j].id).length === 0) {
          selected.push(players[i].hand[j]);
        }
      }
    }
    // reveal cards
    let reveals = [...revealCards];
    for (let i=0; i<reveals.length; i++) {
      if (reveals[i].id < 36 && selectedCards.filter(c => c.id === reveals[i].id).length === 0) {
        selected.push(reveals[i]);
      } 
    }
    
    setSelectedCards(selected);

  }

  function getCardOptions() {
    let cardOptions = [];
    let viewedCards = [];
    let cardsByRank = [];

    // reveal cards
    let reveals = [...revealCards];
    for (let i=0; i<reveals.length; i++) {
      reveals[i].cardLocation = 'reveal-' + i.toString();
      // add it to the list if it's not a filler card or if it's already selected
      if (reveals[i].id < 36 && selectedCards.filter(c => c.id === reveals[i].id).length === 0) {
        reveals[i].blocked = false;
        cardOptions.push(reveals[i]);
      }
      // push to viewed cards
      if (reveals[i].id < 36 && reveals[i].revealedTime > 0) {
        reveals[i].blocked = false;
        viewedCards.push(reveals[i]);
      }
    }

    let currPlayers = [...players];
    let j = -1;
    let blocked = false;

    // get viewed cards in player hands
    for (let i=0; i < currPlayers.length; i++) {
      for (let j=0; j<currPlayers[i].hand.length; j++) {
        if (currPlayers[i].hand[j].revealedTime > 0 || i === turnIndex) {
          viewedCards.push(currPlayers[i].hand[j]);
        }
      }
    }

    // player hands
    for (let i=0; i < currPlayers.length; i++) {
      blocked = false;
      if (currPlayers[i].hand.length > 0) {
        j = 0;
        if (selectedCards.filter((cc) => cc.id === currPlayers[i].hand[j].id).length > 0) {
          if (currPlayers[i].hand.length > 2) {
            j = 1;
            if (currPlayers[i].hand[j].rank !== currPlayers[i].hand[j-1].rank) blocked = true;
            if (selectedCards.filter((cc) => cc.id === currPlayers[i].hand[j].id).length > 0) {
              if (currPlayers[i].hand.length > 4) {
                j = 2;
                if (currPlayers[i].hand[j].rank !== currPlayers[i].hand[j-1].rank) blocked = true;
              } else {
                continue;
              }
            }
          } else {
            continue;
          } 
        }
      } else {
        continue;
      }

      if (i === turnIndex) {
        currPlayers[i].hand[j].cardLocation = 'owner-' + i.toString() + '-low-' + j.toString();
      } else {
        currPlayers[i].hand[j].cardLocation = 'bot-' + i.toString() + '-low-' + j.toString();
      }
      currPlayers[i].hand[j].blocked = blocked;
      if (cardOptions.filter((cc) => cc.id === currPlayers[i].hand[j].id).length === 0) {
        cardOptions.push(currPlayers[i].hand[j])
      }

      // do the same thing for the high end of the hand
      blocked = false;
      if (currPlayers[i].hand.length > 1) {
        j = currPlayers[i].hand.length - 1;
        if (selectedCards.filter((cc) => cc.id === currPlayers[i].hand[j].id).length > 0) {
          if (currPlayers[i].hand.length > 3) {
            j = currPlayers[i].hand.length - 2;
            if (currPlayers[i].hand[j].rank !== currPlayers[i].hand[j+1].rank) blocked = true;
            if (selectedCards.filter((cc) => cc.id === currPlayers[i].hand[j].id).length > 0) {
              if (currPlayers[i].hand.length > 5) {
                j = currPlayers[i].hand.length - 3;
                if (currPlayers[i].hand[j].rank !== currPlayers[i].hand[j+1].rank) blocked = true;
             } else {
                continue;
              }
            }
          } else {
            continue;
          } 
        }
      } else {
        continue;
      }

      if (i === turnIndex) {
        currPlayers[i].hand[j].cardLocation = 'owner-' + i.toString() + '-high-' + j.toString();
      } else {
        currPlayers[i].hand[j].cardLocation = 'bot-' + i.toString() + '-high-' + j.toString();
      }
      currPlayers[i].hand[j].blocked = blocked;
      if (cardOptions.filter((cc) => cc.id === currPlayers[i].hand[j].id).length === 0) {
        cardOptions.push(currPlayers[i].hand[j])
      }
    }

    cardOptions.sort((a,b) => a.rank - b.rank);
    viewedCards.sort((a,b) => a.rank - b.rank);
    for (let k=0; k<viewedCards.length;  k++) {
      if (cardOptions.filter(c => c.id === viewedCards[k].id).length === 0 && !viewedCards[k].blocked) {
        console.log('missing card option: ', viewedCards[k]);
      }
    }
    for (let i=1; i <= 12; i++) {
      cardsByRank[i] = [];
    }
    for (let i=0; i<viewedCards.length; i++) {
      cardsByRank[viewedCards[i].rank].push(viewedCards[i]);
    }

    console.log('selected: ', selectedCards);
    console.log('card options: ', cardOptions);
    console.log('viewed cards: ', viewedCards);
    console.log('ranked cards: ', cardsByRank);

    return {    options : cardOptions,
                viewed : viewedCards,
                byRank : cardsByRank
    }
}

  function scoreCards (cardInfo) {

    let scoredCards = [];
    
    // get the count of rankings
    let maxRankCount = -1;
    let maxRankIndx = -1;

    // randomly select initial state for position in case it doesn't get assigned
    let maxRankPosition = Math.floor(Math.random()*2) > 0 ? 'low' : 'high';
    for (let j=1; j<=12; j++) {
      if (cardInfo.byRank[j].length > maxRankCount) {
        maxRankIndx = j;
        maxRankCount = cardInfo.byRank[j].length;
        for (let k=0; k < cardInfo.byRank[j].length; k++) {
          let positionParts = cardInfo.byRank[j][k].cardLocation.split('-');
          if (positionParts.length > 2) {
            maxRankPosition = positionParts[2];
          }
        }
      } else if (cardInfo.byRank[j].length === maxRankCount) {
        // create some diversity - randomly decide to take on new rank or not
        if (Math.floor(Math.random()*2) > 1) {
          maxRankIndx = j;
          for (let k=0; k < cardInfo.byRank[j].length; k++) {
            let positionParts = cardInfo.byRank[j][k].cardLocation.split('-');
            if (positionParts.length > 2) {
              maxRankPosition = positionParts[2];
            }
          }
        }
      }
    }

    // loop through the card options
    for (let i=0; i<cardInfo.options.length; i++) {
      let s = 0;
      let c = cardInfo.options[i];
      c.txt = c.rank.toString() + ' / ' + c.cardLocaton;

      // if it's already revealed
      if (c.revealedTime > 0) {
        c.txt += ' / ' + 'reveal time: ' + c.revealedTime.toString();
        // see if card in triple 
        const rankCnt = cardInfo.byRank[c.rank].length;
        let blocked = false;   
        for (let j=0; j<rankCnt; j++) {
          if (cardInfo.byRank[c.rank][j].blocked) {
            blocked = true;
            break;
          }
        }
        // check to see if this is the same trio you started with
        if (rankCnt + selectedCards.filter((selCard, indx) => selCard.rank === c.rank).length > 2 && !blocked) {
          s += 1000;
          c.txt += ' / part of trio';
        }
      
        // is this the first, second, or third card selected
        switch (selectedCards.length) {
          case 0:
            break;

          case 1:
            if (c.rank === selectedCards[0].rank) {
              s += 500;
              c.txt += ' / second card same rank';
            }
            break;

          case 2:
            if (c.rank === selectedCards[0].rank && c.rank === selectedCards[1].rank) {
              s += 500;
              c.txt += ' / third card same rank';
            }
            break;

        }
    
        // prefer 7's
        if (c.rank === 7) {
          s += 100;
           c.txt += ' / prefer 7s';
        } 
          
      } else {

        // card has not been revealed
        c.txt += ' / NOT revealed';

        const locationParts = c.cardLocation.split('-');
        if (locationParts.length === 2 && locationParts[0] === 'reveal') {
          s += 300;
          c.txt += ' / in reveal pile';
        } else if (locationParts.length === 4 && locationParts[2] === maxRankPosition) {
          s += 400;
          c.txt += ' / in correct high-low';
        } else {
          s += 200;
          
          c.txt += ' / in wrong high-low';
        }
  
        // don't pick one of your unrevealed cards
        if (locationParts[0] !== 'owner') {
          s += 100;
          c.txt += ' / not the owner';
        }
      }
      scoredCards.push( {card: c, score: s} )
    }
/*
    //console.log('Scoring card options: ', cardOptions);
    //console.log('Count by rank: ', countByRank);
    let scoredCards = [];
    for (let i=0; i < cardOptions.length; i++) {
      let conditions = '';
      let cardScore = 0;
      let locationParts = cardOptions[i].cardLocation.split('-');
      // if the card is one that we know about, we can use the rank in our scoring - it may have not been revealed or it may have been forgotten
      if ((cardOptions[i].revealedTime > -1 && Date.now() - cardOptions[i].revealedTime < (100 - players[turnIndex].forgetfullness)/100 * 60000) || locationParts[0] === 'owner') {
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
      //console.log(` => score ${cardScore} Location: ${cardOptions[i].cardLocation} Card ${cardOptions[i].id} (rank ${cardOptions[i].rank}): ${conditions}`); 
      scoredCards.push( {card: cardOptions[i], score: cardScore} )
    }
    //console.log('scoredCards: ', scoredCards);
    */

    // mix up cases where there is a common high score
    scoredCards.sort((a, b) => b.score - a.score);
    const highScore = scoredCards[0].score;
    for (let ii=0; ii<scoredCards.length; ii++) {
      if (scoredCards[ii].score === highScore) {
        scoredCards[ii].score += Math.random() * 100;  
      }
    }
    const mixedscoredCards = scoredCards.sort((a, b) => b.score - a.score);

    console.log('scored cards: ', mixedscoredCards);
    return mixedscoredCards
  }

  /*
  function scoreCardsOld (cardOptions, countByRank) {

    const triosByRank = getTriosByRank();
    let scoredCards = [];

    for (let i=0; i < cardOptions.length; i++) {
      let cardScore = 0;

      // use card details if this card has been revealed or if it's from your hand
      if (cardOptions[i].revealedTime > -1 || players[turnIndex].hand.filter(c => c.id === cardOptions[i].id).length > 0) {

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
    console.log('next - newTurnIndex & newTurnCount: ', newTurnIndex);
  }

  function samePlayer() {
    setTurnCount(turnCount + .1);
    //console.log('turnIndex: ', turnIndex);
    console.log('same - turnCount: ', turnCount + .1);
  }

  ///////////////////  /////////////////////
  function handleCardClick(card, isSelected) {

   // ignore if it's not a human's turn
    if (players[turnIndex].type !== 'human') return;

    let selected = [...selectedCards];
    if (!isSelected && isSelectable(card)) {
      selected.push(card);

      // flip the card visually - chekck if it's facedown
      /*
      const cardElement = document.getElementById('card-' + card.id);
      if (cardElement.classList.contains('selected')) {
        flipCard(cardElement, '<img src="/trio/trio-card-back.png">');          
      } else {
        flipCard(cardElement, '<span className="rank">' + card.rank.toString() + '</span>');
      }
      */

      // save card revealed history
      let currPlayers = [...players];
      for (let i = 0; i < currPlayers.length; i++) {
        const idx = currPlayers[i].hand.findIndex(c => c.id === card.id);
        if (idx !== -1) {
          currPlayers[i].hand[idx].revealedTime = Date.now();
          setPlayers(currPlayers);
          break;
        }
      }

      // may be in reveal pile
      const idx = revealCards.findIndex(c => c.id === card.id);
      if (idx !== -1) {
        let currRevealCards = [...revealCards];
        currRevealCards[idx].revealedTime = Date.now();
        setRevealCards(currRevealCards);
      } 

      if (selected.length === 3) {
        if (selected.filter(c => c.rank === selected[0].rank).length === 3) {
          // trio
          const currSettings = getSettings();
      
          animateMoveTrio (selected, turnIndex);
          setHoldUseEffects(true);
          moveTrioTimer = setTimeout(() => {
            setHoldUseEffects(false);
            moveCardsToPlayerTrio(turnIndex, selected);
            return;
          }, currSettings.cardDisplayTime * 1000); 
          
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
    currPlayers[playerIndx].trios.push(trio);
    const currSettings = getSettings();

    if (trio[0].rank === 7 || currPlayers[playerIndx].trios.length === 3) {
      currPlayers[playerIndx].winner = true;
      
      // increment win count for winner 
      const currSettings = getSettings();
      currSettings.playerRecentWins[playerIndx]++;
      saveSettings(currSettings);
      
      // show all cards if the settings say so 
      if (currSettings.showHands) {
        selectAll();
      }
      
      setHoldUseEffects(true);
      
      moveTrioCardsTimer = setTimeout(() => {
        gtag('event', 'games_completed', {
        event_category: 'Games',
        event_label: 'Games Completed',
        value: 1
      });

      
        setHoldUseEffects(false);
        setGameOver(true);
        return;
      }, currSettings.cardDisplayTime * 1000);  
    } else {
      setSelectedCards([]);  
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
          const blankCard = { id: 99-trio[h].id, rank: -1, color: -1, revealedTime: -1 };
          currReveals = currReveals.toSpliced(idx, 1, blankCard);
        }
      }
    }
    setPlayers(currPlayers);
    setRevealCards(currReveals);
  }

  function newGame() {
    ////////////////////////

    setStartGame(true);
    setHoldUseEffects(true);    
    handleClosePopup();

    // cancel all timers
    clearTimeout(noMatchTimer);
    clearTimeout(matchTimer);
    clearTimeout(trioTimer);
    clearTimeout(moveTrioTime);
    clearTimeout(moveTrioCardsTimer);

    noMatchTimer = null;
    matchTimer = null;
    trioTimer = null;
    moveTrioTime = null;
    moveTrioCardsTimer = null;

    const initSettings = getSettings();
    if (initSettings) {
      numberOfPlayers = initSettings.playerCount;
      if (initSettings.newUser) {
        setShowRules(true);
        initSettings.newUser = false;
        localStorage.setItem('trioSettings', JSON.stringify(initSettings));
      }
    }
    
    //const initSettings = getSettings();
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);
    const initplayers = createPlayers(initSettings);
    const playersWithCards = dealCards(shuffledDeck, initplayers);
    const initRevealCards = getRevealCards(shuffledDeck, initSettings.playerCount);
    
    const playerIndex = Math.floor(Math.random() * initplayers.length); 
    
    setGameOver(false);
    setPlayers(playersWithCards); 
    setRevealCards(initRevealCards);
    setTurnIndex(playerIndex);
    setTurnCount(playerIndex);
    setHoldUseEffects(false);
    setSelectedCards([]);

    
    /////////////////
    /*
    handleClosePopup();
    setHoldUseEffects(true);
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);
    const playersWithCards = dealCards(shuffledDeck, players);
    for (let i = 0; i < playersWithCards.length; i++) {
      playersWithCards[i].trios = [];
      playersWithCards[i].winner = false;
    }
    const initRevealCards = getRevealCards(shuffledDeck, settings.playerCount);
    
    const playerIndex = Math.floor(Math.random() * players.length);
    
    setGameOver(false);
    setPlayers(playersWithCards);
    setRevealCards(initRevealCards);
    setReturnMode(false);
    setSelectedCards([]);
    setTurnIndex(playerIndex);
    setTurnCount(playerIndex);
    setHoldUseEffects(false);
    */
  }
/*
  function announceWinner() {
    setGameOver(true);   
  }   
  */   
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

/*
const handleTriosReady = (el, childIndex, grandIndex) => { 
  console.log("Mounted:", childIndex, grandIndex, el);
  //animateMoveTrio(el, childIndex);
}
 */

function animateMoveTrio(trio, playerIndex) {
  let targetRect = {};
  const currSettings = getSettings();

  // calculate the next card location in the players trioSet area
  const trioSets = document.querySelectorAll('.trios-container.player-' + playerIndex.toString());
  targetRect = trioSets[0].getBoundingClientRect();
  
  for (let i = 0; i < trio.length; i++) {
    const trioCard = document.getElementById("card-" + trio[i].id.toString());
    const startX = trioCard.getBoundingClientRect().left;
    const startY = trioCard.getBoundingClientRect().top; 
    // find center of target
    const endX = targetRect.left + ((targetRect.right - targetRect.left)/2);
    const endY = targetRect.top + ((targetRect.bottom - targetRect.top)/2);
    const targetX = (endX - startX).toString() + "px";
    const targetY = (endY - startY).toString() + "px";

    const cardAnimation = trioCard.animate(
      [
        {
          opacity: 1,
          scale: 1,
        },
        {
          opacity: 1,
          scale: 1,
        },
        {
          opacity: 1,
          scale: 0.9,
        },
        {
          opacity: 1,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 0.75,
        },
        {
          opacity: 1,
          scale: 0.7,
        },
        {
          opacity: 1,
          scale: 0.65,
        },
        {
          opacity: 1,
          scale: 0.6,
        },
        {
          opacity: 0.75,
          scale: 0.55,
        },
        {
          opacity: 0.25,
          scale: 0.5,
        },
        {
          translate: targetX + " " + targetY,
          opacity: 0,
          rotate: 720
        },
      ],
      {
        duration: currSettings.cardDisplayTime * 1000,
        delay: (i * 250) / trio.length,
        easing: "ease-in-out",
        fill: "forwards",
        direction: "normal",
      }
    );
  }
}

function animateMoveTrioOld(trio, playerIndex) {
  let targetRect = {};

  // calculate the next card location in the players hand
  const trioSets = document.querySelectorAll('.trios-container.player-' + playerIndex.toString());
  targetRect = trioSets[0].getBoundingClientRect();
  
  for (let i = 0; i < trio.length; i++) {
    const trioCard = document.getElementById("card-" + trio[i].id.toString());
    const startX = trioCard.getBoundingClientRect().left;
    const startY = trioCard.getBoundingClientRect().top; 
    // find center of target
    const endX = targetRect.left + ((targetRect.right - targetRect.left)/2);
    const endY = targetRect.top + ((targetRect.bottom - targetRect.top)/2);
    const targetX = (endX - startX).toString() + "px";
    const targetY = (endY - startY).toString() + "px";

    trioCard.style.setProperty('--translate-x', targetX);
    trioCard.style.setProperty('--translate-y', targetY);
    trioCard.style.setProperty('--rotateX', '720deg');

    //console.log('done');
  }
    /*
    const cardAnimation = trio[i].animate(
      [
        {
          opacity: 1,
          scale: 1,
        },
        {
          opacity: 1,
          scale: 1,
        },
        {
          opacity: 1,
          scale: 0.9,
        },
        {
          opacity: 1,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 0.75,
        },
        {
          opacity: 1,
          scale: 0.7,
        },
        {
          opacity: 1,
          scale: 0.65,
        },
        {
          opacity: 1,
          scale: 0.6,
        },
        {
          opacity: 0.75,
          scale: 0.55,
        },
        {
          opacity: 0.25,
          scale: 0.5,
        },
        {
          translate: targetX + " " + targetY,
          opacity: 0,
        },
      ],
      {
        duration: 1500,
        delay: (i * 500) / trio.length,
        easing: "ease-in-out",
        fill: "forwards",
        direction: "normal",
      }
    );
  }
    */
}

/*
useEffect(() => {
  const observer = new MutationObserver(() => {
    const el = document.querySelector('.trioSet');
    if (el) {
      observer.disconnect();
      runMyRoutine(el);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}, []);
*/

/*
function flipCard(element, frontOrBackHtml) {
  const animation = element.animate(
    [
      { transform: "rotateY(0deg)", easing: "ease-in" },
      { transform: "rotateY(90deg)" },   // halfway point
      { transform: "rotateY(180deg)", easing: "ease-out" }
    ],
    {
      duration: 500,
      fill: "forwards"
    }
  );
  // Swap content at the halfway point
  animation.onfinish = () => {
    element.style.transform = "rotateY(0deg)";
    element.innerHTML = frontOrBackHtml;
  }
}
  */

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
                              settings,
                              handleToggleShowErrors
                            }} >
        <div className="game-container">
          <Table 
          />
        </div>

        <GameSettings showRules={showRules}  
                      newGame={newGame} 
                      showSettings={showSettings} 
                      setShowSettings={setShowSettings}
                      setShowRules={setShowRules}
                      />

        <RulesSummary setShowRules={setShowRules} showRules={showRules} />
        
        
        <div className={'game-over' + (gameOver ? ' popup-visible' : '')}>
          <GameOverPopup gameOver={gameOver} setGameOver={setGameOver} newGame={newGame} onClose={handleClosePopup}  ></GameOverPopup>
        </div>

      </UserContext.Provider>

    );
  }
}


export default App;