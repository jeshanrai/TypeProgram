import './App.css';
import LanguageBar from './components/Languagebar';
import Navbar from './components/Navbar';
import TypingArea from './components/TypingArea';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const res = await axios.post('http://localhost:3001/api/snippet', {
          language,
          excludeIds: shownIds
        });
        setSnippet(res.data.code);
        setShownIds(prev => [...prev, res.data._id]);
      } catch (err) {
        setSnippet('// No more unique snippets available.');
      }
    };

    if (language !== 'text') {
      fetchSnippet();
    } else {
      setSnippet('Select a language to start typing.');
      setShownIds([]);
    }
  }, [language]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LanguageBar
                setLanguage={setLanguage}
                className={inputStarted && timeLeft > 0 ? 'fade-out' : ''}
              />
              <TypingArea
                snippet={snippet}
                inputStarted={inputStarted}
                setInputStarted={setInputStarted}
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                timeLimit={timeLimit}
                setTimeLimit={setTimeLimit}
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
