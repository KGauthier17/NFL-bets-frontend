import React, { useState, useEffect } from 'react';
import BetCard from './BetCard';
import '../styles/BetGrid.css';

// Dummy data for example
const dummyData = {
  rushingYards: [
    { player: 'Player 1', image: 'player1.jpg', bet365: '1.90', betway: '1.95', line: '75.5', confidence: '85%' },
    { player: 'Player 2', image: 'player2.jpg', bet365: '2.10', betway: '2.05', line: '90.5', confidence: '78%' },
  ],
  receivingYards: [
    { player: 'Player 3', image: 'player3.jpg', bet365: '2.00', betway: '2.10', line: '62.5', confidence: '80%' },
    { player: 'Player 4', image: 'player4.jpg', bet365: '1.85', betway: '1.90', line: '20.5', confidence: '75%' },
  ],
  receptions: [
    { player: 'Player 5', image: 'player1.jpg', bet365: '1.90', betway: '1.95', line: '5.5', confidence: '85%' },
    { player: 'Player 6', image: 'player2.jpg', bet365: '2.10', betway: '2.05', line: '2.5', confidence: '78%' },
  ],
  touchdowns: [
    { player: 'Player 7', image: 'player3.jpg', bet365: '2.00', betway: '2.10', line: '1.5', confidence: '80%' },
    { player: 'Player 8', image: 'player4.jpg', bet365: '1.85', betway: '1.90', line: '0.5', confidence: '75%' },
  ],
  passingYards: [
    { player: 'Player 9', image: 'player1.jpg', bet365: '1.90', betway: '1.95', line: '175.5', confidence: '85%' },
    { player: 'Player 10', image: 'player2.jpg', bet365: '2.10', betway: '2.05', line: '190.5', confidence: '78%' },
  ],
  completedPasses: [
    { player: 'Player 11', image: 'player3.jpg', bet365: '2.00', betway: '2.10', line: '17.5', confidence: '80%' },
    { player: 'Player 12', image: 'player4.jpg', bet365: '1.85', betway: '1.90', line: '20.5', confidence: '75%' },
  ],
  // Add more dummy data as needed
};

const BetGrid = () => {
  const [selectedProp, setSelectedProp] = useState('rushingYards');
  const [bets, setBets] = useState([]);

  useEffect(() => {
    // Fetch bets data from backend API based on selectedProp
    // Replace with your API call
    setBets(dummyData[selectedProp]);
  }, [selectedProp]);

  const handlePropChange = (event) => {
    setSelectedProp(event.target.value);
  };

  return (
    <div>
      <div className="prop-selector">
        <label htmlFor="prop-select">Select Player Prop: </label>
        <select id="prop-select" value={selectedProp} onChange={handlePropChange}>
          <option value="rushingYards">Rushing Yards</option>
          <option value="receivingYards">Receiving Yards</option>
          <option value="receptions">Receptions</option>
          <option value="touchdowns">Touchdowns</option>
          <option value="passingYards">Passing Yards</option>
          <option value="completedPasses">Completed Passes</option>
        </select>
      </div>
      <div className="bet-grid">
        {bets.map((bet, index) => (
          <BetCard key={index} bet={bet} />
        ))}
      </div>
    </div>
  );
};

export default BetGrid;