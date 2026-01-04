import { Modal, Button } from 'react-bootstrap';
import React, { useContext } from 'react';
import { UserContext } from '../App';

import './GameOverPopup.css'; 

const GameOverPopup = ({ gameOver, onClose, newGame, players, turnIndex}) => {
  
  const ctx = useContext(UserContext);
  
  if (!gameOver) {
    return null; // Don't render anything if 'show' is false
  }

  return (
      <Modal show={gameOver} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>We Have a Winner</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h3>The winner is { ctx.players.filter(p => p.winner)[0].name }.</h3>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-primary" onClick={() => onClose()}>Close</button>
              <button className="btn btn-primary" onClick={() => newGame(true)}>New Game</button>
            </Modal.Footer>
          </Modal>
  );
};

export default GameOverPopup;