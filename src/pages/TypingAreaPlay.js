import React, { useState, useEffect, useRef } from "react";

const TypingAreaPlay = ({ finalSnippet, timer, fontStyle, theme, onExit }) => {
  const textareaRef = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(timer);
  const [isRunning, setIsRunning] = useState(false);
  const [showWPM, setShowWPM] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [bestWPM, setBestWPM] = useState(
    localStorage.getItem("bestWPM") || 0
  );

  // Focus input when typing area loads
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || showWPM) return;
    if (timeLeft <= 0) {
      setEndTime(Date.now());
      setShowWPM(true);
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, showWPM]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (!startTime) {
      setStartTime(Date.now());
      setIsRunning(true);
    }

    // Mistake count
    let errors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== finalSnippet[i]) errors++;
    }
    setMistakes(errors);

    if (value.length >= finalSnippet.length) {
      setEndTime(Date.now());
      setShowWPM(true);
      setIsRunning(false);
    }
  };

  const calculateResults = () => {
    if (!startTime || !endTime) return null;
    const elapsedMinutes = (endTime - startTime) / 60000;
    let correct = 0,
      incorrect = 0;

    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === finalSnippet[i]) correct++;
      else incorrect++;
    }

    const wpm = Math.round(correct / 5 / elapsedMinutes);
    const accuracy = Math.round((correct / (correct + incorrect)) * 100);

    // Save best WPM
    if (wpm > bestWPM) {
      setBestWPM(wpm);
      localStorage.setItem("bestWPM", wpm);
    }

    return { wpm, accuracy };
  };

  const restartTest = () => {
    setUserInput("");
    setTimeLeft(timer);
    setIsRunning(false);
    setShowWPM(false);
    setStartTime(null);
    setEndTime(null);
    setMistakes(0);
    textareaRef.current?.focus();
  };

  return (
    <div className={`typing-area-container theme-${theme}`}>
      <div className="typing-header">
        <div className="typing-info">
          <span>
            <strong>Time Left:</strong> {timeLeft}s
          </span>
          <span>
            <strong>Characters:</strong> {userInput.length}/{finalSnippet.length}
          </span>
          <span>
            <strong>Mistakes:</strong> {mistakes}
          </span>
        </div>
        <div className="btn-group">
          <button className="exit-btn" onClick={onExit}>
            Exit
          </button>
          <button className="restart-btn" onClick={restartTest}>
            Restart
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${(userInput.length / finalSnippet.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Highlighted snippet */}
      <div
        className="snippet-box"
        style={{ fontFamily: fontStyle }}
        onClick={() => textareaRef.current?.focus()}
      >
        {finalSnippet.split("").map((char, index) => {
          let color;
          if (index < userInput.length) {
            color = char === userInput[index] ? "green" : "red";
          }
          return (
            <span key={index} style={{ color }}>
              {char}
            </span>
          );
        })}
      </div>

      <textarea
        ref={textareaRef}
        className="input-area"
        value={userInput}
        onChange={handleInputChange}
        disabled={showWPM}
        style={{ fontFamily: fontStyle }}
      />

      {showWPM && (
        <div className="results-box">
          {(() => {
            const results = calculateResults();
            return (
              results && (
                <>
                  <div>
                    <strong>WPM:</strong> {results.wpm}
                  </div>
                  <div>
                    <strong>Accuracy:</strong> {results.accuracy}%
                  </div>
                  <div>
                    <strong>Best WPM:</strong> {bestWPM}
                  </div>
                </>
              )
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default TypingAreaPlay;
