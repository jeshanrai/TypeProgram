// pages/playcomponents/PlayArea.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Adjust the URL as needed

function PlayArea() {
  const [snippet, setSnippet] = useState('');
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    socket.emit('request-snippet'); // Ask server for a snippet

    socket.on('send-snippet', (code) => {
      setSnippet(code);
      setGameStarted(true);
    });

    return () => {
      socket.off('send-snippet');
    };
  }, []);

  useEffect(() => {
    let interval;
    if (gameStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      alert('Time is up!');
      // Optionally emit "game-over" or show result screen
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeLeft]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Typing Challenge</h2>
      <p><strong>Time Left:</strong> {timeLeft}s</p>
      <pre style={{ background: '#f4f4f4', padding: '1rem' }}>{snippet}</pre>
      <textarea
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', marginTop: '1rem', fontSize: '1rem' }}
        disabled={!gameStarted || timeLeft === 0}
      />
    </div>
  );
}

export default PlayArea;
