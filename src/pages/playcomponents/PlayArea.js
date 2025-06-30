import React, { useState } from "react";
import "./playarea.css";
import { motion, AnimatePresence } from "framer-motion";

const PlayArea= () => {
  const [activeTab, setActiveTab] = useState("text");
  const [fontStyle, setFontStyle] = useState("Sans Serif"); // Add this line

  return (
    <div className="snippet-container">
      <div className="snippet-content">
        <div className="snippet-tab-buttons">
          <button
            className={`snippet-tab ${activeTab === "text" ? "active" : ""}`}
            onClick={() => setActiveTab("text")}
          >
            Text
          </button>
          <button
            className={`snippet-tab ${activeTab === "language" ? "active" : ""}`}
            onClick={() => setActiveTab("language")}
          >
            Language
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "text" && (
            <motion.div
              key="text"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="snippet-section"
            >
              <div className="default-customize">
                <div className="default-text">
                  <label>Default Text</label>
                </div>
                <div className="customize-button">
                  <label>Customize</label>
                </div>
              </div>
       

              <div className="snippet-row">
                <div className="snippet-col">
                  <label>Character Limit</label>
                  <input className="snippet-input" defaultValue="200" />
                </div>
                <div className="snippet-col">
                  <label>Difficulty Level</label>
                  <select className="snippet-dropdown">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
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

              <div className="snippet-col">
                <label>Text Type</label>
                <div className="snippet-type-buttons">
                  <button className="snippet-type-btn active">Number</button>
                  <button className="snippet-type-btn">Capital</button>
                  <button className="snippet-type-btn">Symbol</button>
                  <button className="snippet-type-btn">Mix</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "language" && (
            <motion.div
              key="language"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="snippet-section"
            >
              <div className="snippet-language-buttons">
                <button className="snippet-lang-btn">JavaScript</button>
                <button className="snippet-lang-btn">C++</button>
                <button className="snippet-lang-btn">Java</button>
                <button className="snippet-lang-btn">Python</button>
                <button className="snippet-lang-btn">TypeScript</button>
                <button className="snippet-lang-btn">CSS</button>
                <button className="snippet-lang-btn">HTML</button>
                <button className="snippet-lang-btn">Text</button>
                <button className="snippet-lang-btn">C#</button>
                <button className="snippet-lang-btn">C</button>
                <button className="snippet-lang-btn">PHP</button>
                <button className="snippet-lang-btn">Ruby</button>
                <button className="snippet-lang-btn">Rust</button>
                <button className="snippet-lang-btn">Kotlin</button>
                <button className="snippet-lang-btn">Swift</button>
                <button className="snippet-lang-btn">SQL</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
     <button className="next-button">
  <img src="/images/next.png" alt="Next" className="button-icon" />
  <span className="button-text">Next</span>
</button>
 

        <div className="snippet-preview-box">Snippet preview</div>
      </div>
    </div>
  );
};

export default PlayArea;
