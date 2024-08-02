import React from 'react';
import '../styles/BetCard.css';

const BetCard = ({ bet }) => {
  return (
    <div className="bet-card">
      <img src={bet.image} alt={bet.player} className="player-image" />
      <h2>{bet.player}</h2>
      <p>Bet365: {bet.bet365}</p>
      <p>Betway: {bet.betway}</p>
      <p>Line: {bet.line}</p>
      <p>Confidence: {bet.confidence}</p>
    </div>
  );
};

export default BetCard;
