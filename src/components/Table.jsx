//import React from 'react';
import './Table.css'
import React, { useContext, useRef, useEffect  } from 'react';
import { UserContext } from '../App';
import cardBack from '/trio-card-back.png';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import ReactDOM from "react-dom"

const modules = import.meta.glob("/picture*.png", { eager: true });

const images = Object.entries(modules)
  .sort(([a], [b]) => {
    const numA = parseInt(a.match(/picture(\d+)\.png/)[1]);
    const numB = parseInt(b.match(/picture(\d+)\.png/)[1]);
    return numA - numB;
  })
  .map(([, mod]) => mod.default);

const rowsBetweenCards = ['left', 'left-1', 'left-2', 'right', 'right-1', 'right-2'];
  
export default function Table() {
  
  const ctx = useContext(UserContext);

      return (
        <div className="game-table row justify-content-center align-items-center">
          <div className="card-container vertical col-1 seat left-side" >
            <p className="players-name">{ctx.players[1].name}</p>
            {ctx.players[1].hand.map((card) => (
              <Card key={card.id} 
                    activePlayer={ctx.turnIndex === 1}
                    card={card}
                    isHuman={ctx.players[1].type === 'human'}
                    isSelected={ctx.selectedCards.filter(c => c.id === card.id).length > 0} 
                    turnIndex={ctx.turnIndex}
                    isTrio={false} />
            ))}
        </div>
        <div className="col-10 justify-content-center">
          <div className="row justify-content-center">
            <p className="players-name">{ctx.players[2].name}</p>
            <div className="card-container horizontal col-12 seat top" >
              {ctx.players[2].hand.map((card) => (
                <Card key={card.id} 
                      activePlayer={ctx.turnIndex === 2}
                      card={card}
                      isHuman={ctx.players[2].type === 'human'}
                      isSelected={ctx.selectedCards.filter(c => c.id === card.id).length > 0} 
                      turnIndex={ctx.turnIndex}
                      isTrio={false} />
                      
              ))}
            </div>
          </div>
          <div className="row">
            <div className="trios-container col-2 trios left align-content-center player-1">
              {ctx.players[1].trios.map((triosSet, indx) => (
                <TrioSet key={10 + indx}
                          indx={indx}
                          position='left'
                          playerNum={1}
                          triosSet={triosSet} />
              ))}
            </div>  
            <div className=" reveal-trio-cards-section col-8 trios center align-items-center">
              <div className="row justify-content-center align-items-center trios-container trios top player-2">
                {ctx.players[2].trios.map((triosSet, indx) => (
                <TrioSet key={20 + indx}
                          indx={indx}
                          position='top'
                          playerNum={2}
                          triosSet={triosSet} />
              ))}
              </div>
              <div className="row justify-content-center align-items-center reveal-cards-section">
                 <div className="reveal-cards center card-container" >
                      {ctx.revealCards.map((card, indx) => {if (indx < 4) return (
                      <Card key={card.id} 
                                          activePlayer={false}
                                          card={card}
                                          isSelected={ctx.selectedCards.filter(c => c.id === card.id).length > 0} 
                                          turnIndex={ctx.turnIndex} />
                      )})}
                    </div>
                    <div className="reveal-cards center card-container row" >
                      {ctx.revealCards.map((card, indx) => {if (indx > 3) return (
                        <Card key={card.id} 
                                          activePlayer={false}
                                          card={card}
                                          isSelected={ctx.selectedCards.filter(c => c.id === card.id).length > 0} 
                                          turnIndex={ctx.turnIndex} />
                    )})}
                    </div>
              </div>
              <div className="row justify-content-center align-items-center trios-container trios bottom player-0">
                {ctx.players[0].trios.map((triosSet, indx) => (
                <TrioSet key={indx}
                          indx={indx}
                          position='bottom'
                          playerNum={0}
                          triosSet={triosSet} />
              ))}
              </div>
            </div>
            <div className="trios-container col-2 trios right align-content-center player-3">
              {ctx.players[3].trios.map((triosSet, indx) => (
                <TrioSet key={30 + indx}
                          indx={indx}
                          position='right'
                          playerNum={3}
                          triosSet={triosSet}
                           />
              ))}  
            </div>
          </div>
            <div className="row justify-content-center">
              <div className="card-container horizontal col-12 seat bottom" >
                {ctx.players[0].hand.map((card) => (
                <Card key={card.id} 
                      card={card}
                      activePlayer={ctx.turnIndex === 0}
                      isHuman={ctx.players[0].type === 'human'}
                      isSelected={ctx.selectedCards.filter(c => c.id === card.id).length > 0} 
                      turnIndex={ctx.turnIndex}
                      isTrio={false} />
                ))}
              </div>
              <p className="players-name">{ctx.players[0].name}</p>
            </div>
          </div>
          <div className="card-container vertical col-1 seat right-side" >
            <p className="players-name">{ctx.players[3].name}</p>
              {ctx.players[3].hand.map((card) => (
              <Card key={card.id} 
                    activePlayer={ctx.turnIndex === 3}
                    card={card}
                    isHuman={ctx.players[3].type === 'human'}
                    isSelected={ctx.selectedCards.filter(c => c.id === card.id).length > 0} 
                    turnIndex={ctx.turnIndex}
                    isTrio={false} />
            ))}
        </div>
        </div> 
      );
    }

function TrioSet ({position, indx, triosSet, playerNum}) {
  
  const ctx = useContext(UserContext);
 /* 
 const ref = useRef(); 

  useEffect(() => {
    onReady(ref.current, childIndex, grandIndex);
  }, [])
*/
  return (
    <div key={position + "-" + indx.toString()} className="trioSet" >
      {triosSet.map((card, indx) => (
          <Card key={card.id} 
                activePlayer={ctx.turnIndex === playerNum}
                card={card}
                isHuman={ctx.players[playerNum].type === 'human'}
                isTrio={true}
                overlap={indx === 2 ? false : true} />
      ))}
    </div>
  );
}

function Card({ card, isSelectable, isSelected, isHuman, overlap, isTrio, activePlayer}) {

  const ctx = useContext(UserContext);

    //const cardClass = `game-card rank-${card.rank} }`;
    // reverse the front and back if it's a human
    if (isHuman) {
      return (
        <div className={'game-card'+ (isSelected ? ' selected' : '')  + (activePlayer ? ' active-player' : '') 
                    + (isTrio ? ' trio' : '') + (isHuman ? ' human' : ' bot') + (card.id > 35 ? ' hidden' : '') + (overlap ? ' overlap' : '')} 
                    id={'card-' + card.id} onClick={() => ctx.handleCardClick(card, isSelected)}>
        <div className='back'>
          <CardImage isHuman={isHuman} isTrio={isTrio} />
        </div>
        <div className='front'>
          <span className="rank" ><img src={images[card.rank]} /></span>
        </div>
      </div>
      )
    } else {
    return (
      <div className={'game-card'+ (isSelected ? ' selected' : '')  + (activePlayer ? ' active-player' : '')  
                    + (isTrio ? ' trio' : '') + (isHuman ? ' human' : ' bot') + (card.id > 35 ? ' hidden' : '') + (overlap ? ' overlap' : '')} 
                    id={'card-' + card.id} onClick={() => ctx.handleCardClick(card, isSelected)}>
        <div className='front'>
          <CardImage isHuman={isHuman} isTrio={isTrio} />
        </div>
        <div className='back'>
          <span className="rank" ><img src={images[card.rank]} /></span>
        </div>
      </div>
    )
  }
    /*
    if (isSelected) {
        return (
          <div className={'game-card selected' + (activePlayer ? ' active-player' : '') + (isHuman ? ' human' : ' bot') + (card.id > 35 ? ' hidden' : '')} 
                    id={'card-' + card.id} onClick={() => ctx.handleCardClick(card, isSelected)}>
            <span className="rank" >{card.rank}</span>
        </div>
        );
    } else {
        if (isSelectable) {
            return (
              <div className={'game-card selectable' + (activePlayer ? ' active-player' : '') + (isHuman ? ' human' : ' bot') + (card.id > 35 ? ' hidden' : '')} id={'card-' + card.id} onClick={() => ctx.handleCardClick(card, isSelected)}>
                <span>{card.rank}</span><span className="rank">{isHuman || isTrio ? card.rank.toString() : ''}
                  <CardImage isHuman={isHuman} isTrio={isTrio} />
                </span>
              </div>
            );
        } else {
            return (
              <div className={'game-card' + (activePlayer ? ' active-player' : '')+ (isHuman ? ' human' : ' bot') + (overlap ? ' overlap' : '') + (card.id > 35 ? ' hidden' : '')} 
              id={'card-' + card.id} onClick={() => ctx.handleCardClick(card, isSelected)}>
                <span className="rank">{isHuman || isTrio ? card.rank.toString() : ''}
                  <CardImage isHuman={isHuman} isTrio={isTrio} />
                </span>
              </div>
            );   
        }
    }
    */
}

function CardImage({ isHuman, isTrio }) {
    //if (isHuman || isTrio) {
    //    return '';
    //} else {
        return <img src={cardBack} />;
    //}   
    
<img src={logo} />

}