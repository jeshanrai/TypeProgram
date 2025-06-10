import React, { useState, useEffect, useRef } from 'react';
import './TypingArea.css';

const TypingArea = ({
  snippet,
  inputStarted,
  setInputStarted,
  timeLeft,
  setTimeLeft
}) => {

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null); // in milliseconds

  const [showWPM, setShowWPM] = useState(false);
  const timerInterval = useRef(null);

  const [timeLimit, setTimeLimit] = useState(30000); // Default 30 seconds
  const [userInput, setUserInput] = useState('');
  const textareaRef = useRef(null);
  const timerRef = useRef(null);

  const handleTimerSelect = (ms) => {
    setTimeLimit(ms);
    if (inputStarted) {
      setTimeLeft(ms); // reset timer if already typing
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (!inputStarted) {
      setInputStarted(true);
      setTimeLeft(timeLimit);
    }
  };

  useEffect(() => {
    if (inputStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1000), 1000);
    } else if (timeLeft === 0) {
      clearTimeout(timerRef.current);
      setInputStarted(false); // reset inputStarted to fade LanguageBar back in
      setEndTime(Date.now());
      textareaRef.current?.blur();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, inputStarted, setTimeLeft, setInputStarted]);

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
                setInputStarted(false);
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
  }, [startTime, timeLimit, setInputStarted]);

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

  const handleRetry = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(null);
    setShowWPM(false);
    clearInterval(timerInterval.current);
    setInputStarted(false);
    textareaRef.current?.focus();
  };

  return (
    <>
    <div className="timer-wrapper">
  <div className={`timer-selector ${inputStarted && timeLeft > 0 ? 'fade-out' : ''}`}>
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

  {inputStarted && timeLeft !== null && (
    <div className="timer-display">Time: {timeLeft / 1000}s</div>
  )}
</div>

    <div className="typing-container" onClick={handleClick}>
    
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
    </>
  );
};

export default TypingArea;
