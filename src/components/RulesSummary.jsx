import { Modal, Button } from 'react-bootstrap';

import './RulesSummary.css'; 

const RulesSummary = (params) => {

    const onClose = () => params.setShowRules(false);

    return (
        
      <Modal show={params.showRules} onHide={onClose} className="rules-summary-modal">
        <Modal.Header closeButton>
          <Modal.Title>Trio Quick Reference</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Goal</h4>
            <p>Be the first player to collect three trios (three of a kind) or the trio of 7s for an instant win.</p>
            <hr />

          <h4>Turn Basics</h4>
            <p>The first player is randomly selected and play proceeds clockwise. On your turn, you must choose a card by:</p>
            <ul>
                <li>Asking an opponent to see their lowest or highest card.</li>
                <li>Revealing your own lowest or highest card.</li>
                <li>Flipping a face-down card from the center.</li>
            </ul> 
            <p>These actions are accomplished by clicking the desired cards on your turn.</p>
            <p>After revealing a card:</p>
            <p>If the revealed card matches the previous one, you continue your turn to reveal another.</p>
            <p>If it doesn't match, return the cards and end your turn by clicking the cards you've selected.</p>
            <p>If you reveal a third matching card, the trio will be placed face-up in front of your hand. Your turn ends.</p>
            <hr />

          <h4>Key Rules</h4>
            <p>Play passes to the player to the right even if a trio is created.</p>
            <p>You can ask for the same type of card (high/low) multiple times in a row from an opponent.</p>
            <p>The first player to collect three trios or the trio of 7s wins the game.</p>
            
        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-primary" onClick={() => onClose()}>Close</button>
        </Modal.Footer>
    </Modal>
  );
};

export default RulesSummary;