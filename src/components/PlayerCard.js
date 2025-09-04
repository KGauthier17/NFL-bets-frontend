import React, { useState } from 'react';
import '../styles/PlayerCard.css';

const PlayerCard = ({ playerName, playerData }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  // Create a visually appealing player avatar
  const getPlayerAvatar = (name) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = [
      { bg: '#1B2631', text: '#FFD700' }, // Navy & Gold
      { bg: '#2C3E50', text: '#E8F4FD' }, // Slate & Light Blue
      { bg: '#34495E', text: '#F1C40F' }, // Dark Gray & Yellow
      { bg: '#273746', text: '#E74C3C' }, // Dark Blue & Red
      { bg: '#1A252F', text: '#2ECC71' }, // Dark Navy & Green
      { bg: '#17202A', text: '#E67E22' }, // Almost Black & Orange
    ];
    
    // Use name length to pick consistent color for each player
    const colorIndex = name.length % colors.length;
    const selectedColor = colors[colorIndex];
    
    return {
      initials,
      backgroundColor: selectedColor.bg,
      textColor: selectedColor.text
    };
  };

  // Format prop line text for display
  const formatPropLine = (key) => {
    let formatted = key.replace(/_/g, ' ');
    formatted = formatted.replace('player ', '');
    
    // Handle specific prop type formatting
    const propMappings = {
      // Touchdown props
      'anytime td yes': 'Anytime TD',
      'anytime td no': 'No TD',
      'first td': 'First TD',
      'last td': 'Last TD',
      
      // Receiving props
      'reception longest': 'Longest Reception',
      'reception yds': 'Receiving Yards',
      'receiving yards': 'Receiving Yards',
      'receptions': 'Receptions',
      'receiving tds': 'Receiving TDs',
      'targets': 'Targets',
      
      // Passing props
      'pass attempts': 'Pass Attempts',
      'pass completions': 'Completions',
      'completion percentage': 'Completion %',
      'pass interceptions': 'Interceptions',
      'pass tds': 'Passing TDs',
      'pass yds': 'Passing Yards',
      'passing yards': 'Passing Yards',
      'passing tds': 'Passing TDs',
      'sacks taken': 'Sacks',
      'qb rating': 'QB Rating',
      
      // Rushing props
      'rush attempts': 'Rush Attempts',
      'rush longest': 'Longest Rush',
      'rush yds': 'Rushing Yards',
      'rushing yards': 'Rushing Yards',
      'rushing tds': 'Rushing TDs',
      'carries': 'Carries',
      
      // Combined props
      'rush reception yds': 'Rush + Rec Yards'
    };

    // Find matching mapping
    for (const [key_pattern, display] of Object.entries(propMappings)) {
      if (formatted.includes(key_pattern)) {
        return display;
      }
    }
    
    // Default formatting if no mapping found
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Extract the line value from the prop key
  const extractLineValue = (key) => {
    const match = key.match(/(\d+\.?\d*)/);
    return match ? match[1] : '';
  };

  // Group props by type for better organization
  const groupProps = (data) => {
    const groups = {
      touchdowns: [],
      receiving: [],
      rushing: [],
      passing: []
    };

    Object.entries(data).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      
      if (lowerKey.includes('td')) {
        groups.touchdowns.push({ key, value });
      } else if (lowerKey.includes('reception')) {
        groups.receiving.push({ key, value });
      } else if (lowerKey.includes('rush')) {
        groups.rushing.push({ key, value });
      } else if (lowerKey.includes('pass')) {
        groups.passing.push({ key, value });
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return groups;
  };

  const propGroups = groupProps(playerData);
  const avatar = getPlayerAvatar(playerName);

  return (
    <div className={`player-card ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
      <div className="card-inner">
        {/* Front of the card */}
        <div className="card-front">
          <div className="player-image-container">
            <div 
              className="player-avatar"
              style={{
                backgroundColor: avatar.backgroundColor,
                color: avatar.textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                fontSize: '3rem',
                fontWeight: 'bold',
                border: '4px solid #FFD700',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background pattern for visual interest */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-20%',
                  width: '60%',
                  height: '60%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  zIndex: 1
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-30%',
                  left: '-30%',
                  width: '80%',
                  height: '80%',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '50%',
                  zIndex: 1
                }}
              />
              <span style={{ position: 'relative', zIndex: 2 }}>
                {avatar.initials}
              </span>
            </div>
          </div>
          <div className="player-name">
            {playerName.toUpperCase()}
          </div>
          <div className="card-footer">
            NFL PLAYER PROPS
          </div>
        </div>

        {/* Back of the card */}
        <div className="card-back">
          <div className="player-name-back">
            {playerName.toUpperCase()}
          </div>
          <div className="props-container">
            {Object.keys(propGroups).map(groupName => {
              const props = propGroups[groupName];
              if (props.length === 0) return null;

              return (
                <div key={groupName} className="prop-group">
                  <h4 className="prop-group-title">{groupName.toUpperCase()}</h4>
                  {props.map(({ key, value }) => {
                    const percentage = (value * 100).toFixed(1);
                    const lineValue = extractLineValue(key);
                    const propType = formatPropLine(key);
                    
                    return (
                      <div key={key} className="prop-line">
                        <span className="prop-text">
                          {propType}
                          {key.includes('over') && ` O${lineValue}`}
                          {key.includes('under') && ` U${lineValue}`}
                          {key.includes('yes') && ''}
                          {key.includes('no') && ''}
                        </span>
                        <span className="prop-probability">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
