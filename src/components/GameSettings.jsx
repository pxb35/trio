import { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Dropdown, Form } from 'react-bootstrap';
import "./GameSettings.css";

//import React from 'react';
//import Dropdown from 'react-bootstrap/Dropdown';
   
export default function GameSettings(params) {
 
  const handleShowHandsChange = (event) => {
     setShowHands(event.target.checked);
     handleSave();
  };

  const [show, setShow] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  
  const handleToggleShowErrors = () => {
    setShowErrors(!showErrors);
  }
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = () => {
    const newSettings = {
      playerCount:            parseInt(playerOption.split('-')[1]),
      playerNames:            playerNames,
      playerForgetfullnesses: playerForgetfullnesses,
      playerRecentWins,       playerRecentWins,
      cardDisplayTime:        cardDisplayTime,
      interactiveUserIndexes: [0],
      newUser:                false,
      showHands:              showHands
    }
    localStorage.setItem('trioSettings', JSON.stringify(newSettings));
    setSaved(true);
  }

      const storedSettings = getSettings();

      const [playerOption, setPlayerOption] = useState('option-' + storedSettings.playerCount);
      const [playerNames, setPlayerNames] = useState(storedSettings.playerNames);
      const [playerForgetfullnesses, setPlayerForgetfullnesses] = useState(storedSettings.playerForgetfullnesses);
      const [playerRecentWins, setPlayerRecentWins] = useState(storedSettings.playerRecentWins);
      const [cardDisplayTime, setCardDisplayTime] = useState(storedSettings.cardDisplayTime);
      const [showHands, setShowHands] = useState(storedSettings.showHands);
      const [saved, setSaved] = useState(true);

      let showRulesSummary = false;
      const setShowRulesSummary = (value) => {
        if (value === undefined) {
          showRulesSummary = !showRulesSummary;
        } else {
          showRulesSummary = value;
        } 
      }

      return (
        <>
        <div className='dropdown-container' >
        <Dropdown className="main-dropdown">
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Settings&nbsp;
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleShow}>
              Settings</Dropdown.Item>
            <Dropdown.Item onClick={() => params.newGame()}>
              New Game</Dropdown.Item>
            <Dropdown.Item onClick={() => params.setShowRules(true)}>
              Rules Summary</Dropdown.Item> 
          </Dropdown.Menu>
        </Dropdown>
        </div>

          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>gameOv Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="number-of-players section">
                <p className="settings label">Number of Players</p>
                <input type="radio" className="btn-check" name="options-players" id="players-4" autoComplete="off" value="option-4" checked={playerOption === 'option-4'} 
                      onChange={(e) => {setPlayerOption(e.target.value); setSaved(false); } } />
                <label className="btn" htmlFor="players-4">4</label>
              </div>

            <div className="player-names section">
              <p className="settings label">Player Names & Forgetfullness (0-none,  100-complete)</p>
              
              <div className="input-group mb-3">
                  <span className="input-group-text" id="player-name-1">Player 1</span>
                  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-1" 
                          onChange={(e) => {setPlayerNames((prev) => [...prev.slice(0, 0), e.target.value, ...prev.slice(1)]); setSaved(false); } } value={playerNames[0]} />
                  <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-1" 
                          onChange={(e) => {setPlayerForgetfullnesses((prev) => [...prev.slice(0, 0), e.target.value, ...prev.slice(1)]); setSaved(false); } } value={playerForgetfullnesses[0]} />
              </div>

              <div className="input-group mb-3">
                  <span className="input-group-text" id="player-name-2">Player 2</span>
                  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-2" 
                        onChange={(e) => {setPlayerNames((prev) => [...prev.slice(0, 1), e.target.value, ...prev.slice(2)]); setSaved(false); } } value={playerNames[1]} />
                  <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-2" 
                          onChange={(e) => {setPlayerForgetfullnesses((prev) => [...prev.slice(0, 1), e.target.value, ...prev.slice(2)]); setSaved(false); } } value={playerForgetfullnesses[1]} />
              </div>

              <div className="input-group mb-3">
                  <span className="input-group-text" id="player-name-3">Player 3</span>
                  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-2" 
                        onChange={(e) => {setPlayerNames((prev) => [...prev.slice(0, 2), e.target.value, ...prev.slice(3)]); setSaved(false); } } value={playerNames[2]} />
                  <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-3" 
                          onChange={(e) => {setPlayerForgetfullnesses((prev) => [...prev.slice(0, 2), e.target.value, ...prev.slice(3)]); setSaved(false); } } value={playerForgetfullnesses[2]} />
              </div>

              <div className="input-group mb-3">
                  <span className="input-group-text" id="player-name-4">Player 4</span>
                  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-4" 
                        onChange={(e) => {setPlayerNames((prev) => [...prev.slice(0, 3), e.target.value, ...prev.slice(4)]); setSaved(false); } } value={playerNames[3]} />
                  <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-4" 
                          onChange={(e) => {setPlayerForgetfullnesses((prev) => [...prev.slice(0, 3), e.target.value, ...prev.slice(4)]); setSaved(false); } } value={playerForgetfullnesses[3]} />
              </div>
            </div>

            <div className="bot-card-display-time section">
              <p className="settings label">Bot Card Display Time (seconds)</p>
              <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="bot-card-display-time" 
                    onChange={(e) => {setCardDisplayTime(parseInt(e.target.value)); setSaved(false); } } 
                    value={cardDisplayTime} />
            </div>  

            
            <div className="reveal-card-check">
              <p className="settings label">Cards</p>
              <input className="form-check-input" 
                    type="checkbox"   
                    id="reveal-cards"
                    checked={showHands}
                    onChange={(e) => {handleShowHandsChange(e); setSaved(false); } }
               />
              <label className="form-check-label" htmlFor="reveal-cards" >
                Reveal cards at the end of the round
              </label>
            </div>


            <div className="row justify-contents-left settings-buttons">
              <button className={"btn btn-primary col-3" + (saved ? " disabled " : " ")}
                          onClick={() => handleSave()}>
                      {"save" + (saved ? "d" : "")}
              </button>
              <button className="btn btn-primary col-3"
                          onClick={() => handleClose()}>
                      close
              </button>
            </div>        
            <hr className="thin-break"></hr>
            <div className='version-date' onClick={() => handleToggleShowErrors() }>
              January 13, 2026
            </div>
            <CrashLogViewer showErrors={showErrors} ></CrashLogViewer>
            </Offcanvas.Body>
          </Offcanvas>
          </>
      );
    }

    export function saveSettings(settings) {
      localStorage.setItem('trioSettings', JSON.stringify(settings));
    }

    export function getSettings() {

        // get settings from local storage - use default if object if not there

        const defaultSettings = {
            playerCount:    4,
            playerNames:    ["you", "bot 1", "bot 2", "bot 3"],
            playerForgetfullnesses: [0, 0, 0, 0],
            playerRecentWins: [0, 0, 0, 0],
            newUser:        true,
            interactiveUserIndexes: [0],
            cardDisplayTime: 2,
            showHands: false,
            crashLogs: []
        }

        const storedSettings = localStorage.getItem('trioSettings');
        return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    }

    function CrashLogViewer(params) {
      const logs = JSON.parse(localStorage.getItem('swoopCrashLogs') || '[]');
      return (
        <div className={'error-log' + (params && params.showErrors ? ' error-log-visible' : '')} >
          <h3>Crash Logs</h3>
          <pre>{JSON.stringify(logs, null, 2)}</pre>
        </div>
      );
    }
