import React, { useState } from 'react';
import './LearnPage.css';

const Learn = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const lessons = {
    English: ['Hello', 'Good Morning', 'Thank you'],
    Nepali: ['नमस्ते', 'शुभ प्रभात', 'धन्यवाद'],
    Japanese: ['こんにちは', 'おはよう', 'ありがとう'],
  };

  return (
    <div className="learn-container">
      <h1>Language Typing Practice</h1>

      <div className="language-selector">
        <label>Select Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Nepali">Nepali</option>
          <option value="Japanese">Japanese</option>
        </select>
      </div>

      <div className="lesson-box">
        <h2>{selectedLanguage} Lessons</h2>
        <ul>
          {lessons[selectedLanguage].map((item, index) => (
            <li key={index} className="lesson-item">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="practice-box">
        <h3>Start Typing:</h3>
        <textarea
          placeholder={`Type here in ${selectedLanguage}...`}
          rows="4"
        ></textarea>
        <button className="start-button">Check</button>
      </div>
    </div>
  );
};

export default Learn;
