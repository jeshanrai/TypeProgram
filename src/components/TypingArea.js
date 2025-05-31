import React, { useState, useEffect, useRef } from 'react';
import './TypingArea.css';

const TypingArea = ({ snippet }) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(0); // in milliseconds
  const [timeLeft, setTimeLeft] = useState(null);
  const [showWPM, setShowWPM] = useState(false);
  const timerInterval = useRef(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleFirstKey = () => {
      if (!startTime) {
        const now = Date.now();
        setStartTime(now);
        if (timeLimit > 0) {
          setTimeLeft(timeLimit);
          timerInterval.current = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1000) {
                clearInterval(timerInterval.current);
                setEndTime(Date.now());
                textareaRef.current?.blur();
                return 0;
              }
              return prev - 1000;
            });
          }, 1000);
        }
      }
    };

    window.addEventListener('keydown', handleFirstKey);
    return () => window.removeEventListener('keydown', handleFirstKey);
  }, [startTime, timeLimit]);

  const handleInputChange = (e) => {
    if (timeLimit === 0 || timeLeft > 0) {
      const value = e.target.value;
      setUserInput(value);

      if (value === snippet) {
        setEndTime(Date.now());
        clearInterval(timerInterval.current);
      }
    }
  };

  const handleClick = () => {
    textareaRef.current?.focus();
  };

  const calculateWPM = () => {
    if (!startTime || !endTime) return 0;
    const words = userInput.trim().split(/\s+/).length;
    const minutes = (endTime - startTime) / 60000;
    return Math.round(words / minutes);
  };

  const renderSnippetWithCursor = () => {
    const pos = userInput.length;
    const chars = snippet.split('');
    return chars.map((char, i) => {
      const isCorrect = userInput[i] === char;
      const isTyped = i < userInput.length;

      return (
        <span
          key={i}
          className={`char-wrapper ${isTyped ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
        >
          {char}
          {i === pos && <span className="cursor" />}
        </span>
      );
    });
  };

  const handleTimerSelect = (ms) => {
    setTimeLimit(ms);
    setStartTime(null);
    setEndTime(null);
    setUserInput('');
    setTimeLeft(null);
    clearInterval(timerInterval.current);
    textareaRef.current?.focus();
    setShowWPM(false);
  };

  const handleRetry = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(null);
    setShowWPM(false);
    clearInterval(timerInterval.current);
    textareaRef.current?.focus();
  };

  return (
    <div className="typing-container" onClick={handleClick}>
       <div className="timer-selector">
        {[15000, 30000, 60000, 120000].map((ms) => (
          <span
            key={ms}
            className={`timer-number ${timeLimit === ms ? 'active' : ''}`}
            onClick={() => handleTimerSelect(ms)}
          >
            {ms / 1000}
          </span>
        ))}
      </div>

      <div className="snippet-box" aria-label="typing snippet">
        {renderSnippetWithCursor()}
      </div>

      <textarea
        ref={textareaRef}
        className="input-area"
        value={userInput}
        onChange={handleInputChange}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        aria-hidden="true"
      />

      <div className="button-row">
        <button onClick={() => console.log('Next')}>
          <img src="/images/next.png" alt="Next" />
        </button>
        <button onClick={handleRetry}>
          <img src="/images/reload.png" className="reload" alt="Retry" />
        </button>
      </div>

      {endTime && (
        <div className="results">
          <strong>Speed:</strong> {calculateWPM()} WPM
        </div>
      )}
    </div>
  );
};

export default TypingArea;
