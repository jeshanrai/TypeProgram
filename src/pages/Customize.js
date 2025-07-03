import React, { useState, useEffect, useRef } from 'react';
import './CustomizePage.css';
import { FaMusic, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const defaultSamples = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect.",
  "Stay focused and keep typing.",
];

const codeSamples = [
  "function helloWorld() { console.log('Hello, world!'); }",
  "for (let i = 0; i < 10; i++) { console.log(i); }",
  "const sum = (a, b) => a + b;",
];

const randomWords = [
  "apple banana orange grape lemon cherry peach plum pear kiwi",
  "table chair desk lamp sofa bed shelf drawer cabinet rug",
  "quickly silently bravely happily sadly loudly gently softly",
];

const CustomizePage = () => {
  const [useDefault, setUseDefault] = useState(true);
  const [defaultType, setDefaultType] = useState('Sample Paragraph');
  const [selectedDefault, setSelectedDefault] = useState(defaultSamples[0]);
  const [snippet, setSnippet] = useState('');
  const [charLimit, setCharLimit] = useState(200);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [difficulty, setDifficulty] = useState('Easy');
  const [textType, setTextType] = useState('Number');
  const [fontStyle, setFontStyle] = useState('Sans Serif');
  const [theme, setTheme] = useState('light');
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languageSamples, setLanguageSamples] = useState([]);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [showTypingArea, setShowTypingArea] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showWPM, setShowWPM] = useState(false);
  const [snippetFade, setSnippetFade] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timer);
  const [isRunning, setIsRunning] = useState(false);
  const [inputStarted, setInputStarted] = useState(false);
  const [exitAnim, setExitAnim] = useState(false);

  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const timerInterval = useRef(null);

  useEffect(() => {
    // Fetch languages from your backend API
    fetch('http://localhost:3001/api/languages')
      .then(res => res.json())
      .then(data => {
        setLanguages(data);
        setSelectedLanguage(data[0]?.key || '');
      });
  }, []);

  useEffect(() => {
    if (defaultType === 'Code Snippet' && selectedLanguage) {
      fetch(`http://localhost:3001/api/snippets?language=${selectedLanguage}`)
        .then(res => res.json())
        .then(data => setLanguageSamples(data));
    }
  }, [defaultType, selectedLanguage]);

  useEffect(() => {
    if (useDefault && defaultType !== 'Code Snippet') {
      const langKey = getLanguageKey(difficulty, textType); // e.g., "easyNumber"
      console.log('Requesting snippet for language:', langKey);
      fetch('http://localhost:3001/api/snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: langKey, excludeIds: [] }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          // Trim to charLimit
          const trimmed = (data.code || '').slice(0, charLimit);
          setSelectedDefault(trimmed);
          console.log('Fetched snippet for', langKey, ':', trimmed);
        })
        .catch(err => {
          setSelectedDefault('');
          console.error('Snippet fetch error:', err);
        });
    }
  }, [difficulty, textType, useDefault, defaultType, charLimit]);

  // Handle switching between Default and Custom
  const handleSourceToggle = (isDefault) => {
    setUseDefault(isDefault);
    if (isDefault) {
      setSnippet('');
    }
  };

  // Handle default type change
  const handleDefaultTypeChange = (e) => {
    const type = e.target.value;
    setDefaultType(type);
    let sample = '';
    if (type === 'Sample Paragraph') sample = defaultSamples[0];
    else if (type === 'Code Snippet') sample = codeSamples[0];
    else if (type === 'Random Words') sample = randomWords[0];
    setSelectedDefault(sample);
  };

  // Handle default sample selection
  const handleDefaultSampleChange = (e) => {
    setSelectedDefault(e.target.value);
  };

  // Handle custom snippet input
  const handleSnippetChange = (e) => {
    const value = e.target.value.slice(0, charLimit);
    setSnippet(value);
  };

  // Handle timer change
  const handleTimerChange = (e) => {
    const value = Number(e.target.value);
    if (value > 300) {
      setTimer(300);
    } else {
      setTimer(value);
    }
  };

  // Handle char limit change
  const handleCharLimitChange = (e) => {
    const value = Number(e.target.value);
    if (value > 300) {
      setCharLimit(300);
      if (snippet.length > 300) setSnippet(snippet.slice(0, 300));
    } else {
      setError('');
      setCharLimit(value);
      if (snippet.length > value) setSnippet(snippet.slice(0, value));
    }
  };

  // Handle theme change
  const handleThemeChange = (themeName) => {
    setTheme(themeName);
  };

  // Handle start typing (navigate or pass config to typing page)
  const handleStartTyping = () => {
    if (timer > 300) {
      setError('Timer cannot be more than 5 minutes (300 seconds).');
      return;
    }
    if (charLimit > 300) {
      setError('Character limit cannot be more than 300.');
      return;
    }
    setError('');
    const finalSnippet = useDefault ? selectedDefault : snippet;
    setPopupData({
      finalSnippet,
      timer,
      charLimit,
      difficulty,
      textType,
      fontStyle,
      theme,
      musicEnabled,
    });
    setShowPopup(true);
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

  const targetSnippet = useDefault ? selectedDefault : snippet;
  const chars = targetSnippet.split('');
  const inputChars = userInput.split('');
  const maxLen = Math.max(chars.length, inputChars.length);

  return (
    <span className={`snippet-text${snippetFade ? ' fade' : ''}`}>
      {Array.from({ length: maxLen }).map((_, i) => {
        const expected = chars[i];
        const typed = inputChars[i];
        let className = 'char-wrapper';

        if (typed === undefined) {
          // Not typed yet
          if (i === inputChars.length) className += ' active';
        } else if (expected === undefined) {
          // Extra character
          className += ' extra incorrect';
        } else if (typed === expected) {
          className += ' correct';
        } else {
          className += ' incorrect';
        }

        if (expected === ' ') className += ' space-char';

        return (
          <span key={i} className={className}>
            {expected !== undefined ? (expected === ' ' ? '\u00A0' : expected) : typed}
            {i === inputChars.length && !showWPM && <span className="cursor" />}
          </span>
        );
      })}
    </span>
  );
};

// Improved result calculation (character-based, like monkeytype)
const calculateResults = () => {
  if (!startTime || !endTime) return null;
  const elapsedMinutes = (endTime - startTime) / 60000;
  const target = (useDefault ? selectedDefault : snippet) || '';
  const input = userInput || '';

  let correct = 0, incorrect = 0, extra = 0;
  for (let i = 0; i < input.length; i++) {
    if (i < target.length) {
      if (input[i] === target[i]) correct++;
      else incorrect++;
    } else {
      extra++;
    }
  }
  // Count missed (untyped) as incorrect if you want strict accuracy
  // let missed = Math.max(0, target.length - input.length);

  // Monkeytype accuracy: correct / (correct + incorrect + extra)
  const totalTyped = correct + incorrect + extra;
  const accuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 0;

  // WPM: (correct chars / 5) / minutes
  const wpm = elapsedMinutes > 0 ? Math.round((correct / 5) / elapsedMinutes) : 0;

  return { wpm, accuracy, correct, incorrect, extra };
};

  const handleRetry = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setShowWPM(false);
    setTimeLeft(timer);
    setInputStarted(false);
    setIsRunning(false);
    textareaRef.current?.focus();
  };

  const resetAndNext = (langKey = language) => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setShowWPM(false);
    setTimeLeft(timer);
    setInputStarted(false);
    setIsRunning(false);

    // Always fetch a new snippet from the backend for all default types
    handleNext(langKey);

    textareaRef.current?.focus();
  };

  const handleNext = (langKey) => {
    if (useDefault && defaultType === 'Code Snippet' && selectedLanguage) {
      // For code snippets, fetch a new one for the selected language
      fetch(`http://localhost:3001/api/snippets?language=${selectedLanguage}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            setSelectedDefault(data[0].code || '');
          }
          setUserInput('');
          setShowWPM(false);
          setSnippetFade(false);
          setStartTime(null);
          setEndTime(null);
          setTimeLeft(timer);
          setInputStarted(false);
          textareaRef.current?.focus();
        })
        .catch(err => {
          setSelectedDefault('');
          setError('Snippet fetch error: ' + err.message);
        });
    } else if (useDefault && (defaultType === 'Sample Paragraph' || defaultType === 'Random Words')) {
      // For sample paragraph or random words, fetch a new snippet for the language key
      fetch('http://localhost:3001/api/snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: langKey, excludeIds: [] }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          // Trim to charLimit
          const trimmed = (data.code || '').slice(0, charLimit);
          setSelectedDefault(trimmed);
          setUserInput('');
          setShowWPM(false);
          setSnippetFade(false);
          setStartTime(null);
          setEndTime(null);
          setTimeLeft(timer);
          setInputStarted(false);
          textareaRef.current?.focus();
        })
        .catch(err => {
          setSelectedDefault('');
          setError('Snippet fetch error: ' + err.message);
        });
    } else if (!useDefault) {
      // For custom text, just reset
      setUserInput('');
      setShowWPM(false);
      setSnippetFade(false);
      setStartTime(null);
      setEndTime(null);
      setTimeLeft(timer);
      setInputStarted(false);
      textareaRef.current?.focus();
    }
  };

  // Get options for default samples
  let defaultOptions = [];
  if (defaultType === 'Sample Paragraph') defaultOptions = defaultSamples;
  else if (defaultType === 'Code Snippet') defaultOptions = codeSamples;
  else if (defaultType === 'Random Words') defaultOptions = randomWords;

  // Helper to build language key like "easyNumber"
  function getLanguageKey(difficulty, textType) {
    const type = textType.charAt(0).toUpperCase() + textType.slice(1).toLowerCase();
    return `${difficulty.toLowerCase()}${type}`;
  }

 

// 2. language variable (use selectedLanguage or fallback)
const language = getLanguageKey(difficulty, textType);




  // 4. handleInputChange function
const handleInputChange = (e) => {
  const value = e.target.value;
  setUserInput(value);

  // Play sound if enabled
  if (musicEnabled) {
    const audio = new Audio('/sounds/type-sound.mp3');
    audio.volume = 0.2;
    audio.play();
  }

  if (!inputStarted) {
    setInputStarted(true);
    setStartTime(Date.now());
    setIsRunning(true);
  }

  const target = useDefault ? selectedDefault : snippet;
  if (value.length >= target.length) {
    setEndTime(Date.now());
    setShowWPM(true);
    setIsRunning(false);
  }
};

  const handleExit = () => {
    setExitAnim(true);
    setTimeout(() => {
      setShowTypingArea(false);
      setExitAnim(false);
    }, 400); // Match the CSS transition duration
  };

  useEffect(() => {
    if (showTypingArea && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showTypingArea]);

  // 1. Always sync timeLeft with timer when timer changes or when starting a new test
useEffect(() => {
  setTimeLeft(timer);
}, [timer, showTypingArea]);

// 2. Timer countdown effect
useEffect(() => {
  if (!showTypingArea || !isRunning || showWPM) return;

  if (timeLeft <= 0) {
    setEndTime(Date.now());
    setShowWPM(true);
    setIsRunning(false);
    return;
  }

  const interval = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        setEndTime(Date.now());
        setShowWPM(true);
        setIsRunning(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [showTypingArea, isRunning, showWPM, timeLeft]);

// Add this useEffect to reset typing state when leaving the page or exiting typing area
useEffect(() => {
  // Reset typing state when typing area is closed or on unmount
  if (!showTypingArea) {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setShowWPM(false);
    setTimeLeft(timer);
    setInputStarted(false);
    setIsRunning(false);
  }
  // Also reset on unmount (navigate away)
  return () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setShowWPM(false);
    setTimeLeft(timer);
    setInputStarted(false);
    setIsRunning(false);
  };
}, [showTypingArea, timer]);

  return (
    <div className={`customize-wrapper theme-${theme}`}>
      {showTypingArea ? (
        <div className={`typing-area-container${exitAnim ? ' exit-anim' : ''}`}>
          <div className="typing-header">
            <div className="typing-info">
              <span>
                <strong>Time Left:</strong> {timeLeft}s
              </span>
              <span>
                <strong>Characters:</strong> {userInput.length}/{(useDefault ? selectedDefault : snippet).length}
              </span>
            </div>
            <button className="exit-btn" onClick={handleExit}>
              Exit
            </button>
          </div>

          <div
            className="snippet-box"
            aria-label="typing snippet"
            onClick={() => textareaRef.current && textareaRef.current.focus()}
            style={{
              fontFamily:
                fontStyle === 'Sans Serif'
                  ? 'sans-serif'
                  : fontStyle === 'Serif'
                  ? 'serif'
                  : fontStyle === 'Monospace'
                  ? 'monospace'
                  : fontStyle,
            }}
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
            aria-label="Typing input"
            disabled={showWPM}
            style={{
              fontFamily:
                fontStyle === 'Sans Serif'
                  ? 'sans-serif'
                  : fontStyle === 'Serif'
                  ? 'serif'
                  : fontStyle === 'Monospace'
                  ? 'monospace'
                  : fontStyle,
            }}
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
      ) : (
        <div className="customize-container">
          {error && (
            <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>
          )}
          {/* Popup Modal */}
          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <h2>Typing Test Preview</h2>
                <div className="popup-content">
                  <div><strong>Langugage:</strong> {selectedLanguage || 'Text'}</div>
                  <div><strong>Timer:</strong> {popupData.timer} seconds</div>
                  <div><strong>Character Limit:</strong> {popupData.charLimit}</div>
                  <div><strong>Difficulty:</strong> {popupData.difficulty}</div>
                  <div><strong>Text Type:</strong> {popupData.textType}</div>
                  <div><strong>Font:</strong> {popupData.fontStyle}</div>
                  <div><strong>Theme:</strong> {popupData.theme}</div>
                  <div><strong>Sound:</strong> {popupData.musicEnabled ? 'On' : 'Off'}</div>
                  <div>
                    <strong>Snippet Preview:</strong>
                    <div
                      style={{
                        fontFamily: popupData.fontStyle === 'Sans Serif' ? 'sans-serif'
                          : popupData.fontStyle === 'Serif' ? 'serif'
                          : popupData.fontStyle === 'Monospace' ? 'monospace'
                          : popupData.fontStyle,
                        margin: '8px 0',
                        padding: '8px',
                        background: '#f8f8f8',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        maxHeight: '120px',
                        overflowY: 'auto'
                      }}
                    >
                      {popupData.finalSnippet}
                    </div>
                  </div>
                </div>
                <div className="popup-actions">
                   <button
                    onClick={() => {
                      setShowPopup(false);
                      setShowTypingArea(true); // Show the new container
                      // Optionally, you can still navigate or pass state if needed
                      // navigate('/typingArea', { state: { ...popupData } });
                    }}
                  >
                    Start
                  </button>
                  <button onClick={() => setShowPopup(false)}>Close</button>
                 
                </div>
              </div>
            </div>
          )}
          <div className="button-row">
            <button className="start-button" onClick={handleStartTyping}>
              <FaPlay style={{ marginRight: 8 }} /> Start Typing
            </button>
          </div>

          <div className="customize-grid">
            {/* Default or Custom Text Option */}
            <div className="customize-section full-width">
              <label>Text Source</label>
              <div className="toggle-row">
                <button
                  className={useDefault ? 'active' : ''}
                  onClick={() => handleSourceToggle(true)}
                >
                  Default
                </button>
                <button
                  className={!useDefault ? 'active' : ''}
                  onClick={() => handleSourceToggle(false)}
                >
                  Custom
                </button>
              </div>
              {useDefault ? (
                <>
                 <select className="default-dropdown"
                  value={defaultType}
                  onChange={handleDefaultTypeChange}
                >
                
                  <option value="">Text</option>
                  <option value="">javascript</option>
                  <option value="">C++</option>
                  <option value="">Java</option>
                  <option value="">Python</option>
                  <option value="">TypeScript</option>
                  <option value="">CSS</option>
                  <option value="">HTML</option>
                  <option value="">C#</option>
                  <option value="">C</option>
                  <option value="">PHP</option>
                  <option value="">Ruby</option>
                  <option value="">Kotlin</option>
                  <option value="">Swift</option>
                   <option value="">SQL</option>
                </select>

                {defaultType === 'Code Snippet' && (
                  <>
                    <select
                      className="default-dropdown"
                      value={selectedLanguage}
                      onChange={e => setSelectedLanguage(e.target.value)}
                    >
                      {languages.map(lang => (
                        <option key={lang.key} value={lang.key}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="default-dropdown"
                      value={selectedDefault}
                      onChange={handleDefaultSampleChange}
                    >
                      {languageSamples.map((sample, idx) => (
                        <option key={idx} value={sample.code}>
                          {`Sample ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                    {/* Removed preview textarea */}
                  </>
                )}
                {defaultType !== 'Code Snippet' && (
                  <>
                    {/* Removed second default dropdown */}
                  </>
                )}
              </>
            ) : (
              <textarea
                placeholder="Write your own text..."
                rows="4"
                value={snippet}
                onChange={handleSnippetChange}
                maxLength={charLimit}
              />
            )}
          </div>

          {/* Timer */}
          <div className="customize-section">
            <label htmlFor="timer">Set Timer (seconds)</label>
            <input
              type="number"
              id="timer"
              placeholder="60"
              min="10"
              value={timer}
              onChange={handleTimerChange}
            />
          </div>

          {/* Character Limit */}
          <div className="customize-section">
            <label htmlFor="char-count">Character Limit</label>
            <input
              type="number"
              id="char-count"
              placeholder="200"
              min="10"
              value={charLimit}
              onChange={handleCharLimitChange}
            />
          </div>

          {/* Difficulty */}
          <div className="customize-section">
            <label>Difficulty Level</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
              
            </select>
          </div>

          {/* Text Type */}
          <div className="customize-section">
            <label>Text Type</label>
            <div className="option-buttons">
              {['Number', 'Capital', 'Symbol','Mix'].map(type => (
                <button
                  key={type}
                  className={textType === type ? 'active' : ''}
                  onClick={() => setTextType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Font Style */}
          <div className="customize-section">
            <label>Font Style</label>
            <select value={fontStyle} onChange={e => setFontStyle(e.target.value)}>
              <option>Sans Serif</option>
              <option>Serif</option>
              <option>Monospace</option>
              <option>Comic Sans MS</option>
              <option>Courier New</option>
              <option>Georgia</option>
              <option>Trebuchet MS</option>
              <option>Verdana</option>
              <option>Arial</option>
              <option>Lucida Console</option>
              <option>Impact</option>
            </select>
          </div>

          {/* Theme */}
          <div className="customize-section">
            <label>Theme</label>
            <div className="theme-options">
              <span
                className={`theme-swatch light${theme === 'light' ? ' selected' : ''}`}
                title="Light Mode"
                onClick={() => handleThemeChange('light')}
              ></span>
              <span
                className={`theme-swatch dark${theme === 'dark' ? ' selected' : ''}`}
                title="Dark Mode"
                onClick={() => handleThemeChange('dark')}
              ></span>
              <span
                className={`theme-swatch ocean${theme === 'ocean' ? ' selected' : ''}`}
                title="Ocean"
                onClick={() => handleThemeChange('ocean')}
              ></span>
            </div>
          </div>

          {/* Sound & Feedback */}
          <div className="customize-section">
            <label>Enable Sounds</label>
            <button
              className={`music-toggle${musicEnabled ? ' on' : ''}`}
              onClick={() => setMusicEnabled(m => !m)}
            >
              {musicEnabled ? <FaMusic /> : <FaMusic style={{ opacity: 0.3 }} />} {musicEnabled ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      
</div>
      )}
    </div>
  );
};


export default CustomizePage;

