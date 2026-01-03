import { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Dropdown, Form } from 'react-bootstrap';
import "./GameSettings.css";

//import React from 'react';
//import Dropdown from 'react-bootstrap/Dropdown';
   
export default function GameSettings(params) {
 
  const handleRevealOptionChange = (event) => {
     params.setRevealCardsIsChecked(event.target.checked);
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
      playerCount:    parseInt(playerOption.split('-')[1]),
      playerName1:    playerName1,
      playerName2:    playerName2,
      playerName3:    playerName3,
      playerName4:    playerName4,
      playerForgetfullness1: playerForgetfullness1,
      playerForgetfullness2: playerForgetfullness2,
      playerForgetfullness3: playerForgetfullness3,
      playerForgetfullness4: playerForgetfullness4,
      cardDisplayTime: cardDisplayTime,
      interactiveUserIndexes: [0],
      newUser:        false,
    }
    localStorage.setItem('settings', JSON.stringify(newSettings));
    setSaved(true);
  }

      const storedSettings = getSettings();

      const [playerOption, setPlayerOption] = useState('option-' + storedSettings.playerCount);
      const [playerName1, setPlayerName1] = useState(storedSettings.playerName1);
      const [playerName2, setPlayerName2] = useState(storedSettings.playerName2);
      const [playerName3, setPlayerName3] = useState(storedSettings.playerName3);
      const [playerName4, setPlayerName4] = useState(storedSettings.playerName4);
      const [playerForgetfullness1, setPlayerForgetfullness1] = useState(storedSettings.playerForgetfullness1);
      const [playerForgetfullness2, setPlayerForgetfullness2] = useState(storedSettings.playerForgetfullness2);
      const [playerForgetfullness3, setPlayerForgetfullness3] = useState(storedSettings.playerForgetfullness3);
      const [playerForgetfullness4, setPlayerForgetfullness4] = useState(storedSettings.playerForgetfullness4);
      const [cardDisplayTime, setCardDisplayTime] = useState(storedSettings.cardDislayTime);
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
            <Dropdown.Item onClick={handleShow}>Settings</Dropdown.Item>
            <Dropdown.Divider className='menu-divider'></Dropdown.Divider>
            <Dropdown.Item onClick={() => params.handleNewRound(false)}>
                New Round</Dropdown.Item>
            <Dropdown.Item onClick={() => params.handleNewRound(true)}>
                New Game</Dropdown.Item>
            <Dropdown.Divider className='menu-divider'></Dropdown.Divider>
            <Dropdown.Item onClick={() => params.setShowRules(true)}>
                Rules Summary</Dropdown.Item> 
          </Dropdown.Menu>
        </Dropdown>
        </div>

          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Game Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="number-of-players section">
                <p className="settings label">Number of Players</p>
                <input type="radio" className="btn-check" name="options-players" id="players-4" autoComplete="off" value="option-4" checked={playerOption === 'option-4'} 
                      onChange={(e) => {setPlayerOption(e.target.value); setSaved(false); } } />
                <label className="btn" htmlFor="players-4">4</label>
              </div>
            <div className="player-names section">
              <p className="settings label">Player Names & Forgetfullness</p>
              
              <div className="input-group mb-3">
                  <span className="input-group-text" id="player-name-1">Player 1</span>
                  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-1" 
                          onChange={(e) => {setPlayerName1(e.target.value); setSaved(false); } } value={playerName1} />
                  <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-1" 
                          onChange={(e) => {setPlayerForgetfullness1(e.target.value); setSaved(false); } } value={playerForgetfullness1} />
              </div>

              <div className="input-group mb-3">
                  <span className="input-group-text" id="player-name-2">Player 2</span>
                  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-2" 
                        onChange={(e) => {setPlayerName2(e.target.value); setSaved(false); } } value={playerName2} />
                  <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-2" 
                          onChange={(e) => {setPlayerForgetfullness2(e.target.value); setSaved(false); } } value={playerForgetfullness2} />
              </div>

              <div className="input-group mb-3">
                  <span className="input-group-text" id="player-name-3">Player 3</span>
                  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-2" 
                        onChange={(e) => {setPlayerName3(e.target.value); setSaved(false); } } value={playerName3} />
                  <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-3" 
                          onChange={(e) => {setPlayerForgetfullness3(e.target.value); setSaved(false); } } value={playerForgetfullness3} />
              </div>

              <div className="input-group mb-3">
                  <span className="input-group-text" id="player-name-4">Player 4</span>
                  <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-4" 
                        onChange={(e) => {setPlayerName4(e.target.value); setSaved(false); } } value={playerName4} />
                  <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="player-name-4" 
                          onChange={(e) => {setPlayerForgetfullness4(e.target.value); setSaved(false); } } value={playerForgetfullness4} />
              </div>
            </div>

            <div className="bot-card-display-time section">
              <p className="settings label">Bot Card Display Time (seconds)</p>
              <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="bot-card-display-time" 
                    onChange={(e) => {setCardDisplayTime(parseInt(e.target.value)); setSaved(false); } } 
                    value={cardDisplayTime} />
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
              Dec 1, 2025
            </div>
            <CrashLogViewer showErrors={showErrors} ></CrashLogViewer>
            </Offcanvas.Body>
          </Offcanvas>
          </>
      );
    }

    export function getSettings() {

        // get settings from local storage - use default if object if not there

        const defaultSettings = {
            playerCount:    4,
            playerName1:    "you",
            playerName2:    "bot 1",
            playerName3:    "bot 2",
            playerName4:    "bot 3",
            playerForgetfullness1: 0,
            playerForgetfullness2: 0,
            playerForgetfullness3: 0,
            playerForgetfullness4: 0, 
            newUser:        true,
            interactiveUserIndexes: [0],
            cardDislayTime: 2,
            crashLogs: []
        }

        const storedSettings = localStorage.getItem('settings');
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
