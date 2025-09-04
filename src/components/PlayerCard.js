import React, { useState, useEffect } from 'react';
import '../styles/PlayerCard.css';

const PlayerCard = ({ playerName, playerData }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageUrlIndex, setImageUrlIndex] = useState(0);

  // Reset image URL index when player name changes
  useEffect(() => {
    setImageUrlIndex(0);
  }, [playerName]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleImageError = () => {
    const imageUrls = getPlayerImageUrls(playerName);
    const nextIndex = imageUrlIndex + 1;
    
    if (nextIndex < imageUrls.length) {
      setImageUrlIndex(nextIndex);
    }
    // If we've exhausted all URLs, stay on the last one (placeholder)
  };

  const getCurrentImageUrl = () => {
    const imageUrls = getPlayerImageUrls(playerName);
    return imageUrls[imageUrlIndex] || imageUrls[imageUrls.length - 1];
  };

  // Simple player name formatting for URLs
  const formatNameForImage = (name) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\./g, '')
      .replace(/'/g, '')
      .replace(/jr/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
  };

  // Create multiple image URL sources for better coverage
  const getPlayerImageUrls = (name) => {
    const formattedName = formatNameForImage(name);
    
    return [
      // Try a more generic placeholder first
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=667eea&color=ffffff&bold=true`,
      
      // NFL.com images (if available)
      `https://static.www.nfl.com/image/private/t_headshot_desktop/f_auto/league/api/clubs/logos/${formattedName}`,
      
      // Generic placeholder with just initials
      `https://via.placeholder.com/200x200/667eea/ffffff?text=${encodeURIComponent(name.split(' ').map(n => n[0]).join('').toUpperCase())}`
    ];
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

  return (
    <div className={`player-card ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
      <div className="card-inner">
        {/* Front of the card */}
        <div className="card-front">
          <div className="player-image-container">
            <img 
              src={getCurrentImageUrl()}
              alt={playerName}
              className="player-image"
              onError={handleImageError}
            />
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
