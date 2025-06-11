import React, { useState, useEffect, useRef } from 'react';
import './TypingArea.css';
import LanguageBar from './Languagebar'; // Make sure this import exists

const TypingArea = ({
  snippet,
  inputStarted,
  setInputStarted,
  timeLeft,
  setTimeLeft,
  handleNext,
  language, // <-- add this prop
  setLanguage // <-- add this prop
}) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showWPM, setShowWPM] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30000);
  const [userInput, setUserInput] = useState('');
  const [snippetFade, setSnippetFade] = useState(false);

  const textareaRef = useRef(null);
  const timerInterval = useRef(null);
  const timerRef = useRef(null);

  const handleTimerSelect = (ms) => {
    setTimeLimit(ms);
    if (inputStarted) {
      setTimeLeft(ms);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (!inputStarted) {
      setInputStarted(true);
      setTimeLeft(timeLimit);
    }

   if (value === snippet) {
  if (!endTime) {
    const now = Date.now();
    setEndTime(now);
    setShowWPM(true);
    clearInterval(timerInterval.current);
    clearTimeout(timerRef.current);
    setTimeLeft(0); // stop showing countdown
    setInputStarted(false);
    textareaRef.current?.blur();
  }
}

  };

  useEffect(() => {
    if (inputStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1000), 1000);
    } else if (timeLeft === 0 && inputStarted) {
      clearTimeout(timerRef.current);
      clearInterval(timerInterval.current);
      setEndTime(Date.now());
      setInputStarted(false);
      textareaRef.current?.blur();
      setShowWPM(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, inputStarted]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    // Focus textarea on any key press (except when already focused or on modifier keys)
    const handleGlobalKeyDown = (e) => {
      // Ignore if already focused or if modifier keys are pressed
      if (
        document.activeElement === textareaRef.current ||
        e.ctrlKey || e.altKey || e.metaKey
      ) return;
      textareaRef.current?.focus();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    const handleFirstKey = () => {
      if (!startTime) {
        const now = Date.now();
        setStartTime(now);
        if (timeLimit > 0) {
          setTimeLeft(timeLimit);
          timerInterval.current = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1000) {
                clearInterval(timerInterval.current);
                setEndTime(Date.now());
                setShowWPM(true);
                setInputStarted(false);
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

  useEffect(() => {
    setSnippetFade(true); // Start fade-out
    const timeout = setTimeout(() => setSnippetFade(false), 300); // Fade-in after 300ms
    return () => clearTimeout(timeout);
  }, [snippet]);

  const handleClick = () => {
    textareaRef.current?.focus();
  };

  const calculateResults = () => {
  if (!startTime || !endTime) return null;

  // Count correct characters up to the first mistake
  let correctChars = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === snippet[i]) {
      correctChars++;
    } else {
      break; // stop at first mistake
    }
  }

  const durationInMinutes = (endTime - startTime) / 60000;
  const wpm = durationInMinutes > 0
    ? Math.round((correctChars / 5) / durationInMinutes)
    : 0;
  const accuracy = userInput.length
    ? Math.round((correctChars / userInput.length) * 100)
    : 0;

  return { wpm, accuracy };
};

const renderSnippetWithCursor = () => {
  if (showWPM) {
    const results = calculateResults();
    if (!results) return null;
    return (
      <div className="results-box enhanced-results">
        <div className="result-title">Test Results</div>
        <div className="result-row">
          <span className="result-label">WPM: </span>
          <span className="result-value wpm">{results.wpm}</span>
        </div>
        <div className="result-row">
          <span className="result-label">Accuracy: </span>
          <span className="result-value accuracy">{results.accuracy}%</span>
        </div>
      
      </div>
    );
  }

  const pos = userInput.length;
  const chars = snippet.split('');

  return (
    <span className={`snippet-text${snippetFade ? ' fade' : ''}`}>
      {chars.map((char, i) => {
        const userChar = userInput[i];
        const isCorrect = userChar === char;
        const isTyped = i < userInput.length;
        const isSpace = char === ' ';

        return (
          <span
            key={i}
            className={`char-wrapper ${isTyped ? (isCorrect ? 'correct' : 'incorrect') : ''} ${isSpace ? 'space-char' : ''}`}
          >
            {/* Only render \u00A0 for display, but compare with ' ' */}
            {isSpace ? '\u00A0' : char}
            {i === pos && <span className="cursor" />}
          </span>
        );
      })}
    </span>
  );
};

  const handleRetry = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setShowWPM(false);
    setTimeLeft(null);
    setInputStarted(false);
    clearInterval(timerInterval.current);
    textareaRef.current?.focus();
  };

  const resetAndNext = (langKey = language) => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setShowWPM(false);
    setTimeLeft(null);
    setInputStarted(false);
    clearInterval(timerInterval.current);
    textareaRef.current?.focus();
    handleNext(langKey); // always call with the language key
  };

  return (
    <>
      {/* LanguageBar at the top */}
      <LanguageBar
        setLanguage={setLanguage}
        onNextSnippet={resetAndNext}  className={inputStarted && timeLeft > 0 ? 'fade-out' : ''}
      />

      <div className="timer-wrapper">
        <div className={`timer-selector ${inputStarted && timeLeft > 0 ? 'fade-out' : ''}`}>
          {[15000, 30000, 60000, 120000].map((ms) => (
            <span
              key={ms}
              className={`timer-number ${timeLimit === ms ? 'active' : ''} ${showWPM ? 'disabled' : ''}`}
              onClick={() => !showWPM && handleTimerSelect(ms)}
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
        <div
  className={`snippet-box`}
  aria-label="typing snippet"
>
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
          <button onClick={() => resetAndNext(language)}>
            <img src="/images/next.png" alt="Next" />
          </button>
          <button onClick={handleRetry}>
            <img src="/images/reload.png" className="reload" alt="Retry" />
          </button>
        </div>
      </div>
    </>
  );
};

export default TypingArea;
