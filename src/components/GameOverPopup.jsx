import { Modal, Button } from 'react-bootstrap';
import React, { useContext, useState } from 'react';
import { UserContext } from '../App';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './GameOverPopup.css'; 
import GameSettings, { getSettings, saveSettings } from './GameSettings';

const GameOverPopup = ({ gameOver, onClose, newGame, players, turnIndex}) => {
  
  const ctx = useContext(UserContext);
  const [rowKey, setRowKey] = useState(0);

  if (!gameOver) {
    return null; // Don't render anything if 'show' is false
  }

  function clearScoreHistory() {
    const currSettings = getSettings();
    currSettings.playerRecentWins = [0, 0, 0, 0];
    saveSettings(currSettings);
    setRowKey(prevRowKey => prevRowKey + 1);
  }

  const settings = getSettings();
 
  return (
      <Modal show={gameOver} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>The winner is { ctx.players.filter(p => p.winner)[0].name }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Recent Win Count</p>
              <table className="wins-table">
                <thead>
                <tr>
                  <th></th>
                  {settings.playerNames.map((n, index) => (
                    <th key={index}>{n}</th>
                  ))}
                </tr>
                </thead>
                <tbody>
                <tr key={rowKey}>
                  <td>win count</td>
                  {settings.playerRecentWins.map((n, index) => (
                    <td key={10 + index}>{n.toString()}</td>
                  ))}
                </tr>
                </tbody>
              </table>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn-sm btn-primary" onClick={() => clearScoreHistory()}>reset win count</button>
              <button className="btn btn-primary" onClick={() => onClose()}>Close</button>
              <button className="btn btn-primary" onClick={() => newGame(true)}>New Game</button>
            </Modal.Footer>
          </Modal>
  );
}

export default GameOverPopup;