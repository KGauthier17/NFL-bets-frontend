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
    // Remove 'player_' prefix
    let formatted = key.replace(/^player_/, '');
    
    // Handle specific prop type formatting
    const propMappings = {
      // Touchdown props
      'anytime_td_yes': 'Anytime TD',
      
      // Receiving props
      'reception_longest': 'Longest Reception',
      'reception_yds': 'Receiving Yards',
      'receptions': 'Receptions',
      'receiving_tds': 'Receiving TDs',
      
      // Passing props
      'pass_attempts': 'Pass Attempts',
      'pass_completions': 'Completions',
      'pass_tds': 'Passing TDs',
      'pass_yds': 'Passing Yards',
      
      // Rushing props
      'rush_attempts': 'Rush Attempts',
      'rush_longest': 'Longest Rush',
      'rush_yds': 'Rushing Yards',
      'rushing_tds': 'Rushing TDs',
      
      // Combined props
      'rush_reception_yds': 'Rush + Rec Yards'
    };

    // Extract the base prop name (without over/under and value)
    let baseProp = formatted.replace(/_over_[\d.]+$/, '').replace(/_under_[\d.]+$/, '');
    
    // Find matching mapping
    const displayName = propMappings[baseProp];
    if (displayName) {
      return displayName;
    }
    
    // Default formatting if no mapping found
    return baseProp
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Extract the line value from the prop key
  const extractLineValue = (key) => {
    const overMatch = key.match(/_over_([\d.]+)$/);
    const underMatch = key.match(/_under_([\d.]+)$/);
    return overMatch ? overMatch[1] : underMatch ? underMatch[1] : '';
  };

  // Check if prop is over or under
  const getPropDirection = (key) => {
    if (key.includes('_over_')) return 'over';
    if (key.includes('_under_')) return 'under';
    if (key.includes('_yes')) return 'yes';
    if (key.includes('_no')) return 'no';
    return '';
  };

  // Group props by type for better organization
  const groupProps = (data) => {
    const groups = {
      touchdowns: [],
      receiving: [],
      rushing: [],
      passing: [],
      combined: []
    };

    Object.entries(data).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      
      // Handle combined props first (before individual categories)
      if (lowerKey.includes('rush') && lowerKey.includes('reception')) {
        groups.combined.push({ key, value });
      } else if (lowerKey.includes('td')) {
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
              className={`player-avatar player-avatar-${avatar.initials.toLowerCase()}`}
              style={{
                backgroundColor: avatar.backgroundColor,
                color: avatar.textColor
              }}
            >
              {/* Background pattern for visual interest */}
              <div className="avatar-pattern-1" />
              <div className="avatar-pattern-2" />
              <span className="avatar-initials">
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

              // Map group names to display names
              const groupDisplayNames = {
                touchdowns: 'TOUCHDOWNS',
                receiving: 'RECEIVING',
                rushing: 'RUSHING', 
                passing: 'PASSING',
                combined: 'RUSH + RECEIVING'
              };

              return (
                <div key={groupName} className="prop-group">
                  <h4 className="prop-group-title">{groupDisplayNames[groupName] || groupName.toUpperCase()}</h4>
                  {props.map(({ key, value }) => {
                    const percentage = (value * 100).toFixed(1);
                    const lineValue = extractLineValue(key);
                    const propType = formatPropLine(key);
                    const direction = getPropDirection(key);
                    
                    return (
                      <div key={key} className="prop-line">
                        <span className="prop-text">
                          {propType}
                          {direction === 'over' && ` O${lineValue}`}
                          {direction === 'under' && ` U${lineValue}`}
                          {direction === 'yes' && ''}
                          {direction === 'no' && ''}
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
