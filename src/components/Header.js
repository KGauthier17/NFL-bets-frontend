import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="App-header">
      <div className="header-content">
        <h1>NFL Player Props</h1>
        <p>Real-time betting probabilities computed with Statistical Analysis</p>
        <p style={{ fontSize: '0.9em', opacity: 0.8, marginTop: '8px' }}>
          Updated daily at 12:00 PM Atlantic Time on game days
        </p>
      </div>
    </header>
  );
};

export default Header;
