//import React from 'react';
import './Table.css'
import React, { useContext } from 'react';
import { UserContext } from '../App';

const rowsBetweenCards = ['left', 'left-1', 'left-2', 'right', 'right-1', 'right-2'];
  
export default function Table() {

  const ctx = useContext(UserContext);

      return (

        <div className="game-table row justify-content-center align-items-center">
          <div className="card-container vertical col-1 seat left-side" >
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
            <div className="trios-container col-2 trios left align-content-center">
              {ctx.players[1].trios.map((triosSet, indx) => (
                <div key={"left-" + indx.toString()} className="trioSet" >
                  {triosSet.map((card, indx) => (
                      <Card key={card.id} 
                            activePlayer={ctx.turnIndex === 1}
                            card={card}
                            isHuman={ctx.players[1].type === 'human'}
                            isTrio={true}
                            overlap={indx === 2 ? false : true} />
                  ))}
                </div>
              ))}
            </div>  
            <div className=" reveal-trio-cards-section col-8 trios center align-items-center">
              <div className="row justify-content-center align-items-center trios-container trios top">
                {ctx.players[2].trios.map((triosSet, indx) => (
                <div key={"top-" + indx.toString()} className="trioSet" >
                  {triosSet.map((card, indx) => (
                      <Card key={card.id} 
                            activePlayer={ctx.turnIndex === 2}
                            card={card}
                            isHuman={ctx.players[2].type === 'human'}
                            isTrio={true}
                            overlap={true} />
                  ))}
                </div>
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
              <div className="row justify-content-center align-items-center trios-container trios bottom">
                {ctx.players[0].trios.map((triosSet, indx) => (
                <div key={"bottom-" + indx.toString()} className="trioSet" >
                  {triosSet.map((card, indx) => (
                      <Card key={card.id} 
                            activePlayer={ctx.turnIndex === 0}
                            card={card}
                            isHuman={ctx.players[0].type === 'human'}
                            isTrio={true}
                            overlap={true} />
                  ))}
                </div>
              ))}
              </div>
            </div>
            <div className="trios-container col-2 trios right align-content-center">
              {ctx.players[3].trios.map((triosSet, indx) => (
                <div key={"right-" + indx.toString()} className="trioSet" >
                  {triosSet.map((card, indx) => (
                      <Card key={card.id} 
                            activePlayer={ctx.turnIndex === 3}
                            card={card}
                            isHuman={ctx.players[3].type === 'human'}
                            isTrio={true}
                            overlap={indx === 2 ? false : true} />
                  ))}
                </div>
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
            </div>
          </div>
          <div className="card-container vertical col-1 seat right-side" >
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

function Card({ card, isSelectable, isSelected, isHuman, overlap, isTrio, activePlayer }) {

  const ctx = useContext(UserContext);

    //const cardClass = `game-card rank-${card.rank} }`;
    if (isSelected) {
        return (
          <div className={'game-card selected' + (activePlayer ? ' active-player' : '') + (isHuman ? ' human' : ' bot') + (card.id > 35 ? ' hidden' : '')} id={'card-' + card.id} onClick={() => ctx.handleCardClick(card, isSelected)}>
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
}


function CardImage({ isHuman, isTrio }) {
    if (isHuman || isTrio) {
        return '';
    } else {
        return <img src={isTrio ? '/trio-card-back.png' : '/trio-card-back.png'} />;
    }   
}