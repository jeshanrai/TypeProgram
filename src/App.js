import './App.css';
import Navbar from './components/Navbar';
import TypingArea from './components/TypingArea';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Customize from './pages/Customize';
import Play from './pages/Play';
import AuthUI from './pages/AuthUI/AuthUI';
import PlayArea from './pages/playcomponents/PlayArea';
import ChallengePage from './components/Challangepopup/ChallengePage';
import { io } from 'socket.io-client';
function App() {
  const [language, setLanguage] = useState('text');
  const [snippet, setSnippet] = useState('Select a language to start typing.');
  const [shownIds, setShownIds] = useState([]);
  const [inputStarted, setInputStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeLimit, setTimeLimit] = useState(30000); // default 30s

  // Move fetchSnippet outside useEffect so it can be reused
  const fetchSnippet = useCallback(async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/snippet', {
        language,
        excludeIds: shownIds
      });
      setSnippet(res.data.code);
      setShownIds(prev => [...prev, res.data._id]);
      setInputStarted(false);
      setTimeLeft(timeLimit);
    } catch (err) {
      setSnippet('// No more unique snippets available.');
    }
    // eslint-disable-next-line
  }, [language, shownIds, timeLimit]);

  useEffect(() => {
    fetchSnippet();
    // eslint-disable-next-line
  }, [language]);

  // Handler for Next button
  const handleNext = () => {
    fetchSnippet();
  };

  return (
 <>
  <ChallengePage />

  <Navbar />

  <Routes>
    <Route
      path="/"
      element={
        <TypingArea
          snippet={snippet}
          inputStarted={inputStarted}
          setInputStarted={setInputStarted}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          timeLimit={timeLimit}
          setTimeLimit={setTimeLimit}
          handleNext={handleNext}
          language={language}
          setLanguage={setLanguage}
        />
      }
    />
    <Route path="/customize" element={<Customize />} />
    <Route path="/play" element={<Play />} />
    <Route path="/play-room" element={<PlayArea />} /> {/* shown after challenge accepted */}
    <Route path="/login" element={<AuthUI />} />
  </Routes>
</>


  );
}

export default App;



