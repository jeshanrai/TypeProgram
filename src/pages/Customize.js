import React from 'react';
import './CustomizePage.css';

const CustomizePage = () => {
  return (
    <div className="customize-container">
      <h2>Customize Your Typing Practice</h2>
      
      <div className="customize-grid">
        <div className="customize-section">
          <label htmlFor="snippet">Custom Text</label>
          <textarea id="snippet" placeholder="Enter your own text..." rows="4" />
        </div>

        <div className="customize-section">
          <label htmlFor="timer">Set Timer (seconds)</label>
          <input type="number" id="timer" placeholder="60" min="10" />
        </div>

        <div className="customize-section">
          <label htmlFor="char-count">Character Limit</label>
          <input type="number" id="char-count" placeholder="200" min="10" />
        </div>

        <div className="customize-section">
          <label>Difficulty Level</label>
          <select>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div className="customize-section">
          <label>Text Type</label>
          <div className="option-buttons">
            <button>Words</button>
            <button>Sentences</button>
            <button>Paragraph</button>
          </div>
        </div>

        <div className="customize-section">
          <label>Theme</label>
          <div className="theme-options">
            <span className="theme-swatch light" title="Light Mode"></span>
            <span className="theme-swatch dark" title="Dark Mode"></span>
            <span className="theme-swatch ocean" title="Ocean"></span>
          </div>
        </div>
      </div>

      <button className="start-button">Start Typing</button>
    </div>
  );
};

export default CustomizePage;
