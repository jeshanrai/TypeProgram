import React, { useState, useEffect } from "react";
import "./playarea.css";
import { motion, AnimatePresence } from "framer-motion";

// Fetch snippet from backend
const fetchSnippet = async (language) => {
  try {
    const res = await fetch("http://localhost:3001/api/snippet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, excludeIds: [] }),
    });
    const data = await res.json();
    return data.code || "No snippets found";
  } catch (err) {
    console.error("Fetch snippet error:", err);
    return "Failed to load snippet";
  }
};

const LANGUAGES = [
  "JavaScript",
  "C++",
  "Java",
  "Python",
  "TypeScript",
  "CSS",
  "HTML",
  "Text",
  "C#",
  "C",
  "PHP",
  "Ruby",
  "Rust",
  "Kotlin",
  "Swift",
  "SQL",
];

// Helper to build language key like "easyNumber"
const getLanguageKey = (difficulty, textType) => {
  const type = textType.charAt(0).toUpperCase() + textType.slice(1).toLowerCase();
  return `${difficulty.toLowerCase()}${type}`; // e.g., easyNumber
};

// Map language names to backend keys
const languageMap = {
  JavaScript: "javascript",
  "C++": "cpp",
  Java: "java",
  Python: "python",
  TypeScript: "typescript",
  CSS: "css",
  HTML: "html",
  Text: "text",
  "C#": "csharp",
  C: "c",
  PHP: "php",
  Ruby: "ruby",
  Rust: "rust",
  Kotlin: "kotlin",
  Swift: "swift",
  SQL: "sql",
};

const PlayArea = () => {
  const [activeTab, setActiveTab] = useState("text"); // "text" or "language"
  const [fontStyle, setFontStyle] = useState("Sans Serif");
  const [selectedLanguage, setSelectedLanguage] = useState("Text");
  const [snippetIndex, setSnippetIndex] = useState(0);

  const [snippet, setSnippet] = useState(""); // Full snippet
  const [snippetPreview, setSnippetPreview] = useState(""); // Sliced snippet

  const [customizeSelected, setCustomizeSelected] = useState(false); // initially Default Text
const [difficulty, setDifficulty] = useState("Easy");
const [textType, setTextType] = useState("Number");
const [charLimit, setCharLimit] = useState(200);

// Track first render to avoid auto-switch on mount
const [mounted, setMounted] = useState(false);

useEffect(() => {
  if (mounted && !customizeSelected) {
    setCustomizeSelected(true); // switch to Customize only after first change
  } else {
    setMounted(true); // after first render, mark as mounted
  }
}, [difficulty, textType, charLimit]);


  // Fetch snippet whenever relevant dependencies change
  useEffect(() => {
    let langKey = "text";

    if (activeTab === "language") {
      langKey = languageMap[selectedLanguage] || "text";
    } else if (customizeSelected) {
      langKey = getLanguageKey(difficulty, textType);
    }

    fetchSnippet(langKey).then((data) => {
      setSnippet(data);
      setSnippetPreview(data.slice(0, charLimit));
    });
  }, [snippetIndex, selectedLanguage, customizeSelected, difficulty, textType, activeTab, charLimit]);

  // Slice snippet whenever charLimit changes
  useEffect(() => {
    if (snippet) {
      setSnippetPreview(snippet.slice(0, charLimit));
    }
  }, [charLimit, snippet]);

  // --- Handlers ---
  const handleNext = () => setSnippetIndex((prev) => prev + 1);

  const handleLanguageClick = (lang) => {
    setSelectedLanguage(lang);
    setSnippetIndex(0); // Reset snippet index to fetch new snippet
  };

  return (
    <div className="snippet-container">
      <div className="snippet-content">
        {/* Tabs */}
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

        {/* AnimatePresence for smooth tab transitions */}
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
              {/* Default / Customize Toggle */}
              <div className="toggle-container">
                <div
                  className={`toggle-option ${!customizeSelected ? "active" : ""}`}
                  onClick={() => setCustomizeSelected(false)}
                >
                  Default Text
                </div>
                <div
                  className={`toggle-option ${customizeSelected ? "active" : ""}`}
                  onClick={() => setCustomizeSelected(true)}
                >
                  Customize
                </div>
              </div>

              {/* Character Limit & Difficulty */}
              <div className="snippet-row">
                <div className="snippet-col">
                  <label>Character Limit</label>
                  <input
                    className="snippet-input"
                    type="number"
                    min={10}
                    max={300}
                    value={charLimit}
                    onChange={(e) => setCharLimit(Number(e.target.value))}
                  />
                </div>
                <div className="snippet-col">
                  <label>Difficulty Level</label>
                  <select
                    className="snippet-dropdown"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              {/* Text Type */}
              <div className="snippet-col">
                <label>Text Type</label>
                <div className="snippet-type-buttons">
                  {["Number", "Capital", "Symbol", "Mix"].map((type) => (
                    <button
                      key={type}
                      className={`snippet-type-btn ${textType === type ? "active" : ""}`}
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
                <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
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
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    className={`snippet-lang-btn ${selectedLanguage === lang ? "active" : ""}`}
                    onClick={() => handleLanguageClick(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        <button className="next-button" onClick={handleNext}>
          <img src="/images/next.png" alt="Next" className="button-icon" />
          <span className="button-text">Next</span>
        </button>

        {/* Snippet preview */}
        <div className="snippet-preview-box" style={{ fontFamily: fontStyle }}>
          {snippetPreview || "Loading..."}
        </div>
      </div>
    </div>
  );
};

export default PlayArea;
