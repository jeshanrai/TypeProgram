import './App.css';
import LanguageBar from './components/Languagebar';
import Navbar from './components/Navbar';
import TypingArea from './components/TypingArea';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Customize from './pages/Customize';
import Play from './pages/Play';

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
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
            
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
            </>
          }
        />
        <Route path="/customize" element={<Customize />} />
        <Route path="/Play" element={<Play />} />
      </Routes>
    </>
  );
}

export default App;



