import React, { useState } from 'react';
import './CustomizePage.css';
import { FaMusic, FaPlay, FaSave } from 'react-icons/fa';

const defaultSamples = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect.",
  "Stay focused and keep typing.",
];

const CustomizePage = () => {
  const [useDefault, setUseDefault] = useState(true);
  const [selectedDefault, setSelectedDefault] = useState(defaultSamples[0]);
  const [snippet, setSnippet] = useState('');
  const [charLimit, setCharLimit] = useState(200);
  const [musicEnabled, setMusicEnabled] = useState(false);

  const handleSnippetChange = (e) => {
    const value = e.target.value.slice(0, charLimit);
    setSnippet(value);
  };

  return (
    <div className="customize-wrapper">
  <div className="customize-container">
    <h2>Customize Your Typing Practice</h2>  <div className="button-row">
      <button className="start-button">Start Typing</button>
    </div>

    <div className="customize-grid">
      {/* Default or Custom Text Option */}
      <div className="customize-section full-width">
        <label>Text Source</label>
        <div className="toggle-row">
          <button className="active">Default</button>
          <button>Custom</button>
        </div>
        <select className="default-dropdown">
          <option>Sample Paragraph</option>
          <option>Code Snippet</option>
          <option>Random Words</option>
        </select>
        <textarea placeholder="Or write your own..." rows="4" />
      </div>

      {/* Timer */}
      <div className="customize-section">
        <label htmlFor="timer">Set Timer (seconds)</label>
        <input type="number" id="timer" placeholder="60" min="10" />
      </div>

      {/* Character Limit */}
      <div className="customize-section">
        <label htmlFor="char-count">Character Limit</label>
        <input type="number" id="char-count" placeholder="200" min="10" />
      </div>

      {/* Difficulty */}
      <div className="customize-section">
        <label>Difficulty Level</label>
        <select>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      {/* Text Type */}
      <div className="customize-section">
        <label>Text Type</label>
        <div className="option-buttons">
          <button>Words</button>
          <button>Sentences</button>
          <button>Paragraph</button>
        </div>
      </div>

      {/* Font Style */}
      <div className="customize-section">
        <label>Font Style</label>
        <select>
          <option>Sans Serif</option>
          <option>Serif</option>
          <option>Monospace</option>
        </select>
      </div>

      {/* Theme */}
      <div className="customize-section">
        <label>Theme</label>
        <div className="theme-options">
          <span className="theme-swatch light" title="Light Mode"></span>
          <span className="theme-swatch dark" title="Dark Mode"></span>
          <span className="theme-swatch ocean" title="Ocean"></span>
        </div>
      </div>

      {/* Sound & Feedback */}
      <div className="customize-section">
        <label>Enable Sounds</label>
        <button className="music-toggle">On</button>
      </div>
    </div>

    
  </div>
</div>

  );
};

export default CustomizePage;
