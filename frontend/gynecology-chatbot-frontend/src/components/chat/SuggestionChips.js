// src/components/chat/SuggestionChips.js

import React from 'react';

const SuggestionChips = ({ suggestions, onSuggestionClick }) => {
  return (
    <div className="suggestion-chips mb-2">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="suggestion-chip"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
};

export default SuggestionChips;