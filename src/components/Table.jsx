//import React from 'react';
import { useState, useEffect, use } from 'react';
import { getSettings, createDeck, shuffleDeck, createPlayers, dealCards, getRevealCards } from './startupUtils';
import './Table.css'
import React, { useContext } from 'react';
import { UserContext } from '../App';

const rowsBetweenCards = ['left', 'left-1', 'left-2', 'right', 'right-1', 'right-2'];
  
export default function Table() {

  const ctx = useContext(UserContext);

  switch (ctx.players.length) {
    // case 1 is for testing
    case 1:
      return (
        <div className="game-table">
        <div className="row">
            <Seat key="0"
                    position="bottom" 
                    player={ctx.players[0]} 
                    selectableCards={ctx.turnAndCardInfo.selectableCards}   
                    selectedCards={ctx.turnAndCardInfo.selectedCards} 
                    cturnIndex={ctx.turnAndCardInfo.turnIndex} />
        </div>
        </div>
      );
    case 2: 
      return (
        <div className="game-table">
          <div className="row">
            <div className={"col-2" + (ctx.turnAndCardInfo.turnIndex === 1 ? ' active' : '')}>
              <Seat key="1"
                    position="left" 
                    player={ctx.players[1]} 
                    selectableCards={ctx.turnAndCardInfo.selectableCards}   
                    selectedCards={ctx.turnAndCardInfo.selectedCards} 
                    turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>  
            <div className="col-8">
              <RevealCards cards={ctx.revealCards}  
                            selectableCards={ctx.turnAndCardInfo.selectableCards}   
                            selectedCards={ctx.turnAndCardInfo.selectedCards} 
                            turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>  
          </div>
          <div className={"row" + (ctx.turnAndCardInfo.turnIndex === 0 ? ' active' : '')}>
            <Seat key="0"
                    position="bottom" 
                    player={ctx.players[0]} 
                    selectableCards={ctx.turnAndCardInfo.selectableCards}   
                    selectedCards={ctx.turnAndCardInfo.selectedCards} 
                    turnIndex={ctx.turnAndCardInfo.turnIndex} />
          </div>
        </div>
      );
      break;

    case 3: 
      return (
        <div className="game-table">
          <div className="row">
            <div className="col-2">
              <Seat key="1"
                    position="left" 
                    player={ctx.players[1]} 
                    selectableCards={ctx.turnAndCardInfo.selectableCards}   
                    selectedCards={ctx.turnAndCardInfo.selectedCards} 
                    turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>  
            <div className="col-8">
              <RevealCards cards={ctx.revealCards}  
                            selectableCards={ctx.turnAndCardInfo.selectableCards}   
                            selectedCards={ctx.turnAndCardInfo.selectedCards} 
                            turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>  
            <div className="col-2">
               <Seat key="2" 
                    position="right" 
                    player={ctx.players[2]} 
                    selectableCards={ctx.turnAndCardInfo.selectableCards}   
                    selectedCards={ctx.turnAndCardInfo.selectedCards} 
                    turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>  
          </div>
          <div className="row">
            <Seat key="0"
                    position="bottom" 
                    player={ctx.players[0]} 
                    selectableCards={ctx.turnAndCardInfo.selectableCards}   
                    selectedCards={ctx.turnAndCardInfo.selectedCards} 
                    turnIndex={ctx.turnAndCardInfo.turnIndex} />
          </div>
        </div>
      );
      break;    
    case 4: 
      return (
        <div className="game-table">
            <div className="row upper-row justify-content-center">
              <Seat key="2"
                    position="top" 
                    player={ctx.players[2]} 
                    selectedCards={ctx.turnAndCardInfo.selectedCards} 
                    selectableCards={ctx.turnAndCardInfo.selectableCards} 
                    turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>
            <div className="row center-row justify-content-center">
                <div className="col-1 justify-content-center">
                    <Seat key="1"
                          position="left" 
                          player={ctx.players[1]} 
                          selectableCards={ctx.turnAndCardInfo.selectableCards}  
                          selectedCards={ctx.turnAndCardInfo.selectedCards} 
                          turnIndex={ctx.turnAndCardInfo.turnIndex} />
                </div>
                <div className="col-10 justify-content-center reveal-cards">
                    <RevealCards cards={ctx.revealCards} 
                                 selectableCards={ctx.turnAndCardInfo.selectableCards}   
                                 selectedCards={ctx.turnAndCardInfo.selectedCards} 
                                 turnIndex={ctx.turnAndCardInfo.turnIndex} />
                </div>
                <div className="col-1 justify-content-center">
                    <Seat key="3"
                        position="right" 
                        player={ctx.players[3]}
                        selectableCards={ctx.turnAndCardInfo.selectableCards}    
                        selectedCards={ctx.turnAndCardInfo.selectedCards} 
                        turnIndex={ctx.turnAndCardInfo.turnIndex} />
                </div>  
            </div>
            <div className="row bottom-row justify-content-center">
                <Seat key="0"
                      position="bottom" 
                      player={ctx.players[0]}
                      selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>
        </div>
      );
      break;
    case 5:
     return (
        <div className="game-table">
          <div className="row">
            <Seat key="1" position="top-1" player={ctx.players[2]} selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
            <Seat position="top-2" player={ctx.players[3]} selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
          </div>
          <div className="row">
            <div className="col-2">
                <Seat key="2" position="left" player={ctx.players[1]} selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>
            <div className="col-8">
                <RevealCards cards={ctx.revealCards}  selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>
            <div className="col-2">
                <Seat key="3" position="right" player={ctx.players[3]}  selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>  
          </div>
          <div>
            <Seat key="0" position="bottom" player={ctx.players[0]}  selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
          </div>
        </div>
      );
      break;
    case 6:
      return (
        <div className="game-table">
          <div className="row">
            <Seat key="3" position="top" player={ctx.players[3]} selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
          </div>
          <div className="row">
            <div className="col-2">
                <div className="row">
                    <Seat key= "1" position="left-1" player={ctx.players[1]} selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
                </div>
                <div className="row">
                    <Seat key="2" position="left-2" player={ctx.players[2]} selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
                </div>
            </div>
            <div className="col-8">
                <RevealCards cards={ctx.revealCards}  selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} turnIndex={ctx.turnAndCardInfo.turnIndex} />
            </div>
            <div className="col-2">
                <div className="row">
                    <Seat key="4" position="right-1" player={ctx.players[4]} selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
                </div>
                <div className="row">
                    <Seat key="5" position="right-2" player={ctx.players[5]} selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
                </div>
            </div>
          </div>    
          <div className="row">
            <Seat key="0" position="bottom" player={ctx.players[0]}  selectableCards={ctx.turnAndCardInfo.selectableCards}   
                      selectedCards={ctx.turnAndCardInfo.selectedCards} 
                      turnIndex={ctx.turnAndCardInfo.turnIndex} />
          </div>
        </div>
      );
      break;
    default:
        return <div>Invalid number of players</div>;
    }
}

function Seat({ position, player }) {
    
  const ctx = useContext(UserContext);

    switch (position) { 
        case 'top':
        case 'top-1':
        case 'top-2':
            return (
                <>
                <div className={'row seat top'}>
                    <div className="card-container horizontal col-12" >
                        {player.hand.map((card) => (
                            <Card key={card.id} 
                                  position={position} 
                                  card={card}
                                  isHuman={player.type === 'human'}
                                  isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                                  isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                                  turnIndex={ctx.turnAndCardInfo.turnIndex}
                                  isTrio={false} />
                        ))}
                    </div>
                </div>
                <div className={'row seat trios top'}>
                   <div className="card-container horizontal col-12" >
                     {player.trios.map((triosSet, indx) => (
                      <div key={position + "-" + indx.toString()} className="trioSet" >
                        {triosSet.map((card, indx) => (
                            <Card key={card.id} 
                                  position={position} 
                                  card={card}
                                  isHuman={player.type === 'human'}
                                  isTrio={true}
                                  overlap={indx < 2 ? true : false} />
                        ))}
                        </div>
                      ))}
                    </div> 
                </div>
              </>
            );
            break;

        case 'left':
        case 'left-1':
        case 'left-2':
            return (
                 <>
                    <div className="card-container vertical col-1 seat left-side" >
                        {player.hand.map((card) => (
                            <Card key={card.id} 
                                  position={position} 
                                  card={card}
                                  isHuman={player.type === 'human'}
                                  isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                                  isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                                  turnIndex={ctx.turnAndCardInfo.turnIndex}
                                  isTrio={false} />
                        ))}
                    </div> 
                   <div className="card-container vertical col-1 trios left" >
                     {player.trios.map((triosSet, indx) => (
                      <div key={position + "-" + indx.toString()} className="trioSet" >
                        {triosSet.map((card, indx) => (
                            <Card key={card.id} 
                                  position={position} 
                                  card={card}
                                  isHuman={player.type === 'human'}
                                  isTrio={true}
                                  overlap={indx < 2 ? true : false} />
                        ))}
                        </div>
                      ))}
                    </div>
              </>
            );
            break;

        case 'right':   
        case 'right-1':
        case 'right-2':
            return (
                <>
                <div className={'row seat trios top'}>
                   <div className="card-container vertical col-1 trios right" >
                     {player.trios.map((triosSet, indx) => (
                      <div key={position + "-" + indx.toString()} className="trioSet" >
                        {triosSet.map((card, indx) => (
                            <Card key={card.id} 
                                  position={position} 
                                  card={card}
                                  isHuman={player.type === 'human'}
                                  isTrio={true}
                                  overlap={indx < 2 ? true : false} />
                        ))}
                        </div>
                      ))}
                    </div> 
                </div>
                <div className="card-container vertical col-1 seat right-side" >
                    {player.hand.map((card) => (
                            <Card key={card.id} 
                                  position={position} 
                                  card={card}
                                  isHuman={player.type === 'human'}
                                  isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                                  isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                                  turnIndex={ctx.turnAndCardInfo.turnIndex}
                                  isTrio={false} />
                        ))}
                </div>
                </>
            );
            break;
        case 'bottom':
        default:
            return (
                <>
                <div className={'row seat trios bottom'}>
                   <div className="card-container horizontal col-12" >
                    {player.trios.map((triosSet, indx) => (
                      <div key={position + "-" + indx.toString()} className="trioSet" >
                        {triosSet.map((card, indx) => (
                            <Card key={card.id} 
                                  position={position} 
                                  card={card}
                                  isHuman={player.type === 'human'}
                                  isTrio={true}
                                  overlap={indx < 2 ? true : false} />
                        ))}
                        </div>
                      ))}
                    </div> 
                </div>
               <div className="card-container horizontal col-12" >
                        {player.hand.map((card) => (
                            <Card key={card.id} 
                                  position={position} 
                                  card={card}
                                  isHuman={player.type === 'human'}
                                  isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                                  isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                                  turnIndex={ctx.turnAndCardInfo.turnIndex}
                                  isTrio={false} />
                        ))}
                </div>
               </>
            );
            break;
    }
}   

function RevealCards({ cards, selectableCards, selectedCards, turnIndex }) {

  const ctx = useContext(UserContext);

    if (cards.length === 0) {
        return <div>No reveal cards</div>;
    }

    if (cards.length === 6) {
        return (
          <>
           <div className="reveal-cards center card-container row" >
               {cards.map((card, indx) => indx < 3 (
                  <Card key={card.id} 
                        card={card}
                        isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                        isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                        turnIndex={ctx.turnAndCardInfo.turnIndex} />
            ))}
            </div>
            <div className="reveal-cards center card-container row" >
               {cards.map((card, indx) => indx > 2 (
               <Card key={card.id} 
                        card={card}
                        isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                        isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                        turnIndex={ctx.turnAndCardInfo.turnIndex} />
            ))}
            </div>
          </>
        );

    } else if (cards.length === 8) {
        return (
          <>
           <div className="reveal-cards center card-container row" >
               {cards.map((card, indx) => {if (indx < 4) return (
               <Card key={card.id} 
                                  card={card}
                                  isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                                  isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                                  turnIndex={ctx.turnAndCardInfo.turnIndex} />
               )})}
            </div>
            <div className="reveal-cards center card-container row" >
               {cards.map((card, indx) => {if (indx > 3) return (
                 <Card key={card.id} 
                                  card={card}
                                  isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                                  isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                                  turnIndex={ctx.turnAndCardInfo.turnIndex} />
            )})}
            </div>
          </>
        );

    } else if (cards.length === 9) {
        return (
          <>
           <div className="reveal-cards center card-container row" >
               {cards.map((card, indx) => indx < 3 (
               <Card key={card.id} 
                                  card={card}
                                  isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                                  isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                                  turnIndex={ctx.turnAndCardInfo.turnIndex} />
            ))}
            </div>
            <div className="reveal-cards center card-container row" >
               {cards.map((card, indx) => indx > 2 && indx < 7 (
               <Card key={card.id} 
                                  card={card}
                                  isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                                  isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                                  turnIndex={ctx.turnAndCardInfo.turnIndex} />
            ))}
            </div>
            <div className="reveal-cards center card-container row" >
               {cards.map((card, indx) => indx > 6 (
               <Card key={card.id} 
                                  card={card}
                                  isSelectable={ctx.turnAndCardInfo.selectableCards.filter(c => c.id === card.id).length > 0} 
                                  isSelected={ctx.turnAndCardInfo.selectedCards.filter(c => c.id === card.id).length > 0} 
                                  turnIndex={ctx.turnAndCardInfo.turnIndex} />
            ))}
            </div>
          </>
        );

    } else {
       return <div>Unexpected number of reveal cards</div>;
    }
}
 
function Card({ card, position,isSelectable, isSelected, isHuman, overlap}) {

  const ctx = useContext(UserContext);

    //const cardClass = `game-card rank-${card.rank} }`;
    if (isSelected) {
        return (
          <div className={'game-card selected' + (isHuman ? ' human' : ' bot')} id={'card-' + card.id} onClick={() => ctx.handleCardClick(card, isSelectable, isSelected)}>
            <span className="rank" >{card.rank}</span>
        </div>
        );
    } else {
        if (isSelectable) {
            return (
              <div className={'game-card selectable' + (isHuman ? ' human' : ' bot')} id={'card-' + card.id} onClick={() => ctx.handleCardClick(card, isSelectable, isSelected)}>
                <span className="rank">{isHuman ? card.rank.toString() : ''}</span>
              </div>
            );
        } else {
            return (
              <div className={'game-card' + (isHuman ? ' human' : ' bot') + (overlap ? ' overlap' : '')} 
              id={'card-' + card.id} onClick={() => ctx.handleCardClick(card, isSelectable, isSelected)}>
                <span className="rank">{isHuman ? card.rank.toString() : ''}</span>
              </div>
            );   
        }
    }
}
