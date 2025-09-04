import React, { useState, useEffect, useCallback } from 'react';
import PlayerCard from './PlayerCard';
import '../styles/BetGrid.css';

const BetGrid = () => {
  const [playerData, setPlayerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const fetchWithTimeout = (url, options = {}, timeout = 30000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  };

  const wakeUpBackend = useCallback(async () => {
    try {
      console.log('Waking up backend...');
      const healthResponse = await fetchWithTimeout(`${BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }, 60000); // 60 second timeout for health check
      
      if (!healthResponse.ok) {
        console.warn('Health check failed, but continuing with main request');
      } else {
        console.log('Backend is awake');
      }
    } catch (error) {
      console.warn('Health check failed:', error.message, '- continuing with main request');
    }
  }, [BASE_URL]); // Added BASE_URL to dependency array

  const fetchPlayerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, try to wake up the backend
      await wakeUpBackend();
      
      console.log('Fetching player predictions...');
      const response = await fetchWithTimeout(`${BASE_URL}/predict`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }, 45000); // 45 second timeout for predict endpoint
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      // Extract the Probabilities object from the response
      if (data && data.Probabilities) {
        setPlayerData(data.Probabilities);
      } else {
        throw new Error('Invalid data format: Probabilities not found in response');
      }
    } catch (err) {
      console.error('Error fetching player data:', err);
      
      // Provide more specific error messages
      let errorMessage = err.message;
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. This could be due to CORS policy or network issues.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timed out. The backend may be starting up, please try again in a moment.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [wakeUpBackend, BASE_URL]); // Added BASE_URL to dependency array

  useEffect(() => {
    fetchPlayerData();
  }, [fetchPlayerData]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading NFL player props...</p>
        <small>This may take up to 60 seconds if the backend is starting up</small>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Data</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Normalize player names for display (proper capitalization, suffixes, etc.)
  const normalizePlayerNameForDisplay = (name) => {
    return name
      .split(' ')
      .map(part => {
        // Handle suffixes like Jr., Sr., III, etc.
        if (['jr', 'sr', 'ii', 'iii', 'iv', 'v'].includes(part.toLowerCase().replace('.', ''))) {
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }
        // Capitalize first letter of each word
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join(' ')
      .trim();
  };

  // Sort players alphabetically by name
  const sortedPlayers = Object.entries(playerData).sort(([nameA], [nameB]) => 
    nameA.localeCompare(nameB)
  );

  const uniquePlayerCount = sortedPlayers.length;

  return (
    <div className="bet-grid-container">
      <div className="grid-header">
        <p>{uniquePlayerCount} unique players with active prop bets</p>
      </div>
      
      <div className="bet-grid">
        {sortedPlayers.map(([playerName, props]) => (
          <PlayerCard 
            key={playerName}
            playerName={normalizePlayerNameForDisplay(playerName)}
            playerData={props}
          />
        ))}
      </div>
      
      <div className="grid-footer">
        <p>Click on any player card to see their prop betting probabilities</p>
        <div className="legal-disclaimer">
          <p><strong>⚠️ DISCLAIMER:</strong> Statistical analysis for entertainment only. Gamble responsibly. Must be 21+ and in legal jurisdiction. Not liable for losses. These predictions are not guaranteed outcomes.</p>
        </div>
      </div>
    </div>
  );
};

export default BetGrid;