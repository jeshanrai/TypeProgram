import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function ChallengePage() {
  const [challenger, setChallenger] = useState(null);
  const [timer, setTimer] = useState(15); // Add timer state
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    const registerUser = () => {
      if (user?._id) {
        socket.emit('register-user', user._id);
        console.log("✅ Registered user on socket:", user._id);
      }
    };

    registerUser(); // Initial registration

    socket.on('connect', () => {
      console.log("🔄 Socket reconnected with ID:", socket.id);
      registerUser(); // Re-register on reconnect
    });

    socket.on('receive-challenge', ({ from }) => {
      console.log("🎯 Received challenge from:", from);
      setChallenger(from);
      setTimer(15); // Reset timer when new challenge arrives
    });

    socket.on('start-game', () => {
      console.log("🚀 Game starting... navigating to /play-room");
      setChallenger(null);
      navigate('/play-room');
    });

    return () => {
      socket.off('connect');
      socket.off('receive-challenge');
      socket.off('start-game');
    };
  }, [navigate]);

  // Timer effect
  useEffect(() => {
    if (!challenger) return;
    if (timer === 0) {
      handleDecline();
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [challenger, timer]);

  const handleAccept = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    socket.emit('accept-challenge', {
      from: challenger,
      to: user?._id
    });
    console.log(`✅ Accepted challenge from ${challenger} as user ${user?._id}`);
    setChallenger(null);
    setTimer(15);
  };

  const handleDecline = () => {
    console.log(`❌ Declined challenge from ${challenger}`);
    setChallenger(null);
    setTimer(15);
    navigate('/play'); // <-- Add this line
  };

  return (
    <>
      {challenger && (
        <div style={styles.backdrop}>
          <div style={styles.modal}>
            <h2>🎯 Challenge Incoming</h2>
            <p>User <strong>{challenger}</strong> wants to challenge you!</p>
            <p style={{ color: 'gray', marginBottom: '1rem' }}>
              Respond in <strong>{timer}</strong> seconds...
            </p>
            <div style={styles.buttons}>
              <button style={styles.accept} onClick={handleAccept}>Accept</button>
              <button style={styles.decline} onClick={handleDecline}>Decline</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    background: '#fff', padding: '2rem',
    borderRadius: '1rem', width: '90%', maxWidth: '400px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    textAlign: 'center'
  },
  buttons: {
    display: 'flex', justifyContent: 'space-around', marginTop: '1.5rem'
  },
  accept: {
    padding: '0.5rem 1.5rem', background: 'green',
    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
  },
  decline: {
    padding: '0.5rem 1.5rem', background: 'red',
    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
  }
};

export default ChallengePage;
