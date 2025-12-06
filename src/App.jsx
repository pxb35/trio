import React from 'react';
import { useState, useEffect, use } from 'react';
import { getSettings, createDeck, shuffleDeck, createPlayers, dealCards, getRevealCards } from './components/startupUtils'; 
import Table from './components/Table';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

export const UserContext = createContext();

function App() {

  const [players, setPlayers] = useState([]);
  const [revealCards, setRevealCards] = useState([]);
  const [turnAndCardInfo, setTurnAndCardInfo] = useState({});
  const [initialized, setInitialized] = useState(false);
  //const [selectedCards, setSelectedCards] = useState([]);
  //const [selectableCards, setSelectableCards] = useState([]);
  //const [turnIndex, setTurnIndex] = useState(0);
  //const [turnCounter, setTurnCounter] = useState(0);
  //const [canClick, setCanClick] = useState(true);
  //const [cardsShown, setCardsShown] = useState([]);

  const settings = getSettings();
    
  // -- initialize deck and players -runs once --
  useEffect(() => {
 console.log ("useEffect []");
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);
    const initplayers = createPlayers(settings);
    const playersWithCards = dealCards(shuffledDeck, initplayers);
    const initRevealCards = getRevealCards(shuffledDeck, settings.numPlayers);
    
    setPlayers(playersWithCards); 
    setRevealCards(initRevealCards);
    
  }, []);

  useEffect(() => {
    console.log ("useEffect [players, revealCards]");
    if (initialized) return;
    if (players.length === 0 || revealCards.length === 0) return;
    setInitialized(true);
    const playerIndex = Math.floor(Math.random() * players.length); 
    const initSelectables = buildSelectableList(players, revealCards);
    updateTurnAndCardInfo(initSelectables, [], playerIndex);

  }, [players, revealCards]);

/*
  useEffect(() => {
    
 console.log ("useEffect [turnIndex]");

    if (settings.interactiveUserIndexes.includes(turnAndCardInfo.turnIndex)) {
      completeInteractiveTurn();
    } else {
      completeBotTurn();
    }
  }, [turnAndCardInfo.turnIndex]);

  useEffect(() => {
    
  }, [turnAndCardInfo]);
*/
  /*
  useEffect(() => {
    
    if (players.length === 0) return;
  
    // is turn over
    if (selectedCards.length === 0 && selectableCards.length === 0) {
      //const turnCnt = turnCounter + 1;
      setTurnCounter(turnCounter + 1);
      //const turnIdx = turnCnt % players.length;
      setTurnIndex((turnIndex + 1) %  players.length);
      //setTurnIndex(turnCnt % players.length);

      //setTurnCounter(turnCounter + 1);
      //setTurnIndex((turnCounter + 1) % players.length);
      
    }

  }, [selectableCards, selectedCards]);
*/

  function updateTurnAndCardInfo (selectables, selecteds, startingIndex) {

 console.log ("updateTurnAndCardInfo");

    setTurnAndCardInfo(prev => {
      const currInfo = {...prev};
      let turnIndex = currInfo.turnIndex;
      let turnCounter = currInfo.turnCounter;
       if (startingIndex > -1) {
        turnCounter = startingIndex;
        turnIndex = startingIndex;
      } else if (selecteds.length === 0 && selectables.length === 0) {
        turnCounter += 1;
        turnIndex = (turnIndex + 1) % players.length;
      }
      let currInfoObj = {selectableCards:  selectables,
                        selectedCards:    selecteds,
                        turnCounter:      turnCounter,
                        turnIndex:        turnIndex
      }

      return currInfoObj;
    });
  }

  useEffect(() => {

    if (players.length === 0) return;
      
    if (players[turnAndCardInfo.turnIndex].type === 'bot') {
    
    console.log ("complete Bot Turn ", turnAndCardInfo.turnIndex); 

    updateTurnAndCardInfo(turnAndCardInfo.selectableCards, [], -1);

     // take a look at the reveal history to figure out what to pick
     let cardsByRank = [];
     for (let i=1; i <= 12; i++) {
       cardsByRank[i] = [];
     }
     for (let i=0; i < players.length; i++) {
       for (let j=0; j < players[i].hand.length; j++) {
         if (players[i].hand[j].revealedAtTurn > -1) {
          cardsByRank[players[i].hand[j].rank].push(players[i].hand[j]);
         }
        }
      }
       
      // see how many entries for each rank
      let highestRankCount = 0;
      let highestRankIndex = -1;
      for (let i=1; i <= 12; i++) {
        if (cardsByRank[i].length > highestRankCount) {
          highestRankIndex = i;
          highestRankCount = cardsByRank[i].length;
        }
      }
      
      if (highestRankIndex > -1) {
      console.log('highest set: ', cardsByRank);
      console.log(cardsByRank[highestRankIndex]);
           
      for (let i=0; i<cardsByRank[highestRankIndex].length; i++) {
        //updateTurnAndCardInfo(turnAndCardInfo.selectableCards, turnAndCardInfo.selectedCards, -1);
        //setTimeout(function() {
           handleCardClick(cardsByRank[highestRankIndex][i], true, false);
          // updateTurnAndCardInfo(turnAndCardInfo.selectables, turnAndCardInfo.selecteds, -1);
        //}, 2000);
           //let card = document.getElementById('card-'+cardsByRank[highestRankIndex][i].id);
           //card.click();
      }
    }
///////////////////////////////
    } else {

   console.log ("complete Interactive Turn: ", turnAndCardInfo.turnIndex);

   if (players.length === 0) return;

    //updateTurnAndCardInfo(turnAndCardInfo.selectableCards, [], -1);
     
    // flag when turn is over
    //if (turnAndCardInfo.selectedCards.length !== 0 || turnAndCardInfo.selectableCards.length !== 0) return;
    //updateTurnAndCardInfo(buildSelectableList(players, revealCards), [], (turnAndCardInfo.turnIndex + 1) % players.length);
    //setTurnCounter(turnCounter + 1);
    }

  }, [turnAndCardInfo.turnIndex]);

  /////////////////// handleCardClick /////////////////////
  function handleCardClick(card, isSelectable, isSelected) {

   console.log ("handleCardClck", card);

    let selectable = [...turnAndCardInfo.selectableCards];
    let selected = [...turnAndCardInfo.selectedCards];
;
    if (isSelectable) {
      selected.push(card);
      
      // save card revealTurn status
      for (let i = 0; i < players.length; i++) {
        const idx = players[i].hand.findIndex(c => c.id === card.id);
        if (idx !== -1) {
          let currPlayers = [...players];
          currPlayers[i].hand[idx].revealedAtTurn = turnAndCardInfo.turnCounter;
          setPlayers(currPlayers);
        }
      }

      selectable = selectable.filter(c => c.id !== card.id);
      if (card.rank !== selected[0].rank) {
        selectable = [];
      } else if (selected.length === 3) {
        // trio
        moveCardsToPlayerTrio(turnAndCardInfo.turnIndex, selected);
        selected = [];
        selectable = [];
      } else {
        // see if we need to make the adjacent card selectable
        for (let i = 0; i < players.length; i++) {
          const idx = players[i].hand.findIndex(c => c.id === card.id);
          if (idx !== -1) {
            // make adjacent cards selectable
            if (idx === 0 && players[i].hand.length > 1 || idx === 1 & players[i].hand.length > 2) {
              selectable = [...selectable, players[i].hand[idx + 1]];
            } else if (idx === players[i].hand.length - 1 && players[i].hand.length > 2 || idx === players[i].hand.length - 2 && players[i].hand.length > 3) {
              selectable = [...selectable, players[i].hand[idx - 1]];
            }
            break;
          }
        }

        // must be in reveal pile
        const idx = revealCards.findIndex(c => c.id === card.id);
        if (idx !== -1) {
          let currRevealCards = [...revealCards];
          currRevealCards[idx].revealedAtTurn = turnCounter;
          setRevealCards(currRevealCards);
        } 
      }
    }

    if (isSelected && selectable.length === 0) {
      selected = selected.filter(c => c.id !== card.id);
    }

    updateTurnAndCardInfo(selectable, selected, -1);
  }

  function moveCardsToPlayerTrio(playerIndx, trio) {
    console.log ("moveCardsToPlayerTrio");
    let currPlayers = [...players];
    let currReveals = [...revealCards];
    currPlayers[turnAndCardInfo.turnIndex].trios.push(trio);
          
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
     
  function gameLog(msg) {
      console.log(msg);
  }

  function buildSelectableList(currPlayers, currRevealCards) {
    
   console.log ("buildSelectableList");

    let selectable = currRevealCards.filter(c => c.id < 36);
    for (let i=0; i < currPlayers.length; i++) {
      if (currPlayers[i].hand.length > 0) {
        selectable.push(currPlayers[i].hand[0])
        if (currPlayers[i].hand.length > 1) {
          selectable.push(currPlayers[i].hand[(currPlayers[i].hand.length)-1])
        }
      }
    }
    return selectable
  }
   
  if (players.length === 0) {
    return <div>Loading...</div>;
  } else {
    return (
      <UserContext.Provider value={{players, 
                                setPlayers,
                                revealCards, 
                                setRevealCards,
                                turnAndCardInfo,
                                handleCardClick,
                                settings                               
                              }} >
          <div className="game-container">
            <Table 
            />
          </div>
        </UserContext.Provider>
      );
  }
}

export default App;