import React, { useState, useEffect } from 'react';
import './CustomizePage.css';
import { FaMusic, FaPlay, FaSave } from 'react-icons/fa';

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
  const [textType, setTextType] = useState('Words');
  const [fontStyle, setFontStyle] = useState('Sans Serif');
  const [theme, setTheme] = useState('light');
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languageSamples, setLanguageSamples] = useState([]);

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
    setTimer(Number(e.target.value));
  };

  // Handle char limit change
  const handleCharLimitChange = (e) => {
    setCharLimit(Number(e.target.value));
    if (snippet.length > Number(e.target.value)) {
      setSnippet(snippet.slice(0, Number(e.target.value)));
    }
  };

  // Handle theme change
  const handleThemeChange = (themeName) => {
    setTheme(themeName);
    // Optionally, apply theme to body or context
  };

  // Handle start typing (navigate or pass config to typing page)
  const handleStartTyping = () => {
    const finalSnippet = useDefault ? selectedDefault : snippet;
    // You can use React Router's useNavigate to go to typing page with state
    // Or save config to context/global state
    alert(
      `Starting typing test with:\n\nText: ${finalSnippet}\nTimer: ${timer}s\nChar Limit: ${charLimit}\nDifficulty: ${difficulty}\nText Type: ${textType}\nFont: ${fontStyle}\nTheme: ${theme}\nMusic: ${musicEnabled ? 'On' : 'Off'}`
    );
  };

  // Get options for default samples
  let defaultOptions = [];
  if (defaultType === 'Sample Paragraph') defaultOptions = defaultSamples;
  else if (defaultType === 'Code Snippet') defaultOptions = codeSamples;
  else if (defaultType === 'Random Words') defaultOptions = randomWords;

  return (
    <div className={`customize-wrapper theme-${theme}`}>
      <div className="customize-container">
        <h2>Customize Your Typing Practice</h2>
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
                <select
                  className="default-dropdown"
                  value={defaultType}
                  onChange={handleDefaultTypeChange}
                >
                  <option>Sample Paragraph</option>
                  <option>Code Snippet</option>
                  <option>Random Words</option>
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
                          {sample.code.length > 40 ? sample.code.slice(0, 40) + '...' : sample.code}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={selectedDefault}
                      readOnly
                      rows="4"
                      style={{ marginTop: 8 }}
                    />
                  </>
                )}
                {defaultType !== 'Code Snippet' && (
                  <>
                    <select
                      className="default-dropdown"
                      value={selectedDefault}
                      onChange={handleDefaultSampleChange}
                    >
                      {defaultOptions.map((sample, idx) => (
                        <option key={idx} value={sample}>
                          {sample.length > 40 ? sample.slice(0, 40) + '...' : sample}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={selectedDefault}
                      readOnly
                      rows="4"
                      style={{ marginTop: 8 }}
                    />
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
              {['Words', 'Sentences', 'Paragraph'].map(type => (
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
    </div>
  );
};

export default CustomizePage;

