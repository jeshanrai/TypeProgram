import React, { useState, useEffect, useRef } from 'react';
import './TypingArea.css'; 

const TypingArea = ({ snippet }) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);


  const handleInputChange = (e) => {
    const value = e.target.value;

    // Start timer on first keypress
    if (!startTime) setStartTime(Date.now());

    setUserInput(value);
  };

  const renderSnippet = () => {
    return snippet.split('').map((char, i) => {
      let color;
      if (i < userInput.length) {
        color = userInput[i] === char ? 'correct' : 'incorrect';
      }
      return (
        <span key={i} className={color}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="typing-container">
      <div className="snippet-box">{renderSnippet()}</div>
      
    </div>
  );
};

export default TypingArea;
