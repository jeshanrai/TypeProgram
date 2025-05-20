import React, { useState, useEffect, useRef } from 'react';
import './TypingArea.css';

const TypingArea = ({ snippet }) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const textareaRef = useRef(null);

  // Auto-focus the textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // ⬇️ Start timer on ANY keyboard key press
  useEffect(() => {
    const handleFirstKey = () => {
      if (!startTime) {
        setStartTime(Date.now());
      }
    };

    window.addEventListener('keydown', handleFirstKey);
    return () => {
      window.removeEventListener('keydown', handleFirstKey);
    };
  }, [startTime]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleClick = () => {
    textareaRef.current?.focus();
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

  return (
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
          <img src="/images/next.png" alt="Next"  />
        </button>
        <button
          onClick={() => {
            setUserInput('');
            setStartTime(null);
            textareaRef.current?.focus();
          }}
        >
          <img src="/images/reload.png" class="reload" alt="Retry"  />
        </button>
      </div>
    </div>
  );
};

export default TypingArea;
